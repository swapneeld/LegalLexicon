import React, { Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Switch, Route, Link, useLocation } from "wouter";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import TermDetails from "@/pages/term-details";
import SubmitPage from "@/pages/submit";
import NotesPage from "@/pages/notes-dynamic"; // Using the dynamic notes page
import AboutPage from "@/pages/about";
import Footer from "@/components/layout/Footer";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";

// Header component
function Header() {
  return (
    <header>
      <div className="p-5 bg-primary text-white flex justify-between items-center">
        <Link href="/">
          <span className="text-2xl font-bold cursor-pointer">LawLexicon</span>
        </Link>
        <nav className="flex items-center">
          <ul className="flex space-x-6 mr-4">
            <li>
              <Link href="/">
                <span className="hover:text-primary-foreground/80 transition-colors cursor-pointer">Home</span>
              </Link>
            </li>
            <li>
              <Link href="/dashboard">
                <span className="hover:text-primary-foreground/80 transition-colors cursor-pointer">Dictionary</span>
              </Link>
            </li>
            <li>
              <Link href="/notes">
                <span className="hover:text-primary-foreground/80 transition-colors cursor-pointer">Law Notes</span>
              </Link>
            </li>
            <li>
              <Link href="/about">
                <span className="hover:text-primary-foreground/80 transition-colors cursor-pointer">About</span>
              </Link>
            </li>
            <li className="hidden md:block">
              <Link href="/admin">
                <span className="hover:text-primary-foreground/80 transition-colors cursor-pointer opacity-70">Admin</span>
              </Link>
            </li>
          </ul>
          <Link href="/submit">
            <Button variant="secondary" size="sm" className="hidden md:flex items-center">
              <PlusCircle className="mr-1 h-4 w-4" />
              Submit Term
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}

// Get device type
function getDeviceType() {
  const userAgent = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)) {
    return 'tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)) {
    return 'mobile';
  }
  return 'desktop';
}

// Main App component
function App() {
  const [location] = useLocation();

  // Track visitor
  useEffect(() => {
    const trackVisit = async () => {
      try {
        const visitorData = {
          ipAddress: 'anonymous', // For privacy we don't collect actual IP
          userAgent: navigator.userAgent.substring(0, 255), // Truncate if too long
          path: location,
          referrer: document.referrer || null,
          deviceType: getDeviceType()
        };
        
        await fetch('/api/track-visit', {
          method: 'POST',
          body: JSON.stringify(visitorData),
          headers: {
            'Content-Type': 'application/json'
          }
        });
      } catch (error) {
        console.error('Failed to track visit:', error);
      }
    };
    
    trackVisit();
  }, [location]); // Track when location changes

  return (
    <TooltipProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow bg-gray-50">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/term/:id" component={TermDetails} />
            <Route path="/submit" component={SubmitPage} />
            <Route path="/notes" component={NotesPage} />
            <Route path="/about" component={AboutPage} />
            <Route path="/admin">
              <Suspense fallback={<div className="p-8 text-center">Loading admin panel...</div>}>
                {React.createElement(React.lazy(() => import('@/pages/admin')))}
              </Suspense>
            </Route>
          </Switch>
        </main>
        <Footer />
      </div>
      <Toaster />
    </TooltipProvider>
  );
}

export default App;
