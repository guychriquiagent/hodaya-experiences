import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const req = await prisma.request.findUnique({
      where: { id },
      include: { comments: { orderBy: { createdAt: 'asc' } } },
    });
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

    if (!body.status || !['pending', 'approved', 'rejected'].includes(body.status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const updated = await prisma.request.update({
      where: { id },
      data: { status: body.status },
      include: { comments: { orderBy: { createdAt: 'asc' } } },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to update request' }, { status: 500 });
  }
}
