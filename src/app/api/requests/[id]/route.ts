import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = readDB();
    const req = db.requests.find((r) => r.id === id);
    if (!req) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }
    return NextResponse.json(req);
  } catch {
    return NextResponse.json({ error: 'Failed to read request' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const db = readDB();
    const index = db.requests.findIndex((r) => r.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    if (body.status && ['pending', 'approved', 'rejected'].includes(body.status)) {
      db.requests[index].status = body.status;
    }

    writeDB(db);
    return NextResponse.json(db.requests[index]);
  } catch {
    return NextResponse.json({ error: 'Failed to update request' }, { status: 500 });
  }
}
