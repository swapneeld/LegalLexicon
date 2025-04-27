import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { Term, InsertFavorite } from '@shared/schema';
import { useAuth } from '@/hooks/useAuth';

export function useFavorites() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  // Get user favorites
  const useUserFavorites = () => {
    return useQuery<Term[]>({
      queryKey: [`/api/users/${user?.id}/favorites`],
      queryFn: () => 
        fetch(`/api/users/${user?.id}/favorites`).then(res => res.json()),
      enabled: isAuthenticated && !!user?.id,
    });
  };

  // Check if a term is favorited
  const useIsFavorite = (termId: number) => {
    return useQuery<{ isFavorite: boolean }>({
      queryKey: [`/api/favorites/${user?.id}/${termId}`],
      queryFn: () => 
        fetch(`/api/favorites/${user?.id}/${termId}`).then(res => res.json()),
      enabled: isAuthenticated && !!user?.id && !!termId,
      select: (data) => data || { isFavorite: false },
    });
  };

  // Add a favorite
  const useAddFavorite = () => {
    return useMutation({
      mutationFn: (termId: number) => {
        if (!user?.id) {
          throw new Error('You must be logged in to favorite a term');
        }
        
        const favorite: InsertFavorite = {
          userId: user.id,
          termId,
        };
        
        return apiRequest('POST', '/api/favorites', favorite);
      },
      onSuccess: (_, termId) => {
        queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.id}/favorites`] });
        queryClient.invalidateQueries({ queryKey: [`/api/favorites/${user?.id}/${termId}`] });
        toast({
          title: 'Term Favorited',
          description: 'The term has been added to your favorites.',
        });
      },
      onError: (error) => {
        toast({
          title: 'Error Adding Favorite',
          description: error instanceof Error ? error.message : 'An error occurred while adding the favorite.',
          variant: 'destructive',
        });
      },
    });
  };

  // Remove a favorite
  const useRemoveFavorite = () => {
    return useMutation({
      mutationFn: (termId: number) => {
        if (!user?.id) {
          throw new Error('You must be logged in to remove a favorite');
        }
        
        return apiRequest('DELETE', `/api/favorites/${user.id}/${termId}`);
      },
      onSuccess: (_, termId) => {
        queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.id}/favorites`] });
        queryClient.invalidateQueries({ queryKey: [`/api/favorites/${user?.id}/${termId}`] });
        toast({
          title: 'Favorite Removed',
          description: 'The term has been removed from your favorites.',
        });
      },
      onError: (error) => {
        toast({
          title: 'Error Removing Favorite',
          description: error instanceof Error ? error.message : 'An error occurred while removing the favorite.',
          variant: 'destructive',
        });
      },
    });
  };

  // Toggle favorite status
  const useToggleFavorite = () => {
    const addFavoriteMutation = useAddFavorite();
    const removeFavoriteMutation = useRemoveFavorite();

    return useMutation({
      mutationFn: async ({ termId, isFavorite }: { termId: number; isFavorite: boolean }) => {
        if (isFavorite) {
          await removeFavoriteMutation.mutateAsync(termId);
        } else {
          await addFavoriteMutation.mutateAsync(termId);
        }
      },
    });
  };

  return {
    useUserFavorites,
    useIsFavorite,
    useAddFavorite,
    useRemoveFavorite,
    useToggleFavorite,
  };
}
