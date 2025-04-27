import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  ScaleIcon, 
  MenuIcon, 
  XIcon, 
  SearchIcon, 
  BellIcon 
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useAuthContext } from '@/context/AuthContext';
import { signOut } from '@/lib/firebase';
import AuthModal from '@/components/auth/AuthModal';

const Navbar: React.FC = () => {
  const [location, navigate] = useLocation();
  const { currentUser, firebaseUser } = useAuthContext();
  const isAuthenticated = !!currentUser;
  const isAdmin = currentUser?.isAdmin || false;
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/dashboard?search=${encodeURIComponent(searchQuery)}`);
      setMenuOpen(false);
    }
  };
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-neutral-200 fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              {/* Logo */}
              <Link href="/" className="flex-shrink-0 flex items-center">
                <ScaleIcon className="h-8 w-8 text-primary mr-2" />
                <span className="font-serif text-xl font-bold tracking-tight text-primary">LawLexicon</span>
              </Link>
              
              {/* Desktop Navigation Links */}
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                <div className="space-x-4">
                  <Link href="/">
                    <a className={`px-3 py-5 text-sm font-medium transition-colors duration-150 ${
                      location === '/' 
                        ? 'text-primary-dark border-b-2 border-primary font-medium' 
                        : 'text-neutral-700 hover:text-primary-light'
                    }`}>
                      Home
                    </a>
                  </Link>
                  
                  <Link href="/dashboard">
                    <a className={`px-3 py-5 text-sm font-medium transition-colors duration-150 ${
                      location.startsWith('/dashboard') 
                        ? 'text-primary-dark border-b-2 border-primary font-medium' 
                        : 'text-neutral-700 hover:text-primary-light'
                    }`}>
                      Dictionary
                    </a>
                  </Link>

                  <Link href="/notes">
                    <a className={`px-3 py-5 text-sm font-medium transition-colors duration-150 ${
                      location.startsWith('/notes') 
                        ? 'text-primary-dark border-b-2 border-primary font-medium' 
                        : 'text-neutral-700 hover:text-primary-light'
                    }`}>
                      Law Notes
                    </a>
                  </Link>
                  
                  {isAuthenticated && isAdmin && (
                    <Link href="/admin">
                      <a className={`px-3 py-5 text-sm font-medium transition-colors duration-150 ${
                        location.startsWith('/admin') 
                          ? 'text-primary-dark border-b-2 border-primary font-medium' 
                          : 'text-neutral-700 hover:text-primary-light'
                      }`}>
                        Admin
                      </a>
                    </Link>
                  )}
                </div>
              </div>
            </div>
            
            {/* Search Box (Desktop) */}
            <div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
              <div className="max-w-lg w-full lg:max-w-xs hidden md:block">
                <form onSubmit={handleSearch}>
                  <label htmlFor="search" className="sr-only">Search</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <SearchIcon className="h-5 w-5 text-neutral-500" />
                    </div>
                    <Input
                      id="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2"
                      placeholder="Search legal terms"
                      type="search"
                    />
                  </div>
                </form>
              </div>
            </div>
            
            {/* Right side menu */}
            <div className="flex items-center">
              {/* Login/Account Button */}
              <div className="ml-4 relative flex-shrink-0">
                {!isAuthenticated ? (
                  <Button 
                    onClick={() => setShowAuthModal(true)} 
                    variant="ghost"
                    className="text-sm font-medium text-neutral-700 hover:text-primary-light"
                  >
                    Sign In
                  </Button>
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="p-0 h-8 w-8 rounded-full relative">
                        <Avatar className="h-8 w-8 bg-primary">
                          <AvatarImage src={currentUser?.profilePicture || ''} alt={currentUser?.displayName || 'User'} />
                          <AvatarFallback className="bg-primary text-white">
                            {currentUser?.displayName?.charAt(0) || currentUser?.username?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-secondary transform translate-x-1/4 -translate-y-1/4"></span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem className="focus:bg-neutral-100">
                        <Link href="/profile">Your Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="focus:bg-neutral-100">
                        <Link href="/settings">Settings</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut} className="focus:bg-neutral-100">
                        Sign out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
              
              {/* Mobile Menu Button */}
              <div className="flex items-center sm:hidden ml-4">
                <Button 
                  onClick={() => setMenuOpen(!menuOpen)} 
                  variant="ghost" 
                  size="icon"
                  className="text-neutral-600 hover:text-neutral-900"
                >
                  <span className="sr-only">Open main menu</span>
                  {menuOpen ? (
                    <XIcon className="h-6 w-6" />
                  ) : (
                    <MenuIcon className="h-6 w-6" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {menuOpen && (
          <div className="sm:hidden" id="mobile-menu">
            <div className="pt-2 pb-3 space-y-1">
              <Link href="/">
                <a
                  className={`block pl-3 pr-4 py-2 text-base font-medium w-full text-left ${
                    location === '/'
                      ? 'bg-primary-light text-white'
                      : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  Home
                </a>
              </Link>
              
              <Link href="/dashboard">
                <a
                  className={`block pl-3 pr-4 py-2 text-base font-medium w-full text-left ${
                    location.startsWith('/dashboard')
                      ? 'bg-primary-light text-white'
                      : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  Dictionary
                </a>
              </Link>

              <Link href="/notes">
                <a
                  className={`block pl-3 pr-4 py-2 text-base font-medium w-full text-left ${
                    location.startsWith('/notes')
                      ? 'bg-primary-light text-white'
                      : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  Law Notes
                </a>
              </Link>
              
              {isAuthenticated && isAdmin && (
                <Link href="/admin">
                  <a
                    className={`block pl-3 pr-4 py-2 text-base font-medium w-full text-left ${
                      location.startsWith('/admin')
                        ? 'bg-primary-light text-white'
                        : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900'
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    Admin
                  </a>
                </Link>
              )}
            </div>
            
            {/* Mobile Search */}
            <div className="pt-2 pb-3 px-4">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-neutral-500" />
                  </div>
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2"
                    placeholder="Search legal terms"
                    type="search"
                  />
                </div>
              </form>
            </div>
          </div>
        )}
      </nav>

      <AuthModal open={showAuthModal} setOpen={setShowAuthModal} />
    </>
  );
};

export default Navbar;
