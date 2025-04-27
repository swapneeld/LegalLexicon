import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Switch, Route } from "wouter";
import Home from "@/pages/home";
import Footer from "@/components/layout/Footer";

// Header component
function Header() {
  return (
    <header>
      <div className="p-5 bg-primary text-white flex justify-between items-center">
        <h1 className="text-2xl font-bold">LawLexicon</h1>
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
        <main className="flex-grow p-5">
          <Switch>
            <Route path="/" component={Home} />
          </Switch>
        </main>
        <Footer />
      </div>
      <Toaster />
    </TooltipProvider>
  );
}

export default App;
