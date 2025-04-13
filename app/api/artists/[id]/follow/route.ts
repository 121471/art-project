import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    if (session.user.id === params.id) {
      return NextResponse.json(
        { message: "Cannot follow yourself" },
        { status: 400 }
      )
    }

    await prisma.user.update({
      where: {
        id: params.id,
      },
      data: {
        followers: {
          connect: {
            id: session.user.id,
          },
        },
      },
    })

    return NextResponse.json({ message: "Followed successfully" })
  } catch (error) {
    console.error("Follow error:", error)
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
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    await prisma.user.update({
      where: {
        id: params.id,
      },
      data: {
        followers: {
          disconnect: {
            id: session.user.id,
          },
        },
      },
    })

    return NextResponse.json({ message: "Unfollowed successfully" })
  } catch (error) {
    console.error("Unfollow error:", error)
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
} 