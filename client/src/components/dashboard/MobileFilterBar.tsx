import React, { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Filter, 
  SortDesc, 
  Search,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';

const categories = [
  'Constitutional Law',
  'Criminal Law',
  'Contract Law',
  'Tort Law',
  'Property Law',
  'Family Law',
  'Administrative Law',
  'International Law'
];

interface MobileFilterBarProps {
  section?: string;
  activeCategory?: string;
  onCategorySelect?: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const MobileFilterBar: React.FC<MobileFilterBarProps> = ({ 
  section = 'all',
  activeCategory,
  onCategorySelect,
  searchQuery,
  setSearchQuery
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [tempSearchQuery, setTempSearchQuery] = useState(searchQuery);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(tempSearchQuery);
    setShowSearch(false);
  };

  return (
    <div className="block lg:hidden bg-white shadow rounded-lg mb-4 p-4">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-neutral-700 capitalize">
          {section === 'all' ? 'All Terms' : section}
          {activeCategory && <span className="ml-1">• {activeCategory}</span>}
        </span>
        <div className="flex space-x-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-neutral-700 hover:text-primary-light"
            onClick={() => setShowFilters(true)}
          >
            <Filter className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-neutral-700 hover:text-primary-light"
            onClick={() => setShowSearch(true)}
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <div className="mt-3 flex flex-nowrap overflow-x-auto space-x-2 pb-2 scrollbar-hide">
        <Link href="/dashboard">
          <Button 
            size="sm" 
            variant={section === 'all' || !section ? 'default' : 'outline'}
            className="whitespace-nowrap"
          >
            All Terms
          </Button>
        </Link>
        <Link href="/dashboard/favorites">
          <Button 
            size="sm" 
            variant={section === 'favorites' ? 'default' : 'outline'}
            className="whitespace-nowrap"
          >
            My Favorites
          </Button>
        </Link>
        <Link href="/dashboard/recent">
          <Button 
            size="sm" 
            variant={section === 'recent' ? 'default' : 'outline'}
            className="whitespace-nowrap"
          >
            Recently Viewed
          </Button>
        </Link>
        <Link href="/dashboard/contributions">
          <Button 
            size="sm" 
            variant={section === 'contributions' ? 'default' : 'outline'}
            className="whitespace-nowrap"
          >
            My Contributions
          </Button>
        </Link>
      </div>
      
      {/* Filters Dialog */}
      <Dialog open={showFilters} onOpenChange={setShowFilters}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Filter Terms</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <h3 className="text-sm font-medium mb-2">Categories</h3>
            <ScrollArea className="h-72">
              <div className="space-y-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-sm",
                      activeCategory === category && "bg-primary/10 text-primary font-medium"
                    )}
                    onClick={() => onCategorySelect && onCategorySelect(category)}
                  >
                    {activeCategory === category && (
                      <Check className="h-4 w-4 mr-2" />
                    )}
                    {category}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => onCategorySelect && onCategorySelect('')}
            >
              Clear Filters
            </Button>
            <DialogClose asChild>
              <Button>Apply</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Search Dialog */}
      <Dialog open={showSearch} onOpenChange={setShowSearch}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Search Terms</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSearch} className="py-4">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                <Input
                  type="search"
                  placeholder="Search legal terms..."
                  className="pl-10"
                  value={tempSearchQuery}
                  onChange={(e) => setTempSearchQuery(e.target.value)}
                />
              </div>
              <p className="text-sm text-neutral-500">
                Search for terms, definitions, or examples
              </p>
            </div>
            <DialogFooter className="mt-6">
              <Button 
                variant="outline" 
                onClick={() => {
                  setTempSearchQuery('');
                  setSearchQuery('');
                  setShowSearch(false);
                }}
              >
                Clear
              </Button>
              <Button type="submit">Search</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MobileFilterBar;
