'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function CollectionError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <div className="container mx-auto py-8 text-center">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-gray-500 mb-6">{error.message}</p>
      <div className="flex justify-center space-x-4">
        <Button onClick={() => reset()}>Try again</Button>
        <Button variant="outline" onClick={() => router.push('/collections')}>
          Back to Collections
        </Button>
      </div>
    </div>
  );
} 