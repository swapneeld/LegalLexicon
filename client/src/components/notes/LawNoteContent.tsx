import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollIcon, BookOpen, FileIcon, CheckSquare } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { getQueryFn } from '@/lib/queryClient';

interface LawTopicProps {
  courseId: string;
}

interface LawTopic {
  id: number;
  courseId: number;
  name: string;
  description: string | null;
  orderIndex: number;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

interface LawQuestion {
  id: number;
  topicId: number;
  questionNumber: number;
  title: string;
  content: string;
  contentJson: {
    _id: string;
    questionNumber: number;
    topicId: number;
    title: string;
    content: string;
    synopsis: string[];
    notes: {
      section: string;
      content: string;
    }[];
    detailedAnalysis?: {
      section: string;
      content: string;
    }[];
    cases?: {
      name: string;
      citation: string;
      summary: string;
    }[];
    createdAt: string;
    updatedAt: string;
  } | null;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

export const LawTopicsList: React.FC<LawTopicProps> = ({ courseId }) => {
  const { data: topics, isLoading, error } = useQuery({
    queryKey: [`/api/law-courses/${courseId}/topics`],
    queryFn: getQueryFn({ on401: 'returnNull' }),
    enabled: !!courseId
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (error || !topics || topics.length === 0) {
    return (
      <div className="bg-gray-100 p-8 rounded-lg text-center">
        <ScrollIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-700 mb-2">
          {error ? 'Error Loading Topics' : 'No Topics Available'}
        </h3>
        <p className="text-gray-500">
          {error ? 'Failed to load topics. Please try again later.' : 'Topics for this course will be added soon.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {topics.map((topic: LawTopic) => (
        <TopicItem key={topic.id} topic={topic} />
      ))}
    </div>
  );
};

const TopicItem: React.FC<{ topic: LawTopic }> = ({ topic }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <BookOpen className="h-5 w-5 mr-2" />
          {topic.name}
        </CardTitle>
        <CardDescription>{topic.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <QuestionsList topicId={topic.id} />
      </CardContent>
    </Card>
  );
};

const QuestionsList: React.FC<{ topicId: number }> = ({ topicId }) => {
  const { data: questions, isLoading, error } = useQuery({
    queryKey: [`/api/law-topics/${topicId}/questions`],
    queryFn: getQueryFn({ on401: 'returnNull' }),
    enabled: !!topicId
  });

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
      </div>
    );
  }

  if (error || !questions || questions.length === 0) {
    return (
      <div className="bg-gray-50 p-4 rounded text-center">
        <FileIcon className="h-8 w-8 text-gray-300 mx-auto mb-2" />
        <p className="text-gray-500 text-sm">No questions available for this topic.</p>
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      {questions.map((question: LawQuestion) => (
        <AccordionItem key={question.id} value={question.id.toString()}>
          <AccordionTrigger className="text-left">
            <div className="flex items-start">
              <span className="font-medium">
                {question.questionNumber}. {question.title}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <QuestionContent question={question} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

const QuestionContent: React.FC<{ question: LawQuestion }> = ({ question }) => {
  if (!question.contentJson) {
    return (
      <div className="text-gray-700 whitespace-pre-line">{question.content}</div>
    );
  }

  const { contentJson } = question;

  return (
    <div className="space-y-6">
      <div className="text-gray-700 mb-4">{contentJson.content}</div>
      
      {/* Synopsis */}
      {contentJson.synopsis && contentJson.synopsis.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold text-primary-dark mb-2 flex items-center">
            <CheckSquare className="h-4 w-4 mr-2" /> Synopsis
          </h4>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {contentJson.synopsis.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Notes */}
      {contentJson.notes && contentJson.notes.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold text-primary-dark mb-4">Notes</h4>
          <div className="space-y-4">
            {contentJson.notes.map((note, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-md">
                <h5 className="font-medium text-gray-800 mb-2">{note.section}</h5>
                <div className="text-gray-700 whitespace-pre-line">{note.content}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Detailed Analysis */}
      {contentJson.detailedAnalysis && contentJson.detailedAnalysis.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold text-primary-dark mb-4">Detailed Analysis</h4>
          <div className="space-y-4">
            {contentJson.detailedAnalysis.map((analysis, index) => (
              <div key={index}>
                <h5 className="font-medium text-gray-800 mb-2">{analysis.section}</h5>
                <div className="text-gray-700">{analysis.content}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Case Law References */}
      {contentJson.cases && contentJson.cases.length > 0 && (
        <div>
          <h4 className="font-semibold text-primary-dark mb-3">Case References</h4>
          <div className="space-y-3">
            {contentJson.cases.map((caseRef, index) => (
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
  );
};