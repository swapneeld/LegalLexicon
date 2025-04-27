import React from 'react';
import { Link } from 'wouter';
import { Bookmark, Share, Flag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useFavorites } from '@/hooks/useFavorites';
import AuthModal from '@/components/auth/AuthModal';
import { Term, Case } from '@shared/schema';

interface WordOfTheDayProps {
  term?: Term & { cases?: Case[] };
  isLoading?: boolean;
}

const WordOfTheDay: React.FC<WordOfTheDayProps> = ({ term, isLoading }) => {
  const { isAuthenticated } = useAuth();
  const { useIsFavorite, useToggleFavorite } = useFavorites();
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  
  const { data: favoriteData } = useIsFavorite(term?.id || 0);
  const isFavorite = favoriteData?.isFavorite || false;
  
  const toggleFavoriteMutation = useToggleFavorite();
  
  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    
    if (term) {
      toggleFavoriteMutation.mutate({ termId: term.id, isFavorite });
    }
  };
  
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="text-center mb-6">
          <div className="h-6 bg-neutral-200 rounded w-48 mx-auto"></div>
          <div className="w-16 h-1 bg-neutral-200 mx-auto mt-2"></div>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <div className="bg-neutral-200 p-6 rounded-t-lg h-28"></div>
          <div className="border-l border-r border-neutral-200 p-6 space-y-4">
            <div className="h-5 bg-neutral-200 rounded w-1/4"></div>
            <div className="h-4 bg-neutral-200 rounded"></div>
            <div className="h-4 bg-neutral-200 rounded"></div>
            <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
            
            <div className="h-5 bg-neutral-200 rounded w-1/4 mt-8"></div>
            <div className="h-20 bg-neutral-200 rounded"></div>
            
            <div className="h-5 bg-neutral-200 rounded w-1/4 mt-8"></div>
            <div className="h-32 bg-neutral-200 rounded"></div>
          </div>
          <div className="border border-neutral-200 rounded-b-lg bg-neutral-50 p-4 flex justify-between items-center">
            <div className="h-4 bg-neutral-200 rounded w-32"></div>
            <div className="h-4 bg-neutral-200 rounded w-16"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!term) {
    return (
      <Card className="max-w-3xl mx-auto">
        <CardContent className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">No Word of the Day Available</h2>
          <p className="text-neutral-600">
            Please check back later. Our team is working on adding more legal terms to the dictionary.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="text-center mb-6">
        <h2 className="text-lg text-primary font-medium uppercase tracking-wider mb-1">Word of the Day</h2>
        <div className="w-16 h-1 bg-secondary mx-auto"></div>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <div className="bg-gradient-to-r from-primary-light to-primary p-6 rounded-t-lg text-white">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-serif font-bold">{term.term}</h1>
            <div>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-secondary focus:outline-none transition duration-150"
                onClick={handleToggleFavorite}
              >
                <Bookmark className={cn("h-6 w-6", isFavorite && "fill-current text-secondary")} />
              </Button>
            </div>
          </div>
          {term.origin && <p className="italic text-neutral-200 mt-1">[{term.origin}]</p>}
        </div>
        
        <div className="border-l border-r border-neutral-200 p-6 bg-white">
          <h3 className="text-lg font-medium text-neutral-900 mb-2">Definition</h3>
          <p className="text-neutral-700 mb-4">{term.definition}</p>
          
          {term.example && (
            <>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">Example</h3>
              <p className="text-neutral-700 bg-neutral-50 p-4 rounded-md mb-4 border-l-4 border-primary">
                "{term.example}"
              </p>
            </>
          )}
          
          {term.cases && term.cases.length > 0 && (
            <>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">Landmark Case</h3>
              <div className="bg-neutral-50 p-4 rounded-md border border-neutral-200">
                <h4 className="font-medium text-primary-dark">
                  {term.cases[0].caseName} {term.cases[0].year && `(${term.cases[0].year})`}
                </h4>
                <p className="text-neutral-700 mt-1">{term.cases[0].description}</p>
              </div>
            </>
          )}
        </div>
        
        <div className="border border-neutral-200 rounded-b-lg bg-neutral-50 p-4 flex justify-between items-center">
          <div>
            <span className="text-sm text-neutral-500">
              Added: {new Date(term.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-neutral-500 hover:text-primary"
              onClick={() => {
                if (!isAuthenticated) {
                  setShowAuthModal(true);
                  return;
                }
                // Handle share functionality
              }}
            >
              <Share className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-neutral-500 hover:text-destructive"
              onClick={() => {
                if (!isAuthenticated) {
                  setShowAuthModal(true);
                  return;
                }
                // Handle report functionality
              }}
            >
              <Flag className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      
      <AuthModal open={showAuthModal} setOpen={setShowAuthModal} />
    </>
  );
};

export default WordOfTheDay;
