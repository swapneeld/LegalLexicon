import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Switch, Route } from "wouter";
import Home from "@/pages/home";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

function App() {
  return (
    <TooltipProvider>
      <div className="flex flex-col min-h-screen">
        <header>
          <h1 className="p-5 bg-primary text-white text-2xl font-bold">
            LawLexicon
          </h1>
        </header>
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
