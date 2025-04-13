"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronRight, Loader2, Search, ArrowUpDown, Filter, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'

interface Artwork {
  id: string
  title: string
  description: string
  price: number
  imageUrl: string
  createdAt: string
  location: string | null
  category: string
  dimensions: string | null
  year: number | null
  artist: {
    id: string
    name: string | null
    image: string | null
  }
}

interface Collection {
  id: string
  name: string
  description: string
  artworks: Artwork[]
}

export default function ArtFeed() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDistance, setSelectedDistance] = useState("25")
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [yearRange, setYearRange] = useState([1900, new Date().getFullYear()])
  const [sortBy, setSortBy] = useState("newest")
  const [page, setPage] = useState(1)
  const itemsPerPage = 12

  // Filter artworks based on all criteria
  const filteredArtworks = artworks.filter((artwork) => {
    const matchesSearch = artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artwork.artist.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artwork.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = selectedCategory === "all" || artwork.category === selectedCategory
    const matchesPrice = artwork.price >= priceRange[0] && artwork.price <= priceRange[1]
    const matchesYear = artwork.year ? artwork.year >= yearRange[0] && artwork.year <= yearRange[1] : true

    return matchesSearch && matchesCategory && matchesPrice && matchesYear
  })

  // Sort artworks
  const sortedArtworks = [...filteredArtworks].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case "price-high":
        return b.price - a.price
      case "price-low":
        return a.price - b.price
      default:
        return 0
    }
  })

  // Paginate artworks
  const totalPages = Math.ceil(sortedArtworks.length / itemsPerPage)
  const paginatedArtworks = sortedArtworks.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  )

  useEffect(() => {
    async function fetchArtworks() {
      try {
        const response = await fetch("/api/artworks")
        if (!response.ok) {
          throw new Error("Failed to fetch artworks")
        }
        const data = await response.json()
        setArtworks(data)
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred")
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch artworks",
        })
      } finally {
        setLoading(false)
      }
    }

    async function fetchCollections() {
      try {
        const response = await fetch("/api/collections")
        if (!response.ok) {
          throw new Error("Failed to fetch collections")
        }
        const data = await response.json()
        setCollections(data)
      } catch (error) {
        console.error("Error fetching collections:", error)
      }
    }

    fetchArtworks()
    fetchCollections()
  }, [toast])

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    setPage(1)
  }

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
    setPage(1)
  }

  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange(value)
    setPage(1)
  }

  const handleYearRangeChange = (value: number[]) => {
    setYearRange(value)
    setPage(1)
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    setPage(1)
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setSelectedDistance("25")
    setPriceRange([0, 10000])
    setYearRange([1900, new Date().getFullYear()])
    setSortBy("newest")
    setPage(1)
  }

  if (loading) {
    return (
      <div className="p-4 space-y-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-[200px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-[100px]" />
            <Skeleton className="h-4 w-[60px]" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-0">
                  <Skeleton className="w-full aspect-square" />
                </CardContent>
                <CardFooter className="p-2">
                  <div className="space-y-2 w-full">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search artworks or artists..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="PAINTING">Paintings</SelectItem>
                      <SelectItem value="PHOTOGRAPHY">Photography</SelectItem>
                      <SelectItem value="SCULPTURE">Sculpture</SelectItem>
                      <SelectItem value="DIGITAL">Digital Art</SelectItem>
                      <SelectItem value="MIXED_MEDIA">Mixed Media</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Price Range</label>
                  <div className="space-y-4">
                    <Slider
                      value={priceRange}
                      min={0}
                      max={10000}
                      step={100}
                      onValueChange={handlePriceRangeChange}
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Year Range</label>
                  <div className="space-y-4">
                    <Slider
                      value={yearRange}
                      min={1900}
                      max={new Date().getFullYear()}
                      step={1}
                      onValueChange={handleYearRangeChange}
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{yearRange[0]}</span>
                      <span>{yearRange[1]}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Distance</label>
                  <Select value={selectedDistance} onValueChange={setSelectedDistance}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select distance" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">Within 10 miles</SelectItem>
                      <SelectItem value="25">Within 25 miles</SelectItem>
                      <SelectItem value="50">Within 50 miles</SelectItem>
                      <SelectItem value="100">Within 100 miles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={clearFilters} variant="outline" className="w-full">
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {collections.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Featured Collections</h2>
            <Link href="/collections" className="text-sm text-gray-500 flex items-center hover:text-gray-700">
              See all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {collections.slice(0, 3).map((collection) => (
              <Link href={`/collection/${collection.id}`} key={collection.id}>
                <Card>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {collection.artworks.slice(0, 4).map((artwork) => (
                        <div key={artwork.id} className="relative aspect-square">
                          <Image
                            src={artwork.imageUrl}
                            alt={artwork.title}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                      ))}
                    </div>
                    <h3 className="font-medium">{collection.name}</h3>
                    <p className="text-sm text-gray-500">{collection.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            {searchQuery ? `Search Results (${filteredArtworks.length})` : "All Artworks"}
          </h2>
          <span className="text-sm text-gray-500">
            Showing {Math.min(page * itemsPerPage, filteredArtworks.length)} of {filteredArtworks.length}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedArtworks.map((artwork) => (
            <Link href={`/artwork/${artwork.id}`} key={artwork.id} className="block">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative aspect-square">
                    <Image
                      src={artwork.imageUrl}
                      alt={artwork.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium">{artwork.title}</h3>
                    <p className="text-sm text-gray-600">{artwork.artist.name}</p>
                    <div className="flex justify-between items-center text-sm mt-1">
                      <span className="font-semibold">${artwork.price}</span>
                      <Badge variant="outline">{artwork.category}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {totalPages > 1 && (
          <Pagination className="justify-center">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage(page - 1)}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i + 1}>
                  <PaginationLink
                    onClick={() => setPage(i + 1)}
                    isActive={page === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage(page + 1)}
                  className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  )
}
