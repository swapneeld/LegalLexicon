import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription, 
  CardFooter 
} from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLawNotes } from '@/hooks/useLawNotes';
import { 
  Loader2, 
  Plus,
  FileEdit,
  Trash2, 
  Eye, 
  CheckCircle2, 
  XCircle,
  Book
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { format } from 'date-fns';

// Form schemas
const courseFormSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
  shortCode: z.string().min(2, { message: 'Short code must be at least 2 characters' }),
  semester: z.coerce.number().int().min(1).max(12),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

const topicFormSchema = z.object({
  courseId: z.coerce.number().int().positive(),
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  description: z.string().optional(),
  orderIndex: z.coerce.number().int().min(1),
  isVisible: z.boolean().default(true),
});

const questionFormSchema = z.object({
  topicId: z.coerce.number().int().positive(),
  questionNumber: z.coerce.number().int().min(1),
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  content: z.string().min(3, { message: 'Content is required' }),
  isVisible: z.boolean().default(true),
});

type CourseFormValues = z.infer<typeof courseFormSchema>;
type TopicFormValues = z.infer<typeof topicFormSchema>;
type QuestionFormValues = z.infer<typeof questionFormSchema>;

const LawNotesManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('courses');
  const [selectedSemester, setSelectedSemester] = useState<number>(4);
  const [selectedCourseId, setSelectedCourseId] = useState<number | undefined>();
  const [selectedTopicId, setSelectedTopicId] = useState<number | undefined>();
  
  // Dialog states
  const [isCourseDialogOpen, setCourseDialogOpen] = useState<boolean>(false);
  const [isTopicDialogOpen, setTopicDialogOpen] = useState<boolean>(false);
  const [isQuestionDialogOpen, setQuestionDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  
  // Edit/Delete states
  const [editItemId, setEditItemId] = useState<number | null>(null);
  const [deleteItemType, setDeleteItemType] = useState<'course' | 'topic' | 'question'>('course');
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);
  
  // Get all data with hooks
  const { 
    useLawCourses, 
    useLawTopics, 
    useLawQuestions,
    createLawCourse,
    updateLawCourse,
    createLawTopic,
    updateLawTopic,
    createLawQuestion,
    updateLawQuestion,
  } = useLawNotes();
  
  const { data: courses, isLoading: isLoadingCourses } = useLawCourses(selectedSemester);
  const { data: topics, isLoading: isLoadingTopics } = useLawTopics(selectedCourseId || 0);
  const { data: questions, isLoading: isLoadingQuestions } = useLawQuestions(selectedTopicId || 0);
  
  // Setup forms
  const courseForm = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      name: '',
      shortCode: '',
      semester: selectedSemester,
      description: '',
      isActive: true,
    },
  });
  
  const topicForm = useForm<TopicFormValues>({
    resolver: zodResolver(topicFormSchema),
    defaultValues: {
      courseId: selectedCourseId,
      title: '',
      description: '',
      orderIndex: 1,
      isVisible: true,
    },
  });
  
  const questionForm = useForm<QuestionFormValues>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: {
      topicId: selectedTopicId,
      questionNumber: 1,
      title: '',
      content: '{"synopsis":[],"notes":[],"detailedAnalysis":[],"cases":[]}',
      isVisible: true,
    },
  });
  
  // Add/Edit Course
  const onSubmitCourse = (data: CourseFormValues) => {
    if (editItemId) {
      updateLawCourse.mutate({
        id: editItemId,
        data
      }, {
        onSuccess: () => {
          setCourseDialogOpen(false);
          setEditItemId(null);
          courseForm.reset();
        }
      });
    } else {
      createLawCourse.mutate(data, {
        onSuccess: () => {
          setCourseDialogOpen(false);
          courseForm.reset();
        }
      });
    }
  };
  
  // Add/Edit Topic
  const onSubmitTopic = (data: TopicFormValues) => {
    if (editItemId) {
      updateLawTopic.mutate({
        id: editItemId,
        data
      }, {
        onSuccess: () => {
          setTopicDialogOpen(false);
          setEditItemId(null);
          topicForm.reset();
        }
      });
    } else {
      createLawTopic.mutate(data, {
        onSuccess: () => {
          setTopicDialogOpen(false);
          topicForm.reset();
        }
      });
    }
  };
  
  // Add/Edit Question
  const onSubmitQuestion = (data: QuestionFormValues) => {
    // Validate JSON before submitting
    try {
      JSON.parse(data.content);
    } catch (error) {
      toast({
        title: 'Invalid JSON format',
        description: 'Please check your content format',
        variant: 'destructive',
      });
      return;
    }
    
    if (editItemId) {
      updateLawQuestion.mutate({
        id: editItemId,
        data
      }, {
        onSuccess: () => {
          setQuestionDialogOpen(false);
          setEditItemId(null);
          questionForm.reset();
        }
      });
    } else {
      createLawQuestion.mutate(data, {
        onSuccess: () => {
          setQuestionDialogOpen(false);
          questionForm.reset();
        }
      });
    }
  };
  
  // Prepare to edit course
  const handleEditCourse = (course: any) => {
    setEditItemId(course.id);
    courseForm.reset({
      name: course.name,
      shortCode: course.shortCode,
      semester: course.semester,
      description: course.description || '',
      isActive: course.isActive,
    });
    setCourseDialogOpen(true);
  };
  
  // Prepare to edit topic
  const handleEditTopic = (topic: any) => {
    setEditItemId(topic.id);
    topicForm.reset({
      courseId: topic.courseId,
      title: topic.title,
      description: topic.description || '',
      orderIndex: topic.orderIndex,
      isVisible: topic.isVisible,
    });
    setTopicDialogOpen(true);
  };
  
  // Prepare to edit question
  const handleEditQuestion = (question: any) => {
    setEditItemId(question.id);
    questionForm.reset({
      topicId: question.topicId,
      questionNumber: question.questionNumber,
      title: question.title,
      content: question.content,
      isVisible: question.isVisible,
    });
    setQuestionDialogOpen(true);
  };
  
  // Confirm deletion
  const confirmDelete = () => {
    setDeleteDialogOpen(false);
    // Here you would call the delete mutation
    toast({
      title: 'Delete not implemented',
      description: 'The delete functionality is not implemented yet',
    });
  };
  
  // Open add course dialog
  const handleAddCourse = () => {
    setEditItemId(null);
    courseForm.reset({
      name: '',
      shortCode: '',
      semester: selectedSemester,
      description: '',
      isActive: true,
    });
    setCourseDialogOpen(true);
  };
  
  // Open add topic dialog
  const handleAddTopic = () => {
    if (!selectedCourseId) {
      toast({
        title: 'Please select a course',
        description: 'You need to select a course before adding a topic',
        variant: 'destructive',
      });
      return;
    }
    
    setEditItemId(null);
    topicForm.reset({
      courseId: selectedCourseId,
      title: '',
      description: '',
      orderIndex: topics?.length ? Math.max(...topics.map(t => t.orderIndex)) + 1 : 1,
      isVisible: true,
    });
    setTopicDialogOpen(true);
  };
  
  // Open add question dialog
  const handleAddQuestion = () => {
    if (!selectedTopicId) {
      toast({
        title: 'Please select a topic',
        description: 'You need to select a topic before adding a question',
        variant: 'destructive',
      });
      return;
    }
    
    setEditItemId(null);
    questionForm.reset({
      topicId: selectedTopicId,
      questionNumber: questions?.length ? Math.max(...questions.map(q => q.questionNumber)) + 1 : 1,
      title: '',
      content: JSON.stringify({
        synopsis: [],
        notes: [],
        detailedAnalysis: [],
        cases: []
      }, null, 2),
      isVisible: true,
    });
    setQuestionDialogOpen(true);
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Law Notes Management</h2>
      <p className="text-gray-600">
        Manage law courses, topics, and questions from this panel. You can add, edit, and delete content.
      </p>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="topics">Topics</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
        </TabsList>
        
        {/* Courses Tab */}
        <TabsContent value="courses" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-x-2">
              <Select value={selectedSemester.toString()} onValueChange={(val) => setSelectedSemester(parseInt(val))}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Semester" />
                </SelectTrigger>
                <SelectContent>
                  {[3, 4, 5, 6, 7, 8].map(sem => (
                    <SelectItem key={sem} value={sem.toString()}>Semester {sem}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddCourse}>
              <Plus className="h-4 w-4 mr-2" />
              Add Course
            </Button>
          </div>
          
          {isLoadingCourses ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="mt-2 text-gray-500">Loading courses...</p>
            </div>
          ) : courses && courses.length > 0 ? (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Short Code</TableHead>
                    <TableHead>Semester</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map(course => (
                    <TableRow key={course.id} className="cursor-pointer hover:bg-gray-50" onClick={() => setSelectedCourseId(course.id)}>
                      <TableCell>{course.id}</TableCell>
                      <TableCell className="font-medium">{course.name}</TableCell>
                      <TableCell>{course.shortCode}</TableCell>
                      <TableCell>Semester {course.semester}</TableCell>
                      <TableCell>
                        {course.isActive ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <CheckCircle2 className="h-3 w-3 mr-1" /> Active
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                            <XCircle className="h-3 w-3 mr-1" /> Inactive
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex space-x-2 justify-end" onClick={e => e.stopPropagation()}>
                          <Button variant="outline" size="sm" onClick={() => handleEditCourse(course)}>
                            <FileEdit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => {
                              setDeleteItemType('course');
                              setDeleteItemId(course.id);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 border rounded-md">
              <Book className="h-8 w-8 mx-auto text-gray-400" />
              <p className="mt-2 text-gray-500">No courses found for this semester.</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4"
                onClick={handleAddCourse}
              >
                Add your first course
              </Button>
            </div>
          )}
        </TabsContent>
        
        {/* Topics Tab */}
        <TabsContent value="topics" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-x-2">
              <Select 
                value={selectedCourseId?.toString() || ''} 
                onValueChange={(val) => setSelectedCourseId(parseInt(val))}
                disabled={!courses || courses.length === 0}
              >
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Select Course" />
                </SelectTrigger>
                <SelectContent>
                  {courses?.map(course => (
                    <SelectItem key={course.id} value={course.id.toString()}>
                      {course.name} (Sem {course.semester})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddTopic} disabled={!selectedCourseId}>
              <Plus className="h-4 w-4 mr-2" />
              Add Topic
            </Button>
          </div>
          
          {!selectedCourseId ? (
            <div className="text-center py-8 border rounded-md">
              <Book className="h-8 w-8 mx-auto text-gray-400" />
              <p className="mt-2 text-gray-500">Please select a course to view topics.</p>
            </div>
          ) : isLoadingTopics ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="mt-2 text-gray-500">Loading topics...</p>
            </div>
          ) : topics && topics.length > 0 ? (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Visibility</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topics.map(topic => (
                    <TableRow key={topic.id} className="cursor-pointer hover:bg-gray-50" onClick={() => setSelectedTopicId(topic.id)}>
                      <TableCell>{topic.id}</TableCell>
                      <TableCell className="font-medium">{topic.title}</TableCell>
                      <TableCell>{topic.orderIndex}</TableCell>
                      <TableCell>
                        {topic.isVisible ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <Eye className="h-3 w-3 mr-1" /> Visible
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                            <XCircle className="h-3 w-3 mr-1" /> Hidden
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex space-x-2 justify-end" onClick={e => e.stopPropagation()}>
                          <Button variant="outline" size="sm" onClick={() => handleEditTopic(topic)}>
                            <FileEdit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => {
                              setDeleteItemType('topic');
                              setDeleteItemId(topic.id);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 border rounded-md">
              <Book className="h-8 w-8 mx-auto text-gray-400" />
              <p className="mt-2 text-gray-500">No topics found for this course.</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4"
                onClick={handleAddTopic}
              >
                Add your first topic
              </Button>
            </div>
          )}
        </TabsContent>
        
        {/* Questions Tab */}
        <TabsContent value="questions" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex space-x-3">
              <Select 
                value={selectedCourseId?.toString() || ''} 
                onValueChange={(val) => {
                  setSelectedCourseId(parseInt(val));
                  setSelectedTopicId(undefined);
                }}
                disabled={!courses || courses.length === 0}
              >
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Select Course" />
                </SelectTrigger>
                <SelectContent>
                  {courses?.map(course => (
                    <SelectItem key={course.id} value={course.id.toString()}>
                      {course.name} (Sem {course.semester})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select 
                value={selectedTopicId?.toString() || ''} 
                onValueChange={(val) => setSelectedTopicId(parseInt(val))}
                disabled={!topics || topics.length === 0}
              >
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Select Topic" />
                </SelectTrigger>
                <SelectContent>
                  {topics?.map(topic => (
                    <SelectItem key={topic.id} value={topic.id.toString()}>
                      {topic.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddQuestion} disabled={!selectedTopicId}>
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </div>
          
          {!selectedTopicId ? (
            <div className="text-center py-8 border rounded-md">
              <Book className="h-8 w-8 mx-auto text-gray-400" />
              <p className="mt-2 text-gray-500">Please select a course and topic to view questions.</p>
            </div>
          ) : isLoadingQuestions ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="mt-2 text-gray-500">Loading questions...</p>
            </div>
          ) : questions && questions.length > 0 ? (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Number</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Visibility</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questions.map(question => (
                    <TableRow key={question.id} className="hover:bg-gray-50">
                      <TableCell>{question.id}</TableCell>
                      <TableCell>Q{question.questionNumber}</TableCell>
                      <TableCell className="font-medium">{question.title}</TableCell>
                      <TableCell>
                        {question.isVisible ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <Eye className="h-3 w-3 mr-1" /> Visible
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                            <XCircle className="h-3 w-3 mr-1" /> Hidden
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex space-x-2 justify-end">
                          <Button variant="outline" size="sm" onClick={() => handleEditQuestion(question)}>
                            <FileEdit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => {
                              setDeleteItemType('question');
                              setDeleteItemId(question.id);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 border rounded-md">
              <Book className="h-8 w-8 mx-auto text-gray-400" />
              <p className="mt-2 text-gray-500">No questions found for this topic.</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4"
                onClick={handleAddQuestion}
              >
                Add your first question
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Course Dialog */}
      <Dialog open={isCourseDialogOpen} onOpenChange={setCourseDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>{editItemId ? 'Edit Course' : 'Add New Course'}</DialogTitle>
            <DialogDescription>
              {editItemId 
                ? 'Update the course details below.' 
                : 'Fill in the course details below to create a new course.'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...courseForm}>
            <form onSubmit={courseForm.handleSubmit(onSubmitCourse)} className="space-y-4">
              <FormField
                control={courseForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Family Law II" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={courseForm.control}
                name="shortCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Code</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. FAM-LAW-2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={courseForm.control}
                name="semester"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Semester</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a semester" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[3, 4, 5, 6, 7, 8].map(sem => (
                          <SelectItem key={sem} value={sem.toString()}>Semester {sem}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={courseForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Brief description of the course" 
                        className="resize-none" 
                        {...field} 
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={courseForm.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active Status</FormLabel>
                      <FormDescription>
                        Inactive courses will not be visible to users
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setCourseDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={courseForm.formState.isSubmitting}>
                  {courseForm.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editItemId ? 'Update Course' : 'Add Course'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Topic Dialog */}
      <Dialog open={isTopicDialogOpen} onOpenChange={setTopicDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>{editItemId ? 'Edit Topic' : 'Add New Topic'}</DialogTitle>
            <DialogDescription>
              {editItemId 
                ? 'Update the topic details below.' 
                : 'Fill in the topic details below to create a new topic.'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...topicForm}>
            <form onSubmit={topicForm.handleSubmit(onSubmitTopic)} className="space-y-4">
              <FormField
                control={topicForm.control}
                name="courseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a course" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {courses?.map(course => (
                          <SelectItem key={course.id} value={course.id.toString()}>
                            {course.name} (Sem {course.semester})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={topicForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Hindu Succession" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={topicForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Brief description of the topic" 
                        className="resize-none" 
                        {...field} 
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={topicForm.control}
                name="orderIndex"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Order</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={topicForm.control}
                name="isVisible"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Visibility</FormLabel>
                      <FormDescription>
                        Hidden topics will not be visible to users
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setTopicDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={topicForm.formState.isSubmitting}>
                  {topicForm.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editItemId ? 'Update Topic' : 'Add Topic'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Question Dialog */}
      <Dialog open={isQuestionDialogOpen} onOpenChange={setQuestionDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>{editItemId ? 'Edit Question' : 'Add New Question'}</DialogTitle>
            <DialogDescription>
              {editItemId 
                ? 'Update the question details below.' 
                : 'Fill in the question details below to create a new question.'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...questionForm}>
            <form onSubmit={questionForm.handleSubmit(onSubmitQuestion)} className="space-y-4">
              <FormField
                control={questionForm.control}
                name="topicId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a topic" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {topics?.map(topic => (
                          <SelectItem key={topic.id} value={topic.id.toString()}>
                            {topic.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={questionForm.control}
                name="questionNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question Number</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={questionForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Rules of Devolution of Property" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={questionForm.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content (JSON Format)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder='{"synopsis":[],"notes":[],"detailedAnalysis":[],"cases":[]}' 
                        rows={12}
                        className="font-mono text-sm" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the content in JSON format with synopsis, notes, detailed analysis, and cases sections.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={questionForm.control}
                name="isVisible"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Visibility</FormLabel>
                      <FormDescription>
                        Hidden questions will not be visible to users
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setQuestionDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={questionForm.formState.isSubmitting}>
                  {questionForm.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editItemId ? 'Update Question' : 'Add Question'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this {deleteItemType}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LawNotesManager;