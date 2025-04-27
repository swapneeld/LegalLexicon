import React, { useState, useEffect } from 'react';
import { useLocation, useSearch } from 'wouter';
import { useTerms } from '@/hooks/useTerms';
import DashboardSidebar from '@/components/sidebar/DashboardSidebar';
import TermsGrid from '@/components/terms/TermsGrid';
import MobileFilterBar from '@/components/dashboard/MobileFilterBar';
import DesktopFilterBar from '@/components/dashboard/DesktopFilterBar';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/hooks/useAuth';
import AuthModal from '@/components/auth/AuthModal';

interface DashboardProps {
  section?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ section = 'all' }) => {
  const [location] = useLocation();
  const search = useSearch();
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [sort, setSort] = useState('name_asc');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { isAuthenticated } = useAuth();
  const { useAllTerms, useSearchTerms } = useTerms();
  const { useUserFavorites } = useFavorites();

  // Extract search query from URL if present
  useEffect(() => {
    const params = new URLSearchParams(search);
    const query = params.get('search');
    if (query) {
      setSearchQuery(query);
    }
  }, [search]);

  // Handle section-specific data fetching
  const { data: terms, isLoading: isLoadingTerms } = useAllTerms(page, limit);
  const { data: favorites, isLoading: isLoadingFavorites } = useUserFavorites();
  const { data: searchResults, isLoading: isLoadingSearch } = useSearchTerms(searchQuery, page, limit);

  // Determine which data to display based on section
  const displayTerms = searchQuery 
    ? searchResults 
    : section === 'favorites' 
      ? favorites 
      : terms;
  
  const isLoading = searchQuery 
    ? isLoadingSearch 
    : section === 'favorites' 
      ? isLoadingFavorites 
      : isLoadingTerms;

  // Handle category selection
  const handleCategorySelect = (category: string) => {
    setActiveCategory(category === activeCategory ? undefined : category);
  };

  // Filter terms by category if selected
  const filteredTerms = activeCategory && displayTerms
    ? displayTerms.filter(term => term.category === activeCategory)
    : displayTerms;

  // Redirect to login if trying to access user-specific sections while not authenticated
  useEffect(() => {
    if (!isAuthenticated && (section === 'favorites' || section === 'contributions')) {
      setShowAuthModal(true);
    }
  }, [isAuthenticated, section]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        {/* Sidebar for Desktop */}
        <div className="hidden lg:block lg:col-span-3">
          <DashboardSidebar 
            activeCategory={activeCategory} 
            onCategorySelect={handleCategorySelect} 
          />
        </div>
        
        {/* Main Content Area */}
        <div className="mt-8 lg:mt-0 lg:col-span-9">
          {/* Mobile Filter Bar */}
          <MobileFilterBar 
            section={section} 
            onCategorySelect={handleCategorySelect}
            activeCategory={activeCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          
          {/* Desktop Filter Bar */}
          <DesktopFilterBar 
            totalCount={filteredTerms?.length || 0}
            sort={sort}
            setSort={setSort}
          />
          
          {/* Terms Grid */}
          <TermsGrid 
            terms={filteredTerms || []} 
            isLoading={isLoading} 
            page={page}
            setPage={setPage}
            totalPages={Math.ceil((filteredTerms?.length || 0) / limit)}
          />
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal open={showAuthModal} setOpen={setShowAuthModal} />
    </div>
  );
};

export default Dashboard;
