'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Session } from 'next-auth'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ExternalLink, Instagram, Twitter, Globe, MapPin, Calendar } from "lucide-react"
import Image from "next/image"
import { UserCollections } from '@/components/user-collections'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface Artist {
  id: string
  name: string | null
  email: string | null
  image: string | null
  role: string
  bio: string | null
  website: string | null
  socialLinks: any // Changed to any to handle JSON from Prisma
  location: string | null
  isVerified: boolean
  createdAt: Date
  updatedAt: Date
  artworks: {
    id: string
    title: string
    price: number
    imageUrl: string
    category: {
      name: string
    }
    createdAt: Date
  }[]
  followers: { id: string }[]
  following: { id: string }[]
}

interface ArtistContentProps {
  initialSession: Session
  artist: Artist
}

export default function ArtistContent({ initialSession, artist }: ArtistContentProps) {
  const router = useRouter()
  const [isFollowing, setIsFollowing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!initialSession) {
      router.push('/login')
      return
    }

    // Check if the current user is following this artist
    setIsFollowing(artist.followers.some(follower => follower.id === initialSession.user.id))
  }, [initialSession, artist.followers, router])

  const handleFollow = async () => {
    if (!initialSession) {
      router.push('/login')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/artists/${artist.id}/follow`, {
        method: isFollowing ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to update follow status')
      }

      setIsFollowing(!isFollowing)
      toast.success(isFollowing ? 'Unfollowed artist' : 'Followed artist')
    } catch (error) {
      console.error('Error updating follow status:', error)
      toast.error('Failed to update follow status')
    } finally {
      setIsLoading(false)
    }
  }

  if (!initialSession) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <Avatar className="w-24 h-24 mb-4">
                  <AvatarImage src={artist.image || undefined} />
                  <AvatarFallback>{artist.name?.charAt(0) || 'A'}</AvatarFallback>
                </Avatar>
                <h1 className="text-2xl font-bold mb-2">{artist.name}</h1>
                {artist.isVerified && (
                  <Badge variant="secondary" className="mb-4">
                    Verified Artist
                  </Badge>
                )}
                <Button
                  variant={isFollowing ? "outline" : "default"}
                  onClick={handleFollow}
                  disabled={isLoading}
                  className="w-full mb-4"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : isFollowing ? (
                    'Unfollow'
                  ) : (
                    'Follow'
                  )}
                </Button>
                {artist.bio && <p className="text-center mb-4">{artist.bio}</p>}
                <div className="flex flex-col gap-2 w-full">
                  {artist.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{artist.location}</span>
                    </div>
                  )}
                  {artist.website && (
                    <Link href={artist.website} target="_blank" className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <span>Website</span>
                    </Link>
                  )}
                  {artist.socialLinks?.instagram && (
                    <Link href={artist.socialLinks.instagram} target="_blank" className="flex items-center gap-2">
                      <Instagram className="h-4 w-4" />
                      <span>Instagram</span>
                    </Link>
                  )}
                  {artist.socialLinks?.twitter && (
                    <Link href={artist.socialLinks.twitter} target="_blank" className="flex items-center gap-2">
                      <Twitter className="h-4 w-4" />
                      <span>Twitter</span>
                    </Link>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="w-full md:w-2/3">
          <Tabs defaultValue="artworks">
            <TabsList className="mb-4">
              <TabsTrigger value="artworks">Artworks</TabsTrigger>
              <TabsTrigger value="collections">Collections</TabsTrigger>
            </TabsList>
            <TabsContent value="artworks">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {artist.artworks.map((artwork) => (
                  <Card key={artwork.id}>
                    <CardContent className="p-0">
                      <Link href={`/artwork/${artwork.id}`}>
                        <div className="relative aspect-square">
                          <Image
                            src={artwork.imageUrl}
                            alt={artwork.title}
                            fill
                            className="object-cover rounded-t-lg"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold">{artwork.title}</h3>
                          <p className="text-sm text-muted-foreground">${artwork.price}</p>
                        </div>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="collections">
              <UserCollections userId={artist.id} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
} 