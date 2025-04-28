import React from 'react';
import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Term, Case } from '@shared/schema';

interface WordOfTheDayProps {
  term?: Term & { cases?: Case[] };
  isLoading?: boolean;
}

const WordOfTheDay: React.FC<WordOfTheDayProps> = ({ term, isLoading }) => {
  
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="text-center mb-6">
          <div className="h-6 bg-neutral-200 rounded w-48 mx-auto"></div>
          <div className="w-16 h-1 bg-neutral-200 mx-auto mt-2"></div>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <div className="bg-neutral-200 p-6 rounded-t-lg h-28"></div>
          <div className="border-l border-r border-neutral-200 p-6 space-y-4">
            <div className="h-5 bg-neutral-200 rounded w-1/4"></div>
            <div className="h-4 bg-neutral-200 rounded"></div>
            <div className="h-4 bg-neutral-200 rounded"></div>
            <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
            
            <div className="h-5 bg-neutral-200 rounded w-1/4 mt-8"></div>
            <div className="h-20 bg-neutral-200 rounded"></div>
            
            <div className="h-5 bg-neutral-200 rounded w-1/4 mt-8"></div>
            <div className="h-32 bg-neutral-200 rounded"></div>
          </div>
          <div className="border border-neutral-200 rounded-b-lg bg-neutral-50 p-4 flex justify-between items-center">
            <div className="h-4 bg-neutral-200 rounded w-32"></div>
            <div className="h-4 bg-neutral-200 rounded w-16"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!term) {
    return (
      <Card className="max-w-3xl mx-auto">
        <CardContent className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">No Word of the Day Available</h2>
          <p className="text-neutral-600">
            Please check back later. Our team is working on adding more legal terms to the dictionary.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-primary to-blue-700 text-white rounded-t-lg">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-3xl font-bold text-white">{term.term}</CardTitle>
            <div className="bg-yellow-300 text-black px-3 py-1 rounded-md inline-block mt-2">
              <p className="font-medium">{term.term}</p>
            </div>
            {term.origin && <p className="italic text-neutral-200 mt-1">[{term.origin}]</p>}
          </div>
          <Badge variant="secondary">{term.category}</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium text-neutral-900 mb-2">Definition</h3>
        <p className="text-neutral-700 mb-6">{term.definition}</p>
        
        {term.example && (
          <>
            <h3 className="text-lg font-medium text-neutral-900 mb-2">Example 1</h3>
            <p className="text-neutral-700 bg-neutral-50 p-4 rounded-md mb-6 border-l-4 border-primary">
              "{term.example}"
            </p>
          </>
        )}
        
        {term.cases && term.cases.length > 0 && (
          <>
            <h3 className="text-lg font-medium text-neutral-900 mb-2">Example 2 (Case Reference)</h3>
            <div className="bg-neutral-50 p-4 rounded-md border border-neutral-200 mb-4">
              <h4 className="font-medium text-primary-dark">
                {term.cases[0].caseName} {term.cases[0].year && `(${term.cases[0].year})`}
              </h4>
              <p className="text-neutral-700 mt-1">{term.cases[0].description}</p>
            </div>
          </>
        )}
      </CardContent>
      
      <CardFooter className="bg-neutral-50 text-sm text-neutral-500 py-4 border-t">
        Added: {new Date(term.createdAt).toLocaleDateString()}
      </CardFooter>
    </Card>
  );
};

export default WordOfTheDay;
