import React from 'react';
import { Link } from 'wouter';
import { Bookmark, ThumbsUp, MessageSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useFavorites } from '@/hooks/useFavorites';
import { Term } from '@shared/schema';

interface TermCardProps {
  term: Term;
  className?: string;
}

const TermCard: React.FC<TermCardProps> = ({ term, className }) => {
  const { isAuthenticated } = useAuth();
  const { useIsFavorite, useToggleFavorite } = useFavorites();
  
  const { data: favoriteData } = useIsFavorite(term.id);
  const isFavorite = favoriteData?.isFavorite || false;
  
  const toggleFavoriteMutation = useToggleFavorite();
  
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      // This should be handled by a modal or redirect
      return;
    }
    
    toggleFavoriteMutation.mutate({ termId: term.id, isFavorite });
  };

  return (
    <Card className={cn("border border-neutral-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden", className)}>
      <CardContent className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="font-serif text-xl font-bold text-primary-dark">{term.term}</h3>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "text-neutral-400 hover:text-secondary focus:outline-none",
              isFavorite && "text-secondary"
            )}
            onClick={handleToggleFavorite}
          >
            <Bookmark className={cn("h-5 w-5", isFavorite && "fill-current")} />
          </Button>
        </div>
        
        {term.origin && (
          <p className="text-sm text-neutral-500 italic mt-1">[{term.origin}]</p>
        )}
        
        <p className="text-neutral-700 mt-3 line-clamp-3">{term.definition}</p>
        
        <div className="mt-4 pt-4 border-t border-neutral-200">
          <div className="flex justify-between items-center">
            <div className="flex space-x-3">
              <Button variant="ghost" size="sm" className="text-neutral-500 hover:text-primary p-0 h-auto">
                <ThumbsUp className="h-4 w-4 mr-1" />
                <span>42</span>
              </Button>
              <Button variant="ghost" size="sm" className="text-neutral-500 hover:text-primary p-0 h-auto">
                <MessageSquare className="h-4 w-4 mr-1" />
                <span>8</span>
              </Button>
            </div>
            <Link href={`/term/${term.id}`}>
              <a className="text-primary hover:text-primary-light text-sm font-medium">
                View Details
              </a>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TermCard;
