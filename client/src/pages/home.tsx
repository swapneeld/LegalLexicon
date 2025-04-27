import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Home: React.FC = () => {

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="text-center py-8">
            <h1 className="text-4xl font-bold text-primary mb-4">Welcome to LawLexicon</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your comprehensive legal dictionary with detailed definitions, examples, and case references.
            </p>
          </div>
          
          {/* Featured Section */}
          <div className="mt-12">
            <h2 className="text-xl font-medium text-neutral-900 mb-4">Explore Legal Terms</h2>
            
            <div className="mt-4 text-center">
              <span onClick={() => window.location.href = '/dashboard'}>
                <Button 
                  variant="default"
                  className="text-white font-medium inline-flex items-center"
                >
                  Browse Dictionary
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Feature 1 */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="border-b border-neutral-200 bg-primary-light/5 px-6 py-4">
            <h3 className="text-lg font-medium text-primary-dark">Word of the Day</h3>
          </div>
          <div className="p-6">
            <p className="text-neutral-700 mb-4">
              Learn a new legal term every day. Enhance your legal vocabulary with our carefully selected terms.
            </p>
            <Button className="w-full">
              View Today's Word
            </Button>
          </div>
        </div>
        
        {/* Feature 2 */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="border-b border-neutral-200 bg-primary-light/5 px-6 py-4">
            <h3 className="text-lg font-medium text-primary-dark">Join Our Community</h3>
          </div>
          <div className="p-6">
            <p className="text-neutral-700 mb-4">
              Connect with legal professionals, contribute examples, and participate in discussions.
            </p>
            <Button 
              onClick={() => window.location.href = '/dashboard'}
              className="w-full"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
