import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { BookOpen, Gavel, HomeIcon, ScrollIcon, HeartHandshake, Building, FileText, Loader2 } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useLawNotes } from '@/hooks/useLawNotes';
import LawNoteContent from '@/components/notes/LawNoteContent';

// Define a map of subject IDs to icons for display
const SUBJECT_ICONS = {
  'company-law': Building,
  'family-law-2': HeartHandshake,
  'property-law': HomeIcon,
  'contract-2': FileText,
  'adr': Gavel,
  'default': BookOpen
};

const NotesPage: React.FC = () => {
  const [location, navigate] = useLocation();
  const [selectedSemester, setSelectedSemester] = useState<number>(4); // Default to Semester 4
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
  
  // Get courses for the selected semester
  const { useLawCourses, useLawTopics, useLawQuestions } = useLawNotes();
  const { data: courses, isLoading: isLoadingCourses } = useLawCourses(selectedSemester, true);
  
  // Get topics for the selected course
  const { data: topics, isLoading: isLoadingTopics } = useLawTopics(selectedCourseId || 0, true);
  
  // Get questions for the selected topic
  const { data: questions, isLoading: isLoadingQuestions } = useLawQuestions(selectedTopicId || 0, true);

  // Set default course when courses load
  useEffect(() => {
    if (courses && courses.length > 0 && !selectedCourseId) {
      setSelectedCourseId(courses[0].id);
    }
  }, [courses]);

  // Set default topic when topics load
  useEffect(() => {
    if (topics && topics.length > 0 && !selectedTopicId) {
      setSelectedTopicId(topics[0].id);
    }
  }, [topics, selectedCourseId]);

  const handleCourseChange = (courseId: number) => {
    setSelectedCourseId(courseId);
    setSelectedTopicId(null); // Reset selected topic when course changes
  };

  const handleTopicChange = (topicId: number) => {
    setSelectedTopicId(topicId);
  };

  // Get the selected course for display
  const selectedCourse = courses?.find(course => course.id === selectedCourseId);
  
  // Function to get an icon for a course
  const getCourseIcon = (shortCode: string) => {
    const iconKey = Object.keys(SUBJECT_ICONS).find(key => 
      shortCode?.toLowerCase().includes(key)) || 'default';
    return SUBJECT_ICONS[iconKey as keyof typeof SUBJECT_ICONS];
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
          {selectedCourse && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <span>{selectedCourse.name}</span>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold text-primary mb-6">Law Notes</h1>
      <p className="text-gray-600 mb-8">
        Access semester-wise law notes for your study. Currently featuring Semester {selectedSemester} content.
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
                <div className="font-medium text-primary-dark">Semester {selectedSemester}</div>
                
                {isLoadingCourses && (
                  <div className="space-y-2 ml-4 mt-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                )}
                
                {!isLoadingCourses && courses && (
                  <ul className="space-y-2 ml-4">
                    {courses.map(course => {
                      const IconComponent = getCourseIcon(course.shortCode);
                      return (
                        <li key={course.id}>
                          <button
                            onClick={() => handleCourseChange(course.id)}
                            className={`flex items-center space-x-2 w-full text-left py-1 px-2 rounded-md ${
                              selectedCourseId === course.id
                                ? 'bg-primary-light/10 text-primary-dark font-medium'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <IconComponent className="h-4 w-4" />
                            <span>{course.name}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {selectedCourse && (
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-primary-dark flex items-center mb-2">
                  {(() => {
                    const IconComponent = getCourseIcon(selectedCourse.shortCode);
                    return <IconComponent className="mr-2 h-6 w-6" />;
                  })()}
                  {selectedCourse.name}
                </h2>
                <p className="text-gray-600">{selectedCourse.description}</p>
              </div>

              {/* Topics and Questions */}
              {isLoadingTopics ? (
                <Card>
                  <CardHeader>
                    <Skeleton className="h-8 w-48" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  </CardContent>
                </Card>
              ) : topics && topics.length > 0 ? (
                topics.map(topic => (
                  <Card key={topic.id} className="mb-8">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BookOpen className="mr-2 h-5 w-5" />
                        {topic.title}
                      </CardTitle>
                      {topic.description && (
                        <CardDescription>{topic.description}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      {isLoadingQuestions ? (
                        <div className="space-y-4">
                          <Skeleton className="h-12 w-full" />
                          <Skeleton className="h-12 w-full" />
                        </div>
                      ) : questions && questions.length > 0 ? (
                        <Accordion type="single" collapsible className="w-full">
                          {questions
                            .filter(q => q.topicId === topic.id)
                            .map(question => (
                              <AccordionItem key={question.id} value={question.id.toString()}>
                                <AccordionTrigger className="text-left">
                                  <div className="flex items-start">
                                    <span className="font-medium">
                                      {question.questionNumber}. {question.title}
                                    </span>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                  <LawNoteContent question={question} />
                                </AccordionContent>
                              </AccordionItem>
                            ))}
                        </Accordion>
                      ) : (
                        <div className="bg-gray-100 p-8 rounded-lg text-center">
                          <ScrollIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-700 mb-2">No Questions Available</h3>
                          <p className="text-gray-500">
                            Questions for this topic will be added soon. Please check back later.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>{selectedCourse.name} Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-100 p-8 rounded-lg text-center">
                      <ScrollIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-700 mb-2">Content Coming Soon</h3>
                      <p className="text-gray-500">
                        Detailed notes for {selectedCourse.name} will be added soon. Please check back later.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {isLoadingCourses && (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                <p className="text-gray-500">Loading courses...</p>
              </div>
            </div>
          )}

          {!isLoadingCourses && (!courses || courses.length === 0) && (
            <Card>
              <CardContent className="p-8">
                <div className="text-center">
                  <ScrollIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No Courses Available</h3>
                  <p className="text-gray-500">
                    Law notes for this semester are not available yet. Please check back later.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesPage;