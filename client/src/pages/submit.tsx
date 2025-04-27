import React, { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import SubmissionForm from '@/components/forms/SubmissionForm';

const SubmitPage: React.FC = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  
  const handleSuccess = () => {
    setIsSuccess(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link href="/dashboard">
          <Button variant="ghost" className="pl-0">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dictionary
          </Button>
        </Link>
      </div>
      
      {isSuccess ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 text-center">
          <h2 className="text-2xl font-bold text-green-800 mb-2">Thank You for Your Submission!</h2>
          <p className="text-green-700 mb-4">
            Your legal term has been submitted successfully and will be reviewed by our team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
            <Button variant="outline" onClick={() => setIsSuccess(false)}>
              Submit Another Term
            </Button>
            <Link href="/dashboard">
              <Button>
                Return to Dictionary
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <SubmissionForm onSuccess={handleSuccess} />
      )}
      
      <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-blue-800 mb-3">Why Submit a Term?</h2>
        <ul className="space-y-2 text-blue-700 list-disc pl-5">
          <li>Help others understand complex legal terminology</li>
          <li>Contribute to building a comprehensive legal resource</li>
          <li>Share your legal knowledge with the community</li>
          <li>Help students and professionals in their legal education</li>
        </ul>
        <p className="mt-4 text-blue-700">
          All submissions are reviewed by our legal experts before being added to the dictionary.
        </p>
      </div>
    </div>
  );
};

export default SubmitPage;