"use client"

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import Image from 'next/image'
import { toast } from 'sonner'
import { validateArtwork } from '@/lib/validation'
import { AddToCollection } from '@/components/add-to-collection'
import { Heart, Edit2 } from 'lucide-react'

interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  subcategories: Category[];
}

interface Artwork {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  category: Category;
  artist: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

export default function ArtworkPage({ artwork }: { artwork: Artwork }) {
  const router = useRouter()
  const { data: session } = useSession()
  const isArtist = session?.user?.id === artwork.artist.id
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedArtwork, setEditedArtwork] = useState(artwork)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState(artwork.category.id)
  const [selectedSubcategory, setSelectedSubcategory] = useState(artwork.category.id)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/categories')
        if (!response.ok) {
          throw new Error('Failed to fetch categories')
        }
        const data = await response.json()
        setCategories(data)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchCategories()
  }, [])

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/artworks/${artwork.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete artwork')
      }

      toast.success('Artwork deleted successfully')
      router.push('/')
    } catch (error) {
      console.error('Error deleting artwork:', error)
      toast.error('Failed to delete artwork')
    }
  }

  const handleEdit = async () => {
    const validation = validateArtwork(editedArtwork)
    if (!validation.isValid) {
      setValidationErrors(validation.errors)
      return
    }

    try {
      const response = await fetch(`/api/artworks/${artwork.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedArtwork),
      })

      if (!response.ok) {
        throw new Error('Failed to update artwork')
      }

      toast.success('Artwork updated successfully')
      setIsEditing(false)
      setValidationErrors({})
      router.refresh()
    } catch (error) {
      console.error('Error updating artwork:', error)
      toast.error('Failed to update artwork')
    }
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Create preview URL
    const previewUrl = URL.createObjectURL(file)
    setImagePreview(previewUrl)

    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload image')
      }

      const { imageUrl } = await response.json()
      setEditedArtwork((prev) => ({ ...prev, imageUrl }))
      setImagePreview(null) // Clear preview after successful upload
      toast.success('Image updated successfully')
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Failed to upload image')
      setImagePreview(null)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedArtwork(artwork)
    setValidationErrors({})
    setImagePreview(null)
  }

  const handleFavorite = () => {
    setIsFavorite(!isFavorite)
  }

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
    setSelectedSubcategory(value)
    setEditedArtwork((prev) => ({ ...prev, categoryId: value }))
    setValidationErrors((prev) => ({ ...prev, category: '' }))
  }

  const handleSubcategoryChange = (value: string) => {
    setSelectedSubcategory(value)
    setEditedArtwork((prev) => ({ ...prev, categoryId: value }))
    setValidationErrors((prev) => ({ ...prev, category: '' }))
  }

  const getSubcategories = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId)
    return category?.subcategories || []
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {isEditing ? (
                <div className="space-y-2">
                  <Input
                    value={editedArtwork.title}
                    onChange={(e) => {
                      setEditedArtwork((prev) => ({ ...prev, title: e.target.value }))
                      setValidationErrors((prev) => ({ ...prev, title: '' }))
                    }}
                    className={validationErrors.title ? 'border-red-500' : ''}
                  />
                  {validationErrors.title && (
                    <p className="text-sm text-red-500">{validationErrors.title}</p>
                  )}
                </div>
              ) : (
                artwork.title
              )}
            </CardTitle>
            {isArtist && (
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button onClick={handleEdit}>Save</Button>
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button onClick={() => setIsEditing(true)}>Edit</Button>
                    <Button
                      variant="destructive"
                      onClick={() => setIsDeleteDialogOpen(true)}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative aspect-square mb-6">
            <Image
              src={imagePreview || editedArtwork.imageUrl}
              alt={editedArtwork.title}
              fill
              className="object-cover rounded-md"
            />
            {isEditing && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <label className="cursor-pointer bg-white px-4 py-2 rounded">
                  Change Image
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              {isEditing ? (
                <div className="space-y-2">
                  <Textarea
                    value={editedArtwork.description}
                    onChange={(e) => {
                      setEditedArtwork((prev) => ({ ...prev, description: e.target.value }))
                      setValidationErrors((prev) => ({ ...prev, description: '' }))
                    }}
                    className={validationErrors.description ? 'border-red-500' : ''}
                    rows={3}
                  />
                  {validationErrors.description && (
                    <p className="text-sm text-red-500">{validationErrors.description}</p>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">{artwork.description}</p>
              )}
            </div>
            <div>
              <h3 className="font-semibold mb-2">Category</h3>
              {isEditing ? (
                <div className="space-y-2">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Main Category</label>
                    <Select
                      value={selectedCategory}
                      onValueChange={handleCategoryChange}
                    >
                      <SelectTrigger className={validationErrors.category ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories
                          .filter((cat) => !cat.parentId)
                          .map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedCategory && getSubcategories(selectedCategory).length > 0 && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">Subcategory</label>
                      <Select
                        value={selectedSubcategory}
                        onValueChange={handleSubcategoryChange}
                      >
                        <SelectTrigger className={validationErrors.category ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Select a subcategory" />
                        </SelectTrigger>
                        <SelectContent>
                          {getSubcategories(selectedCategory).map((subcategory) => (
                            <SelectItem key={subcategory.id} value={subcategory.id}>
                              {subcategory.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {validationErrors.category && (
                    <p className="text-sm text-red-500">{validationErrors.category}</p>
                  )}
                </div>
              ) : (
                <div>
                  <p className="text-muted-foreground">
                    {artwork.category.parent
                      ? `${artwork.category.parent.name} - ${artwork.category.name}`
                      : artwork.category.name}
                  </p>
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold mb-2">Price</h3>
              {isEditing ? (
                <div className="space-y-2">
                  <Input
                    type="number"
                    value={editedArtwork.price}
                    onChange={(e) => {
                      setEditedArtwork((prev) => ({ ...prev, price: parseFloat(e.target.value) }))
                      setValidationErrors((prev) => ({ ...prev, price: '' }))
                    }}
                    className={validationErrors.price ? 'border-red-500' : ''}
                    min="0"
                    step="0.01"
                  />
                  {validationErrors.price && (
                    <p className="text-sm text-red-500">{validationErrors.price}</p>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">${artwork.price.toFixed(2)}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {artwork.artist.image && (
                <Image
                  src={artwork.artist.image}
                  alt={artwork.artist.name || 'Artist'}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              )}
              <span className="text-muted-foreground">
                {artwork.artist.name}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button onClick={handleFavorite} variant={isFavorite ? 'default' : 'outline'}>
              {isFavorite ? (
                <>
                  <Heart className="w-4 h-4 mr-2" />
                  Favorited
                </>
              ) : (
                <>
                  <Heart className="w-4 h-4 mr-2" />
                  Favorite
                </>
              )}
            </Button>
            <AddToCollection artworkId={artwork.id} />
            {isArtist && (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Artwork"
        description="Are you sure you want to delete this artwork? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  )
}
