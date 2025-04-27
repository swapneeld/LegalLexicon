import React from 'react';
import { Link } from 'wouter';
import { Facebook, Twitter, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-neutral-200 mt-12">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start space-x-6">
            <Link href="/about">
              <a className="text-neutral-500 hover:text-neutral-900">About</a>
            </Link>
            <Link href="/terms">
              <a className="text-neutral-500 hover:text-neutral-900">Terms</a>
            </Link>
            <Link href="/privacy">
              <a className="text-neutral-500 hover:text-neutral-900">Privacy</a>
            </Link>
            <Link href="/contact">
              <a className="text-neutral-500 hover:text-neutral-900">Contact</a>
            </Link>
          </div>
          <div className="mt-8 md:mt-0">
            <p className="text-center md:text-right text-base text-neutral-500">
              &copy; {new Date().getFullYear()} LawLexicon. All rights reserved.
            </p>
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
