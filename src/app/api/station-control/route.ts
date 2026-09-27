import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { stationId, command, targetSubsystem, value } = body;

    // Simulate remote actuator telemetry response
    const executionId = `CMD-${Date.now().toString(36).toUpperCase()}`;
    const timestamp = new Date().toISOString();

    return NextResponse.json({
      success: true,
      executionId,
      timestamp,
      stationId: stationId || 'bharati',
      command,
      targetSubsystem,
      value,
      status: 'EXECUTED_CONFIRMED',
      message: `Remote actuator command [${command}] on [${targetSubsystem}] successfully transmitted and verified via Antarctic Satellite Earth Link.`
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 400 });
  }
}
