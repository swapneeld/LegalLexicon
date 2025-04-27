import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Switch, Route, Link } from "wouter";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import TermDetails from "@/pages/term-details";
import Footer from "@/components/layout/Footer";

// Header component
function Header() {
  return (
    <header>
      <div className="p-5 bg-primary text-white flex justify-between items-center">
        <Link href="/">
          <span className="text-2xl font-bold cursor-pointer">LawLexicon</span>
        </Link>
        <nav>
          <ul className="flex space-x-6">
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
          </ul>
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
          </Switch>
        </main>
        <Footer />
      </div>
      <Toaster />
    </TooltipProvider>
  );
}

export default App;
