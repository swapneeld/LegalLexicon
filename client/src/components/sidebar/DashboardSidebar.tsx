import React from 'react';
import { Link, useLocation } from 'wouter';
import { 
  BookOpen, 
  Bookmark, 
  History, 
  Edit, 
  ChevronRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useFavorites } from '@/hooks/useFavorites';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { exportToPDF, exportToCSV } from '@/utils/exportUtils';

interface DashboardSidebarProps {
  activeCategory?: string;
  onCategorySelect?: (category: string) => void;
}

const categories = [
  'Constitutional Law',
  'Criminal Law',
  'Contract Law',
  'Tort Law',
  'Property Law',
  'Family Law',
  'Administrative Law',
  'International Law'
];

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ 
  activeCategory,
  onCategorySelect 
}) => {
  const [location] = useLocation();
  const { user } = useAuth();
  const { useUserFavorites } = useFavorites();
  const { data: favorites } = useUserFavorites();
  
  const handleExportPDF = () => {
    if (favorites && user) {
      exportToPDF(favorites, user.displayName || user.username);
    }
  };
  
  const handleExportCSV = () => {
    if (favorites) {
      exportToCSV(favorites);
    }
  };

  return (
    <div className="space-y-6">
      <nav className="sticky top-20 space-y-1">
        <Link href="/dashboard">
          <a className={cn(
            "flex items-center px-3 py-2 text-sm font-medium rounded-md",
            location === "/dashboard" 
              ? "bg-primary-light/10 text-primary-dark" 
              : "text-neutral-700 hover:bg-neutral-100",
          )}>
            <BookOpen className="mr-3 h-5 w-5 text-primary" />
            All Terms
          </a>
        </Link>
        
        <Link href="/dashboard/favorites">
          <a className={cn(
            "flex items-center px-3 py-2 text-sm font-medium rounded-md",
            location === "/dashboard/favorites" 
              ? "bg-primary-light/10 text-primary-dark" 
              : "text-neutral-700 hover:bg-neutral-100",
          )}>
            <Bookmark className="mr-3 h-5 w-5 text-neutral-500 group-hover:text-neutral-600" />
            My Favorites
          </a>
        </Link>
        
        <Link href="/dashboard/recent">
          <a className={cn(
            "flex items-center px-3 py-2 text-sm font-medium rounded-md",
            location === "/dashboard/recent" 
              ? "bg-primary-light/10 text-primary-dark" 
              : "text-neutral-700 hover:bg-neutral-100",
          )}>
            <History className="mr-3 h-5 w-5 text-neutral-500 group-hover:text-neutral-600" />
            Recently Viewed
          </a>
        </Link>
        
        <Link href="/dashboard/contributions">
          <a className={cn(
            "flex items-center px-3 py-2 text-sm font-medium rounded-md",
            location === "/dashboard/contributions" 
              ? "bg-primary-light/10 text-primary-dark" 
              : "text-neutral-700 hover:bg-neutral-100",
          )}>
            <Edit className="mr-3 h-5 w-5 text-neutral-500 group-hover:text-neutral-600" />
            My Contributions
          </a>
        </Link>
      </nav>
      
      <div className="pt-4 mt-4 border-t border-neutral-200">
        <h3 className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Categories</h3>
        <ScrollArea className="h-[200px] mt-2">
          <div className="space-y-1 pr-3">
            {categories.map((category) => (
              <Button
                key={category}
                variant="ghost"
                className={cn(
                  "w-full justify-start font-normal text-sm px-3 py-2",
                  activeCategory === category ? "bg-primary-light/10 text-primary-dark" : ""
                )}
                onClick={() => onCategorySelect && onCategorySelect(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </ScrollArea>
        <Link href="/dashboard/categories">
          <a className="text-primary hover:text-primary-light text-sm px-3 flex items-center mt-2">
            View all categories
            <ChevronRight className="h-4 w-4 ml-1" />
          </a>
        </Link>
      </div>
      
      <Card>
        <CardHeader className="bg-primary-light/5 border-b border-neutral-200 py-4">
          <CardTitle className="text-sm font-medium text-primary-dark">Your Stats</CardTitle>
        </CardHeader>
        <CardContent className="py-4">
          <dl className="grid grid-cols-1 gap-y-4">
            <div>
              <dt className="text-sm font-medium text-neutral-500">Favorite Terms</dt>
              <dd className="mt-1 text-sm text-neutral-900">{favorites?.length || 0}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-neutral-500">Contributions</dt>
              <dd className="mt-1 text-sm text-neutral-900">2</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-neutral-500">Last Login</dt>
              <dd className="mt-1 text-sm text-neutral-900">{new Date().toLocaleDateString()}</dd>
            </div>
          </dl>
        </CardContent>
        <Separator />
        <CardFooter className="pt-4 flex flex-col items-start space-y-2">
          <Button 
            variant="link" 
            className="text-sm text-primary hover:text-primary-light p-0 h-auto"
            onClick={handleExportPDF}
            disabled={!favorites || favorites.length === 0}
          >
            Download favorites as PDF
          </Button>
          <Button 
            variant="link" 
            className="text-sm text-primary hover:text-primary-light p-0 h-auto"
            onClick={handleExportCSV}
            disabled={!favorites || favorites.length === 0}
          >
            Download favorites as CSV
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DashboardSidebar;
