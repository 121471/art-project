"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Session } from 'next-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface PreferencesContentProps {
  initialSession: Session;
}

export default function PreferencesContent({ initialSession }: PreferencesContentProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [preferences, setPreferences] = useState({
    name: initialSession?.user?.name || '',
    email: initialSession?.user?.email || '',
    bio: '',
    location: '',
    website: '',
    instagram: '',
    twitter: '',
  })

  useEffect(() => {
    if (!initialSession) {
      router.push('/login')
      return
    }

    async function fetchPreferences() {
      try {
        const response = await fetch('/api/users/preferences')
        if (!response.ok) {
          throw new Error('Failed to fetch preferences')
        }
        const data = await response.json()
        setPreferences(prev => ({
          ...prev,
          ...data,
          name: initialSession?.user?.name || data.name || '',
          email: initialSession?.user?.email || data.email || '',
        }))
      } catch (error) {
        console.error('Error fetching preferences:', error)
        toast.error('Failed to load preferences')
      }
    }

    fetchPreferences()
  }, [initialSession, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/users/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      })

      if (!response.ok) {
        throw new Error('Failed to update preferences')
      }

      toast.success('Preferences updated successfully')
    } catch (error) {
      console.error('Error updating preferences:', error)
      toast.error('Failed to update preferences')
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
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Profile Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={preferences.name}
                onChange={(e) => setPreferences({ ...preferences, name: e.target.value })}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={preferences.email}
                onChange={(e) => setPreferences({ ...preferences, email: e.target.value })}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Input
                id="bio"
                value={preferences.bio}
                onChange={(e) => setPreferences({ ...preferences, bio: e.target.value })}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={preferences.location}
                onChange={(e) => setPreferences({ ...preferences, location: e.target.value })}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={preferences.website}
                onChange={(e) => setPreferences({ ...preferences, website: e.target.value })}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                value={preferences.instagram}
                onChange={(e) => setPreferences({ ...preferences, instagram: e.target.value })}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter</Label>
              <Input
                id="twitter"
                value={preferences.twitter}
                onChange={(e) => setPreferences({ ...preferences, twitter: e.target.value })}
                disabled={isLoading}
              />
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Preferences'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 