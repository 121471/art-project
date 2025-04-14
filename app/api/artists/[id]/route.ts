import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const artist = await prisma.user.findUnique({
      where: {
        id: params.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        bio: true,
        website: true,
        socialLinks: true,
        location: true,
        isVerified: true,
        createdAt: true,
        artworks: {
          select: {
            id: true,
            title: true,
            price: true,
            imageUrl: true,
            category: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        followers: {
          select: {
            id: true,
          },
        },
        following: {
          select: {
            id: true,
          },
        },
      },
    })

    if (!artist) {
      return NextResponse.json(
        { message: "Artist not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(artist)
  } catch (error) {
    console.error("Artist fetch error:", error)
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.id !== params.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const { name, image, bio, website, socialLinks, location } = await req.json()

    const artist = await prisma.user.update({
      where: {
        id: params.id,
      },
      data: {
        name,
        image,
        bio,
        website,
        socialLinks,
        location,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        bio: true,
        website: true,
        socialLinks: true,
        location: true,
        isVerified: true,
        createdAt: true,
        artworks: {
          select: {
            id: true,
            title: true,
            price: true,
            imageUrl: true,
            category: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        followers: {
          select: {
            id: true,
          },
        },
        following: {
          select: {
            id: true,
          },
        },
      },
    })

    return NextResponse.json(artist)
  } catch (error) {
    console.error("Artist update error:", error)
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
} 