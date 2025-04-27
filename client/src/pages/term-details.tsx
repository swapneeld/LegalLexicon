import React from 'react';
import { Link, useRoute } from 'wouter';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BookmarkPlus, Share2, ThumbsUp, ThumbsDown, AlertTriangle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Sample legal terms data (same as in dashboard)
const sampleTerms = [
  {
    id: 1,
    term: 'Habeas Corpus',
    definition: 'A legal action or writ by which detainees can seek relief from unlawful imprisonment. Latin for "you shall have the body."',
    category: 'Constitutional Law',
    examples: [
      {
        text: 'The defendant filed a petition for habeas corpus after claiming his constitutional rights were violated during the trial.',
        type: 'american'
      },
      {
        text: 'Rajesh, a local shopkeeper from Mumbai, applied for habeas corpus when he was detained without formal charges by the local police for seven days.',
        type: 'indian'
      }
    ],
    cases: [
      {
        name: 'Ex parte Milligan',
        citation: '71 U.S. 2 (1866)',
        summary: 'The U.S. Supreme Court ruled that the suspension of habeas corpus was lawful, but military trials of civilians were not constitutional when civilian courts were operational.'
      },
      {
        name: 'Boumediene v. Bush',
        citation: '553 U.S. 723 (2008)',
        summary: 'The Supreme Court held that prisoners at Guantanamo Bay detention camp have a right to the habeas corpus privilege.'
      }
    ]
  },
  {
    id: 2,
    term: 'Stare Decisis',
    definition: 'A legal doctrine that obligates courts to follow historical cases when making a ruling on a similar case.',
    category: 'Legal Principles',
    examples: [
      'The Supreme Court relied on stare decisis when it upheld the precedent set in Roe v. Wade.'
    ],
    cases: [
      {
        name: 'Planned Parenthood v. Casey',
        citation: '505 U.S. 833 (1992)',
        summary: 'The Supreme Court reaffirmed the central holding of Roe v. Wade based on the principle of stare decisis.'
      }
    ]
  },
  {
    id: 3,
    term: 'Mens Rea',
    definition: 'The intention or knowledge of wrongdoing that constitutes part of a crime.',
    category: 'Criminal Law',
    examples: [
      'The prosecution had to prove mens rea to establish that the defendant knowingly committed the crime.'
    ],
    cases: [
      {
        name: 'Staples v. United States',
        citation: '511 U.S. 600 (1994)',
        summary: 'The Supreme Court held that the government must prove beyond a reasonable doubt that the defendant knew the weapon possessed the characteristics that brought it within the scope of the statute.'
      }
    ]
  },
  {
    id: 4,
    term: 'Tort',
    definition: 'A civil wrong that causes someone else to suffer loss or harm, resulting in legal liability for the person who commits the act.',
    category: 'Civil Law',
    examples: [
      'The plaintiff filed a tort claim against the company for negligence that resulted in personal injury.'
    ],
    cases: [
      {
        name: 'Palsgraf v. Long Island Railroad Co.',
        citation: '248 N.Y. 339 (1928)',
        summary: 'A landmark case establishing the principle of foreseeability in determining proximate cause and liability in tort law.'
      }
    ]
  },
  {
    id: 5,
    term: 'Pro Bono',
    definition: 'Professional work undertaken voluntarily and without payment as a public service.',
    category: 'Legal Practice',
    examples: [
      'The attorney took the case pro bono because the client couldn\'t afford legal representation.'
    ],
    cases: []
  },
  {
    id: 6,
    term: 'Voir Dire',
    definition: 'The preliminary examination of a witness or a juror to determine their competency to give or hear evidence.',
    category: 'Trial Procedure',
    examples: [
      'During voir dire, the attorneys questioned potential jurors about their knowledge of the highly publicized case.'
    ],
    cases: [
      {
        name: 'Batson v. Kentucky',
        citation: '476 U.S. 79 (1986)',
        summary: 'The Supreme Court ruled that prosecutors may not use peremptory challenges to dismiss jurors based solely on their race.'
      }
    ]
  }
];

const TermDetails: React.FC = () => {
  const [, params] = useRoute('/term/:id');
  const termId = params ? parseInt(params.id, 10) : 0;
  
  // Find the term with the matching ID
  const term = sampleTerms.find(t => t.id === termId);
  
  // If term not found, show a message
  if (!term) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Term Not Found</h2>
          <p className="text-gray-600 mb-6">The legal term you're looking for doesn't exist or has been removed.</p>
          <Link href="/dashboard">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dictionary
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <Link href="/dashboard">
            <Button variant="ghost" className="p-0 mr-2">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Dictionary
            </Button>
          </Link>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <BookmarkPlus className="mr-1 h-4 w-4" />
            Save
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              const text = `*${term.term}*: ${term.definition}\n\nLearn more at LawLexicon!`;
              const encodedText = encodeURIComponent(text);
              window.open(`https://wa.me/?text=${encodedText}`, '_blank');
            }}
          >
            <Share2 className="mr-1 h-4 w-4" />
            Share on WhatsApp
          </Button>
          <Button variant="outline" size="sm" className="text-red-500">
            <AlertTriangle className="mr-1 h-4 w-4" />
            Report
          </Button>
        </div>
      </div>
      
      {/* Term Card */}
      <Card className="mb-8 border-2 border-primary/10">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center">
            <div>
              <CardTitle className="text-3xl text-primary">{term.term}</CardTitle>
              <CardDescription className="text-lg mt-2">
                <Badge variant="outline" className="mr-2">{term.category}</Badge>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-medium mb-3">Definition</h3>
              <p className="text-gray-700 text-lg">{term.definition}</p>
            </div>
            
            <Separator />
            
            <Tabs defaultValue="examples">
              <TabsList className="mb-4">
                <TabsTrigger value="examples">Examples</TabsTrigger>
                <TabsTrigger value="cases">Case References</TabsTrigger>
              </TabsList>
              
              <TabsContent value="examples">
                <div>
                  <h3 className="text-xl font-medium mb-3">Examples</h3>
                  {term.examples.length > 0 ? (
                    <ul className="space-y-4">
                      {term.examples.map((example, index) => (
                        <li key={index} className="border-l-4 border-primary/20 pl-4 py-2">
                          <div className="flex justify-between">
                            <p className="text-gray-700 italic">{example}</p>
                            <div className="flex items-center gap-3 text-gray-500">
                              <button className="flex items-center hover:text-primary">
                                <ThumbsUp className="h-4 w-4 mr-1" />
                                <span>12</span>
                              </button>
                              <button className="flex items-center hover:text-red-500">
                                <ThumbsDown className="h-4 w-4 mr-1" />
                                <span>3</span>
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600">No examples available for this term.</p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="cases">
                <div>
                  <h3 className="text-xl font-medium mb-3">Case References</h3>
                  {term.cases && term.cases.length > 0 ? (
                    <ul className="space-y-6">
                      {term.cases.map((caseRef, index) => (
                        <li key={index} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between mb-2">
                            <h4 className="font-medium text-primary">{caseRef.name}</h4>
                            <Badge variant="outline">{caseRef.citation}</Badge>
                          </div>
                          <p className="text-gray-700">{caseRef.summary}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600">No case references available for this term.</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
        
        <CardFooter className="border-t pt-6 flex justify-between">
          <div className="text-sm text-gray-500">
            Last updated: April 15, 2023
          </div>
          
          <Link href={`/term/${term.id - 1 > 0 ? term.id - 1 : sampleTerms.length}`}>
            <Button variant="outline" className="mr-2">
              Previous Term
            </Button>
          </Link>
          
          <Link href={`/term/${term.id % sampleTerms.length + 1}`}>
            <Button>
              Next Term
            </Button>
          </Link>
        </CardFooter>
      </Card>
      
      {/* Related Terms */}
      <div className="mt-8">
        <h3 className="text-xl font-medium mb-4">Related Terms</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sampleTerms
            .filter(t => t.id !== term.id && t.category === term.category)
            .slice(0, 3)
            .map(relatedTerm => (
              <Link key={relatedTerm.id} href={`/term/${relatedTerm.id}`}>
                <Card className="cursor-pointer hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-lg">{relatedTerm.term}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 line-clamp-2">{relatedTerm.definition}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default TermDetails;