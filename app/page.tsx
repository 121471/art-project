import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import HomeContent from './home-content'

// Mark the page as dynamic to handle session data
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  return <HomeContent initialSession={session} />
}
