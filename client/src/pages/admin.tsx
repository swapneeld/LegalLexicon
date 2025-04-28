import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { 
  Loader2, 
  UsersRound, 
  MonitorSmartphone, 
  TabletSmartphone, 
  Smartphone,
  Check, 
  X, 
  Eye, 
  AlertCircle, 
  Pencil, 
  Trash2 
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Submission, Term } from '@shared/schema';

// Submissions Review Component
const SubmissionsReview = () => {
  const queryClient = useQueryClient();
  const [showDetails, setShowDetails] = useState<Submission | null>(null);
  
  // Fetch submissions
  const { data, isLoading, isError } = useQuery<{ submissions: Submission[], total: number }>({
    queryKey: ['/api/admin/submissions'],
    queryFn: async () => {
      const response = await fetch('/api/admin/submissions?processed=false&page=1&limit=50');
      if (!response.ok) {
        throw new Error('Failed to fetch submissions');
      }
      return response.json();
    }
  });
  
  // Approve submission mutation
  const approveMutation = useMutation({
    mutationFn: (id: number) => apiRequest('PUT', `/api/admin/submissions/${id}/approve`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/submissions'] });
      toast({
        title: 'Submission approved',
        description: 'The term submission has been approved and added to the dictionary.',
      });
      setShowDetails(null);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to approve submission',
        variant: 'destructive',
      });
    }
  });
  
  // Reject submission mutation
  const rejectMutation = useMutation({
    mutationFn: (id: number) => apiRequest('PUT', `/api/admin/submissions/${id}/reject`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/submissions'] });
      toast({
        title: 'Submission rejected',
        description: 'The term submission has been rejected.',
      });
      setShowDetails(null);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to reject submission',
        variant: 'destructive',
      });
    }
  });
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (isError || !data) {
    return (
      <div className="text-center py-8 text-red-500">
        <AlertCircle className="h-12 w-12 mx-auto mb-2" />
        <p>Error loading submissions. Please try again.</p>
      </div>
    );
  }
  
  if (data.submissions.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border">
        <p className="text-gray-500">No pending submissions to review.</p>
      </div>
    );
  }
  
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Term</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Submitted By</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.submissions.map((submission) => (
            <TableRow key={submission.id}>
              <TableCell className="font-medium">
                {submission.term}
              </TableCell>
              <TableCell>
                <Badge variant="outline">{submission.category}</Badge>
              </TableCell>
              <TableCell>{submission.submitterName || 'Anonymous'}</TableCell>
              <TableCell>{new Date(submission.createdAt).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowDetails(submission)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => approveMutation.mutate(submission.id)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => rejectMutation.mutate(submission.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {/* Submission Details Dialog */}
      {showDetails && (
        <Dialog open={!!showDetails} onOpenChange={(open) => !open && setShowDetails(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Submission Details</DialogTitle>
              <DialogDescription>Review the full details of this submission</DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Term</h3>
                  <p className="text-lg font-semibold">{showDetails.term}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Category</h3>
                  <p><Badge>{showDetails.category}</Badge></p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Definition</h3>
                <p className="bg-gray-50 p-3 rounded-md mt-1">{showDetails.definition}</p>
              </div>
              
              {showDetails.example && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Example</h3>
                  <p className="bg-gray-50 p-3 rounded-md mt-1 border-l-4 border-primary">{showDetails.example}</p>
                </div>
              )}
              
              {showDetails.caseName && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Case Reference</h3>
                  <div className="bg-gray-50 p-3 rounded-md mt-1">
                    <p className="font-medium">{showDetails.caseName} {showDetails.caseCitation && `(${showDetails.caseCitation})`}</p>
                    {showDetails.caseDescription && <p className="mt-1 text-gray-700">{showDetails.caseDescription}</p>}
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4 mt-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Submitted By</h3>
                  <p>{showDetails.submitterName || 'Anonymous'}</p>
                </div>
                {/* Email field would go here if we collect it */}
                {showDetails.submitterMobile && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Mobile</h3>
                    <p>{showDetails.submitterMobile}</p>
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter className="gap-2 flex-row sm:justify-end">
              <Button
                variant="outline"
                onClick={() => setShowDetails(null)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => rejectMutation.mutate(showDetails.id)}
                disabled={rejectMutation.isPending}
              >
                {rejectMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <X className="mr-2 h-4 w-4" />}
                Reject
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => approveMutation.mutate(showDetails.id)}
                disabled={approveMutation.isPending}
              >
                {approveMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                Approve
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

// Pending Terms Review Component
const PendingTermsReview = () => {
  const queryClient = useQueryClient();
  const [showDetails, setShowDetails] = useState<Term | null>(null);
  
  // Fetch pending terms
  const { data, isLoading, isError } = useQuery<{ terms: Term[], total: number }>({
    queryKey: ['/api/terms'],
    queryFn: async () => {
      const response = await fetch('/api/terms?approved=false&page=1&limit=50');
      if (!response.ok) {
        throw new Error('Failed to fetch pending terms');
      }
      return response.json();
    }
  });
  
  // Approve term mutation
  const approveMutation = useMutation({
    mutationFn: (id: number) => apiRequest('PUT', `/api/admin/approve/term/${id}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/terms'] });
      toast({
        title: 'Term approved',
        description: 'The term has been approved and is now visible in the dictionary.',
      });
      setShowDetails(null);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to approve term',
        variant: 'destructive',
      });
    }
  });
  
  // Delete term mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/admin/terms/${id}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/terms'] });
      toast({
        title: 'Term deleted',
        description: 'The term has been deleted from the system.',
      });
      setShowDetails(null);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete term',
        variant: 'destructive',
      });
    }
  });
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (isError || !data) {
    return (
      <div className="text-center py-8 text-red-500">
        <AlertCircle className="h-12 w-12 mx-auto mb-2" />
        <p>Error loading pending terms. Please try again.</p>
      </div>
    );
  }
  
  if (data.terms.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border">
        <p className="text-gray-500">No pending terms to review.</p>
      </div>
    );
  }
  
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Term</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Added</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.terms.map((term) => (
            <TableRow key={term.id}>
              <TableCell className="font-medium">
                {term.term}
              </TableCell>
              <TableCell>
                <Badge variant="outline">{term.category}</Badge>
              </TableCell>
              <TableCell>{new Date(term.createdAt).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowDetails(term)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => approveMutation.mutate(term.id)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => deleteMutation.mutate(term.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {/* Term Details Dialog */}
      {showDetails && (
        <Dialog open={!!showDetails} onOpenChange={(open) => !open && setShowDetails(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Term Details</DialogTitle>
              <DialogDescription>Review the full details of this term</DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Term</h3>
                  <p className="text-lg font-semibold">{showDetails.term}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Category</h3>
                  <p><Badge>{showDetails.category}</Badge></p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Definition</h3>
                <p className="bg-gray-50 p-3 rounded-md mt-1">{showDetails.definition}</p>
              </div>
              
              {showDetails.example && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Example</h3>
                  <p className="bg-gray-50 p-3 rounded-md mt-1 border-l-4 border-primary">{showDetails.example}</p>
                </div>
              )}
            </div>
            
            <DialogFooter className="gap-2 flex-row sm:justify-end">
              <Button
                variant="outline"
                onClick={() => setShowDetails(null)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteMutation.mutate(showDetails.id)}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <X className="mr-2 h-4 w-4" />}
                Delete
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => approveMutation.mutate(showDetails.id)}
                disabled={approveMutation.isPending}
              >
                {approveMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                Approve
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

// Terms Management Component
const TermsManagement = () => {
  const queryClient = useQueryClient();
  const [showDetails, setShowDetails] = useState<Term | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState<string>('');
  
  // Form for editing terms
  const form = useForm<{
    id: number;
    term: string;
    pronunciation: string | null;
    definition: string;
    category: string;
    example: string | null;
  }>({
    defaultValues: {
      id: 0,
      term: '',
      pronunciation: '',
      definition: '',
      category: '',
      example: ''
    }
  });
  
  // Fetch all terms
  const { data, isLoading, isError } = useQuery<{ terms: Term[], total: number }>({
    queryKey: ['/api/terms', searchTerm, category],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('approved', 'true');
      params.append('page', '1');
      params.append('limit', '100');
      
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      if (category && category !== 'all') {
        params.append('category', category);
      }
      
      const response = await fetch(`/api/terms?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch terms');
      }
      return response.json();
    }
  });
  
  // Delete term mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/admin/terms/${id}`, {}),
    onSuccess: () => {
      // Match the exact query key pattern used in the useQuery above
      queryClient.invalidateQueries({ queryKey: ['/api/terms', searchTerm, category] });
      toast({
        title: 'Term deleted',
        description: 'The term has been deleted from the dictionary.',
      });
      setShowDetails(null);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete term',
        variant: 'destructive',
      });
    }
  });
  
  // Update term mutation
  const updateMutation = useMutation({
    mutationFn: (data: { id: number, term: any }) => 
      apiRequest('PUT', `/api/admin/terms/${data.id}`, data.term),
    onSuccess: () => {
      // Match the exact query key pattern used in the useQuery above
      queryClient.invalidateQueries({ queryKey: ['/api/terms', searchTerm, category] });
      toast({
        title: 'Term updated',
        description: 'The term has been updated successfully.',
      });
      setShowDetails(null);
      setEditMode(false);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update term',
        variant: 'destructive',
      });
    }
  });
  
  // Categories for filtering
  const categories = [
    { label: 'All Categories', value: 'all' },
    { label: 'Constitutional', value: 'Constitutional' },
    { label: 'Criminal', value: 'Criminal' },
    { label: 'Civil', value: 'Civil' },
    { label: 'Family', value: 'Family' },
    { label: 'Procedural', value: 'Procedural' },
    { label: 'Contract', value: 'Contract' },
    { label: 'Property', value: 'Property' },
    { label: 'Administrative', value: 'Administrative' },
    { label: 'International', value: 'International' },
    { label: 'Other', value: 'Other' },
  ];
  
  const handleEditClick = (term: Term) => {
    setShowDetails(term);
    setEditMode(true);
    form.reset({
      id: term.id,
      term: term.term,
      pronunciation: term.pronunciation,
      definition: term.definition,
      category: term.category,
      example: term.example
    });
  };
  
  const handleViewClick = (term: Term) => {
    setShowDetails(term);
    setEditMode(false);
  };
  
  const handleSubmitEdit = (formData: any) => {
    updateMutation.mutate({
      id: formData.id,
      term: {
        term: formData.term,
        pronunciation: formData.pronunciation || null,
        definition: formData.definition,
        category: formData.category,
        example: formData.example || null
      }
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (isError || !data) {
    return (
      <div className="text-center py-8 text-red-500">
        <AlertCircle className="h-12 w-12 mx-auto mb-2" />
        <p>Error loading terms. Please try again.</p>
      </div>
    );
  }
  
  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search terms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {data.terms.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border">
          <p className="text-gray-500">No terms found matching your criteria.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Term</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="hidden md:table-cell">Definition</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.terms.map((term) => (
              <TableRow key={term.id}>
                <TableCell className="font-medium">
                  {term.term}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{term.category}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell truncate max-w-[300px]">
                  {term.definition.length > 100 
                    ? term.definition.substring(0, 100) + '...' 
                    : term.definition}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleViewClick(term)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-blue-600"
                      onClick={() => handleEditClick(term)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => deleteMutation.mutate(term.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      
      {/* Term Details Dialog */}
      {showDetails && !editMode && (
        <Dialog open={!!showDetails && !editMode} onOpenChange={(open) => !open && setShowDetails(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Term Details</DialogTitle>
              <DialogDescription>View the full details of this term</DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Term</h3>
                  <p className="text-lg font-semibold">{showDetails.term}</p>
                  {showDetails.pronunciation && (
                    <p className="text-sm text-gray-500">/{showDetails.pronunciation}/</p>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Category</h3>
                  <p><Badge>{showDetails.category}</Badge></p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Definition</h3>
                <p className="bg-gray-50 p-3 rounded-md mt-1">{showDetails.definition}</p>
              </div>
              
              {showDetails.example && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Example</h3>
                  <p className="bg-gray-50 p-3 rounded-md mt-1 border-l-4 border-primary">{showDetails.example}</p>
                </div>
              )}
            </div>
            
            <DialogFooter className="gap-2 flex-row sm:justify-end">
              <Button
                variant="outline"
                onClick={() => setShowDetails(null)}
              >
                Close
              </Button>
              <Button
                variant="outline"
                className="text-blue-600"
                onClick={() => handleEditClick(showDetails)}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteMutation.mutate(showDetails.id)}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Term Edit Dialog */}
      {showDetails && editMode && (
        <Dialog open={!!showDetails && editMode} onOpenChange={(open) => !open && setEditMode(false)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Edit Term</DialogTitle>
              <DialogDescription>Make changes to the term details</DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmitEdit)} className="space-y-4 mt-4">
                <input type="hidden" {...form.register('id')} />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="term"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Term</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="pronunciation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pronunciation (optional)</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.slice(1).map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="definition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Definition</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="example"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Example (optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={3}
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter className="gap-2 flex-row sm:justify-end pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditMode(false);
                      setShowDetails(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={updateMutation.isPending}
                  >
                    {updateMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

// Visitor Statistics Component
type VisitorStats = {
  total: number;
  today: number;
  lastWeek: number;
  byPath: { path: string; count: number }[];
  byDevice: { deviceType: string; count: number }[];
};

const VisitorStatistics = () => {
  // Fetch visitor statistics
  const { data, isLoading, isError } = useQuery({
    queryKey: ['/api/visitor-stats'],
    queryFn: async () => {
      const response = await fetch('/api/visitor-stats');
      if (!response.ok) {
        throw new Error('Failed to fetch visitor statistics');
      }
      return response.json() as Promise<VisitorStats>;
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>Error loading visitor statistics. Please try again.</p>
      </div>
    );
  }

  // Get device icon based on type
  const getDeviceIcon = (type: string) => {
    switch(type.toLowerCase()) {
      case 'desktop':
        return <MonitorSmartphone className="w-5 h-5" />;
      case 'tablet':
        return <TabletSmartphone className="w-5 h-5" />;
      case 'mobile':
        return <Smartphone className="w-5 h-5" />;
      default:
        return <UsersRound className="w-5 h-5" />;
    }
  };

  return (
    <div>
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Visitors</p>
                <p className="text-3xl font-bold">{data.total}</p>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <UsersRound className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Today's Visitors</p>
                <p className="text-3xl font-bold">{data.today}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <UsersRound className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Last 7 Days</p>
                <p className="text-3xl font-bold">{data.lastWeek}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <UsersRound className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Path Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Popular Pages */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Popular Pages</CardTitle>
            <CardDescription>The most visited pages on your website</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.byPath.length > 0 ? (
                data.byPath.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="font-medium truncate max-w-[200px]">
                        {item.path === '/' ? 'Home Page' : item.path}
                      </span>
                    </div>
                    <span className="bg-primary/10 px-2 py-1 rounded text-sm font-medium">
                      {item.count} {item.count === 1 ? 'visit' : 'visits'}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No page visit data available yet</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Device Types */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Device Types</CardTitle>
            <CardDescription>What devices your visitors are using</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.byDevice.length > 0 ? (
                data.byDevice.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getDeviceIcon(item.deviceType)}
                      <span className="font-medium capitalize">{item.deviceType}</span>
                    </div>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                      {item.count} {item.count === 1 ? 'visit' : 'visits'}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No device data available yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Login form schema
const loginFormSchema = z.object({
  mobileNumber: z.string()
    .regex(/^[6-9]\d{9}$/, 'Mobile number must be a valid 10-digit Indian number starting with 6, 7, 8, or 9')
    .refine(val => val === '8007348348', { message: 'Invalid admin mobile number' }),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .refine(val => val === '8007348348', { message: 'Invalid password' }),
});

// Login form values type
type LoginFormValues = {
  mobileNumber: string;
  password: string;
};

const AdminPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<{ id: number; mobileNumber: string; name?: string } | null>(null);
  const [_, setLocation] = useLocation();
  
  // Check if already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/me');
        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(true);
          setAdminUser(data);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      }
    };
    
    checkAuth();
  }, []);
  
  // Create form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      mobileNumber: '',
      password: '',
    },
  });
  
  // Form submission handler
  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        const userData = await response.json();
        setIsAuthenticated(true);
        setAdminUser(userData);
        
        toast({
          title: 'Login successful',
          description: `Welcome back${userData.name ? ', ' + userData.name : ''}!`,
        });
      } else {
        const errorData = await response.json();
        toast({
          title: 'Login failed',
          description: errorData.message || 'Invalid mobile number or password',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Login failed',
        description: 'An error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLogout = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
      });
      
      if (response.ok) {
        setIsAuthenticated(false);
        setAdminUser(null);
        
        toast({
          title: 'Logout successful',
          description: 'You have been logged out.',
        });
      } else {
        toast({
          title: 'Logout failed',
          description: 'An error occurred. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Logout failed',
        description: 'An error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-primary">Admin Login</CardTitle>
              <CardDescription>
                Login to access the admin dashboard and manage content. Use your mobile number for both username and password.
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="mobileNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mobile Number</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="10-digit mobile number" 
                            type="tel"
                            maxLength={10}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Your password" 
                            type="password"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      'Login'
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
            
            <CardFooter className="border-t pt-4">
              <p className="text-sm text-gray-500">
                Note: This area is restricted to administrators only.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" onClick={handleLogout} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging out...
            </>
          ) : (
            'Logout'
          )}
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <Tabs defaultValue="statistics" className="w-full">
          <TabsList className="w-full border-b">
            <TabsTrigger value="submissions" className="flex-1">Submissions</TabsTrigger>
            <TabsTrigger value="pending-terms" className="flex-1">Pending Terms</TabsTrigger>
            <TabsTrigger value="manage-terms" className="flex-1">Manage Terms</TabsTrigger>
            <TabsTrigger value="statistics" className="flex-1">Visitor Stats</TabsTrigger>
            <TabsTrigger value="notes" className="flex-1">Law Notes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="submissions" className="p-6">
            <h2 className="text-xl font-semibold mb-4">Term Submissions</h2>
            <p className="text-gray-500 mb-4">
              Review user-submitted terms and approve or reject them.
            </p>
            
            <SubmissionsReview />
          </TabsContent>
          
          <TabsContent value="pending-terms" className="p-6">
            <h2 className="text-xl font-semibold mb-4">Pending Terms</h2>
            <p className="text-gray-500 mb-4">
              Review and approve terms that have been flagged for review.
            </p>
            
            <PendingTermsReview />
          </TabsContent>
          
          <TabsContent value="manage-terms" className="p-6">
            <h2 className="text-xl font-semibold mb-4">Manage Dictionary Terms</h2>
            <p className="text-gray-500 mb-4">
              View, edit, or delete existing terms in the dictionary.
            </p>
            
            <TermsManagement />
          </TabsContent>
          
          <TabsContent value="statistics" className="p-6">
            <h2 className="text-xl font-semibold mb-4">Visitor Statistics</h2>
            <p className="text-gray-500 mb-6">
              Track user engagement and monitor traffic to your dictionary.
            </p>
            
            <VisitorStatistics />
          </TabsContent>
          
          <TabsContent value="notes" className="p-6">
            <h2 className="text-xl font-semibold mb-4">Law Notes Management</h2>
            <p className="text-gray-500">
              Manage semester-wise law notes content.
            </p>
            
            <div className="mt-6 text-center">
              <p>Law notes management functionality will be implemented soon.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;