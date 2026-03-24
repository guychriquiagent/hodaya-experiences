import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';

export async function GET() {
  try {
    const db = readDB();
    return NextResponse.json(db.requests);
  } catch {
    return NextResponse.json({ error: 'Failed to read requests' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = readDB();

    const id = Date.now().toString(36) + Math.random().toString(36).substr(2);

    const newRequest = {
      id,
      name: body.name,
      email: body.email,
      date: body.date,
      experience: body.experience,
      details: body.details || '',
      status: 'pending' as const,
      comments: [],
      createdAt: new Date().toISOString(),
    };

    db.requests.push(newRequest);
    writeDB(db);

    return NextResponse.json(newRequest, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create request' }, { status: 500 });
  }
}
