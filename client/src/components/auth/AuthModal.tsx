import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogClose 
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';
import { signInWithEmail, registerWithEmail } from '@/lib/firebase';

interface AuthModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ open, setOpen }) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const { signIn, register } = useAuth();
  const { toast } = useToast();
  
  // Handle sign in
  const handleSignIn = async () => {
    try {
      if (!email || !password) {
        toast({
          title: 'Error',
          description: 'Please enter both email and password',
          variant: 'destructive'
        });
        return;
      }
      
      await signIn(email, password);
      setOpen(false);
      toast({
        title: 'Successfully signed in',
        description: 'Welcome to LawLexicon!',
      });
    } catch (error) {
      console.error('Error signing in:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive'
      });
    }
  };
  
  // Handle registration
  const handleRegister = async () => {
    try {
      if (!email || !password || !confirmPassword || !fullName) {
        toast({
          title: 'Error',
          description: 'Please fill out all required fields',
          variant: 'destructive'
        });
        return;
      }
      
      if (password !== confirmPassword) {
        toast({
          title: 'Error',
          description: 'Passwords do not match',
          variant: 'destructive'
        });
        return;
      }
      
      await register(email, password);
      setOpen(false);
      toast({
        title: 'Account created successfully',
        description: 'Welcome to LawLexicon!',
      });
    } catch (error) {
      console.error('Error registering:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive'
      });
    }
  };
  
  // Use test account
  const handleUseTestAccount = async () => {
    try {
      await signIn();
      setOpen(false);
      toast({
        title: 'Successfully signed in with test account',
        description: 'Welcome to LawLexicon!',
      });
    } catch (error) {
      console.error('Error signing in with test account:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive'
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-lg">
              {authMode === 'login' ? 'Sign in to your account' : 'Create a new account'}
            </DialogTitle>
            <DialogClose className="text-neutral-400 hover:text-neutral-500 h-6 w-6 rounded-full focus:outline-none focus:ring-1 focus:ring-primary">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </div>
          <DialogDescription>
            {authMode === 'login' 
              ? 'Access your favorites and contribute to the legal community'
              : 'Join our community of legal professionals and enthusiasts'}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="login" value={authMode} onValueChange={(value) => setAuthMode(value as 'login' | 'register')}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-login">Email address</Label>
                <Input 
                  id="email-login" 
                  type="email" 
                  placeholder="Email address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-login">Password</Label>
                <Input 
                  id="password-login" 
                  type="password" 
                  placeholder="Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember-me" />
                  <Label htmlFor="remember-me" className="text-sm">Remember me</Label>
                </div>
                <Button variant="link" className="text-primary hover:text-primary-light p-0 h-auto">
                  Forgot password?
                </Button>
              </div>
              
              <Button className="w-full" onClick={handleSignIn}>Sign in</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="register" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full-name">Full name</Label>
                <Input 
                  id="full-name" 
                  placeholder="Full name" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-register">Email address</Label>
                <Input 
                  id="email-register" 
                  type="email" 
                  placeholder="Email address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-register">Password</Label>
                <Input 
                  id="password-register" 
                  type="password" 
                  placeholder="Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-confirm">Confirm password</Label>
                <Input 
                  id="password-confirm" 
                  type="password" 
                  placeholder="Confirm password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the <a href="#" className="text-primary hover:text-primary-light">Terms of Service</a> and <a href="#" className="text-primary hover:text-primary-light">Privacy Policy</a>
                </Label>
              </div>
              
              <Button className="w-full" onClick={handleRegister}>Create account</Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-neutral-500">Or continue with</span>
          </div>
        </div>
        
        <div className="mt-6">
          <Button 
            variant="outline" 
            className="w-full mb-3" 
            onClick={handleUseTestAccount}
          >
            Use Test Account
          </Button>
          
          <div className="text-center text-sm text-neutral-600">
            <p>For development/demo purposes only.</p>
            <p>No need to register - test@example.com / password123</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
