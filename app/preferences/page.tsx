"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Loader2, X } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  parentId: string | null
  parent: Category | null
}

interface ArtPreference {
  id: string
  categoryId: string
  category: Category
}

export default function PreferencesPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [preferences, setPreferences] = useState<ArtPreference[]>([])

  useEffect(() => {
    if (!session) {
      router.push('/login')
      return
    }

    async function fetchData() {
      try {
        const [categoriesRes, preferencesRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/preferences'),
        ])

        if (!categoriesRes.ok || !preferencesRes.ok) {
          throw new Error('Failed to fetch data')
        }

        const [categoriesData, preferencesData] = await Promise.all([
          categoriesRes.json(),
          preferencesRes.json(),
        ])

        setCategories(categoriesData)
        setPreferences(preferencesData)
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Failed to load preferences')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [session, router])

  const handleAddPreference = async (categoryId: string) => {
    try {
      const response = await fetch('/api/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ categoryId }),
      })

      if (!response.ok) {
        throw new Error('Failed to add preference')
      }

      const newPreference = await response.json()
      setPreferences([...preferences, newPreference])
      toast.success('Preference added successfully')
    } catch (error) {
      console.error('Error adding preference:', error)
      toast.error('Failed to add preference')
    }
  }

  const handleRemovePreference = async (preferenceId: string) => {
    try {
      const response = await fetch('/api/preferences', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ preferenceId }),
      })

      if (!response.ok) {
        throw new Error('Failed to remove preference')
      }

      setPreferences(preferences.filter((p) => p.id !== preferenceId))
      toast.success('Preference removed successfully')
    } catch (error) {
      console.error('Error removing preference:', error)
      toast.error('Failed to remove preference')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const mainCategories = categories.filter((cat) => !cat.parentId)
  const getSubcategories = (parentId: string) =>
    categories.filter((cat) => cat.parentId === parentId)

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Art Preferences</h1>
      <p className="text-muted-foreground">
        Select the types of art you're interested in to receive notifications about new artworks.
      </p>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {preferences.map((preference) => (
                <Badge
                  key={preference.id}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {preference.category.name}
                  <button
                    onClick={() => handleRemovePreference(preference.id)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {preferences.length === 0 && (
                <p className="text-muted-foreground">No preferences selected yet.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {mainCategories.map((category) => (
            <Card key={category.id}>
              <CardHeader>
                <CardTitle>{category.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getSubcategories(category.id).map((subcategory) => {
                    const isSelected = preferences.some(
                      (p) => p.categoryId === subcategory.id
                    )
                    return (
                      <div
                        key={subcategory.id}
                        className="flex items-center justify-between"
                      >
                        <span>{subcategory.name}</span>
                        <Button
                          variant={isSelected ? "destructive" : "secondary"}
                          onClick={() =>
                            isSelected
                              ? handleRemovePreference(
                                  preferences.find(
                                    (p) => p.categoryId === subcategory.id
                                  )!.id
                                )
                              : handleAddPreference(subcategory.id)
                          }
                        >
                          {isSelected ? 'Remove' : 'Add'}
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
} 