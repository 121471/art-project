'use client';

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Session } from 'next-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ArtFeed from "@/components/art-feed"
import { Search, Plus, User, Home } from "lucide-react"
import Link from "next/link"

interface Artwork {
  id: string
  title: string
  description: string
  imageUrl: string
  price: number
  categoryId: string
  userId: string
  createdAt: string
  updatedAt: string
}

interface HomeContentProps {
  initialSession: Session;
}

export default function HomeContent({ initialSession }: HomeContentProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [artworks, setArtworks] = useState<Artwork[]>([])

  useEffect(() => {
    if (!initialSession) {
      router.push('/login')
      return
    }

    async function fetchArtworks() {
      try {
        const response = await fetch('/api/artworks')
        if (!response.ok) {
          throw new Error('Failed to fetch artworks')
        }
        const data = await response.json()
        setArtworks(data)
      } catch (error) {
        console.error('Error fetching artworks:', error)
        toast.error('Failed to load artworks')
      }
    }

    fetchArtworks()
  }, [initialSession, router])

  if (!initialSession) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col">
      <header className="p-4 border-b">
        <h1 className="text-2xl font-bold">Art Project</h1>
      </header>

      <Tabs defaultValue="discover" className="flex-1 flex flex-col">
        <TabsContent value="discover" className="flex-1 overflow-auto pb-16">
          <ArtFeed />
        </TabsContent>

        <TabsContent value="search" className="flex-1 overflow-auto pb-16">
          <div className="p-4">
            <div className="relative mb-4">
              <input type="text" placeholder="Search" className="w-full p-2 pl-10 border rounded-full" />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">Location</h2>
              <div className="border rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <span>Current location</span>
                  <span>10 miles</span>
                </div>
                <input type="range" min="1" max="50" defaultValue="10" className="w-full accent-blue-500" />
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">Categories</h2>
              <div className="border rounded-lg p-4 grid grid-cols-2 gap-2">
                <button className="border rounded-lg p-2 text-center bg-blue-50 border-blue-200">Painting</button>
                <button className="border rounded-lg p-2 text-center">Photography</button>
                <button className="border rounded-lg p-2 text-center">Sculpture</button>
              </div>
            </div>

            <button className="w-full bg-blue-500 text-white rounded-lg p-3 font-medium">Apply Filters</button>
          </div>
        </TabsContent>

        <TabsContent value="profile" className="flex-1 overflow-auto pb-16">
          <div className="flex flex-col items-center p-4">
            <div className="w-24 h-24 rounded-full overflow-hidden mb-2">
              <img
                src={initialSession.user?.image || "/placeholder.svg"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-xl font-bold">{initialSession.user?.name}</h2>
            <p className="text-center text-gray-700 mb-4">{initialSession.user?.email}</p>

            <div className="grid grid-cols-3 gap-2 w-full mb-4">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="aspect-square rounded-md overflow-hidden">
                  <img
                    src={`/placeholder.svg?height=120&width=120&text=Art${item}`}
                    alt={`Artwork ${item}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsList className="fixed bottom-0 left-0 right-0 h-16 border-t bg-white grid grid-cols-4 gap-0">
          <TabsTrigger
            value="discover"
            className="flex flex-col items-center justify-center data-[state=active]:text-blue-500"
          >
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Discover</span>
          </TabsTrigger>
          <TabsTrigger
            value="search"
            className="flex flex-col items-center justify-center data-[state=active]:text-blue-500"
          >
            <Search className="h-5 w-5" />
            <span className="text-xs mt-1">Search</span>
          </TabsTrigger>
          <TabsTrigger
            value="create"
            className="flex flex-col items-center justify-center data-[state=active]:text-blue-500"
          >
            <Plus className="h-5 w-5" />
            <span className="text-xs mt-1">Create</span>
          </TabsTrigger>
          <TabsTrigger
            value="profile"
            className="flex flex-col items-center justify-center data-[state=active]:text-blue-500"
          >
            <User className="h-5 w-5" />
            <span className="text-xs mt-1">Profile</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
} 