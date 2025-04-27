import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Calendar, Award } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Word of the day definition
const wordOfTheDay = {
  term: 'Habeas Corpus',
  definition: 'A legal action or writ by which detainees can seek relief from unlawful imprisonment. Latin for "you shall have the body."',
  category: 'Constitutional Law',
  example: 'The defendant filed a petition for habeas corpus after claiming his constitutional rights were violated during the trial.',
  caseReference: 'Ex parte Milligan, 71 U.S. 2 (1866)'
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
              Your comprehensive legal dictionary with detailed definitions, examples, and case references.
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
        <div className="flex items-center mb-6">
          <Award className="text-primary mr-2 h-6 w-6" />
          <h2 className="text-2xl font-bold">Word of the Day</h2>
        </div>
        
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="text-gray-400 h-4 w-4" />
                  <span className="text-sm text-gray-500">{new Date().toLocaleDateString()}</span>
                </div>
                <CardTitle className="text-3xl text-primary">{wordOfTheDay.term}</CardTitle>
              </div>
              <Badge variant="outline">{wordOfTheDay.category}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-6 text-lg">{wordOfTheDay.definition}</p>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2 text-primary">Example:</h4>
                <p className="text-gray-600 italic border-l-4 border-primary/20 pl-4 py-1">
                  {wordOfTheDay.example}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2 text-primary">Case Reference:</h4>
                <p className="text-gray-600 border-l-4 border-primary/20 pl-4 py-1">
                  {wordOfTheDay.caseReference}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <div className="flex flex-col sm:flex-row sm:justify-between w-full gap-4">
              <Button variant="outline" className="sm:flex-1">
                Previous Word
              </Button>
              <Link href="/dashboard">
                <Button className="w-full sm:flex-1">
                  Explore More Terms
                </Button>
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
      
      {/* Features Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Feature 1 */}
        <Card>
          <CardHeader>
            <CardTitle>Comprehensive Definitions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Access clear, accurate definitions of legal terms from various fields of law.
            </p>
          </CardContent>
        </Card>
        
        {/* Feature 2 */}
        <Card>
          <CardHeader>
            <CardTitle>Real-World Examples</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              See how each term is used in real legal contexts with practical examples.
            </p>
          </CardContent>
        </Card>
        
        {/* Feature 3 */}
        <Card>
          <CardHeader>
            <CardTitle>Case References</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Study important precedents and cases that have shaped the meaning of legal terms.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
