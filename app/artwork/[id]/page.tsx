import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import ArtworkContent from './artwork-content'
import prisma from "@/lib/prisma"

export default async function ArtworkPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/login')
  }

  const artwork = await prisma.artwork.findUnique({
    where: { id: params.id },
    include: {
      artist: true,
      category: true
    }
  })

  if (!artwork) {
    redirect('/')
  }

  return <ArtworkContent initialSession={session} artwork={artwork} />
}
