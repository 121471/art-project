"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Heart, Share2, MessageCircle, MapPin, Calendar, ArrowLeft } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

interface Artwork {
  id: string
  title: string
  description: string | null
  price: number
  imageUrl: string
  location: string | null
  category: string
  dimensions: string | null
  year: number | null
  artist: {
    id: string
    name: string | null
    image: string | null
    bio: string | null
  }
  relatedArtworks: Artwork[]
}

export default function ArtworkDetail() {
  const params = useParams()
  const { toast } = useToast()
  const [artwork, setArtwork] = useState<Artwork | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [showContactDialog, setShowContactDialog] = useState(false)
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: ""
  })

  useEffect(() => {
    async function fetchArtwork() {
      try {
        const response = await fetch(`/api/artworks/${params.id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch artwork")
        }
        const data = await response.json()
        setArtwork(data)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An error occurred"
        setError(errorMessage)
        toast({
          variant: "destructive",
          title: "Error",
          description: errorMessage,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchArtwork()
  }, [params.id, toast])

  const handleFavorite = async () => {
    try {
      const response = await fetch(`/api/artworks/${artwork?.id}/favorite`, {
        method: isFavorite ? "DELETE" : "POST",
      })
      if (!response.ok) {
        throw new Error("Failed to update favorite status")
      }
      setIsFavorite(!isFavorite)
      toast({
        title: isFavorite ? "Removed from favorites" : "Added to favorites",
        description: isFavorite ? "Artwork removed from your favorites" : "Artwork added to your favorites",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update favorite status",
      })
    }
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: artwork?.title,
        text: `Check out this artwork: ${artwork?.title}`,
        url: window.location.href,
      })
    } catch (error) {
      toast({
        title: "Share failed",
        description: "Could not share the artwork",
      })
    }
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/artworks/${artwork?.id}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactForm),
      })
      if (!response.ok) {
        throw new Error("Failed to send message")
      }
      setShowContactDialog(false)
      setContactForm({ name: "", email: "", message: "" })
      toast({
        title: "Message sent",
        description: "Your message has been sent to the artist",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message",
      })
    }
  }

  if (loading) {
    return (
      <div className="p-4 space-y-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-[200px]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="w-full aspect-square" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !artwork) {
    return (
      <div className="p-4">
        <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
          {error || "Artwork not found"}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">{artwork.title}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="relative aspect-square">
            <img
              src={artwork.imageUrl}
              alt={artwork.title}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handleFavorite}>
                <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{artwork.category}</Badge>
              <Badge variant="outline">${artwork.price}</Badge>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">About the Artwork</h2>
            <p className="text-gray-600">{artwork.description}</p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="h-4 w-4" />
                  <span>Location</span>
                </div>
                <p>{artwork.location}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>Year</span>
                </div>
                <p>{artwork.year}</p>
              </div>
              {artwork.dimensions && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>Dimensions</span>
                  </div>
                  <p>{artwork.dimensions}</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">About the Artist</h2>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={artwork.artist.image || undefined} />
                <AvatarFallback>{artwork.artist.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <Link href={`/artist/${artwork.artist.id}`} className="font-medium hover:underline">
                  {artwork.artist.name}
                </Link>
                <p className="text-sm text-gray-500">{artwork.artist.bio}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
              <DialogTrigger asChild>
                <Button className="flex-1">Contact Artist</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Contact Artist</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <Input
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Message</label>
                    <Textarea
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">Send Message</Button>
                </form>
              </DialogContent>
            </Dialog>
            <Button variant="outline" className="flex-1">Make Offer</Button>
          </div>
        </div>
      </div>

      {artwork.relatedArtworks.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Related Artworks</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {artwork.relatedArtworks.map((related) => (
              <Link href={`/artwork/${related.id}`} key={related.id} className="block">
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <img
                      src={related.imageUrl}
                      alt={related.title}
                      className="w-full aspect-square object-cover"
                    />
                  </CardContent>
                  <CardFooter className="p-3">
                    <div className="w-full">
                      <h3 className="font-medium">{related.title}</h3>
                      <p className="text-sm text-gray-600">{related.artist.name}</p>
                      <div className="flex justify-between items-center text-sm mt-1">
                        <span className="font-semibold">${related.price}</span>
                        <Badge variant="outline">{related.location}</Badge>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 