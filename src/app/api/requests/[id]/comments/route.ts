import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';

export async function POST(
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

    const comment = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      text: body.text,
      author: body.author || 'מנהל',
      createdAt: new Date().toISOString(),
    };

    db.requests[index].comments.push(comment);
    writeDB(db);

    return NextResponse.json(comment, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 });
  }
}
