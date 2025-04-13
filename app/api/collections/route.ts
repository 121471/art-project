import { NextResponse } from "next/server"
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Category } from "@prisma/client"

const FEATURED_CATEGORIES = [
  Category.PAINTING,
  Category.PHOTOGRAPHY,
  Category.SCULPTURE,
  Category.DIGITAL,
  Category.MIXED_MEDIA,
]

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const collections = await prisma.collection.findMany({
      where: {
        userId: session.user.id,
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
    })

    return NextResponse.json(collections)
  } catch (error) {
    console.error('Error fetching collections:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { name, description } = body

    if (!name) {
      return new NextResponse('Name is required', { status: 400 })
    }

    const collection = await prisma.collection.create({
      data: {
        name,
        description,
        userId: session.user.id,
      },
    })

    return NextResponse.json(collection)
  } catch (error) {
    console.error('Error creating collection:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 