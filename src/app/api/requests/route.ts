import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const requests = await prisma.request.findMany({
      include: { comments: { orderBy: { createdAt: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(requests);
  } catch {
    return NextResponse.json({ error: 'Failed to read requests' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newRequest = await prisma.request.create({
      data: {
        name: body.name,
        email: body.email,
        date: body.date,
        experience: body.experience,
        details: body.details || '',
        status: 'pending',
      },
      include: { comments: true },
    });

    return NextResponse.json(newRequest, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create request' }, { status: 500 });
  }
}
