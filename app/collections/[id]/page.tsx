'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { toast } from 'sonner';

interface Artwork {
  id: string;
  title: string;
  description: string | null;
  price: number;
  imageUrl: string;
  category: string;
  artist: {
    id: string;
    name: string;
    image: string | null;
  };
}

interface Collection {
  id: string;
  name: string;
  description: string | null;
  artworks: Artwork[];
  user: {
    id: string;
    name: string;
    image: string | null;
  };
}

export default function CollectionPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCollection, setEditedCollection] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    fetchCollection();
  }, [params.id]);

  const fetchCollection = async () => {
    try {
      const response = await fetch(`/api/collections/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setCollection(data);
        setEditedCollection({
          name: data.name,
          description: data.description || '',
        });
      }
    } catch (error) {
      console.error('Error fetching collection:', error);
      toast.error('Failed to load collection');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCollection = async () => {
    try {
      const response = await fetch(`/api/collections/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedCollection),
      });

      if (response.ok) {
        toast.success('Collection updated successfully');
        setIsEditing(false);
        fetchCollection();
      } else {
        throw new Error('Failed to update collection');
      }
    } catch (error) {
      console.error('Error updating collection:', error);
      toast.error('Failed to update collection');
    }
  };

  const handleDeleteCollection = async () => {
    try {
      const response = await fetch(`/api/collections/${params.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Collection deleted successfully');
        router.push('/collections');
      } else {
        throw new Error('Failed to delete collection');
      }
    } catch (error) {
      console.error('Error deleting collection:', error);
      toast.error('Failed to delete collection');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!collection) {
    return <div>Collection not found</div>;
  }

  const isOwner = session?.user?.id === collection.user.id;

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold">{collection.name}</h1>
          {collection.description && (
            <p className="text-gray-500 mt-2">{collection.description}</p>
          )}
          <div className="flex items-center mt-4">
            <img
              src={collection.user.image || '/default-avatar.png'}
              alt={collection.user.name || 'User'}
              className="w-8 h-8 rounded-full mr-2"
            />
            <span className="text-sm text-gray-500">
              by {collection.user.name || 'Unknown User'}
            </span>
          </div>
        </div>
        {isOwner && (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <ConfirmDialog
              title="Delete Collection"
              description="Are you sure you want to delete this collection? This action cannot be undone."
              onConfirm={handleDeleteCollection}
            >
              <Button variant="outline" size="icon">
                <Trash2 className="w-4 h-4" />
              </Button>
            </ConfirmDialog>
          </div>
        )}
      </div>

      {isEditing && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Edit Collection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Collection Name"
                value={editedCollection.name}
                onChange={(e) =>
                  setEditedCollection({ ...editedCollection, name: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
              <textarea
                placeholder="Description (optional)"
                value={editedCollection.description}
                onChange={(e) =>
                  setEditedCollection({
                    ...editedCollection,
                    description: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
              />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateCollection}>Save</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collection.artworks.map((artwork) => (
          <Card
            key={artwork.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push(`/artwork/${artwork.id}`)}
          >
            <div className="relative aspect-square">
              <img
                src={artwork.imageUrl}
                alt={artwork.title}
                className="w-full h-full object-cover rounded-t"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold">{artwork.title}</h3>
              <p className="text-sm text-gray-500">{artwork.category}</p>
              <p className="text-sm font-medium mt-2">
                ${artwork.price.toLocaleString()}
              </p>
              <div className="flex items-center mt-2">
                <img
                  src={artwork.artist.image || '/default-avatar.png'}
                  alt={artwork.artist.name}
                  className="w-6 h-6 rounded-full mr-2"
                />
                <span className="text-sm text-gray-500">
                  {artwork.artist.name}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 