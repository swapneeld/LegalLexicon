import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  Eye,
  Trash2,
  Check,
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
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Report } from '@shared/schema';

const ReportedContent: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showReportDialog, setShowReportDialog] = useState(false);
  
  // Fetch pending reports
  const { data: reports, isLoading } = useQuery<Report[]>({
    queryKey: ['/api/reports/pending', page, limit],
    queryFn: () => fetch(`/api/reports/pending?page=${page}&limit=${limit}`).then(res => res.json()),
  });
  
  // Resolve report mutation
  const resolveReportMutation = useMutation({
    mutationFn: (reportId: number) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      return apiRequest('PUT', `/api/reports/${reportId}/resolve`, { userId: user.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/reports/pending'] });
      toast({
        title: 'Report Resolved',
        description: 'The report has been marked as resolved',
      });
      setShowReportDialog(false);
    },
    onError: (error) => {
      toast({
        title: 'Error Resolving Report',
        description: error instanceof Error ? error.message : 'An error occurred while resolving the report',
        variant: 'destructive',
      });
    },
  });
  
  // Remove content mutation
  const removeContentMutation = useMutation({
    mutationFn: async (report: Report) => {
      let endpoint = '';
      switch (report.contentType) {
        case 'term':
          endpoint = `/api/terms/${report.contentId}`;
          break;
        case 'example':
          endpoint = `/api/examples/${report.contentId}`;
          break;
        case 'case':
          endpoint = `/api/cases/${report.contentId}`;
          break;
        default:
          throw new Error('Invalid content type');
      }
      
      // Remove the content
      await apiRequest('DELETE', endpoint);
      
      // Then resolve the report
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      return apiRequest('PUT', `/api/reports/${report.id}/resolve`, { userId: user.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/reports/pending'] });
      toast({
        title: 'Content Removed',
        description: 'The reported content has been removed and the report resolved',
      });
      setShowReportDialog(false);
    },
    onError: (error) => {
      toast({
        title: 'Error Removing Content',
        description: error instanceof Error ? error.message : 'An error occurred while removing the content',
        variant: 'destructive',
      });
    },
  });
  
  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    setShowReportDialog(true);
  };
  
  const getContentTypeBadge = (contentType: string) => {
    switch (contentType) {
      case 'term':
        return <Badge className="bg-blue-100 text-blue-800">Term</Badge>;
      case 'example':
        return <Badge className="bg-purple-100 text-purple-800">Example</Badge>;
      case 'case':
        return <Badge className="bg-yellow-100 text-yellow-800">Case</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };
  
  const getReasonBadge = (reason: string) => {
    switch (reason.toLowerCase()) {
      case 'inappropriate':
      case 'offensive':
        return <Badge className="bg-red-100 text-red-800">Inappropriate Content</Badge>;
      case 'misinformation':
      case 'incorrect':
        return <Badge className="bg-orange-100 text-orange-800">Misinformation</Badge>;
      case 'spam':
        return <Badge className="bg-neutral-100 text-neutral-800">Spam</Badge>;
      default:
        return <Badge className="bg-neutral-100 text-neutral-800">{reason}</Badge>;
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading reports...</CardTitle>
          <CardDescription>Please wait while we fetch reported content</CardDescription>
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
          <CardTitle>Reported Content</CardTitle>
          <CardDescription>Review flagged content for policy violations.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>A list of content reported by users</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Content</TableHead>
                <TableHead>Report Reason</TableHead>
                <TableHead>Reported By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports && reports.length > 0 ? (
                reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{report.contentType} #{report.contentId}</div>
                        <div className="text-sm text-neutral-500 truncate max-w-xs">
                          {getContentTypeBadge(report.contentType)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getReasonBadge(report.reason)}
                    </TableCell>
                    <TableCell>User {report.reportedBy}</TableCell>
                    <TableCell>{new Date(report.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleViewReport(report)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Review
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive hover:text-destructive"
                          onClick={() => removeContentMutation.mutate(report)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-neutral-500 hover:text-neutral-700"
                          onClick={() => resolveReportMutation.mutate(report.id)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Dismiss
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No reported content to review
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
              disabled={!reports || reports.length < limit}
            >
              Next
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Report Details Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Report Details</DialogTitle>
            <DialogDescription>
              Review the reported content
            </DialogDescription>
          </DialogHeader>
          
          {selectedReport && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-sm">Content Type:</h3>
                <p className="capitalize">{selectedReport.contentType}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-sm">Content ID:</h3>
                <p>{selectedReport.contentId}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-sm">Report Reason:</h3>
                <p>{selectedReport.reason}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-sm">Reported By:</h3>
                <p>User {selectedReport.reportedBy}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-sm">Report Date:</h3>
                <p>{new Date(selectedReport.createdAt).toLocaleString()}</p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <div className="flex space-x-2">
              <Button 
                variant="destructive" 
                onClick={() => selectedReport && removeContentMutation.mutate(selectedReport)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Remove Content
              </Button>
              <Button 
                variant="outline"
                onClick={() => selectedReport && resolveReportMutation.mutate(selectedReport.id)}
              >
                <Check className="h-4 w-4 mr-1" />
                Dismiss Report
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

export default ReportedContent;
