'use client';

import { useState, useEffect } from 'react';
import { Session } from 'next-auth';
import { useRouter } from 'next/navigation';
import { Plus, Edit2, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ConfirmDialog } from '@/components/confirm-dialog';
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

interface CollectionsContentProps {
  initialSession: Session;
}

export default function CollectionsContent({ initialSession }: CollectionsContentProps) {
  const router = useRouter();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newCollection, setNewCollection] = useState({
    name: '',
    description: '',
  });
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!initialSession?.user) {
      router.push('/login');
      return;
    }

    fetchCollections();
  }, [initialSession, router]);

  const fetchCollections = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/collections');
      if (!response.ok) {
        throw new Error('Failed to fetch collections');
      }
      const data = await response.json();
      setCollections(data);
    } catch (error) {
      console.error('Error fetching collections:', error);
      toast.error('Failed to load collections');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCollection = async () => {
    try {
      const response = await fetch('/api/collections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCollection),
      });

      if (response.ok) {
        toast.success('Collection created successfully');
        setIsCreating(false);
        setNewCollection({ name: '', description: '' });
        fetchCollections();
      } else {
        throw new Error('Failed to create collection');
      }
    } catch (error) {
      console.error('Error creating collection:', error);
      toast.error('Failed to create collection');
    }
  };

  const handleDeleteCollection = async (collectionId: string) => {
    try {
      const response = await fetch(`/api/collections/${collectionId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Collection deleted successfully');
        fetchCollections();
      } else {
        throw new Error('Failed to delete collection');
      }
    } catch (error) {
      console.error('Error deleting collection:', error);
      toast.error('Failed to delete collection');
    }
  };

  const handleUpdateCollection = async () => {
    if (!selectedCollection) return;

    try {
      const response = await fetch(`/api/collections/${selectedCollection.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: selectedCollection.name,
          description: selectedCollection.description,
        }),
      });

      if (response.ok) {
        toast.success('Collection updated successfully');
        setIsEditing(false);
        setSelectedCollection(null);
        fetchCollections();
      } else {
        throw new Error('Failed to update collection');
      }
    } catch (error) {
      console.error('Error updating collection:', error);
      toast.error('Failed to update collection');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!initialSession?.user) {
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Collections</h1>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Collection
        </Button>
      </div>

      {isCreating && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Create New Collection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                placeholder="Collection Name"
                value={newCollection.name}
                onChange={(e) => setNewCollection({ ...newCollection, name: e.target.value })}
              />
              <Textarea
                placeholder="Description (optional)"
                value={newCollection.description}
                onChange={(e) => setNewCollection({ ...newCollection, description: e.target.value })}
              />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateCollection}>Create</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((collection) => (
          <Card key={collection.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{collection.name}</CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedCollection(collection);
                      setIsEditing(true);
                    }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <ConfirmDialog
                    title="Delete Collection"
                    description="Are you sure you want to delete this collection? This action cannot be undone."
                    onConfirm={() => handleDeleteCollection(collection.id)}
                  >
                    <Button variant="ghost" size="icon">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </ConfirmDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {collection.description && (
                <p className="text-sm text-gray-500 mb-4">{collection.description}</p>
              )}
              <div className="grid grid-cols-2 gap-2">
                {collection.artworks.map((artwork) => (
                  <div
                    key={artwork.id}
                    className="relative aspect-square cursor-pointer"
                    onClick={() => router.push(`/artwork/${artwork.id}`)}
                  >
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {isEditing && selectedCollection && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Edit Collection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  placeholder="Collection Name"
                  value={selectedCollection.name}
                  onChange={(e) =>
                    setSelectedCollection({ ...selectedCollection, name: e.target.value })
                  }
                />
                <Textarea
                  placeholder="Description (optional)"
                  value={selectedCollection.description || ''}
                  onChange={(e) =>
                    setSelectedCollection({ ...selectedCollection, description: e.target.value })
                  }
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
        </div>
      )}
    </div>
  );
} 