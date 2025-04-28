import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { 
  LawCourse, InsertLawCourse, 
  LawTopic, InsertLawTopic, 
  LawQuestion, InsertLawQuestion 
} from '@shared/schema';

export function useLawNotes() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Get all law courses (optionally filtered by semester)
  const useLawCourses = (semester?: number, active: boolean = true) => {
    let queryParams = '';
    if (semester !== undefined) {
      queryParams += `semester=${semester}`;
    }
    if (active !== undefined) {
      queryParams += queryParams ? `&active=${active}` : `active=${active}`;
    }
    
    return useQuery<LawCourse[]>({
      queryKey: ['/api/law-courses', semester, active],
      queryFn: () => 
        fetch(`/api/law-courses${queryParams ? `?${queryParams}` : ''}`)
          .then(res => res.json()),
    });
  };

  // Get law course by ID
  const useLawCourse = (id: number) => {
    return useQuery<LawCourse>({
      queryKey: ['/api/law-courses', id],
      queryFn: () => 
        fetch(`/api/law-courses/${id}`)
          .then(res => res.json()),
      enabled: !!id,
    });
  };

  // Get topics for a course
  const useLawTopics = (courseId: number, visible: boolean = true) => {
    return useQuery<LawTopic[]>({
      queryKey: ['/api/law-topics', courseId, visible],
      queryFn: () => 
        fetch(`/api/law-courses/${courseId}/topics?visible=${visible}`)
          .then(res => res.json()),
      enabled: !!courseId,
    });
  };

  // Get topic by ID
  const useLawTopic = (id: number) => {
    return useQuery<LawTopic>({
      queryKey: ['/api/law-topics', id],
      queryFn: () => 
        fetch(`/api/law-topics/${id}`)
          .then(res => res.json()),
      enabled: !!id,
    });
  };

  // Get questions for a topic
  const useLawQuestions = (topicId: number, visible: boolean = true) => {
    return useQuery<LawQuestion[]>({
      queryKey: ['/api/law-questions', topicId, visible],
      queryFn: () => 
        fetch(`/api/law-topics/${topicId}/questions?visible=${visible}`)
          .then(res => res.json()),
      enabled: !!topicId,
    });
  };

  // Get question by ID
  const useLawQuestion = (id: number) => {
    return useQuery<LawQuestion>({
      queryKey: ['/api/law-questions', id],
      queryFn: () => 
        fetch(`/api/law-questions/${id}`)
          .then(res => res.json()),
      enabled: !!id,
    });
  };

  // Create a new law course (admin only)
  const createLawCourse = useMutation({
    mutationFn: (course: InsertLawCourse) => 
      apiRequest('/api/law-courses', course),
    onSuccess: () => {
      toast({
        title: 'Course created',
        description: 'The course has been created successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/law-courses'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create course',
        variant: 'destructive',
      });
    },
  });

  // Update a law course (admin only)
  const updateLawCourse = useMutation({
    mutationFn: ({ id, data }: { id: number, data: Partial<InsertLawCourse> }) => 
      apiRequest(`/api/law-courses/${id}`, data, 'PUT'),
    onSuccess: (_, variables) => {
      toast({
        title: 'Course updated',
        description: 'The course has been updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/law-courses'] });
      queryClient.invalidateQueries({ queryKey: ['/api/law-courses', variables.id] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update course',
        variant: 'destructive',
      });
    },
  });

  // Create a new law topic (admin only)
  const createLawTopic = useMutation({
    mutationFn: (topic: InsertLawTopic) => 
      apiRequest('/api/law-topics', topic),
    onSuccess: (_, variables) => {
      toast({
        title: 'Topic created',
        description: 'The topic has been created successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/law-topics', variables.courseId] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create topic',
        variant: 'destructive',
      });
    },
  });

  // Update a law topic (admin only)
  const updateLawTopic = useMutation({
    mutationFn: ({ id, data }: { id: number, data: Partial<InsertLawTopic> }) => 
      apiRequest(`/api/law-topics/${id}`, data, 'PUT'),
    onSuccess: (_, variables) => {
      toast({
        title: 'Topic updated',
        description: 'The topic has been updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/law-topics'] });
      queryClient.invalidateQueries({ queryKey: ['/api/law-topics', variables.id] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update topic',
        variant: 'destructive',
      });
    },
  });

  // Create a new law question (admin only)
  const createLawQuestion = useMutation({
    mutationFn: (question: InsertLawQuestion) => 
      apiRequest('/api/law-questions', question),
    onSuccess: (_, variables) => {
      toast({
        title: 'Question created',
        description: 'The question has been created successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/law-questions', variables.topicId] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create question',
        variant: 'destructive',
      });
    },
  });

  // Update a law question (admin only)
  const updateLawQuestion = useMutation({
    mutationFn: ({ id, data }: { id: number, data: Partial<InsertLawQuestion> }) => 
      apiRequest(`/api/law-questions/${id}`, data, 'PUT'),
    onSuccess: (_, variables) => {
      toast({
        title: 'Question updated',
        description: 'The question has been updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/law-questions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/law-questions', variables.id] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update question',
        variant: 'destructive',
      });
    },
  });

  return {
    useLawCourses,
    useLawCourse,
    useLawTopics,
    useLawTopic,
    useLawQuestions,
    useLawQuestion,
    createLawCourse,
    updateLawCourse,
    createLawTopic,
    updateLawTopic,
    createLawQuestion,
    updateLawQuestion,
  };
}