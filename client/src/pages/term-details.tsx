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
import { ArrowLeft, BookmarkPlus, Share2, AlertTriangle } from 'lucide-react';
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
        name: 'A.K. Gopalan v. State of Madras',
        citation: 'AIR 1950 SC 27',
        summary: 'The Supreme Court of India held that Article A.21 providing for right to life and personal liberty has to be read separately and not as qualified by the provisions of Articles 14, 19 and 22 of the Constitution of India.'
      },
      {
        name: 'ADM Jabalpur v. Shivakant Shukla',
        citation: 'AIR 1976 SC 1207',
        summary: 'Supreme Court ruled that the right to move any court for enforcement of Fundamental Rights, including right to habeas corpus, remains suspended during Emergency under Article 359 of the Constitution.'
      },
      {
        name: 'Sunil Batra v. Delhi Administration',
        citation: '(1978) 4 SCC 494',
        summary: 'Supreme Court expanded the scope of habeas corpus to include protection against inhuman treatment of prisoners in jail and issued detailed guidelines for prison authorities.'
      }
    ]
  },
  {
    id: 2,
    term: 'Stare Decisis',
    definition: 'A legal doctrine that obligates courts to follow historical cases when making a ruling on a similar case.',
    category: 'Legal Principles',
    examples: [
      {
        text: 'The Supreme Court relied on stare decisis when it upheld the precedent set in Roe v. Wade.',
        type: 'american'
      },
      {
        text: 'In a landmark judgment, the Delhi High Court applied stare decisis to uphold the previous ruling on Fundamental Rights under Article 21.',
        type: 'indian'
      }
    ],
    cases: [
      {
        name: 'Kesavananda Bharati v. State of Kerala',
        citation: '(1973) 4 SCC 225',
        summary: 'The Supreme Court established the basic structure doctrine, applying stare decisis by reaffirming fundamental principles from Golaknath case while overruling specific elements.'
      },
      {
        name: 'I.C. Golaknath v. State of Punjab',
        citation: 'AIR 1967 SC 1643',
        summary: 'Supreme Court upheld the precedent that Fundamental Rights cannot be amended by the Parliament, establishing an important legal principle using stare decisis.'
      }
    ]
  },
  {
    id: 3,
    term: 'Mens Rea',
    definition: 'The intention or knowledge of wrongdoing that constitutes part of a crime.',
    category: 'Criminal Law',
    examples: [
      {
        text: 'The prosecution had to prove mens rea to establish that the defendant knowingly committed the crime.',
        type: 'american'
      },
      {
        text: 'In the murder trial at Patiala House Court, the public prosecutor emphasized mens rea as a critical element in determining whether it was culpable homicide or murder.',
        type: 'indian'
      }
    ],
    cases: [
      {
        name: 'Nathulal v. State of Madhya Pradesh',
        citation: 'AIR 1966 SC 43',
        summary: 'Supreme Court held that mens rea is an essential ingredient of any crime and cannot be dispensed with unless explicitly stated in the statute.'
      },
      {
        name: 'Kartar Singh v. State of Punjab',
        citation: '(1994) 3 SCC 569',
        summary: 'Supreme Court ruled that in serious offenses like terrorism, proof of mens rea remains critical even for stringent laws like TADA.'
      },
      {
        name: 'State of Maharashtra v. Mayor Hans George',
        citation: 'AIR 1965 SC 722',
        summary: 'Court held that certain statutory offenses might not require mens rea if the legislative intent clearly dispenses with it.'
      }
    ]
  },
  {
    id: 4,
    term: 'Tort',
    definition: 'A civil wrong that causes someone else to suffer loss or harm, resulting in legal liability for the person who commits the act.',
    category: 'Civil Law',
    examples: [
      {
        text: 'The plaintiff filed a tort claim against the company for negligence that resulted in personal injury.',
        type: 'american'
      },
      {
        text: 'After the chemical factory leaked contaminants into the Yamuna River, villagers filed a tort case against the company in the Delhi High Court.',
        type: 'indian'
      }
    ],
    cases: [
      {
        name: 'M.C. Mehta v. Union of India',
        citation: 'AIR 1987 SC 1086',
        summary: 'Supreme Court established the principle of absolute liability in cases of hazardous industries, enhancing tort law without the exceptions available in Rylands v. Fletcher.'
      },
      {
        name: 'Indian Council for Enviro-Legal Action v. Union of India',
        citation: '(1996) 3 SCC 212',
        summary: 'Supreme Court held that polluter pays principle is an essential feature of sustainable development, establishing important precedent in environmental tort law.'
      },
      {
        name: 'Rajkot Municipal Corporation v. Manjulben Jayantilal Nakum',
        citation: '(1997) 9 SCC 552',
        summary: 'Supreme Court held that municipal corporations are liable under tort law for negligence in maintaining public infrastructure.'
      }
    ]
  },
  {
    id: 5,
    term: 'Pro Bono',
    definition: 'Professional work undertaken voluntarily and without payment as a public service.',
    category: 'Legal Practice',
    examples: [
      {
        text: 'The attorney took the case pro bono because the client couldn\'t afford legal representation.',
        type: 'american'
      },
      {
        text: 'The Legal Aid Society in Bangalore offers pro bono services to underprivileged communities facing housing disputes.',
        type: 'indian'
      }
    ],
    cases: []
  },
  {
    id: 6,
    term: 'Voir Dire',
    definition: 'The preliminary examination of a witness or a juror to determine their competency to give or hear evidence.',
    category: 'Trial Procedure',
    examples: [
      {
        text: 'During voir dire, the attorneys questioned potential jurors about their knowledge of the highly publicized case.',
        type: 'american'
      },
      {
        text: 'The Sessions Judge at Tis Hazari Courts conducted voir dire to assess if witnesses were influenced by media coverage of the high-profile corruption case.',
        type: 'indian'
      }
    ],
    cases: [
      {
        name: 'State of Rajasthan v. Bhera',
        citation: 'AIR 2001 SC 2548',
        summary: 'Supreme Court emphasized the importance of proper voir dire examination to assess the credibility of child witnesses in criminal proceedings.'
      },
      {
        name: 'Bipin Shantilal Panchal v. State of Gujarat',
        citation: '(2001) 3 SCC 1',
        summary: 'Supreme Court laid down detailed guidelines for examination and cross-examination of witnesses including voir dire examination.'
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
                    <div className="space-y-6">
                      <ul className="space-y-4">
                        {term.examples
                          .map((example, index) => {
                            const isIndian = typeof example === 'object' && example.type === 'indian';
                            return (
                              <li 
                                key={index} 
                                className={`border-l-4 ${isIndian ? 'border-orange-200' : 'border-blue-200'} pl-4 py-3 ${isIndian ? 'bg-orange-50/20' : 'bg-blue-50/20'} rounded-r-md`}
                              >
                                <div className="flex flex-col gap-2">
                                  <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                      <div className="flex items-center mb-2">
                                        <span className={`inline-block w-6 h-6 bg-primary-50 text-primary-800 rounded-full mr-2 flex items-center justify-center text-xs font-bold`}>
                                          {index + 1}
                                        </span>
                                        <span className="text-sm font-medium text-gray-600">
                                          Example {index + 1}
                                        </span>
                                      </div>
                                      <p className="text-gray-700 italic">{typeof example === 'object' ? example.text : example}</p>
                                    </div>

                                  </div>
                                </div>
                              </li>
                            );
                          })}
                      </ul>
                    </div>
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