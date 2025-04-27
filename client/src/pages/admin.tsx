import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

// Login form schema
const loginFormSchema = z.object({
  mobileNumber: z.string()
    .regex(/^[6-9]\d{9}$/, 'Mobile number must be a valid 10-digit Indian number starting with 6, 7, 8, or 9')
    .refine(val => val === '8007348348', { message: 'Invalid admin mobile number' }),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .refine(val => val === '8007348348', { message: 'Invalid password' }),
});

// Login form values type
type LoginFormValues = z.infer<typeof loginFormSchema>;

const AdminPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<{ id: number; mobileNumber: string; name?: string } | null>(null);
  const [_, setLocation] = useLocation();
  
  // Check if already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/me');
        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(true);
          setAdminUser(data);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      }
    };
    
    checkAuth();
  }, []);
  
  // Create form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      mobileNumber: '',
      password: '',
    },
  });
  
  // Form submission handler
  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        const userData = await response.json();
        setIsAuthenticated(true);
        setAdminUser(userData);
        
        toast({
          title: 'Login successful',
          description: `Welcome back${userData.name ? ', ' + userData.name : ''}!`,
        });
      } else {
        const errorData = await response.json();
        toast({
          title: 'Login failed',
          description: errorData.message || 'Invalid mobile number or password',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Login failed',
        description: 'An error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLogout = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
      });
      
      if (response.ok) {
        setIsAuthenticated(false);
        setAdminUser(null);
        
        toast({
          title: 'Logout successful',
          description: 'You have been logged out.',
        });
      } else {
        toast({
          title: 'Logout failed',
          description: 'An error occurred. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Logout failed',
        description: 'An error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-primary">Admin Login</CardTitle>
              <CardDescription>
                Login to access the admin dashboard and manage content. Use your mobile number for both username and password.
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="mobileNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mobile Number</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="10-digit mobile number" 
                            type="tel"
                            maxLength={10}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Your password" 
                            type="password"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      'Login'
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
            
            <CardFooter className="border-t pt-4">
              <p className="text-sm text-gray-500">
                Note: This area is restricted to administrators only.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" onClick={handleLogout} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging out...
            </>
          ) : (
            'Logout'
          )}
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <Tabs defaultValue="submissions" className="w-full">
          <TabsList className="w-full border-b">
            <TabsTrigger value="submissions" className="flex-1">Submissions</TabsTrigger>
            <TabsTrigger value="pending-terms" className="flex-1">Pending Terms</TabsTrigger>
            <TabsTrigger value="reports" className="flex-1">Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="submissions" className="p-6">
            <h2 className="text-xl font-semibold mb-4">Term Submissions</h2>
            <p className="text-gray-500">
              Review user-submitted terms and approve or reject them.
            </p>
            
            <div className="mt-6 text-center">
              <p>Submissions functionality will be implemented soon.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="pending-terms" className="p-6">
            <h2 className="text-xl font-semibold mb-4">Pending Terms</h2>
            <p className="text-gray-500">
              Review and approve terms that have been flagged for review.
            </p>
            
            <div className="mt-6 text-center">
              <p>Pending terms functionality will be implemented soon.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="reports" className="p-6">
            <h2 className="text-xl font-semibold mb-4">Reports</h2>
            <p className="text-gray-500">
              Manage user reports for inappropriate content.
            </p>
            
            <div className="mt-6 text-center">
              <p>Reports functionality will be implemented soon.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;