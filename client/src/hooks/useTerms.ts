import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { Term, InsertTerm } from '@shared/schema';

export function useTerms() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Get all terms (paginated)
  const useAllTerms = (page: number = 1, limit: number = 10, approved: boolean = true) => {
    return useQuery<Term[]>({
      queryKey: ['/api/terms', page, limit, approved],
      queryFn: () => 
        fetch(`/api/terms?page=${page}&limit=${limit}&approved=${approved}`)
          .then(res => res.json()),
    });
  };

  // Get term by ID
  const useTerm = (id: number | null) => {
    return useQuery<Term & { cases: any[]; examples: any[] }>({
      queryKey: [`/api/terms/${id}`],
      queryFn: () => 
        fetch(`/api/terms/${id}`).then(res => res.json()),
      enabled: !!id,
    });
  };

  // Get word of the day
  const useWordOfTheDay = () => {
    return useQuery<Term & { cases: any[] }>({
      queryKey: ['/api/terms/word-of-the-day'],
      queryFn: () => 
        fetch('/api/terms/word-of-the-day').then(res => res.json()),
    });
  };

  // Search terms
  const useSearchTerms = (query: string, page: number = 1, limit: number = 10) => {
    return useQuery<Term[]>({
      queryKey: ['/api/terms/search', query, page, limit],
      queryFn: () => 
        fetch(`/api/terms/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`)
          .then(res => res.json()),
      enabled: query.length > 0,
    });
  };

  // Create a new term
  const useCreateTerm = () => {
    return useMutation({
      mutationFn: (term: InsertTerm) => 
        apiRequest('POST', '/api/terms', term),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/api/terms'] });
        toast({
          title: 'Term Created',
          description: 'The term was successfully created and is pending approval.',
        });
      },
      onError: (error) => {
        toast({
          title: 'Error Creating Term',
          description: error instanceof Error ? error.message : 'An error occurred while creating the term.',
          variant: 'destructive',
        });
      },
    });
  };

  // Update a term
  const useUpdateTerm = () => {
    return useMutation({
      mutationFn: ({ id, term }: { id: number; term: Partial<InsertTerm> }) => 
        apiRequest('PUT', `/api/terms/${id}`, term),
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['/api/terms'] });
        queryClient.invalidateQueries({ queryKey: [`/api/terms/${variables.id}`] });
        toast({
          title: 'Term Updated',
          description: 'The term was successfully updated.',
        });
      },
      onError: (error) => {
        toast({
          title: 'Error Updating Term',
          description: error instanceof Error ? error.message : 'An error occurred while updating the term.',
          variant: 'destructive',
        });
      },
    });
  };

  // Delete a term
  const useDeleteTerm = () => {
    return useMutation({
      mutationFn: (id: number) => 
        apiRequest('DELETE', `/api/terms/${id}`),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/api/terms'] });
        toast({
          title: 'Term Deleted',
          description: 'The term was successfully deleted.',
        });
      },
      onError: (error) => {
        toast({
          title: 'Error Deleting Term',
          description: error instanceof Error ? error.message : 'An error occurred while deleting the term.',
          variant: 'destructive',
        });
      },
    });
  };

  // Get pending terms (admin)
  const usePendingTerms = (page: number = 1, limit: number = 10) => {
    return useQuery<Term[]>({
      queryKey: ['/api/admin/pending/terms', page, limit],
      queryFn: () => 
        fetch(`/api/admin/pending/terms?page=${page}&limit=${limit}`)
          .then(res => res.json()),
    });
  };

  // Approve a term (admin)
  const useApproveTerm = () => {
    return useMutation({
      mutationFn: (id: number) => 
        apiRequest('PUT', `/api/admin/approve/term/${id}`, {}),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/api/admin/pending/terms'] });
        queryClient.invalidateQueries({ queryKey: ['/api/terms'] });
        toast({
          title: 'Term Approved',
          description: 'The term was successfully approved and is now visible to users.',
        });
      },
      onError: (error) => {
        toast({
          title: 'Error Approving Term',
          description: error instanceof Error ? error.message : 'An error occurred while approving the term.',
          variant: 'destructive',
        });
      },
    });
  };

  return {
    useAllTerms,
    useTerm,
    useWordOfTheDay,
    useSearchTerms,
    useCreateTerm,
    useUpdateTerm,
    useDeleteTerm,
    usePendingTerms,
    useApproveTerm,
  };
}
