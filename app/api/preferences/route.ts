import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        artPreferences: {
          include: {
            category: true,
          },
        },
      },
    })

    return NextResponse.json(user?.artPreferences || [])
  } catch (error) {
    console.error('Error fetching preferences:', error)
    return NextResponse.json(
      { error: 'Failed to fetch preferences' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { categoryId } = await req.json()
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const preference = await prisma.artPreference.create({
      data: {
        userId: user.id,
        categoryId,
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json(preference)
  } catch (error) {
    console.error('Error creating preference:', error)
    return NextResponse.json(
      { error: 'Failed to create preference' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { preferenceId } = await req.json()
    await prisma.artPreference.delete({
      where: {
        id: preferenceId,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting preference:', error)
    return NextResponse.json(
      { error: 'Failed to delete preference' },
      { status: 500 }
    )
  }
} 