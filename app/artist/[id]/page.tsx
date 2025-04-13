"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { ExternalLink, Instagram, Twitter, Globe, MapPin, Calendar } from "lucide-react"
import Image from "next/image"
import { UserCollections } from '@/components/user-collections'

interface Artist {
  id: string
  name: string | null
  email: string
  image: string | null
  role: string
  bio: string | null
  website: string | null
  socialLinks: {
    instagram?: string
    twitter?: string
  } | null
  location: string | null
  isVerified: boolean
  createdAt: string
  artworks: {
    id: string
    title: string
    price: number
    imageUrl: string
    category: string
    createdAt: string
  }[]
  followers: { id: string }[]
  following: { id: string }[]
}

export default function ArtistPage() {
  const params = useParams()
  const { data: session } = useSession()
  const [artist, setArtist] = useState<Artist | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFollowing, setIsFollowing] = useState(false)

  useEffect(() => {
    async function fetchArtist() {
      try {
        const response = await fetch(`/api/artists/${params.id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch artist")
        }
        const data = await response.json()
        setArtist(data)
        setIsFollowing(data.followers.some((f: { id: string }) => f.id === session?.user?.id))
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchArtist()
  }, [params.id, session?.user?.id])

  const handleFollow = async () => {
    try {
      const response = await fetch(`/api/artists/${params.id}/follow`, {
        method: isFollowing ? "DELETE" : "POST",
      })
      if (!response.ok) {
        throw new Error("Failed to update follow status")
      }
      setIsFollowing(!isFollowing)
    } catch (error) {
      console.error("Error updating follow status:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="animate-pulse space-y-4">
          <div className="bg-gray-200 h-32 w-32 rounded-full mx-auto" />
          <div className="space-y-2">
            <div className="bg-gray-200 h-4 w-3/4 mx-auto rounded" />
            <div className="bg-gray-200 h-4 w-1/2 mx-auto rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !artist) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
          {error || "Artist not found"}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center mb-6">
              <div className="relative w-32 h-32 mb-4">
                <Avatar className="w-full h-full">
                  <AvatarImage src={artist.image || undefined} />
                  <AvatarFallback>{artist.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                {artist.isVerified && (
                  <Badge className="absolute -bottom-2 -right-2">Verified</Badge>
                )}
              </div>
              <div className="text-center mb-4">
                <h1 className="text-2xl font-bold mb-2">{artist.name}</h1>
                <p className="text-gray-600">{artist.email}</p>
              </div>
              {session?.user?.id !== artist.id && (
                <Button
                  variant={isFollowing ? "outline" : "default"}
                  onClick={handleFollow}
                  className="mb-4"
                >
                  {isFollowing ? "Following" : "Follow"}
                </Button>
              )}
              <div className="flex gap-4 mb-4">
                {artist.website && (
                  <a
                    href={artist.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <Globe className="h-5 w-5" />
                  </a>
                )}
                {artist.socialLinks?.instagram && (
                  <a
                    href={`https://instagram.com/${artist.socialLinks.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                )}
                {artist.socialLinks?.twitter && (
                  <a
                    href={`https://twitter.com/${artist.socialLinks.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                )}
              </div>
              <div className="flex gap-4 text-sm text-gray-600 mb-4">
                {artist.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{artist.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {new Date(artist.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              {artist.bio && (
                <p className="text-center text-gray-600 max-w-2xl">{artist.bio}</p>
              )}
            </div>

            <div className="flex justify-center gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{artist.artworks.length}</div>
                <div className="text-sm text-gray-600">Artworks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{artist.followers.length}</div>
                <div className="text-sm text-gray-600">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{artist.following.length}</div>
                <div className="text-sm text-gray-600">Following</div>
              </div>
            </div>

            <Tabs defaultValue="artworks">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="artworks">Artworks</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
              </TabsList>
              <TabsContent value="artworks">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  {artist.artworks.map((artwork) => (
                    <Link
                      href={`/artwork/${artwork.id}`}
                      key={artwork.id}
                      className="block"
                    >
                      <div className="relative aspect-square rounded-lg overflow-hidden mb-2">
                        <Image
                          src={artwork.imageUrl}
                          alt={artwork.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <h3 className="font-medium">{artwork.title}</h3>
                      <div className="flex justify-between text-sm">
                        <span>${artwork.price}</span>
                        <span className="text-gray-500">{artwork.category}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="about">
                <div className="mt-4 space-y-4">
                  {artist.bio && (
                    <div>
                      <h3 className="font-semibold mb-2">Bio</h3>
                      <p className="text-gray-600">{artist.bio}</p>
                    </div>
                  )}
                  {artist.location && (
                    <div>
                      <h3 className="font-semibold mb-2">Location</h3>
                      <p className="text-gray-600">{artist.location}</p>
                    </div>
                  )}
                  {artist.website && (
                    <div>
                      <h3 className="font-semibold mb-2">Website</h3>
                      <a
                        href={artist.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        {artist.website}
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  )}
                  {(artist.socialLinks?.instagram || artist.socialLinks?.twitter) && (
                    <div>
                      <h3 className="font-semibold mb-2">Social Media</h3>
                      <div className="flex gap-4">
                        {artist.socialLinks?.instagram && (
                          <a
                            href={`https://instagram.com/${artist.socialLinks.instagram}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
                          >
                            <Instagram className="h-4 w-4" />
                            @{artist.socialLinks.instagram}
                          </a>
                        )}
                        {artist.socialLinks?.twitter && (
                          <a
                            href={`https://twitter.com/${artist.socialLinks.twitter}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
                          >
                            <Twitter className="h-4 w-4" />
                            @{artist.socialLinks.twitter}
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Collections</h2>
          <UserCollections userId={params.id} isOwnProfile={session?.user?.id === params.id} />
        </div>
      </div>
    </div>
  )
}
