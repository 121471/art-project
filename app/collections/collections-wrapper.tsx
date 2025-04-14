'use client'

import { Session } from 'next-auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import CollectionsContent from './collections-content'

interface CollectionsWrapperProps {
  initialSession: Session
}

export default function CollectionsWrapper({
  initialSession
}: CollectionsWrapperProps) {
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

  return <CollectionsContent initialSession={initialSession} />
} 