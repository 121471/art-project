import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { deleteImage } from '@/lib/cloudinary'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const artwork = await prisma.artwork.findUnique({
      where: { id: params.id },
      include: {
        artist: {
          select: {
            id: true,
            name: true,
            image: true,
            bio: true,
          },
        },
        relatedArtworks: {
          take: 3,
          include: {
            artist: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    })

    if (!artwork) {
      return NextResponse.json(
        { error: "Artwork not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(artwork)
  } catch (error) {
    console.error("Error fetching artwork:", error)
    return NextResponse.json(
      { error: "Failed to fetch artwork" },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { title, description, price, imageUrl, location, category } =
      await req.json()

    const artwork = await prisma.artwork.update({
      where: {
        id: params.id,
      },
      data: {
        title,
        description,
        price,
        imageUrl,
        location,
        category,
      },
      include: {
        artist: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json(artwork)
  } catch (error) {
    console.error("Artwork update error:", error)
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const artwork = await prisma.artwork.findUnique({
      where: { id: params.id },
    })

    if (!artwork) {
      return new NextResponse('Artwork not found', { status: 404 })
    }

    if (artwork.artistId !== session.user.id) {
      return new NextResponse('Unauthorized', { status: 403 })
    }

    // Delete the image from Cloudinary
    await deleteImage(artwork.imageUrl)

    // Delete the artwork from the database
    await prisma.artwork.delete({
      where: { id: params.id },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting artwork:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 