import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Prisma } from '@prisma/client'
import { uploadImage } from '@/lib/cloudinary'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const formData = await req.formData()
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string
    const price = parseFloat(formData.get('price') as string)
    const image = formData.get('image') as File

    if (!title || !description || !category || !price || !image) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    // Upload image to Cloudinary
    const imageUrl = await uploadImage(image)

    const artwork = await prisma.artwork.create({
      data: {
        title,
        description,
        category,
        price,
        imageUrl,
        artistId: session.user.id,
      },
    })

    return NextResponse.json(artwork)
  } catch (error) {
    console.error('Error creating artwork:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get('query')
    const category = searchParams.get('category')
    const sort = searchParams.get('sort')

    const where: Prisma.ArtworkWhereInput = {
      ...(query && {
        OR: [
          { title: { contains: query, mode: 'insensitive' as const } },
          { description: { contains: query, mode: 'insensitive' as const } },
        ],
      }),
      ...(category && { category }),
    }

    const orderBy: Prisma.ArtworkOrderByWithRelationInput = {
      ...(sort === 'newest' && { createdAt: 'desc' }),
      ...(sort === 'oldest' && { createdAt: 'asc' }),
      ...(sort === 'price_asc' && { price: 'asc' }),
      ...(sort === 'price_desc' && { price: 'desc' }),
      ...(!sort && { createdAt: 'desc' }), // Default sort
    }

    const artworks = await prisma.artwork.findMany({
      where,
      orderBy,
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

    return NextResponse.json(artworks)
  } catch (error) {
    console.error('Error fetching artworks:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 