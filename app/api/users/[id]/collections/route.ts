import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const collections = await prisma.collection.findMany({
      where: {
        userId: params.id,
      },
      include: {
        artworks: {
          select: {
            id: true,
            title: true,
            imageUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(collections);
  } catch (error) {
    console.error('Error fetching user collections:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 