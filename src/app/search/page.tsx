import React from 'react';
import Navigation from '@/components/NavBar';
import CigaretteSearchClient from '@/components/CigaretteSearchClient';

const SearchPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navigation />
      <CigaretteSearchClient />
    </div>
  );
};

export default SearchPage;
