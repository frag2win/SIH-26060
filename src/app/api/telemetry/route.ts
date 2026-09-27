import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_BHARATI_TELEMETRY, INITIAL_MAITRI_TELEMETRY } from '@/data/stationData';
import { TelemetryEngine } from '@/utils/telemetryEngine';
import { ScenarioPreset, StationId } from '@/types/telemetry';

// Global singleton instances for serverless simulation
const bharatiEngine = new TelemetryEngine(INITIAL_BHARATI_TELEMETRY);
const maitriEngine = new TelemetryEngine(INITIAL_MAITRI_TELEMETRY);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const station = (searchParams.get('station') || 'bharati') as StationId;
  const scenario = searchParams.get('scenario') as ScenarioPreset | null;

  const engine = station === 'maitri' ? maitriEngine : bharatiEngine;

  if (scenario) {
    engine.setScenario(scenario);
  }

  const telemetry = engine.tick();
  const alerts = engine.getAlerts();
  const activeScenario = engine.getActiveScenario();

  return NextResponse.json({
    success: true,
    telemetry,
    alerts,
    activeScenario,
    serverTime: new Date().toISOString()
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const station = (body.stationId || 'bharati') as StationId;
    const action = body.action;
    const scenario = body.scenario as ScenarioPreset;

    const engine = station === 'maitri' ? maitriEngine : bharatiEngine;

    if (action === 'set_scenario' && scenario) {
      const alert = engine.setScenario(scenario);
      const telemetry = engine.tick();
      return NextResponse.json({
        success: true,
        scenario,
        alert,
        telemetry,
        alerts: engine.getAlerts()
      });
    }

    if (action === 'auto_mitigate') {
      const result = engine.autoMitigate();
      const telemetry = engine.tick();
      return NextResponse.json({
        success: true,
        result,
        telemetry,
        alerts: engine.getAlerts()
      });
    }

    if (action === 'clear_alerts') {
      engine.clearAllAlerts();
      return NextResponse.json({
        success: true,
        alerts: engine.getAlerts()
      });
    }

    return NextResponse.json({
      success: true,
      telemetry: engine.tick(),
      alerts: engine.getAlerts()
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 400 });
  }
}
