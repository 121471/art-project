import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import HomeContent from './home-content'

export default async function HomePage() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      redirect('/login')
    }

    return <HomeContent initialSession={session} />
  } catch (error) {
    console.error('Error in HomePage:', error)
    redirect('/login')
  }
}
