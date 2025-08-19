import React, { Suspense } from 'react';
import Navigation from '@/components/NavBar';
import CigaretteSearchClient from '@/components/CigaretteSearchClient';

const SearchPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen bg-gray-900 text-white">
        <Navigation />
        <CigaretteSearchClient />
      </div>
    </Suspense>
  );
};

export default SearchPage;
