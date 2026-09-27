import { StationTelemetry, StationId, StationModule } from '@/types/telemetry';

export const INITIAL_BHARATI_MODULES: StationModule[] = [
  {
    id: 'mod-cmd',
    name: 'Command Deck & Comms Core',
    category: 'comms',
    status: 'nominal',
    health: 98,
    temperature: 21.4,
    powerDrawKw: 18.5,
    lastServiceDate: '2026-08-14',
    description: 'Central operations center, telemetry downlink rack, and emergency coordination bridge.',
    x: 48,
    y: 22,
    subcomponents: [
      { name: 'GSAT-7A Terminal', metric: 'Signal Lock', value: '99.4% Link Quality', status: 'nominal' },
      { name: 'NOC Bridge Servers', metric: 'CPU Load', value: '28%', status: 'nominal' },
      { name: 'VHF Emergency Transceiver', metric: 'Status', value: 'Standby Ready', status: 'nominal' }
    ]
  },
  {
    id: 'mod-power',
    name: 'Primary Power Generation Plant',
    category: 'power',
    status: 'nominal',
    health: 94,
    temperature: 32.1,
    powerDrawKw: 4.2,
    lastServiceDate: '2026-09-02',
    description: 'Houses 3x 100 kVA Scania-Stamford diesel generators with automated load-balancing and heat recovery.',
    x: 24,
    y: 42,
    subcomponents: [
      { name: 'Generator 1 (Primary)', metric: 'Load', value: '62 kW (62%)', status: 'nominal' },
      { name: 'Generator 2 (Secondary)', metric: 'Load', value: '45 kW (45%)', status: 'nominal' },
      { name: 'Generator 3 (Cold Standby)', metric: 'Readiness', value: 'Ready (Pre-heated)', status: 'nominal' },
      { name: 'Heat Recovery Loop', metric: 'Thermal Output', value: '78 kW Heat', status: 'nominal' }
    ]
  },
  {
    id: 'mod-habitat',
    name: 'Habitation & Medical Bay',
    category: 'life_support',
    status: 'nominal',
    health: 99,
    temperature: 21.8,
    powerDrawKw: 34.0,
    lastServiceDate: '2026-08-28',
    description: 'Berthing for 25 winter-over scientists, galley, gym, and surgical ICU facility with hyperbaric support.',
    x: 52,
    y: 46,
    subcomponents: [
      { name: 'HVAC Air Recirculator', metric: 'Flow Rate', value: '4,200 m³/h', status: 'nominal' },
      { name: 'Indoor Oxygen Sensor', metric: 'Concentration', value: '20.95%', status: 'nominal' },
      { name: 'Indoor CO2 Scrubbers', metric: 'Atmosphere', value: '460 ppm', status: 'nominal' }
    ]
  },
  {
    id: 'mod-fuel',
    name: 'Arctic Fuel Farm & Trace Heating',
    category: 'fuel',
    status: 'nominal',
    health: 95,
    temperature: -4.2,
    powerDrawKw: 12.8,
    lastServiceDate: '2026-07-20',
    description: 'Double-walled tank farm storing 280,000L of Aviation Turbine Fuel (ATF-50) with active electrical trace heating.',
    x: 18,
    y: 72,
    subcomponents: [
      { name: 'Main ATF Tank 1', metric: 'Level', value: '92,400 L (92%)', status: 'nominal' },
      { name: 'Main ATF Tank 2', metric: 'Level', value: '88,100 L (88%)', status: 'nominal' },
      { name: 'Trace Heating Tape', metric: 'Current Draw', value: '14.2 A (Nominal)', status: 'nominal' },
      { name: 'Waxing Prevention Valve', metric: 'Viscosity', value: 'Optimal', status: 'nominal' }
    ]
  },
  {
    id: 'mod-water',
    name: 'Snowmelt & RO Water Treatment',
    category: 'life_support',
    status: 'nominal',
    health: 96,
    temperature: 14.5,
    powerDrawKw: 16.2,
    lastServiceDate: '2026-08-30',
    description: 'Converts glacial blue ice into potable mineral water via heat exchange and multi-stage reverse osmosis.',
    x: 74,
    y: 38,
    subcomponents: [
      { name: 'Melting Hopper Coils', metric: 'Melt Rate', value: '380 L/hr', status: 'nominal' },
      { name: 'Reverse Osmosis Unit', metric: 'Purity TDS', value: '42 ppm', status: 'nominal' },
      { name: 'Potable Buffer Tank', metric: 'Storage', value: '18,400 L (82%)', status: 'nominal' }
    ]
  },
  {
    id: 'mod-radar',
    name: 'MST Radar & Atmospheric Lab',
    category: 'science',
    status: 'nominal',
    health: 97,
    temperature: 18.2,
    powerDrawKw: 22.4,
    lastServiceDate: '2026-09-10',
    description: 'Mesosphere-Stratosphere-Troposphere radar array, Brewer spectrophotometer for ozone, and magnetometers.',
    x: 76,
    y: 68,
    subcomponents: [
      { name: 'Phased Array Radar', metric: 'Transmission', value: '53 MHz Active', status: 'nominal' },
      { name: 'Brewer Spectrophotometer', metric: 'Ozone Column', value: '284 Dobson Units', status: 'nominal' },
      { name: 'Geomagnetic Variometer', metric: 'Field Drift', value: '0.4 nT/hr', status: 'nominal' }
    ]
  },
  {
    id: 'mod-comms',
    name: 'Satellite Radome & Deep Space Uplink',
    category: 'comms',
    status: 'nominal',
    health: 93,
    temperature: -8.0,
    powerDrawKw: 9.6,
    lastServiceDate: '2026-08-19',
    description: '7.3m tracking dish enclosed in a reinforced fluoropolymer radome with high-velocity hot air de-icing.',
    x: 44,
    y: 82,
    subcomponents: [
      { name: '7.3m X/S Tracking Dish', metric: 'Azimuth/Elevation', value: 'Tracking (Lock 98%)', status: 'nominal' },
      { name: 'Radome Hot Air Blower', metric: 'Core Temp', value: '42°C', status: 'nominal' },
      { name: 'Feed Horn Heater', metric: 'Status', value: 'Active (Anti-Ice)', status: 'nominal' }
    ]
  },
  {
    id: 'mod-refuge',
    name: 'Emergency Life Pod & Cryo Shelter',
    category: 'life_support',
    status: 'nominal',
    health: 100,
    temperature: 12.0,
    powerDrawKw: 3.5,
    lastServiceDate: '2026-09-01',
    description: 'Independent survival bunker located 150m upwind with dedicated food rations, battery bank, and HF radio.',
    x: 88,
    y: 18,
    subcomponents: [
      { name: 'Lithium Battery Bank', metric: 'Charge', value: '100% (48h Autonomy)', status: 'nominal' },
      { name: 'Emergency Rations', metric: 'Surplus', value: '60 Days for 25 Pax', status: 'nominal' },
      { name: 'Independent Diesel Stoves', metric: 'Readiness', value: 'Prime Ready', status: 'nominal' }
    ]
  }
];

export const INITIAL_MAITRI_MODULES: StationModule[] = [
  {
    id: 'm-mod-core',
    name: 'Maitri Central Habitation Block',
    category: 'life_support',
    status: 'nominal',
    health: 92,
    temperature: 20.8,
    powerDrawKw: 32.5,
    lastServiceDate: '2026-08-12',
    description: 'Steel-truss insulated main habitat on rocky outcrop at Schirmacher Oasis with bunks for 20 crew.',
    x: 46,
    y: 35,
    subcomponents: [
      { name: 'Main Hab Central Heating', metric: 'Water Loop', value: '68°C Circulation', status: 'nominal' },
      { name: 'Living Quarters Ambient', metric: 'Temp', value: '20.8°C', status: 'nominal' },
      { name: 'Air Exchange Fan', metric: 'Status', value: 'Optimal (2,800 m³/h)', status: 'nominal' }
    ]
  },
  {
    id: 'm-mod-gen',
    name: 'Generator & Auxiliary Power Bay',
    category: 'power',
    status: 'nominal',
    health: 89,
    temperature: 29.5,
    powerDrawKw: 5.5,
    lastServiceDate: '2026-08-25',
    description: 'Kirloskar heavy industrial diesels supplying continuous 415V 3-phase grid to Maitri.',
    x: 26,
    y: 52,
    subcomponents: [
      { name: 'Kirloskar Gen A', metric: 'Load', value: '58 kW (72%)', status: 'nominal' },
      { name: 'Kirloskar Gen B', metric: 'Load', value: '38 kW (48%)', status: 'nominal' },
      { name: 'Kirloskar Gen C (Backup)', metric: 'Status', value: 'Pre-warmed Standby', status: 'nominal' }
    ]
  },
  {
    id: 'm-mod-lake',
    name: 'Priyadarshini Lake Water Intake',
    category: 'life_support',
    status: 'nominal',
    health: 94,
    temperature: 3.2,
    powerDrawKw: 11.2,
    lastServiceDate: '2026-09-08',
    description: 'Sub-ice immersion pumping station drawing pristine meltwater from sacred Lake Priyadarshini.',
    x: 75,
    y: 30,
    subcomponents: [
      { name: 'Sub-ice Pump Station', metric: 'Depth', value: '8.4m Submerged', status: 'nominal' },
      { name: 'Trace Heated Pipeline', metric: 'Flow Rate', value: '1,200 L/hr', status: 'nominal' },
      { name: 'Water Filtration Rack', metric: 'Filter Pressure', value: '2.1 bar', status: 'nominal' }
    ]
  },
  {
    id: 'm-mod-seismo',
    name: 'Geomagnetic & Seismology Vault',
    category: 'science',
    status: 'nominal',
    health: 96,
    temperature: 8.5,
    powerDrawKw: 7.4,
    lastServiceDate: '2026-09-15',
    description: 'Bedrock-anchored vault recording crustal plate tectonics and southern geomagnetic pulsations.',
    x: 78,
    y: 65,
    subcomponents: [
      { name: 'Broadband Seismometer', metric: 'Ground Motion', value: '0.012 mm/s RMS', status: 'nominal' },
      { name: 'Proton Precession Magnetometer', metric: 'Total Field', value: '41,250 nT', status: 'nominal' },
      { name: 'Data Logger Link', metric: 'Sync', value: '100% Locked to GPS', status: 'nominal' }
    ]
  },
  {
    id: 'm-mod-fuel',
    name: 'Fuel Depot & Heavy Oil Storage',
    category: 'fuel',
    status: 'nominal',
    health: 91,
    temperature: -2.8,
    powerDrawKw: 8.8,
    lastServiceDate: '2026-07-29',
    description: 'Bunded fuel storage facility for winter survival reserves with manual and automated cut-offs.',
    x: 20,
    y: 78,
    subcomponents: [
      { name: 'Diesel Tank Farm', metric: 'Reserve', value: '142,000 L', status: 'nominal' },
      { name: 'Fuel Pre-heater Manifold', metric: 'Temp', value: '18.4°C', status: 'nominal' },
      { name: 'Leak Detector Array', metric: 'Alerts', value: 'Zero Gas/Fluid Traces', status: 'nominal' }
    ]
  },
  {
    id: 'm-mod-radome',
    name: 'Maitri SatCom Earth Station',
    category: 'comms',
    status: 'nominal',
    health: 90,
    temperature: -5.4,
    powerDrawKw: 8.5,
    lastServiceDate: '2026-08-17',
    description: 'High gain parabolic dish maintaining telemetry and data link to NCPOR Goa and MoES New Delhi.',
    x: 50,
    y: 78,
    subcomponents: [
      { name: 'VSAT C-Band Link', metric: 'Eb/N0', value: '11.8 dB (Solid)', status: 'nominal' },
      { name: 'Satellite Modem', metric: 'Throughput', value: '12.4 Mbps', status: 'nominal' },
      { name: 'Radome Heater', metric: 'Status', value: 'Active', status: 'nominal' }
    ]
  }
];

export const INITIAL_BHARATI_TELEMETRY: StationTelemetry = {
  stationId: 'bharati',
  stationName: 'Bharati Antarctic Research Station',
  coordinates: {
    latitude: '69°24′28″ S',
    longitude: '76°11′14″ E'
  },
  elevationMeters: 35,
  timestamp: new Date().toISOString(),
  overallStatus: 'nominal',
  healthScore: 96,
  activePersonnel: 24,
  environment: {
    outsideTemp: -42.5,
    windSpeed: 38,
    windGust: 52,
    windDirection: 'ESE (Katabatic)',
    windChill: -58.2,
    blizzardStatus: 'None',
    barometricPressure: 988.4,
    geomagneticKp: 3.2,
    uvIndex: 0,
    visibilityKm: 18.5,
    permafrostTemp: -16.4,
    sensorClusters: [
      { name: 'Atmospheric Boundary Layer', metric: 'Sonic Anemometer 3D Flux', status: 'nominal' },
      { name: 'Sea Ice & Ice Shelf Radar', metric: 'Ground Penetrating Radar', status: 'nominal' },
      { name: 'Katabatic Wind Field', metric: 'Multi-point AWS Network', status: 'nominal' },
      { name: 'Optical Polar Visibility', metric: 'Forward Scatter Meter', status: 'nominal' }
    ]
  },
  power: {
    totalGenerationKw: 107.0,
    totalConsumptionKw: 89.5,
    gridFrequencyHz: 50.02,
    batteryReserveKwh: 240,
    batteryCapacityPct: 94,
    batteryAutonomyHours: 19.5,
    dieselKw: 85.0,
    windKw: 18.0,
    solarKw: 4.0,
    generators: [
      {
        id: 'gen-1',
        name: 'Scania Gen 1 (Primary Base)',
        status: 'online',
        loadPct: 62,
        outputKw: 62.0,
        oilTemp: 84.5,
        coolantTemp: 76.2,
        vibrationMmS: 2.1,
        runtimeHours: 4210
      },
      {
        id: 'gen-2',
        name: 'Scania Gen 2 (Dynamic Peak)',
        status: 'online',
        loadPct: 45,
        outputKw: 45.0,
        oilTemp: 81.2,
        coolantTemp: 73.8,
        vibrationMmS: 1.8,
        runtimeHours: 3890
      },
      {
        id: 'gen-3',
        name: 'Scania Gen 3 (Cold Standby)',
        status: 'standby',
        loadPct: 0,
        outputKw: 0,
        oilTemp: 32.0,
        coolantTemp: 35.0,
        vibrationMmS: 0.0,
        runtimeHours: 1940
      }
    ],
    solarWindKw: 22.0
  },
  fuelLifeSupport: {
    arcticDieselLiters: 180500,
    fuelMaxCapacityLiters: 220000,
    fuelBurnRateLitersHr: 36.4,
    fuelDaysRemaining: 206,
    fuelLineTemp: 8.4,
    fuelLineHeaterActive: true,
    indoorTemp: 21.6,
    indoorOxygenPct: 20.95,
    indoorCo2Ppm: 460,
    potableWaterLiters: 18400,
    waterMaxCapacityLiters: 22500,
    snowmeltMeltRateLitersHr: 380,
    indoorHumidityPct: 38
  },
  logistics: {
    foodReservePct: 88,
    foodDaysProjected: 185,
    potableWaterDaysProjected: 48,
    medicalSuppliesPct: 94,
    nextResupplyVoyageDays: 32,
    resupplyVesselName: 'MV Vasiliy Golovnin (MoES Charter)',
    resupplyWindowStatus: 'Open',
    criticalSparesHealthPct: 96
  },
  comms: {
    satelliteLinkStatus: 'locked',
    downlinkMbps: 45.2,
    uplinkMbps: 18.6,
    latencyMs: 540,
    packetLossPct: 0.1,
    primaryTransponder: 'GSAT-7A Polar Military/Sci Transponder',
    antennaDeIcerActive: true
  },
  modules: INITIAL_BHARATI_MODULES
};

export const INITIAL_MAITRI_TELEMETRY: StationTelemetry = {
  stationId: 'maitri',
  stationName: 'Maitri Antarctic Station',
  coordinates: {
    latitude: '70°45′57″ S',
    longitude: '11°44′09″ E'
  },
  elevationMeters: 117,
  timestamp: new Date().toISOString(),
  overallStatus: 'nominal',
  healthScore: 92,
  activePersonnel: 19,
  environment: {
    outsideTemp: -38.2,
    windSpeed: 44,
    windGust: 60,
    windDirection: 'SE (Continental)',
    windChill: -52.8,
    blizzardStatus: 'None',
    barometricPressure: 976.2,
    geomagneticKp: 4.1,
    uvIndex: 0,
    visibilityKm: 14.0,
    permafrostTemp: -14.2,
    sensorClusters: [
      { name: 'Schirmacher Oasis Seismo Vault', metric: '3-Axis Geophone Grid', status: 'nominal' },
      { name: 'Priyadarshini Lake Water Quality', metric: 'Dissolved Oxygen & pH', status: 'nominal' },
      { name: 'Continental Ice Sheet AWS', metric: 'Multi-height Temperature Mast', status: 'nominal' },
      { name: 'Geomagnetic Pulsation Array', metric: 'Fluxgate Magnetometer', status: 'nominal' }
    ]
  },
  power: {
    totalGenerationKw: 96.0,
    totalConsumptionKw: 82.0,
    gridFrequencyHz: 49.98,
    batteryReserveKwh: 160,
    batteryCapacityPct: 88,
    batteryAutonomyHours: 15.2,
    dieselKw: 76.0,
    windKw: 15.0,
    solarKw: 5.0,
    generators: [
      {
        id: 'm-gen-1',
        name: 'Kirloskar Unit A (Base)',
        status: 'online',
        loadPct: 72,
        outputKw: 58.0,
        oilTemp: 86.0,
        coolantTemp: 78.4,
        vibrationMmS: 2.8,
        runtimeHours: 6120
      },
      {
        id: 'm-gen-2',
        name: 'Kirloskar Unit B (Auxiliary)',
        status: 'online',
        loadPct: 48,
        outputKw: 38.0,
        oilTemp: 79.5,
        coolantTemp: 72.1,
        vibrationMmS: 2.4,
        runtimeHours: 5480
      },
      {
        id: 'm-gen-3',
        name: 'Kirloskar Unit C (Standby)',
        status: 'standby',
        loadPct: 0,
        outputKw: 0,
        oilTemp: 34.0,
        coolantTemp: 38.0,
        vibrationMmS: 0.0,
        runtimeHours: 2310
      }
    ],
    solarWindKw: 20.0
  },
  fuelLifeSupport: {
    arcticDieselLiters: 142000,
    fuelMaxCapacityLiters: 185000,
    fuelBurnRateLitersHr: 34.1,
    fuelDaysRemaining: 173,
    fuelLineTemp: 6.8,
    fuelLineHeaterActive: true,
    indoorTemp: 20.8,
    indoorOxygenPct: 20.92,
    indoorCo2Ppm: 490,
    potableWaterLiters: 14200,
    waterMaxCapacityLiters: 19000,
    snowmeltMeltRateLitersHr: 310,
    indoorHumidityPct: 41
  },
  logistics: {
    foodReservePct: 82,
    foodDaysProjected: 140,
    potableWaterDaysProjected: 41,
    medicalSuppliesPct: 89,
    nextResupplyVoyageDays: 32,
    resupplyVesselName: 'MV Vasiliy Golovnin (MoES Charter)',
    resupplyWindowStatus: 'Open',
    criticalSparesHealthPct: 91
  },
  comms: {
    satelliteLinkStatus: 'locked',
    downlinkMbps: 22.4,
    uplinkMbps: 8.8,
    latencyMs: 620,
    packetLossPct: 0.4,
    primaryTransponder: 'Inmarsat Global Xpress & C-Band',
    antennaDeIcerActive: true
  },
  modules: INITIAL_MAITRI_MODULES
};
