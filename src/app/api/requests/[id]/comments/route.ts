import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Verify request exists
    const req = await prisma.request.findUnique({ where: { id } });
    if (!req) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    const comment = await prisma.comment.create({
      data: {
        text: body.text,
        author: body.author || 'מנהל',
        requestId: id,
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 });
  }
}
