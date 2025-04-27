import React, { useState } from 'react';
import { useTerms } from '@/hooks/useTerms';
import { useAuth } from '@/hooks/useAuth';
import { useFavorites } from '@/hooks/useFavorites';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Bookmark,
  BookmarkCheck,
  MessageSquare,
  Flag,
  ThumbsUp,
  ThumbsDown,
  Share,
} from 'lucide-react';
import AuthModal from '@/components/auth/AuthModal';
import ReportForm from '@/components/forms/ReportForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface TermDetailsProps {
  id: number;
}

const TermDetails: React.FC<TermDetailsProps> = ({ id }) => {
  const { useTerm } = useTerms();
  const { isAuthenticated } = useAuth();
  const { useIsFavorite, useToggleFavorite } = useFavorites();
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);

  const { data: term, isLoading } = useTerm(id);
  const { data: favoriteData } = useIsFavorite(id);
  const isFavorite = favoriteData?.isFavorite || false;
  
  const toggleFavoriteMutation = useToggleFavorite();
  
  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    
    toggleFavoriteMutation.mutate({ termId: id, isFavorite });
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: term?.term || 'Legal Term',
        text: `Check out this legal term: ${term?.term}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };
  
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        <div className="h-8 bg-neutral-200 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-neutral-200 rounded w-1/4 mb-8"></div>
        
        <div className="space-y-6">
          <div>
            <div className="h-6 bg-neutral-200 rounded w-1/6 mb-2"></div>
            <div className="h-4 bg-neutral-200 rounded mb-1 w-full"></div>
            <div className="h-4 bg-neutral-200 rounded mb-1 w-full"></div>
            <div className="h-4 bg-neutral-200 rounded w-2/3"></div>
          </div>
          
          <div>
            <div className="h-6 bg-neutral-200 rounded w-1/6 mb-2"></div>
            <div className="h-20 bg-neutral-200 rounded"></div>
          </div>
          
          <div>
            <div className="h-6 bg-neutral-200 rounded w-1/6 mb-2"></div>
            <div className="h-32 bg-neutral-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!term) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h1 className="text-2xl font-bold text-primary-dark mb-4">Term Not Found</h1>
        <p className="text-neutral-600 mb-6">
          The legal term you're looking for could not be found or doesn't exist.
        </p>
        <Button asChild>
          <a href="/dashboard">Browse All Terms</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary-dark">{term.term}</h1>
          {term.origin && (
            <p className="text-neutral-500 italic">[{term.origin}]</p>
          )}
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={handleToggleFavorite}>
            {isFavorite ? (
              <BookmarkCheck className="h-5 w-5 text-secondary fill-current" />
            ) : (
              <Bookmark className="h-5 w-5" />
            )}
          </Button>
          <Button variant="ghost" size="icon" onClick={handleShare}>
            <Share className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => isAuthenticated ? setShowReportDialog(true) : setShowAuthModal(true)}
          >
            <Flag className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {term.pronunciation && (
        <p className="text-neutral-600 mb-4">
          <span className="font-medium">Pronunciation:</span> {term.pronunciation}
        </p>
      )}
      
      {term.category && (
        <Badge variant="outline" className="mb-6">
          {term.category}
        </Badge>
      )}
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Definition</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-700">{term.definition}</p>
        </CardContent>
      </Card>
      
      {term.example && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Example</CardTitle>
          </CardHeader>
          <CardContent>
            <blockquote className="border-l-4 border-primary pl-4 italic text-neutral-700">
              "{term.example}"
            </blockquote>
          </CardContent>
        </Card>
      )}
      
      {term.cases && term.cases.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Landmark Cases</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {term.cases.map((caseRef) => (
              <div key={caseRef.id} className="bg-neutral-50 p-4 rounded-md border border-neutral-200">
                <h3 className="font-medium text-primary-dark">
                  {caseRef.caseName} {caseRef.year && `(${caseRef.year})`}
                </h3>
                <p className="text-neutral-700 mt-2">{caseRef.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      
      {term.examples && term.examples.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Community Examples</CardTitle>
            <CardDescription>
              Examples submitted by our community members
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {term.examples.map((example) => (
              <div key={example.id} className="p-4 border border-neutral-200 rounded-md">
                <p className="text-neutral-700">{example.example}</p>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-neutral-200">
                  <div className="flex space-x-4">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center text-neutral-500 hover:text-primary p-0 h-auto"
                      onClick={() => isAuthenticated ? null : setShowAuthModal(true)}
                    >
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      <span>{example.upvotes}</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center text-neutral-500 hover:text-primary p-0 h-auto"
                      onClick={() => isAuthenticated ? null : setShowAuthModal(true)}
                    >
                      <ThumbsDown className="h-4 w-4 mr-1" />
                      <span>{example.downvotes}</span>
                    </Button>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-neutral-500 hover:text-destructive p-0 h-auto"
                    onClick={() => isAuthenticated ? setShowReportDialog(true) : setShowAuthModal(true)}
                  >
                    <Flag className="h-4 w-4 mr-1" />
                    <span>Report</span>
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex justify-center border-t border-neutral-200 pt-4">
            <Button 
              variant="outline"
              onClick={() => isAuthenticated ? null : setShowAuthModal(true)}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Add Example
            </Button>
          </CardFooter>
        </Card>
      )}
      
      <Separator className="my-8" />
      
      <div className="text-sm text-neutral-500">
        <p>Added: {new Date(term.createdAt).toLocaleDateString()}</p>
        {term.submittedBy && <p>Contributed by: Community Member</p>}
      </div>
      
      {/* Modals */}
      <AuthModal open={showAuthModal} setOpen={setShowAuthModal} />
      
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Content</DialogTitle>
          </DialogHeader>
          <ReportForm 
            contentId={id} 
            contentType="term" 
            onSuccess={() => setShowReportDialog(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TermDetails;
