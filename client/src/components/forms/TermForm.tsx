import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useTerms } from '@/hooks/useTerms';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { insertTermSchema } from '@shared/schema';

// Extend the schema to add client-side validation
const termFormSchema = insertTermSchema.extend({
  term: z.string().min(2, {
    message: "Term must be at least 2 characters.",
  }).max(100, {
    message: "Term cannot exceed 100 characters."
  }),
  definition: z.string().min(10, {
    message: "Definition must be at least 10 characters."
  }).max(1000, {
    message: "Definition cannot exceed 1000 characters."
  }),
  example: z.string().optional(),
  origin: z.string().optional(),
  pronunciation: z.string().optional(),
  category: z.string().optional(),
});

type TermFormValues = z.infer<typeof termFormSchema>;

interface TermFormProps {
  onSuccess?: () => void;
}

const legalCategories = [
  'Constitutional Law',
  'Criminal Law',
  'Contract Law',
  'Tort Law',
  'Property Law',
  'Family Law',
  'Administrative Law',
  'International Law',
  'Evidence Law',
  'Legal Principles',
  'Other'
];

const TermForm: React.FC<TermFormProps> = ({ onSuccess }) => {
  const { useCreateTerm } = useTerms();
  const { user } = useAuth();
  
  const createTermMutation = useCreateTerm();
  
  const form = useForm<TermFormValues>({
    resolver: zodResolver(termFormSchema),
    defaultValues: {
      term: '',
      definition: '',
      example: '',
      origin: '',
      pronunciation: '',
      category: '',
      isApproved: false,
      submittedBy: user?.id
    },
  });
  
  const onSubmit = async (data: TermFormValues) => {
    try {
      await createTermMutation.mutateAsync(data);
      form.reset();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting term:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="term"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Term</FormLabel>
              <FormControl>
                <Input placeholder="Enter legal term" {...field} />
              </FormControl>
              <FormDescription>
                Enter the legal term or phrase you want to define.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="origin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Origin</FormLabel>
                <FormControl>
                  <Input placeholder="Latin: 'in good faith'" {...field} />
                </FormControl>
                <FormDescription>
                  Origin or etymology of the term (optional).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="pronunciation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pronunciation</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. reh-sip-suh" {...field} />
                </FormControl>
                <FormDescription>
                  Phonetic pronunciation guide (optional).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="definition"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Definition</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter a comprehensive definition of the term" 
                  className="min-h-[120px]"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Provide a clear, concise explanation of the term.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="example"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Example</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Provide an example of how this term is used in practice" 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                An example helps users understand the context (optional).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a legal category" />
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
              <FormDescription>
                Select the legal category this term belongs to (optional).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <input type="hidden" {...form.register("submittedBy")} value={user?.id} />
        <input type="hidden" {...form.register("isApproved")} value="false" />
        
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={createTermMutation.isPending}
          >
            {createTermMutation.isPending ? 'Submitting...' : 'Submit Term'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TermForm;
