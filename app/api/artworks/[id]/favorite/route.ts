import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import prisma from "@/lib/prisma"
import { authOptions } from "@/lib/auth-options"

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const artwork = await prisma.artwork.findUnique({
      where: { id: params.id },
    })

    if (!artwork) {
      return NextResponse.json(
        { error: "Artwork not found" },
        { status: 404 }
      )
    }

    await prisma.favorite.create({
      data: {
        userId: session.user.id,
        artworkId: params.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error favoriting artwork:", error)
    return NextResponse.json(
      { error: "Failed to favorite artwork" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const favorite = await prisma.favorite.findFirst({
      where: {
        userId: session.user.id,
        artworkId: params.id,
      },
    })

    if (!favorite) {
      return NextResponse.json(
        { error: "Favorite not found" },
        { status: 404 }
      )
    }

    await prisma.favorite.delete({
      where: { id: favorite.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error unfavoriting artwork:", error)
    return NextResponse.json(
      { error: "Failed to unfavorite artwork" },
      { status: 500 }
    )
  }
} 