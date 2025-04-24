import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import ArtistContent from './artist-content'
import prisma from "@/lib/prisma"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ArtistPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/login')
  }

  const artist = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      artworks: {
        include: {
          category: true,
          artist: true
        }
      },
      followers: true,
      following: true
    }
  })

  if (!artist) {
    redirect('/')
  }

  return <ArtistContent initialSession={session} artist={artist} />
}
