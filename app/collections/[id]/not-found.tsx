import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CollectionNotFound() {
  return (
    <div className="container mx-auto py-8 text-center">
      <h2 className="text-2xl font-bold mb-4">Collection Not Found</h2>
      <p className="text-gray-500 mb-6">
        The collection you're looking for doesn't exist or has been removed.
      </p>
      <Button asChild>
        <Link href="/collections">Back to Collections</Link>
      </Button>
    </div>
  );
} 