import React from 'react';
import Navigation from '@/components/NavBar';
import HomePageClient from '@/components/HomePageClient'; 
import { dbConnect } from '../../utils/dbConnect/dbConnect';

const HomePage: React.FC = async () => {
  const connection = await dbConnect();
  console.log(connection.readyState);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navigation />
      <HomePageClient />
    </div>
  );
};

export default HomePage;