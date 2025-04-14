import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import PreferencesWrapper from './preferences-wrapper'
import prisma from "@/lib/prisma"

export default async function PreferencesPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/login')
  }

  // Fetch initial data using Prisma
  const [categories, preferences] = await Promise.all([
    prisma.category.findMany({
      include: {
        parent: true
      }
    }),
    prisma.artPreference.findMany({
      include: {
        category: true
      },
      where: {
        userId: session.user.id
      }
    })
  ])

  return (
    <PreferencesWrapper 
      initialSession={session}
      initialCategories={categories}
      initialPreferences={preferences}
    />
  )
} 