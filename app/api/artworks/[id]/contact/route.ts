import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { Resend } from "resend"

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not set")
}

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { name, email, message } = await request.json()

    const artwork = await prisma.artwork.findUnique({
      where: { id: params.id },
      include: {
        artist: {
          select: {
            email: true,
            name: true,
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

    if (!artwork.artist.email) {
      return NextResponse.json(
        { error: "Artist email not found" },
        { status: 404 }
      )
    }

    // Send email to artist
    await resend.emails.send({
      from: "Art Marketplace <noreply@artmarketplace.com>",
      to: artwork.artist.email,
      subject: `New message about your artwork: ${artwork.title}`,
      html: `
        <h2>New Message About Your Artwork</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Artwork:</strong> ${artwork.title}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    )
  }
} 