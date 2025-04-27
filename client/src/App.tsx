import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Switch, Route, Link } from "wouter";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import TermDetails from "@/pages/term-details";
import SubmitPage from "@/pages/submit";
import Footer from "@/components/layout/Footer";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

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

// Main App component
function App() {
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
