import React from 'react';
import { Link } from 'wouter';
import { Facebook, Twitter, Linkedin, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-neutral-200 mt-12">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start space-x-6">
            <Link href="/about">
              <span className="text-neutral-500 hover:text-neutral-900 cursor-pointer">About</span>
            </Link>
            <Link href="/terms">
              <span className="text-neutral-500 hover:text-neutral-900 cursor-pointer">Terms</span>
            </Link>
            <Link href="/privacy">
              <span className="text-neutral-500 hover:text-neutral-900 cursor-pointer">Privacy</span>
            </Link>
            <Link href="/contact">
              <span className="text-neutral-500 hover:text-neutral-900 cursor-pointer">Contact</span>
            </Link>
          </div>
          <div className="mt-8 md:mt-0">
            <div className="text-center md:text-right">
              <p className="text-base text-neutral-500">
                &copy; {new Date().getFullYear()} LawLexicon. All rights reserved.
              </p>
              <p className="text-sm text-neutral-500 flex items-center justify-center md:justify-end mt-1">
                Created with <Heart className="h-4 w-4 mx-1 text-red-500 animate-pulse" /> from Latur
              </p>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-neutral-200 pt-8 md:flex md:items-center md:justify-between">
          <div>
            <p className="text-sm text-neutral-500 text-center md:text-left">
              LawLexicon is a comprehensive legal dictionary and learning resource for students, professionals, 
              and anyone interested in legal terminology.
            </p>
          </div>
          <div className="mt-8 md:mt-0 flex justify-center md:justify-end space-x-6">
            <a href="#" className="text-neutral-500 hover:text-neutral-900" aria-label="Facebook">
              <span className="sr-only">Facebook</span>
              <Facebook className="h-6 w-6" />
            </a>
            <a href="#" className="text-neutral-500 hover:text-neutral-900" aria-label="Twitter">
              <span className="sr-only">Twitter</span>
              <Twitter className="h-6 w-6" />
            </a>
            <a href="#" className="text-neutral-500 hover:text-neutral-900" aria-label="LinkedIn">
              <span className="sr-only">LinkedIn</span>
              <Linkedin className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
