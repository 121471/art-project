import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function DELETE(
  req: Request,
  { params }: { params: { id: string; artworkId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const collection = await prisma.collection.update({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      data: {
        artworks: {
          disconnect: {
            id: params.artworkId,
          },
        },
      },
    });

    return NextResponse.json(collection);
  } catch (error) {
    console.error('Error removing artwork from collection:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 