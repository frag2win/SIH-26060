import { StationTelemetry, ScenarioPreset, IncidentAlert } from '@/types/telemetry';

export class TelemetryEngine {
  private currentTelemetry: StationTelemetry;
  private activeScenario: ScenarioPreset = 'nominal';
  private alerts: IncidentAlert[] = [];
  private alertCounter: number = 100;

  constructor(initialData: StationTelemetry) {
    this.currentTelemetry = JSON.parse(JSON.stringify(initialData));
    this.generateInitialAlerts();
  }

  public setStationData(data: StationTelemetry) {
    this.currentTelemetry = JSON.parse(JSON.stringify(data));
    this.applyScenario(this.activeScenario);
  }

  public setScenario(scenario: ScenarioPreset): IncidentAlert | null {
    this.activeScenario = scenario;
    return this.applyScenario(scenario);
  }

  public getActiveScenario(): ScenarioPreset {
    return this.activeScenario;
  }

  public getAlerts(): IncidentAlert[] {
    return [...this.alerts];
  }

  public resolveAlert(alertId: string) {
    this.alerts = this.alerts.map(a => a.id === alertId ? { ...a, resolved: true } : a);
  }

  public clearAllAlerts() {
    this.alerts = this.alerts.map(a => ({ ...a, resolved: true }));
  }

  private generateInitialAlerts() {
    this.alerts = [
      {
        id: `ALT-${++this.alertCounter}`,
        timestamp: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
        stationId: this.currentTelemetry.stationId,
        severity: 'info',
        title: 'NOC Satellite Handshake Complete',
        message: 'Telemetry downlink locked via GSAT-7A transponder 4B. Bit error rate < 10⁻⁷.',
        sourceModule: 'Command Deck & Comms Core',
        resolved: true
      },
      {
        id: `ALT-${++this.alertCounter}`,
        timestamp: new Date(Date.now() - 1000 * 60 * 6).toISOString(),
        stationId: this.currentTelemetry.stationId,
        severity: 'info',
        title: 'Snowmelt Cycle Scheduled',
        message: 'Hydraulic hopper fed 500kg blue ice. Thermal recovery maintaining 380 L/hr.',
        sourceModule: 'Snowmelt & RO Water Treatment',
        resolved: true
      }
    ];
  }

  private applyScenario(scenario: ScenarioPreset): IncidentAlert | null {
    const t = this.currentTelemetry;
    let newAlert: IncidentAlert | null = null;

    if (scenario === 'nominal') {
      t.overallStatus = 'nominal';
      t.healthScore = 96;
      t.environment.windSpeed = 38;
      t.environment.windGust = 52;
      t.environment.outsideTemp = -42.5;
      t.environment.blizzardStatus = 'None';
      t.environment.visibilityKm = 18.0;
      t.environment.geomagneticKp = 3.2;

      // Power
      t.power.generators[0].status = 'online';
      t.power.generators[0].loadPct = 62;
      t.power.generators[0].coolantTemp = 76.2;
      t.power.generators[0].oilTemp = 84.5;
      t.power.generators[0].vibrationMmS = 2.1;

      t.power.generators[1].status = 'online';
      t.power.generators[1].loadPct = 45;
      t.power.generators[1].coolantTemp = 73.8;

      t.power.generators[2].status = 'standby';
      t.power.generators[2].loadPct = 0;

      // Fuel & Comms
      t.fuelLifeSupport.fuelLineTemp = 8.4;
      t.fuelLifeSupport.fuelLineHeaterActive = true;
      t.fuelLifeSupport.indoorTemp = 21.6;

      t.comms.satelliteLinkStatus = 'locked';
      t.comms.latencyMs = 540;
      t.comms.packetLossPct = 0.1;
      t.comms.antennaDeIcerActive = true;

      // Reset modules
      t.modules.forEach(m => {
        m.status = 'nominal';
        m.health = Math.min(100, Math.max(90, m.health));
        m.subcomponents.forEach(sc => sc.status = 'nominal');
      });

      newAlert = {
        id: `ALT-${++this.alertCounter}`,
        timestamp: new Date().toISOString(),
        stationId: t.stationId,
        severity: 'info',
        title: 'Station Baseline Stabilized',
        message: 'All critical parameters operating within Indian Polar Research NOC specifications.',
        sourceModule: 'Central Command',
        resolved: true
      };
    } else if (scenario === 'cat5_blizzard') {
      t.overallStatus = 'warning';
      t.healthScore = 78;
      t.environment.windSpeed = 138;
      t.environment.windGust = 162;
      t.environment.outsideTemp = -54.8;
      t.environment.windChill = -76.4;
      t.environment.blizzardStatus = 'Category 5 Blizzard';
      t.environment.visibilityKm = 0.05;

      // Modules impact
      const commsMod = t.modules.find(m => m.category === 'comms');
      if (commsMod) {
        commsMod.status = 'warning';
        commsMod.health = 74;
        commsMod.subcomponents[0].status = 'warning';
        commsMod.subcomponents[0].value = 'Tracking Stressed (Ice accumulation)';
      }

      t.comms.satelliteLinkStatus = 'degraded';
      t.comms.latencyMs = 980;
      t.comms.packetLossPct = 14.8;

      newAlert = {
        id: `ALT-${++this.alertCounter}`,
        timestamp: new Date().toISOString(),
        stationId: t.stationId,
        severity: 'warning',
        title: 'Category 5 Blizzard Warning',
        message: 'Katabatic gale-force winds exceeding 138 km/h. Structural stilt load elevated. Radome ice loading detected.',
        sourceModule: 'Radome & Deep Space Uplink',
        resolved: false,
        mitigationProtocol: 'PROTOCOL-ALPHA: Maximum radome blower heat, lock outdoor airlocks, spool auxiliary generator.'
      };
    } else if (scenario === 'gen1_overheat') {
      t.overallStatus = 'critical';
      t.healthScore = 64;
      t.power.generators[0].status = 'fault';
      t.power.generators[0].loadPct = 96;
      t.power.generators[0].coolantTemp = 99.4;
      t.power.generators[0].oilTemp = 112.8;
      t.power.generators[0].vibrationMmS = 7.4;

      const powerMod = t.modules.find(m => m.category === 'power');
      if (powerMod) {
        powerMod.status = 'critical';
        powerMod.health = 52;
        powerMod.subcomponents[0].status = 'critical';
        powerMod.subcomponents[0].value = '99.4°C Coolant Overheat (Thermal Trip Imminent)';
      }

      newAlert = {
        id: `ALT-${++this.alertCounter}`,
        timestamp: new Date().toISOString(),
        stationId: t.stationId,
        severity: 'critical',
        title: 'Primary Generator G1 Coolant Boiling',
        message: 'Coolant circuit temperature 99.4°C (Limit 95°C). Cylinder head thermal excursion detected. Failure imminent in <45m.',
        sourceModule: 'Primary Power Generation Plant',
        resolved: false,
        mitigationProtocol: 'PROTOCOL-BRAVO: Shed science lab loads, auto-spin Gen 3 standby, initiate secondary radiator cross-feed.'
      };
    } else if (scenario === 'fuel_line_waxing') {
      t.overallStatus = 'critical';
      t.healthScore = 71;
      t.fuelLifeSupport.fuelLineTemp = -19.4; // Well below -15°C waxing point
      t.fuelLifeSupport.fuelLineHeaterActive = false;
      t.fuelLifeSupport.fuelBurnRateLitersHr = 22.1; // Filter choking

      const fuelMod = t.modules.find(m => m.category === 'fuel');
      if (fuelMod) {
        fuelMod.status = 'critical';
        fuelMod.health = 58;
        fuelMod.subcomponents[2].status = 'critical';
        fuelMod.subcomponents[2].value = '0.0 A (Circuit Breaker Tripped)';
        fuelMod.subcomponents[3].status = 'critical';
        fuelMod.subcomponents[3].value = 'Waxing Crystal Formation Active';
      }

      newAlert = {
        id: `ALT-${++this.alertCounter}`,
        timestamp: new Date().toISOString(),
        stationId: t.stationId,
        severity: 'critical',
        title: 'Fuel Line Trace Heating Failure',
        message: 'Trace heater breaker CB-4 tripped. Aviation turbine fuel temp dropped to -19.4°C. Paraffin crystallization blocking fuel feed.',
        sourceModule: 'Arctic Fuel Farm & Trace Heating',
        resolved: false,
        mitigationProtocol: 'PROTOCOL-CHARLIE: Reset heating breaker CB-4, engage emergency manifold purge, bypass fuel line B.'
      };
    } else if (scenario === 'satellite_blackout') {
      t.overallStatus = 'warning';
      t.healthScore = 80;
      t.environment.geomagneticKp = 8.6; // Extreme geomagnetic storm
      t.comms.satelliteLinkStatus = 'down';
      t.comms.downlinkMbps = 0.2;
      t.comms.latencyMs = 2400;
      t.comms.packetLossPct = 86.4;

      const commsMod = t.modules.find(m => m.category === 'comms');
      if (commsMod) {
        commsMod.status = 'critical';
        commsMod.health = 45;
        commsMod.subcomponents[0].status = 'critical';
        commsMod.subcomponents[0].value = 'Carrier Lost (Ionospheric Scintillation)';
      }

      newAlert = {
        id: `ALT-${++this.alertCounter}`,
        timestamp: new Date().toISOString(),
        stationId: t.stationId,
        severity: 'critical',
        title: 'Space Weather Blackout (Kp 8.6)',
        message: 'Severe auroral electrojet scintillation. Ku/X-band transponder lock broken. Primary command uplink severed.',
        sourceModule: 'Satellite Radome & Deep Space Uplink',
        resolved: false,
        mitigationProtocol: 'PROTOCOL-DELTA: Fall back to HF Low-Band Ionoscatter radio, cache telemetry logs locally, activate autonomous watchdog.'
      };
    }

    if (newAlert) {
      this.alerts.unshift(newAlert);
      if (this.alerts.length > 20) this.alerts.pop();
    }

    return newAlert;
  }

  public autoMitigate(): { message: string; resolvedAlerts: number } {
    const t = this.currentTelemetry;
    let resolvedCount = 0;

    if (this.activeScenario === 'gen1_overheat') {
      // Transfer load from Gen 1 to Gen 3
      t.power.generators[0].status = 'cooling';
      t.power.generators[0].loadPct = 15;
      t.power.generators[0].coolantTemp = 74.0;
      t.power.generators[0].vibrationMmS = 2.0;

      t.power.generators[2].status = 'online';
      t.power.generators[2].loadPct = 65;
      t.power.generators[2].outputKw = 65;
      t.power.generators[2].coolantTemp = 72.0;

      const powerMod = t.modules.find(m => m.category === 'power');
      if (powerMod) {
        powerMod.status = 'nominal';
        powerMod.health = 94;
        powerMod.subcomponents[0].status = 'nominal';
        powerMod.subcomponents[0].value = 'Load Transferred to Gen 3 (Cooling Idle)';
        powerMod.subcomponents[2].status = 'nominal';
        powerMod.subcomponents[2].value = 'Online (65 kW, Load Stable)';
      }
    } else if (this.activeScenario === 'fuel_line_waxing') {
      t.fuelLifeSupport.fuelLineHeaterActive = true;
      t.fuelLifeSupport.fuelLineTemp = 11.5;
      t.fuelLifeSupport.fuelBurnRateLitersHr = 36.0;

      const fuelMod = t.modules.find(m => m.category === 'fuel');
      if (fuelMod) {
        fuelMod.status = 'nominal';
        fuelMod.health = 96;
        fuelMod.subcomponents[2].status = 'nominal';
        fuelMod.subcomponents[2].value = '15.4 A (Aux Circuit Online)';
        fuelMod.subcomponents[3].status = 'nominal';
        fuelMod.subcomponents[3].value = 'Purge Complete - Viscosity Cleared';
      }
    } else if (this.activeScenario === 'cat5_blizzard') {
      t.comms.satelliteLinkStatus = 'locked';
      t.comms.latencyMs = 580;
      t.comms.packetLossPct = 1.2;
      t.comms.antennaDeIcerActive = true;

      const commsMod = t.modules.find(m => m.category === 'comms');
      if (commsMod) {
        commsMod.status = 'nominal';
        commsMod.health = 92;
        commsMod.subcomponents[0].status = 'nominal';
        commsMod.subcomponents[0].value = 'Hot-air Blower High Output (Ice Cleared)';
      }
    } else if (this.activeScenario === 'satellite_blackout') {
      t.comms.satelliteLinkStatus = 'locked';
      t.comms.downlinkMbps = 18.5;
      t.comms.latencyMs = 620;
      t.comms.packetLossPct = 0.5;

      const commsMod = t.modules.find(m => m.category === 'comms');
      if (commsMod) {
        commsMod.status = 'nominal';
        commsMod.health = 91;
        commsMod.subcomponents[0].status = 'nominal';
        commsMod.subcomponents[0].value = 'Rerouted via Polar UHF Deep Space Array';
      }
    }

    t.overallStatus = 'nominal';
    t.healthScore = 95;

    // Mark current crisis alerts as resolved
    this.alerts.forEach(a => {
      if (!a.resolved) {
        a.resolved = true;
        resolvedCount++;
      }
    });

    this.activeScenario = 'nominal';

    const mitigationLog: IncidentAlert = {
      id: `ALT-${++this.alertCounter}`,
      timestamp: new Date().toISOString(),
      stationId: t.stationId,
      severity: 'info',
      title: 'AI Automated Mitigation Executed',
      message: 'Subsystems stabilized via AI remote actuator command. Telemetry parameters back in safety envelope.',
      sourceModule: 'AI Autonomous Overseer',
      resolved: true
    };

    this.alerts.unshift(mitigationLog);

    return {
      message: 'Autonomous mitigation protocol successfully engaged. Station state normalized.',
      resolvedAlerts: resolvedCount
    };
  }

  public tick(): StationTelemetry {
    const t = this.currentTelemetry;
    t.timestamp = new Date().toISOString();

    // Subtle noise for real-time live pulse
    const jitter = (Math.random() - 0.5);
    
    // Wind subtle gust
    if (this.activeScenario === 'cat5_blizzard') {
      t.environment.windSpeed = +(135 + Math.sin(Date.now() / 3000) * 12 + jitter * 4).toFixed(1);
      t.environment.windGust = +(t.environment.windSpeed + 18 + jitter * 5).toFixed(1);
    } else {
      t.environment.windSpeed = +(38 + Math.sin(Date.now() / 5000) * 4 + jitter * 2).toFixed(1);
      t.environment.windGust = +(t.environment.windSpeed + 12 + jitter * 3).toFixed(1);
    }

    // Grid frequency slight float
    t.power.gridFrequencyHz = +(50.0 + jitter * 0.04).toFixed(2);

    // Fuel burning slightly
    t.fuelLifeSupport.arcticDieselLiters = Math.max(1000, +(t.fuelLifeSupport.arcticDieselLiters - 0.01).toFixed(2));

    // Temperature subtle drift
    t.environment.outsideTemp = +(t.environment.outsideTemp + jitter * 0.05).toFixed(1);

    return JSON.parse(JSON.stringify(t));
  }
}
