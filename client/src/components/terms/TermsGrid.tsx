import React from 'react';
import TermCard from '@/components/terms/TermCard';
import { Term } from '@shared/schema';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface TermsGridProps {
  terms: Term[];
  isLoading: boolean;
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
}

const TermsGrid: React.FC<TermsGridProps> = ({ 
  terms, 
  isLoading, 
  page, 
  setPage, 
  totalPages 
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="border border-neutral-200 rounded-lg p-5 animate-pulse">
            <div className="flex justify-between items-start">
              <div className="h-6 bg-neutral-200 rounded w-1/3"></div>
              <div className="h-6 w-6 bg-neutral-200 rounded-full"></div>
            </div>
            <div className="h-4 bg-neutral-200 rounded w-1/4 mt-1"></div>
            <div className="h-4 bg-neutral-200 rounded mt-3 w-full"></div>
            <div className="h-4 bg-neutral-200 rounded mt-1 w-full"></div>
            <div className="h-4 bg-neutral-200 rounded mt-1 w-2/3"></div>
            
            <div className="mt-4 pt-4 border-t border-neutral-200 flex justify-between">
              <div className="flex space-x-3">
                <div className="h-6 bg-neutral-200 rounded w-12"></div>
                <div className="h-6 bg-neutral-200 rounded w-12"></div>
              </div>
              <div className="h-6 bg-neutral-200 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (!terms || terms.length === 0) {
    return (
      <div className="text-center py-12 bg-white border border-neutral-200 rounded-lg">
        <h3 className="text-lg font-medium text-neutral-900 mb-2">No terms found</h3>
        <p className="text-neutral-600">
          Try adjusting your search or filters to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {terms.map((term) => (
          <TermCard key={term.id} term={term} />
        ))}
      </div>
      
      {/* Pagination */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border border-neutral-200 rounded-lg mt-6">
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-neutral-700">
              Showing <span className="font-medium">{(page - 1) * 12 + 1}</span> to{" "}
              <span className="font-medium">{Math.min(page * 12, terms.length)}</span> of{" "}
              <span className="font-medium">{terms.length}</span> results
            </p>
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 1) setPage(page - 1);
                  }}
                  className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                const pageNum = i + 1;
                // Logic for showing the correct page numbers based on current page
                let showPage = pageNum;
                
                if (totalPages > 5) {
                  if (page > 3 && pageNum === 1) {
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            setPage(1);
                          }}
                        >
                          1
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                  
                  if (page > 3 && pageNum === 2) {
                    return (
                      <PaginationItem key="ellipsis-1">
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }
                  
                  if (page > 3) {
                    showPage = page - 3 + pageNum;
                  }
                  
                  if (showPage > totalPages) {
                    return null;
                  }
                }
                
                return (
                  <PaginationItem key={showPage}>
                    <PaginationLink 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(showPage);
                      }}
                      isActive={page === showPage}
                    >
                      {showPage}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              
              {totalPages > 5 && page < totalPages - 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              
              {totalPages > 5 && page < totalPages - 1 && (
                <PaginationItem>
                  <PaginationLink 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(totalPages);
                    }}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              )}
              
              <PaginationItem>
                <PaginationNext 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (page < totalPages) setPage(page + 1);
                  }}
                  className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
        
        {/* Mobile Pagination */}
        <div className="flex items-center justify-between w-full sm:hidden">
          <Button 
            variant="outline"
            size="sm"
            onClick={() => page > 1 && setPage(page - 1)}
            disabled={page <= 1}
          >
            Previous
          </Button>
          <span className="text-sm text-neutral-700">
            Page {page} of {totalPages}
          </span>
          <Button 
            variant="outline"
            size="sm"
            onClick={() => page < totalPages && setPage(page + 1)}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TermsGrid;
