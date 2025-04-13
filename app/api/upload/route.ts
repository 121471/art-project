import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { uploadImage } from '@/lib/cloudinary'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const formData = await req.formData()
    const image = formData.get('image') as File

    if (!image) {
      return new NextResponse('No image provided', { status: 400 })
    }

    const imageUrl = await uploadImage(image)

    return NextResponse.json({ imageUrl })
  } catch (error) {
    console.error('Error uploading image:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 