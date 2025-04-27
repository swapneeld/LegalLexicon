import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Switch, Route } from "wouter";
import Home from "@/pages/home";
import Footer from "@/components/layout/Footer";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Header component with auth controls
function Header() {
  const { user, loading, signIn, signOut } = useAuth();
  
  return (
    <header>
      <div className="p-5 bg-primary text-white flex justify-between items-center">
        <h1 className="text-2xl font-bold">LawLexicon</h1>
        <div>
          {loading ? (
            <div className="animate-pulse bg-white/20 h-10 w-20 rounded"></div>
          ) : user ? (
            <div className="flex items-center gap-3">
              <span className="hidden md:inline">Hi, {user.displayName || 'User'}</span>
              <Avatar className="h-8 w-8 border-2 border-white">
                <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                <AvatarFallback className="bg-secondary text-primary font-semibold">
                  {(user.displayName || 'U')[0]}
                </AvatarFallback>
              </Avatar>
              <Button 
                variant="secondary" 
                onClick={() => signOut()}
                className="text-primary"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <Button 
              variant="secondary" 
              onClick={() => signIn()}
              className="text-primary"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

// Main App component
function AppContent() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow p-5">
        <Switch>
          <Route path="/" component={Home} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

// Root App with providers
function App() {
  return (
    <AuthProvider>
      <TooltipProvider>
        <AppContent />
        <Toaster />
      </TooltipProvider>
    </AuthProvider>
  );
}

export default App;
