import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Award } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import WordOfTheDay from '@/components/terms/WordOfTheDay';
import { useTerms } from '@/hooks/useTerms';

// Word of the Day section with real data
const WordOfTheDaySection = () => {
  const { useWordOfTheDay } = useTerms();
  const { data: term, isLoading } = useWordOfTheDay();
  
  return (
    <>
      <div className="flex items-center mb-6">
        <Award className="text-primary mr-2 h-6 w-6" />
        <h2 className="text-2xl font-bold">Word of the Day</h2>
      </div>
      
      <WordOfTheDay term={term} isLoading={isLoading} />
      
      <div className="mt-4 text-center">
        <Link href="/dashboard">
          <Button variant="outline">
            Explore More Legal Terms
          </Button>
        </Link>
      </div>
    </>
  );
};

const Home: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Hero Section */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-8 sm:p-12">
          <div className="text-center py-6">
            <h1 className="text-4xl font-bold text-primary mb-4">Welcome to LawLexicon</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Your comprehensive legal dictionary and study companion with semester-wise law notes, Q&A, and legal terminology.
            </p>
            <Link href="/dashboard">
              <Button 
                variant="default"
                size="lg"
                className="text-white font-medium inline-flex items-center"
              >
                <BookOpen className="mr-2 h-5 w-5" />
                Browse Dictionary
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Word of the Day Section */}
      <div className="mt-12">
        <WordOfTheDaySection />
      </div>
      
      {/* Call-to-action for Law Notes */}
      <div className="mt-12 text-center">
        <div className="max-w-3xl mx-auto bg-blue-50 rounded-lg p-6 border border-blue-200">
          <BookOpen className="h-10 w-10 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Explore Law Notes</h2>
          <p className="text-gray-600 mb-4">
            Access comprehensive law notes organized by semester, covering key subjects with essential concepts, case analyses, and practice questions.
          </p>
          <Link href="/notes">
            <Button size="lg" className="gap-2">
              <BookOpen className="h-5 w-5" />
              View Law Notes
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
