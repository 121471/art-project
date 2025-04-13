import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { artworkId } = body;

    if (!artworkId) {
      return new NextResponse('Artwork ID is required', { status: 400 });
    }

    const collection = await prisma.collection.update({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      data: {
        artworks: {
          connect: {
            id: artworkId,
          },
        },
      },
    });

    return NextResponse.json(collection);
  } catch (error) {
    console.error('Error adding artwork to collection:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 