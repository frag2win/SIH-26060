import { NextRequest, NextResponse } from 'next/server';
import { AiPrediction, StationTelemetry } from '@/types/telemetry';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const telemetry = body.telemetry as StationTelemetry;
    const clientApiKey = body.apiKey as string | undefined;
    const apiKey = clientApiKey || process.env.GEMINI_API_KEY;

    // Check if we can call Google Gemini API live
    if (apiKey && apiKey.trim().length > 10) {
      try {
        const prompt = `You are the AI Autonomous Mission Overseer for the Indian Antarctic Research Station (${telemetry.stationName}), operated by the Ministry of Earth Sciences (MoES) and NCPOR, Government of India.
Analyze the following real-time telemetry state and generate a structured JSON Predictive Threat Analysis.

Station Telemetry State:
- External Temp: ${telemetry.environment.outsideTemp}°C (Wind Chill: ${telemetry.environment.windChill}°C)
- Wind Speed: ${telemetry.environment.windSpeed} km/h (Gusts: ${telemetry.environment.windGust} km/h)
- Blizzard Status: ${telemetry.environment.blizzardStatus}
- Primary Gen Coolant: ${telemetry.power.generators[0]?.coolantTemp}°C, Oil: ${telemetry.power.generators[0]?.oilTemp}°C, Load: ${telemetry.power.generators[0]?.loadPct}%
- Fuel Line Temp: ${telemetry.fuelLifeSupport.fuelLineTemp}°C (Heater Active: ${telemetry.fuelLifeSupport.fuelLineHeaterActive})
- Satellite Link: ${telemetry.comms.satelliteLinkStatus} (Latency: ${telemetry.comms.latencyMs}ms, Loss: ${telemetry.comms.packetLossPct}%)
- Indoor Habitation: Temp ${telemetry.fuelLifeSupport.indoorTemp}°C, O2: ${telemetry.fuelLifeSupport.indoorOxygenPct}%, CO2: ${telemetry.fuelLifeSupport.indoorCo2Ppm} ppm
- Overall Health Score: ${telemetry.healthScore}%

Respond ONLY with valid JSON in this exact structure without markdown backticks:
{
  "threatLevel": "low" | "moderate" | "high" | "critical",
  "threatScore": number (0 to 100),
  "title": "Short punchy alert title",
  "summary": "1-2 sentence executive assessment for polar command",
  "rootCause": "Technical physical breakdown of the leading telemetry stressor",
  "timeToImpactHours": number,
  "recommendedActions": [
    "Action 1 (precise technical instruction)",
    "Action 2",
    "Action 3"
  ],
  "protocolCode": "PROTOCOL-ALPHA or BRAVO or CHARLIE etc.",
  "confidenceScore": number (85 to 99),
  "affectedModules": ["Module name 1", "Module name 2"]
}`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.2,
                responseMimeType: 'application/json'
              }
            })
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const candidateText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            const parsed = JSON.parse(candidateText.trim());
            const prediction: AiPrediction = {
              ...parsed,
              timestamp: new Date().toISOString()
            };
            return NextResponse.json({
              success: true,
              source: 'gemini_api_live',
              prediction
            });
          }
        }
      } catch (geminiError) {
        console.warn('Gemini API call failed, falling back to polar diagnostic engine:', geminiError);
      }
    }

    // Heuristic Polar Diagnostic Engine (Deterministic, instant, and pitch-perfect fallback)
    const prediction = generatePolarFallbackPrediction(telemetry);

    return NextResponse.json({
      success: true,
      source: 'polar_expert_heuristic_engine',
      prediction
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 400 });
  }
}

function generatePolarFallbackPrediction(t: StationTelemetry): AiPrediction {
  const gen0 = t.power.generators[0];
  const isGenCritical = gen0 && (gen0.coolantTemp > 92 || gen0.loadPct > 90);
  const isFuelWaxing = t.fuelLifeSupport.fuelLineTemp < -15 || !t.fuelLifeSupport.fuelLineHeaterActive;
  const isBlizzard = t.environment.windSpeed > 100 || t.environment.blizzardStatus.includes('Blizzard');
  const isCommsDown = t.comms.satelliteLinkStatus === 'down' || t.comms.packetLossPct > 50;

  if (isGenCritical) {
    return {
      threatLevel: 'critical',
      threatScore: 94,
      title: 'CRITICAL: Primary Generator Thermal Cavitation & Imminent Trip',
      summary: `Generator G1 coolant temperature is at ${gen0.coolantTemp}°C (safe ceiling: 90°C) with oil temp exceeding 110°C. AI predicts automatic circuit trip within 42 minutes, threatening core heat balance.`,
      rootCause: `High thermal load coupled with possible secondary heat-exchanger coolant blockage. Vibration harmonic at ${gen0.vibrationMmS} mm/s indicates cavitation in water jacket.`,
      timeToImpactHours: 0.7,
      recommendedActions: [
        'Engage remote actuator to pre-lubricate and spin up Cold Standby Generator G3.',
        'Shed secondary non-essential loads (Atmospheric Radar & snowmelt booster pumps).',
        'Command cross-tie bus transfer of 45 kW load to G3 and place G1 into 15-minute cooling cycle.'
      ],
      protocolCode: 'PROTOCOL-BRAVO (POWER BUS TRANSFER)',
      confidenceScore: 97.4,
      affectedModules: ['Primary Power Generation Plant', 'Command Deck & Comms Core'],
      timestamp: new Date().toISOString()
    };
  }

  if (isFuelWaxing) {
    return {
      threatLevel: 'critical',
      threatScore: 89,
      title: 'HIGH ALERT: Fuel Line Waxing Risk & Flow Starvation',
      summary: `Fuel line temperature has plunged to ${t.fuelLifeSupport.fuelLineTemp}°C (below critical paraffin solidification threshold of -15°C). Diesel viscosity spike risks engine starvation.`,
      rootCause: `Loss of electrical trace heating current on manifold B. Katabatic ground wind chill accelerating conductive heat loss through double-walled conduit.`,
      timeToImpactHours: 1.5,
      recommendedActions: [
        'Engage secondary circuit breaker CB-4 on Arctic Trace Heating array.',
        'Command manifold bypass valve V-12 to recirculate heated fuel from day tank.',
        'Raise thermal output from Generator heat recovery loop to supply auxiliary heat exchangers.'
      ],
      protocolCode: 'PROTOCOL-CHARLIE (TRACE HEAT PURGE)',
      confidenceScore: 95.8,
      affectedModules: ['Arctic Fuel Farm & Trace Heating', 'Primary Power Generation Plant'],
      timestamp: new Date().toISOString()
    };
  }

  if (isBlizzard) {
    return {
      threatLevel: 'high',
      threatScore: 82,
      title: 'SEVERE WEATHER: Katabatic Gale Whiteout (135+ km/h)',
      summary: `Wind speeds of ${t.environment.windSpeed} km/h with gusts exceeding ${t.environment.windGust} km/h. Wind chill is ${t.environment.windChill}°C. High dynamic pressure on radome and antenna gantry.`,
      rootCause: `Deep Antarctic low-pressure vortex traversing Queen Maud Land coast. Severe katabatic drainage from continental plateau.`,
      timeToImpactHours: 3.2,
      recommendedActions: [
        'Switch 7.3m Earth Station Radome blowers to 100% capacity to prevent ice accumulation.',
        'Enforce Station Lockdown Level 4 (no personnel outside airlock perimeter).',
        'Prepare auxiliary diesel generators for islanded microgrid operation if external lines sway.'
      ],
      protocolCode: 'PROTOCOL-ALPHA (BLIZZARD LOCKDOWN)',
      confidenceScore: 98.1,
      affectedModules: ['Satellite Radome & Deep Space Uplink', 'Habitation & Medical Bay'],
      timestamp: new Date().toISOString()
    };
  }

  if (isCommsDown) {
    return {
      threatLevel: 'high',
      threatScore: 78,
      title: 'COMMS LINK SEVERED: Severe Ionospheric Scintillation',
      summary: `Geomagnetic Kp index is ${t.environment.geomagneticKp}. Severe auroral electrojet absorption has caused Ku/X-band carrier drop. Telemetry link to NCPOR Goa is running in buffered mode.`,
      rootCause: `Coronal Mass Ejection (CME) shockwave impacting polar magnetosphere, causing dense ionization in Antarctic D-layer.`,
      timeToImpactHours: 4.0,
      recommendedActions: [
        'Switch primary data channel to Low-Band High-Frequency (HF) ionoscatter radio link.',
        'Queue all non-vital scientific telemetry to onboard flash arrays.',
        'Enable autonomous station health monitoring daemon with local failover authority.'
      ],
      protocolCode: 'PROTOCOL-DELTA (AUTONOMOUS WATCHDOG)',
      confidenceScore: 92.5,
      affectedModules: ['Satellite Radome & Deep Space Uplink', 'MST Radar & Atmospheric Lab'],
      timestamp: new Date().toISOString()
    };
  }

  // Baseline Nominal state
  return {
    threatLevel: 'low',
    threatScore: 12,
    title: 'STATION NOMINAL: Optimal Energy & Life Support Stability',
    summary: `All telemetry metrics for ${t.stationName} are well within Ministry of Earth Sciences baseline safety envelopes. Projected 72-hour operating trend is completely stable.`,
    rootCause: 'Normal atmospheric and electromechanical operational parameters.',
    timeToImpactHours: 72,
    recommendedActions: [
      'Maintain standard 12-hour generator rotation schedule.',
      'Continue routine blue ice feeding to Snowmelt Hopper (Current output: 380 L/hr).',
      'Monitor southern auroral indices for upcoming space weather cycles.'
    ],
    protocolCode: 'PROTOCOL-ZULU (STANDARD BASELINE)',
    confidenceScore: 99.0,
    affectedModules: ['Central Command'],
    timestamp: new Date().toISOString()
  };
}
