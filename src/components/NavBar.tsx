"use client";

import React, { useState } from 'react';
import Link from 'next/link';

const Navigation: React.FC = () => {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <nav className="bg-gray-900 border-b border-gray-700">
      <div className="bg-gray-800 text-center py-2 text-sm text-gray-300">
        <span className="font-semibold">10% of profits donated to <span className = "text-blue-300 underline hover:text-blue-400"><Link href = "https://truthinitiative.org/">Truth Initiative</Link></span></span> | Fighting tobacco addiction through awareness
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href = "./" className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="text-white">
                <h1 className="text-2xl font-bold text-red-500">Bad Cigarettes</h1>
                <p className="text-xs text-gray-400 mt-1">CIGARETTES ARE BAD</p>
              </div>
            </div>
          </Link>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="./" className="text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Home
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Cigarettes
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Reviews
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Forums
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Stores
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Events
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Magazine
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link href = "../signon" className="bg-red-600 hover:bg-red-700 text-white px-8 py-2 rounded-md text-sm font-medium">
              Sign On
            </Link>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-400 hover:text-white hover:bg-gray-700 p-2 rounded-md"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-700">
              <Link href="#" className="text-gray-300 hover:text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium">
                Home
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium">
                Cigarettes
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium">
                Reviews
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium">
                Forums
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium">
                Stores
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium">
                Events
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium">
                Magazine
              </Link>
              <div className="pt-4 pb-3 border-t border-gray-700">
                <div className="space-y-1">
                  <Link href = "../app/signon" className = "w-full bg-red-600 hover:bg-red-700 text-white px-8 py-2 rounded-md text-sm font-medium">
                    Sign On
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;