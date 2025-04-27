import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { BookOpen, Gavel, HomeIcon, ScrollIcon, HeartHandshake, Building, FileText, CheckSquare } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';


// Semester 4 subjects as requested
const SEMESTER_4_SUBJECTS = [
  {
    id: 'company-law',
    name: 'Company Law',
    icon: Building,
    description: 'Learn about the legal framework governing corporations, their formation, operations and liabilities.',
    courseId: 1
  },
  {
    id: 'family-law-2',
    name: 'Family Law II',
    icon: HeartHandshake,
    description: 'Continue your study of family law with a focus on matrimonial rights, custody, and inheritance.',
    courseId: 2
  },
  {
    id: 'property-law',
    name: 'Property Law',
    icon: HomeIcon,
    description: 'Study the legal rights and interests in both real and personal property under various legal systems.',
    courseId: 3
  },
  {
    id: 'contract-2',
    name: 'Contract II',
    icon: FileText,
    description: 'Advanced contractual principles, specific contracts, and remedies for breach of contract.',
    courseId: 4
  },
  {
    id: 'adr',
    name: 'ADR (Practical)',
    icon: Gavel,
    description: 'Alternative Dispute Resolution methods including arbitration, mediation, and negotiation.',
    courseId: 5
  }
];

// Sample law note data for family law topic
const familyLawContent = {
  _id: "property_devolution_rules",
  questionNumber: 1,
  topicId: 2,
  title: "Rules of Devolution of Property of Hindu Female Dying Intestate",
  content: "Explain the rules regarding devolution of property of a Hindu female dying intestate under the Hindu Succession Act.",
  synopsis: [
    "Introduction",
    "Order of Succession",
    "Property Acquired Before Marriage",
    "Property Acquired After Marriage",
    "Inherited Property",
    "Gifted Property",
    "Illustrations"
  ],
  notes: [
    {
      section: "Introduction",
      content: "Section 15 and 16 of Hindu Succession Act, 1956."
    },
    {
      section: "Order of Succession",
      content: "Sons, daughters, husband.\nHeirs of husband.\nParents.\nHeirs of father.\nHeirs of mother."
    },
    {
      section: "Property Acquired Before Marriage",
      content: "Goes to heirs of natal family (parents, siblings)."
    },
    {
      section: "Property Acquired After Marriage",
      content: "Goes to husband and his heirs."
    },
    {
      section: "Inherited Property",
      content: "Property inherited from father or mother reverts to natal line.\nProperty inherited from husband or father-in-law reverts to husband's heirs."
    },
    {
      section: "Gifted Property",
      content: "Follows same rules depending upon source of gift."
    },
    {
      section: "Illustrations",
      content: "A woman dies leaving behind son and daughter; property divided equally."
    }
  ],
  detailedAnalysis: [
    {
      section: "Statutory Provisions",
      content: "Section 15 and 16 of the Hindu Succession Act, 1956 govern the succession to property of a Hindu female dying intestate."
    },
    {
      section: "General Rules of Succession",
      content: "The property of a female Hindu dying intestate shall devolve according to the rules set out in Section 15."
    }
  ],
  cases: [
    {
      name: "Om Prakash v. Radhacharan",
      citation: "(2009) 15 SCC 66",
      summary: "Supreme Court clarified rules for property inherited by a female Hindu from her parents."
    }
  ],
  createdAt: "2023-04-15T10:30:00Z",
  updatedAt: "2023-05-20T14:45:00Z"
};

// Used to fetch courses
interface LawCourse {
  id: number;
  name: string;
  semester: number;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const NotesPage: React.FC = () => {
  const [location, navigate] = useLocation();
  const [selectedSubject, setSelectedSubject] = useState<string>(SEMESTER_4_SUBJECTS[1].id); // Default to Family Law
  const [initialized, setInitialized] = useState(false);

  // Find the active subject
  const activeSubject = SEMESTER_4_SUBJECTS.find(subject => subject.id === selectedSubject);

  // Hardcoded content to display directly without API calls
  const renderHardcodedContent = () => {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Hindu Succession
            </CardTitle>
            <CardDescription>Rules and principles governing succession under Hindu Law</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="1">
                <AccordionTrigger className="text-left">
                  <div className="flex items-start">
                    <span className="font-medium">
                      1. {familyLawContent.title}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-6">
                    <div className="text-gray-700 mb-4">{familyLawContent.content}</div>
                    
                    {/* Synopsis */}
                    {familyLawContent.synopsis && familyLawContent.synopsis.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-primary-dark mb-2 flex items-center">
                          <CheckSquare className="h-4 w-4 mr-2" /> Synopsis
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {familyLawContent.synopsis.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Notes */}
                    {familyLawContent.notes && familyLawContent.notes.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-primary-dark mb-4">Notes</h4>
                        <div className="space-y-4">
                          {familyLawContent.notes.map((note, index) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-md">
                              <h5 className="font-medium text-gray-800 mb-2">{note.section}</h5>
                              <div className="text-gray-700 whitespace-pre-line">{note.content}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Detailed Analysis */}
                    {familyLawContent.detailedAnalysis && familyLawContent.detailedAnalysis.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-primary-dark mb-4">Detailed Analysis</h4>
                        <div className="space-y-4">
                          {familyLawContent.detailedAnalysis.map((analysis, index) => (
                            <div key={index}>
                              <h5 className="font-medium text-gray-800 mb-2">{analysis.section}</h5>
                              <div className="text-gray-700">{analysis.content}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Case Law References */}
                    {familyLawContent.cases && familyLawContent.cases.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-primary-dark mb-3">Case References</h4>
                        <div className="space-y-3">
                          {familyLawContent.cases.map((caseRef, index) => (
                            <div key={index} className="border border-gray-200 p-3 rounded-md">
                              <h5 className="font-medium text-gray-800">{caseRef.name}</h5>
                              <Badge variant="outline" className="mb-2">{caseRef.citation}</Badge>
                              <p className="text-gray-700 text-sm">{caseRef.summary}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    );
  };

  // No need to initialize content as we're using hardcoded data

  const handleSubjectChange = (subjectId: string) => {
    setSelectedSubject(subjectId);
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/notes">Law Notes</BreadcrumbLink>
          </BreadcrumbItem>
          {activeSubject && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <span>{activeSubject.name}</span>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold text-primary mb-6">Law Notes</h1>
      <p className="text-gray-600 mb-8">
        Access semester-wise law notes for your study. Currently featuring Semester 4 content.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Semesters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="font-medium text-primary-dark">Semester 4</div>
                <ul className="space-y-2 ml-4">
                  {SEMESTER_4_SUBJECTS.map(subject => (
                    <li key={subject.id}>
                      <button
                        onClick={() => handleSubjectChange(subject.id)}
                        className={`flex items-center space-x-2 w-full text-left py-1 px-2 rounded-md ${
                          selectedSubject === subject.id
                            ? 'bg-primary-light/10 text-primary-dark font-medium'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <subject.icon className="h-4 w-4" />
                        <span>{subject.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeSubject && (
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-primary-dark flex items-center mb-2">
                  <activeSubject.icon className="mr-2 h-6 w-6" />
                  {activeSubject.name}
                </h2>
                <p className="text-gray-600">{activeSubject.description}</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="mr-2 h-5 w-5" />
                    {activeSubject.name} Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedSubject === 'family-law-2' ? (
                    // For Family Law II, show hardcoded content
                    renderHardcodedContent()
                  ) : (
                    // For other subjects, show coming soon message
                    <div className="bg-gray-100 p-8 rounded-lg text-center">
                      <ScrollIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-700 mb-2">Content Coming Soon</h3>
                      <p className="text-gray-500">
                        Detailed notes for {activeSubject.name} will be added soon. Please check back later.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesPage;