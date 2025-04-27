import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { insertReportSchema } from '@shared/schema';

// Extend the schema to add client-side validation
const reportFormSchema = insertReportSchema.extend({
  reason: z.string().min(1, {
    message: "Please select a reason for reporting.",
  }),
  additionalInfo: z.string().optional(),
});

type ReportFormValues = z.infer<typeof reportFormSchema> & {
  additionalInfo?: string;
};

interface ReportFormProps {
  contentType: 'term' | 'example' | 'case';
  contentId: number;
  onSuccess?: () => void;
}

const reportReasons = [
  'Inappropriate Content',
  'Misinformation',
  'Incorrect Definition',
  'Outdated Information',
  'Spam',
  'Other'
];

const ReportForm: React.FC<ReportFormProps> = ({ contentType, contentId, onSuccess }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      contentType,
      contentId,
      reason: '',
      additionalInfo: '',
      reportedBy: user?.id
    },
  });
  
  const reportMutation = useMutation({
    mutationFn: (data: ReportFormValues) => {
      const { additionalInfo, ...reportData } = data;
      
      // Add additional info to reason if provided
      let finalReason = data.reason;
      if (additionalInfo) {
        finalReason += `: ${additionalInfo}`;
      }
      
      return apiRequest('POST', '/api/reports', {
        ...reportData,
        reason: finalReason
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/reports/pending'] });
      toast({
        title: 'Report Submitted',
        description: 'Thank you for your report. Our team will review it shortly.',
      });
      form.reset();
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      toast({
        title: 'Error Submitting Report',
        description: error instanceof Error ? error.message : 'An error occurred while submitting your report.',
        variant: 'destructive',
      });
    },
  });
  
  const onSubmit = (data: ReportFormValues) => {
    if (!user?.id) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to report content.',
        variant: 'destructive',
      });
      return;
    }
    
    reportMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason for reporting</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {reportReasons.map((reason) => (
                    <SelectItem key={reason} value={reason}>
                      {reason}
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
          name="additionalInfo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Information (optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Please provide more details about your report" 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <input type="hidden" {...form.register("contentType")} value={contentType} />
        <input type="hidden" {...form.register("contentId")} value={contentId} />
        <input type="hidden" {...form.register("reportedBy")} value={user?.id} />
        
        <div className="flex justify-end space-x-2">
          <Button 
            type="submit" 
            disabled={reportMutation.isPending}
          >
            {reportMutation.isPending ? 'Submitting...' : 'Submit Report'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ReportForm;
