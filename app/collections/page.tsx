import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import CollectionsWrapper from './collections-wrapper';

export default async function CollectionsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }

  return <CollectionsWrapper initialSession={session} />;
} 