import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { BookHeart, Scale, BookOpen, Quote, Heart } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <h1 className="text-3xl font-bold text-primary mb-8 text-center">About LawLexicon</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <BookHeart className="mr-2 h-6 w-6 text-primary" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              LawLexicon aims to make legal knowledge accessible to everyone. We believe that understanding the law should not be a privilege but a right available to all citizens regardless of their background or education.
            </p>
            <p className="text-gray-700">
              By providing clear explanations of legal terms, relevant case references, and practical examples in both Indian and international contexts, we hope to empower individuals to better navigate the complex legal landscape.
            </p>
          </CardContent>
        </Card>
        
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Scale className="mr-2 h-6 w-6 text-primary" />
              Why Legal Literacy Matters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Legal literacy is the foundation of access to justice. As the great Indian jurist Justice V.R. Krishna Iyer once said, "Law must reach the common man and not remain a monopoly of the privileged few." 
            </p>
            <p className="text-gray-700">
              In a democracy, citizens must understand their rights and responsibilities. Legal literacy empowers individuals to advocate for themselves, make informed decisions, and contribute to a more just society.
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <Quote className="mr-2 h-6 w-6 text-primary" />
            Words of Wisdom from Indian Legal Luminaries
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-primary">
            <p className="italic text-gray-700 mb-2">
              "The law is not an end in itself, nor does it provide ends. It is preeminently a means to serve what we think is right."
            </p>
            <p className="font-medium text-gray-600">— Justice P.N. Bhagwati, Former Chief Justice of India</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-primary">
            <p className="italic text-gray-700 mb-2">
              "Law and justice are not always the same. When they aren't, destroying the law may be the first step toward changing it."
            </p>
            <p className="font-medium text-gray-600">— Justice Krishna Iyer, Former Judge, Supreme Court of India</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-primary">
            <p className="italic text-gray-700 mb-2">
              "Constitutional morality is not a natural sentiment. It has to be cultivated. We must realize that our people have yet to learn it. Democracy in India is only a top-dressing on an Indian soil which is essentially undemocratic."
            </p>
            <p className="font-medium text-gray-600">— Dr. B.R. Ambedkar, Principal Architect of the Indian Constitution</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <BookOpen className="mr-2 h-6 w-6 text-primary" />
            Our Vision for the Future
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">
            LawLexicon envisions a future where legal knowledge is demystified and accessible to all. We plan to expand our dictionary to include:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Comprehensive legal term definitions with references to Indian statutes</li>
            <li>Interactive learning modules for students and legal enthusiasts</li>
            <li>Regional language support to reach broader audiences across India</li>
            <li>Video explanations of complex legal concepts by legal experts</li>
            <li>Community discussion forums to encourage legal discourse</li>
          </ul>
          <p className="text-gray-700 mt-4">
            We believe that an informed citizenry is essential for the health of a democracy, and we are committed to contributing to this cause through our platform.
          </p>
        </CardContent>
      </Card>
      
      <div className="text-center py-6">
        <p className="text-gray-600 flex items-center justify-center">
          Created with <Heart className="mx-1 h-4 w-4 text-red-500 animate-pulse" /> from Latur
        </p>
      </div>
    </div>
  );
};

export default AboutPage;