import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
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

// Sample legal terms data
const sampleTerms = [
  {
    id: 1,
    term: 'Habeas Corpus',
    definition: 'A legal action or writ by which detainees can seek relief from unlawful imprisonment.',
    category: 'Constitutional Law',
    examples: [
      'The defendant filed a petition for habeas corpus after claiming his constitutional rights were violated during the trial.'
    ]
  },
  {
    id: 2,
    term: 'Stare Decisis',
    definition: 'A legal doctrine that obligates courts to follow historical cases when making a ruling on a similar case.',
    category: 'Legal Principles',
    examples: [
      'The Supreme Court relied on stare decisis when it upheld the precedent set in Roe v. Wade.'
    ]
  },
  {
    id: 3,
    term: 'Mens Rea',
    definition: 'The intention or knowledge of wrongdoing that constitutes part of a crime.',
    category: 'Criminal Law',
    examples: [
      'The prosecution had to prove mens rea to establish that the defendant knowingly committed the crime.'
    ]
  },
  {
    id: 4,
    term: 'Tort',
    definition: 'A civil wrong that causes someone else to suffer loss or harm, resulting in legal liability for the person who commits the act.',
    category: 'Civil Law',
    examples: [
      'The plaintiff filed a tort claim against the company for negligence that resulted in personal injury.'
    ]
  },
  {
    id: 5,
    term: 'Pro Bono',
    definition: 'Professional work undertaken voluntarily and without payment as a public service.',
    category: 'Legal Practice',
    examples: [
      'The attorney took the case pro bono because the client couldn\'t afford legal representation.'
    ]
  },
  {
    id: 6,
    term: 'Voir Dire',
    definition: 'The preliminary examination of a witness or a juror to determine their competency to give or hear evidence.',
    category: 'Trial Procedure',
    examples: [
      'During voir dire, the attorneys questioned potential jurors about their knowledge of the highly publicized case.'
    ]
  }
];

// Categories for filtering
const categories = [
  'All Categories',
  'Constitutional Law',
  'Legal Principles',
  'Criminal Law',
  'Civil Law', 
  'Legal Practice',
  'Trial Procedure'
];

const Dashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Categories');
  
  // Filter terms based on search query and selected category
  const filteredTerms = sampleTerms.filter(term => {
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
              <div>
                <p className="text-sm text-gray-500">
                  Showing {filteredTerms.length} of {sampleTerms.length} terms
                </p>
              </div>
            </div>
          </div>
          
          {/* Terms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTerms.length > 0 ? (
              filteredTerms.map(term => (
                <Card key={term.id} className="h-full">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl text-primary">{term.term}</CardTitle>
                      <Badge variant="outline">{term.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{term.definition}</p>
                    {term.examples.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Example:</h4>
                        <p className="text-gray-600 italic">{term.examples[0]}</p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="border-t pt-4">
                    <Link href={`/term/${term.id}`}>
                      <Button variant="outline" className="w-full">View Details</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <h3 className="text-lg font-medium">No terms found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;