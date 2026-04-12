import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'online',
    version: '1.0.1',
    timestamp: new Date().toISOString()
  });
}
