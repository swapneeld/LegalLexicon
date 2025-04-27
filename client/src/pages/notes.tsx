import React, { useState } from 'react';
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
import { BookOpen, Gavel, HomeIcon, ScrollIcon, HeartHandshake, Building, FileText } from 'lucide-react';

// Semester 4 subjects as requested
const SEMESTER_4_SUBJECTS = [
  {
    id: 'company-law',
    name: 'Company Law',
    icon: Building,
    description: 'Learn about the legal framework governing corporations, their formation, operations and liabilities.'
  },
  {
    id: 'family-law-2',
    name: 'Family Law II',
    icon: HeartHandshake,
    description: 'Continue your study of family law with a focus on matrimonial rights, custody, and inheritance.'
  },
  {
    id: 'property-law',
    name: 'Property Law',
    icon: HomeIcon,
    description: 'Study the legal rights and interests in both real and personal property under various legal systems.'
  },
  {
    id: 'contract-2',
    name: 'Contract II',
    icon: FileText,
    description: 'Advanced contractual principles, specific contracts, and remedies for breach of contract.'
  },
  {
    id: 'adr',
    name: 'ADR (Practical)',
    icon: Gavel,
    description: 'Alternative Dispute Resolution methods including arbitration, mediation, and negotiation.'
  }
];

const NotesPage: React.FC = () => {
  const [location, navigate] = useLocation();
  const [selectedSubject, setSelectedSubject] = useState<string>(SEMESTER_4_SUBJECTS[0].id);

  // Find the active subject
  const activeSubject = SEMESTER_4_SUBJECTS.find(subject => subject.id === selectedSubject);

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
                  <div className="bg-gray-100 p-8 rounded-lg text-center">
                    <ScrollIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Content Coming Soon</h3>
                    <p className="text-gray-500">
                      Detailed notes for {activeSubject.name} will be added soon. Please check back later.
                    </p>
                  </div>
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