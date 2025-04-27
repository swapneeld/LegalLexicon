import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useMutation } from '@tanstack/react-query';

// Submission form schema
const submissionFormSchema = z.object({
  term: z.string().min(1, 'Term is required'),
  definition: z.string().min(10, 'Definition must be at least 10 characters'),
  category: z.string().min(1, 'Category is required'),
  example: z.string().optional(),
  caseName: z.string().optional(),
  caseCitation: z.string().optional(),
  caseDescription: z.string().optional(),
  submitterName: z.string().optional(),
  submitterMobile: z.string().regex(/^[0-9]{10}$/, 'Mobile number must be 10 digits'),
  submitterCity: z.string().optional(),
});

// Form values type
type SubmissionFormValues = z.infer<typeof submissionFormSchema>;

// Legal categories
const legalCategories = [
  'Constitutional Law',
  'Criminal Law',
  'Civil Law',
  'Contract Law',
  'Tort Law',
  'Family Law',
  'Property Law',
  'International Law',
  'Corporate Law',
  'Intellectual Property',
  'Environmental Law',
  'Administrative Law',
  'Legal Principles',
  'Legal Practice',
  'Trial Procedure',
  'Other'
];

interface SubmissionFormProps {
  onSuccess?: () => void;
}

export default function SubmissionForm({ onSuccess }: SubmissionFormProps) {
  // Create form
  const form = useForm<SubmissionFormValues>({
    resolver: zodResolver(submissionFormSchema),
    defaultValues: {
      term: '',
      definition: '',
      category: '',
      example: '',
      caseName: '',
      caseCitation: '',
      caseDescription: '',
      submitterName: '',
      submitterMobile: '',
      submitterCity: '',
    },
  });

  // Create submission mutation
  const { mutate, isPending } = useMutation({
    mutationFn: (data: SubmissionFormValues) => {
      return fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }).then(res => {
        if (!res.ok) throw new Error('Failed to submit');
        return res.json();
      });
    },
    onSuccess: () => {
      toast({
        title: 'Thank you for your submission!',
        description: 'Your legal term has been submitted for review.',
      });

      form.reset();
      
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      toast({
        title: 'Submission failed',
        description: error.message || 'Please try again later.',
        variant: 'destructive',
      });
    },
  });

  // Form submission handler
  const onSubmit = (data: SubmissionFormValues) => {
    mutate(data);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">Submit a Legal Term</CardTitle>
        <CardDescription>
          Share your knowledge with the legal community. Your submission will be reviewed by our team.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Term Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Term Details</h3>
              
              <FormField
                control={form.control}
                name="term"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Legal Term*</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Habeas Corpus" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="definition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Definition*</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Provide a clear and concise definition..." 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {legalCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="example"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Example (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Provide an example of how this term is used..." 
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      A real-world example helps others understand the term better.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Case Reference Section */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-medium">Case Reference (Optional)</h3>
              <FormDescription className="mt-0">
                If this legal term is associated with a significant case, please provide the details.
              </FormDescription>
              
              <FormField
                control={form.control}
                name="caseName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Case Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Roe v. Wade" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="caseCitation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Case Citation</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 410 U.S. 113 (1973)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="caseDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brief Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Brief description of the case and its significance..." 
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Contact Information Section */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-medium">Your Information</h3>
              <FormDescription className="mt-0">
                We'll use your mobile number to notify you when your submission is approved.
              </FormDescription>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="submitterName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="submitterMobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile Number*</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="10-digit mobile number" 
                          type="tel"
                          maxLength={10}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Format: 10 digits without spaces or hyphens
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="submitterCity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. New Delhi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isPending}
            >
              {isPending ? 'Submitting...' : 'Submit Term'}
            </Button>
          </form>
        </Form>
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-2 border-t pt-6">
        <p className="text-sm text-gray-500">
          * Required fields
        </p>
        <p className="text-sm text-gray-500">
          Your submission will be reviewed by our legal team before being added to the dictionary.
        </p>
      </CardFooter>
    </Card>
  );
}