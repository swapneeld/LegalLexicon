import React, { useState } from 'react';
import { useTerms } from '@/hooks/useTerms';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Check,
  X,
  Eye,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Term, Example, Case } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

const PendingSubmissions: React.FC = () => {
  const { usePendingTerms, useApproveTerm } = useTerms();
  const { toast } = useToast();
  
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [selectedItem, setSelectedItem] = useState<Term | Example | Case | null>(null);
  const [selectedItemType, setSelectedItemType] = useState<'term' | 'example' | 'case' | null>(null);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  
  // Fetch pending terms
  const { data: pendingTerms, isLoading: isLoadingTerms } = usePendingTerms(page, limit);
  
  // Fetch pending examples
  const { data: pendingExamples, isLoading: isLoadingExamples } = useQuery({
    queryKey: ['/api/admin/pending/examples', page, limit],
    queryFn: () => fetch(`/api/admin/pending/examples?page=${page}&limit=${limit}`).then(res => res.json()),
  });
  
  // Fetch pending cases
  const { data: pendingCases, isLoading: isLoadingCases } = useQuery({
    queryKey: ['/api/admin/pending/cases', page, limit],
    queryFn: () => fetch(`/api/admin/pending/cases?page=${page}&limit=${limit}`).then(res => res.json()),
  });
  
  // Mutations for approving content
  const approveTerm = useApproveTerm();
  
  const approveExample = useQuery({
    queryKey: ['approveExample'],
    queryFn: async ({ queryKey }) => null,
    enabled: false,
  });
  
  const approveCase = useQuery({
    queryKey: ['approveCase'],
    queryFn: async ({ queryKey }) => null,
    enabled: false,
  });
  
  const handleApprove = async (type: 'term' | 'example' | 'case', id: number) => {
    try {
      if (type === 'term') {
        await approveTerm.mutateAsync(id);
      } else if (type === 'example') {
        await apiRequest('PUT', `/api/admin/approve/example/${id}`, {});
        toast({
          title: 'Example Approved',
          description: 'The example was successfully approved and is now visible to users.',
        });
      } else if (type === 'case') {
        await apiRequest('PUT', `/api/admin/approve/case/${id}`, {});
        toast({
          title: 'Case Reference Approved',
          description: 'The case reference was successfully approved and is now visible to users.',
        });
      }
    } catch (error) {
      toast({
        title: 'Error Approving Content',
        description: error instanceof Error ? error.message : 'An error occurred while approving the content.',
        variant: 'destructive',
      });
    }
  };
  
  const handleReject = async (type: 'term' | 'example' | 'case', id: number) => {
    try {
      if (type === 'term') {
        await apiRequest('DELETE', `/api/terms/${id}`, {});
      } else if (type === 'example') {
        await apiRequest('DELETE', `/api/examples/${id}`, {});
      } else if (type === 'case') {
        await apiRequest('DELETE', `/api/cases/${id}`, {});
      }
      
      toast({
        title: 'Content Rejected',
        description: 'The content was successfully rejected and removed from the system.',
      });
    } catch (error) {
      toast({
        title: 'Error Rejecting Content',
        description: error instanceof Error ? error.message : 'An error occurred while rejecting the content.',
        variant: 'destructive',
      });
    }
  };
  
  const handlePreview = (type: 'term' | 'example' | 'case', item: Term | Example | Case) => {
    setSelectedItemType(type);
    setSelectedItem(item);
    setShowPreviewDialog(true);
  };
  
  const isLoading = isLoadingTerms || isLoadingExamples || isLoadingCases;
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading submissions...</CardTitle>
          <CardDescription>Please wait while we fetch pending content</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="h-4 bg-neutral-200 rounded animate-pulse"></div>
          <div className="h-4 bg-neutral-200 rounded animate-pulse"></div>
          <div className="h-4 bg-neutral-200 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pending Submissions</CardTitle>
          <CardDescription>Review and approve user-submitted content.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>A list of pending submissions from users</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Term</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Submitted By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingTerms && pendingTerms.map((term) => (
                <TableRow key={`term-${term.id}`}>
                  <TableCell className="font-medium">{term.term}</TableCell>
                  <TableCell>
                    <Badge className="bg-blue-100 text-blue-800">New Term</Badge>
                  </TableCell>
                  <TableCell>User {term.submittedBy}</TableCell>
                  <TableCell>{new Date(term.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handlePreview('term', term)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-success hover:text-success"
                        onClick={() => handleApprove('term', term.id)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleReject('term', term.id)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              
              {pendingExamples && pendingExamples.map((example) => (
                <TableRow key={`example-${example.id}`}>
                  <TableCell className="font-medium">Example for Term #{example.termId}</TableCell>
                  <TableCell>
                    <Badge className="bg-purple-100 text-purple-800">Example</Badge>
                  </TableCell>
                  <TableCell>User {example.submittedBy}</TableCell>
                  <TableCell>{new Date(example.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handlePreview('example', example)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-success hover:text-success"
                        onClick={() => handleApprove('example', example.id)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleReject('example', example.id)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              
              {pendingCases && pendingCases.map((caseItem) => (
                <TableRow key={`case-${caseItem.id}`}>
                  <TableCell className="font-medium">{caseItem.caseName}</TableCell>
                  <TableCell>
                    <Badge className="bg-yellow-100 text-yellow-800">Case Reference</Badge>
                  </TableCell>
                  <TableCell>User {caseItem.submittedBy}</TableCell>
                  <TableCell>{new Date(caseItem.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handlePreview('case', caseItem)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-success hover:text-success"
                        onClick={() => handleApprove('case', caseItem.id)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleReject('case', caseItem.id)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              
              {(!pendingTerms || pendingTerms.length === 0) && 
               (!pendingExamples || pendingExamples.length === 0) && 
               (!pendingCases || pendingCases.length === 0) && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No pending submissions to review
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          <div className="flex items-center justify-end space-x-2 mt-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <span className="text-sm text-neutral-600">Page {page}</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setPage(p => p + 1)}
              disabled={(pendingTerms?.length || 0) < limit && 
                        (pendingExamples?.length || 0) < limit &&
                        (pendingCases?.length || 0) < limit}
            >
              Next
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Preview Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {selectedItemType === 'term' ? 'Term Preview' : 
               selectedItemType === 'example' ? 'Example Preview' : 
               'Case Reference Preview'}
            </DialogTitle>
            <DialogDescription>
              Review the content before approving or rejecting
            </DialogDescription>
          </DialogHeader>
          
          {selectedItem && selectedItemType === 'term' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-sm">Term:</h3>
                <p className="text-lg font-serif font-semibold">{(selectedItem as Term).term}</p>
              </div>
              
              {(selectedItem as Term).origin && (
                <div>
                  <h3 className="font-medium text-sm">Origin:</h3>
                  <p>{(selectedItem as Term).origin}</p>
                </div>
              )}
              
              <div>
                <h3 className="font-medium text-sm">Definition:</h3>
                <p>{(selectedItem as Term).definition}</p>
              </div>
              
              {(selectedItem as Term).example && (
                <div>
                  <h3 className="font-medium text-sm">Example:</h3>
                  <p className="italic">"{(selectedItem as Term).example}"</p>
                </div>
              )}
              
              {(selectedItem as Term).category && (
                <div>
                  <h3 className="font-medium text-sm">Category:</h3>
                  <Badge variant="outline">{(selectedItem as Term).category}</Badge>
                </div>
              )}
            </div>
          )}
          
          {selectedItem && selectedItemType === 'example' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-sm">Term ID:</h3>
                <p>{(selectedItem as Example).termId}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-sm">Example:</h3>
                <p className="italic">"{(selectedItem as Example).example}"</p>
              </div>
            </div>
          )}
          
          {selectedItem && selectedItemType === 'case' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-sm">Term ID:</h3>
                <p>{(selectedItem as Case).termId}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-sm">Case Name:</h3>
                <p className="font-semibold">{(selectedItem as Case).caseName}</p>
              </div>
              
              {(selectedItem as Case).year && (
                <div>
                  <h3 className="font-medium text-sm">Year:</h3>
                  <p>{(selectedItem as Case).year}</p>
                </div>
              )}
              
              <div>
                <h3 className="font-medium text-sm">Description:</h3>
                <p>{(selectedItem as Case).description}</p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={() => selectedItem && selectedItemType && handleReject(selectedItemType, selectedItem.id)}
                className="text-destructive hover:text-destructive"
              >
                <X className="h-4 w-4 mr-1" />
                Reject
              </Button>
              <Button 
                onClick={() => selectedItem && selectedItemType && handleApprove(selectedItemType, selectedItem.id)}
                className="bg-success hover:bg-success text-white"
              >
                <Check className="h-4 w-4 mr-1" />
                Approve
              </Button>
              <DialogClose asChild>
                <Button variant="ghost">Close</Button>
              </DialogClose>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PendingSubmissions;
