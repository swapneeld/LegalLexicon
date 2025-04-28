import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckSquare } from 'lucide-react';
import { LawQuestion } from '@shared/schema';

interface LawNoteContentProps {
  question: LawQuestion;
  isLoading?: boolean;
}

interface ParsedContent {
  synopsis?: string[];
  notes?: {
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
}

const LawNoteContent: React.FC<LawNoteContentProps> = ({ question, isLoading = false }) => {
  const parseContent = (content: string): ParsedContent => {
    try {
      return JSON.parse(content);
    } catch (error) {
      console.error('Failed to parse content:', error);
      return {};
    }
  };

  if (isLoading) {
    return <LawNoteContentSkeleton />;
  }

  if (!question) {
    return <div className="text-center text-gray-500 py-8">Question not found</div>;
  }

  const parsedContent = parseContent(question.content);

  return (
    <div className="space-y-6">
      <div className="text-gray-700 mb-4">{question.title}</div>
      
      {/* Synopsis */}
      {parsedContent.synopsis && parsedContent.synopsis.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold text-primary-dark mb-2 flex items-center">
            <CheckSquare className="h-4 w-4 mr-2" /> Synopsis
          </h4>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {parsedContent.synopsis.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Notes */}
      {parsedContent.notes && parsedContent.notes.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold text-primary-dark mb-4">Notes</h4>
          <div className="space-y-4">
            {parsedContent.notes.map((note, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-md">
                <h5 className="font-medium text-gray-800 mb-2">{note.section}</h5>
                <div className="text-gray-700 whitespace-pre-line">{note.content}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Detailed Analysis */}
      {parsedContent.detailedAnalysis && parsedContent.detailedAnalysis.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold text-primary-dark mb-4">Detailed Analysis</h4>
          <div className="space-y-4">
            {parsedContent.detailedAnalysis.map((analysis, index) => (
              <div key={index}>
                <h5 className="font-medium text-gray-800 mb-2">{analysis.section}</h5>
                <div className="text-gray-700">{analysis.content}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Case Law References */}
      {parsedContent.cases && parsedContent.cases.length > 0 && (
        <div>
          <h4 className="font-semibold text-primary-dark mb-3">Case References</h4>
          <div className="space-y-3">
            {parsedContent.cases.map((caseRef, index) => (
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

const LawNoteContentSkeleton = () => (
  <div className="space-y-6">
    <Skeleton className="h-6 w-full mb-4" />
    
    <div className="mb-6">
      <Skeleton className="h-6 w-40 mb-2" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[80%]" />
        <Skeleton className="h-4 w-[90%]" />
      </div>
    </div>
    
    <div className="mb-6">
      <Skeleton className="h-6 w-40 mb-4" />
      <div className="space-y-4">
        <div className="p-4 rounded-md bg-gray-100">
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[90%]" />
        </div>
        <div className="p-4 rounded-md bg-gray-100">
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[95%]" />
        </div>
      </div>
    </div>
  </div>
);

export default LawNoteContent;