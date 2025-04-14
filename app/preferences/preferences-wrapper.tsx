'use client'

import { Session } from 'next-auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import PreferencesContent from './preferences-content'

interface PreferencesWrapperProps {
  initialSession: Session
  initialCategories: any[]
  initialPreferences: any[]
}

export default function PreferencesWrapper({
  initialSession,
  initialCategories,
  initialPreferences
}: PreferencesWrapperProps) {
  const router = useRouter()

  useEffect(() => {
    if (!initialSession) {
      router.push('/login')
    }
  }, [router, initialSession])

  if (!initialSession) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <PreferencesContent
      initialSession={initialSession}
      initialCategories={initialCategories}
      initialPreferences={initialPreferences}
    />
  )
} 