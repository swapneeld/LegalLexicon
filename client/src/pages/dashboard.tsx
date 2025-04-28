import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, PlusCircle, Share2, Loader2 } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { toast } from '@/hooks/use-toast';
import { useTerms } from '@/hooks/useTerms';
import { Term } from '@shared/schema';

// Categories for filtering
const categories = [
  'All Categories',
  'Constitutional Law',
  'Legal Principles',
  'Criminal Law', 
  'Civil Law',
  'Family Law',
  'Property Law',
  'Contract Law',
  'Administrative Law',
  'Legal Practice',
  'Trial Procedure'
];

// Share term via WhatsApp
const shareViaWhatsApp = (term: string, definition: string) => {
  const text = `*${term}*: ${definition}\n\nLearn more legal terms at LawLexicon!`;
  const encodedText = encodeURIComponent(text);
  const whatsappUrl = `https://wa.me/?text=${encodedText}`;
  window.open(whatsappUrl, '_blank');
};

const Dashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Categories');
  const [page, setPage] = useState(1);
  const limit = 12;
  
  // Use the terms hook to fetch terms
  const { useAllTerms } = useTerms();
  const { data, isLoading, error } = useAllTerms(page, limit);
  
  // Get the terms and total from the response
  const terms = data?.terms || [];
  const total = data?.total || 0;
  
  // Filter terms based on search query and selected category
  const filteredTerms = terms.filter((term: Term) => {
    const matchesSearch = term.term.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        term.definition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All Categories' || term.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 md:shrink-0">
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h2 className="text-lg font-semibold mb-4">Categories</h2>
            <div className="space-y-2">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
            
            {/* Mobile Submit Button */}
            <div className="mt-6 md:hidden">
              <Link href="/submit">
                <Button className="w-full flex items-center justify-center">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Submit a New Term
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1">
          {/* Search and Filter Bar */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  className="pl-10"
                  placeholder="Search legal terms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  Showing {filteredTerms.length} of {total} terms
                </p>
              </div>
            </div>
          </div>
          
          {/* Terms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="h-full">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="h-6 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                      <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-gray-200 rounded w-full animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse mb-2"></div>
                  </CardContent>
                  <CardFooter className="border-t pt-4">
                    <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
                  </CardFooter>
                </Card>
              ))
            ) : error ? (
              // Error state
              <div className="col-span-2 text-center py-12">
                <h3 className="text-lg font-medium text-red-500">Error loading terms</h3>
                <p className="text-gray-500 mt-2">Please try again later</p>
              </div>
            ) : filteredTerms.length > 0 ? (
              // Terms list
              filteredTerms.map((term: Term) => (
                <Card key={term.id} className="h-full">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <Link href={`/term/${term.id}`}>
                        <CardTitle className="text-xl text-primary hover:underline cursor-pointer">{term.term}</CardTitle>
                      </Link>
                      <Badge variant="outline">{term.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{term.definition}</p>
                    {term.example && (
                      <div>
                        <h4 className="font-medium mb-2">Example:</h4>
                        <p className="text-gray-600 italic">{term.example}</p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="border-t pt-4 flex flex-col space-y-2">
                    <div className="flex w-full gap-2">
                      <Link href={`/term/${term.id}`} className="flex-1">
                        <Button variant="outline" className="w-full">View Details</Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => shareViaWhatsApp(term.term, term.definition)}
                        title="Share via WhatsApp"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))
            ) : (
              // No results
              <div className="col-span-2 text-center py-12">
                <h3 className="text-lg font-medium">No terms found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
          
          {/* Submit Button - Desktop */}
          <div className="hidden md:block mt-8 text-center">
            <Link href="/submit">
              <Button className="flex items-center">
                <PlusCircle className="mr-2 h-5 w-5" />
                Submit a New Term
              </Button>
            </Link>
            <p className="text-sm text-gray-500 mt-2">
              Help us grow our legal dictionary by contributing your knowledge.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;