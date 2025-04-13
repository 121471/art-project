'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface Collection {
  id: string;
  name: string;
  artworks: {
    id: string;
  }[];
}

interface AddToCollectionProps {
  artworkId: string;
}

export function AddToCollection({ artworkId }: AddToCollectionProps) {
  const { data: session } = useSession();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      fetchCollections();
    }
  }, [session]);

  const fetchCollections = async () => {
    try {
      const response = await fetch('/api/collections');
      if (response.ok) {
        const data = await response.json();
        setCollections(data);
      }
    } catch (error) {
      console.error('Error fetching collections:', error);
      toast.error('Failed to load collections');
    }
  };

  const handleAddToCollection = async (collectionId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/collections/${collectionId}/artworks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ artworkId }),
      });

      if (response.ok) {
        toast.success('Artwork added to collection');
        fetchCollections();
      } else {
        throw new Error('Failed to add artwork to collection');
      }
    } catch (error) {
      console.error('Error adding artwork to collection:', error);
      toast.error('Failed to add artwork to collection');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromCollection = async (collectionId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/collections/${collectionId}/artworks/${artworkId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Artwork removed from collection');
        fetchCollections();
      } else {
        throw new Error('Failed to remove artwork from collection');
      }
    } catch (error) {
      console.error('Error removing artwork from collection:', error);
      toast.error('Failed to remove artwork from collection');
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add to Collection
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to Collection</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {collections.map((collection) => {
            const isInCollection = collection.artworks.some((artwork) => artwork.id === artworkId);
            return (
              <div
                key={collection.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <span>{collection.name}</span>
                <Button
                  variant={isInCollection ? 'default' : 'outline'}
                  size="sm"
                  onClick={() =>
                    isInCollection
                      ? handleRemoveFromCollection(collection.id)
                      : handleAddToCollection(collection.id)
                  }
                  disabled={isLoading}
                >
                  {isInCollection ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Remove
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Add
                    </>
                  )}
                </Button>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
} 