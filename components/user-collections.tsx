'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Collection {
  id: string;
  name: string;
  description: string | null;
  artworks: {
    id: string;
    title: string;
    imageUrl: string;
  }[];
}

interface UserCollectionsProps {
  userId: string;
  isOwnProfile?: boolean;
}

export function UserCollections({ userId, isOwnProfile = false }: UserCollectionsProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCollections();
  }, [userId]);

  const fetchCollections = async () => {
    try {
      const response = await fetch(`/api/users/${userId}/collections`);
      if (response.ok) {
        const data = await response.json();
        setCollections(data);
      }
    } catch (error) {
      console.error('Error fetching collections:', error);
      toast.error('Failed to load collections');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading collections...</div>;
  }

  if (collections.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          {isOwnProfile ? 'You have no collections yet.' : 'No collections yet.'}
        </p>
        {isOwnProfile && (
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.push('/collections')}
          >
            Create Collection
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {collections.map((collection) => (
        <Card
          key={collection.id}
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => router.push(`/collections/${collection.id}`)}
        >
          <CardHeader>
            <CardTitle>{collection.name}</CardTitle>
          </CardHeader>
          <CardContent>
            {collection.description && (
              <p className="text-sm text-gray-500 mb-4">{collection.description}</p>
            )}
            <div className="grid grid-cols-2 gap-2">
              {collection.artworks.slice(0, 4).map((artwork) => (
                <div key={artwork.id} className="relative aspect-square">
                  {artwork.imageUrl ? (
                    <img
                      src={artwork.imageUrl}
                      alt={artwork.title}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>
              ))}
              {collection.artworks.length > 4 && (
                <div className="relative aspect-square bg-gray-100 rounded flex items-center justify-center">
                  <span className="text-gray-500">+{collection.artworks.length - 4}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 