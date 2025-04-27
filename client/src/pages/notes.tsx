import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { BookOpen, Gavel, HomeIcon, ScrollIcon, HeartHandshake, Building, FileText, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getQueryFn } from '@/lib/queryClient';
import { LawTopicsList } from '@/components/notes/LawNoteContent';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

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

  // Get courses to verify they exist
  const { data: courses, isLoading: coursesLoading, error: coursesError } = useQuery({
    queryKey: ['/api/law-courses'],
    queryFn: getQueryFn({ on401: 'returnNull' })
  });

  // Initialize topic and question if we need to seed the database
  const initializeContent = async () => {
    // Only run this once and only for family law
    if (initialized || selectedSubject !== 'family-law-2') return;

    try {
      // Check if we have topics for the family law course
      const response = await fetch(`/api/law-courses/2/topics`);
      const topics = await response.json();

      // If no topics, create one
      if (!topics || topics.length === 0) {
        // First, make sure course exists
        const courseExists = await fetch('/api/law-courses/2');
        if (courseExists.status === 404) {
          // Create the course
          await fetch('/api/law-courses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: 'Family Law II',
              semester: 4,
              description: 'Continue your study of family law with a focus on matrimonial rights, custody, and inheritance.',
              isActive: true
            })
          });
        }

        // Create a topic
        const topicResponse = await fetch('/api/law-topics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            courseId: 2,
            name: 'Hindu Succession',
            description: 'Rules and principles governing succession under Hindu Law',
            orderIndex: 1,
            isVisible: true
          })
        });

        const topic = await topicResponse.json();
        
        // Create a question with our content
        if (topic && topic.id) {
          await fetch('/api/law-questions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              topicId: topic.id,
              questionNumber: 1,
              title: familyLawContent.title,
              content: familyLawContent.content,
              contentJson: familyLawContent,
              isVisible: true
            })
          });
        }
      }
      setInitialized(true);
    } catch (err) {
      console.error("Failed to initialize content:", err);
    }
  };

  // Call initialize function when we're on family law
  useEffect(() => {
    if (selectedSubject === 'family-law-2') {
      initializeContent();
    }
  }, [selectedSubject]);

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
                    // For Family Law II, show the content from the database
                    <LawTopicsList courseId={activeSubject.courseId.toString()} />
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