import React from 'react';
import connectDB from '@/lib/connectDB';
import subCigarettes from '@/models/subCigarettes';
import CigaretteCard from '@/components/SubCigCard';
import AddCigaretteForm from '@/components/AddSubCig';
import Navigation from '@/components/NavBar';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

interface SubCigarette {
  id: string;
  name: string;
  description: string;
  rating: number;
  noOfReviews: number;
  posts: any[];
}

interface TopCigarettesPageProps {
  topCigarettes: SubCigarette[];
}

async function getTopCigarettes(): Promise<SubCigarette[]> {
  try {
    await connectDB();
    
    const cigarettes = await subCigarettes
      .find({})
      .sort({ rating: -1 })
      .limit(5)
      .select('id name description rating posts')
      .lean();
    
    return cigarettes.map(cig => ({
      id: cig.id,
      name: cig.name,
      description: cig.description,
      rating: cig.rating || 0,
      noOfReviews: cig.noOfReviews || 0,
      posts: cig.posts || []
    }));
  } catch (error) {
    console.error('Error fetching top cigarettes:', error);
    return [];
  }
}

const TopCigarettesPage: React.FC = async () => {
  const topCigarettes = await getTopCigarettes();
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Navigation/>
      </div>
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg p-8 mb-8">
        <h1 className="text-4xl font-bold mb-4">Top Rated Cigarettes</h1>
        <p className="text-xl text-gray-300">
          Discover the highest rated cigarettes based on community reviews and ratings.
        </p>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-red-400">
          {topCigarettes.length === 0 
            ? 'No Cigarettes Found' 
            : `Top ${topCigarettes.length} Cigarettes`}
        </h2>
        
        {topCigarettes.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-300 text-lg mb-4">
              No cigarettes have been added to the database yet.
            </p>
            <p className="text-gray-400">
              Be the first to add a cigarette using the form below!
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {topCigarettes.map((cigarette, index) => (
              <div key={cigarette.id} className="relative">
                <div className="absolute -top-2 -left-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold z-10">
                  #{index + 1}
                </div>
                <CigaretteCard
                  name={cigarette.name}
                  description={cigarette.description}
                  id={cigarette.id}
                  rating={cigarette.rating}
                  noOfReviews={cigarette.noOfReviews}
                  reviews={cigarette.posts.length}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-red-900 border border-red-700 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold mb-2 text-red-300">Health Warning</h3>
        <p className="text-sm text-red-200 mb-3">
          Smoking cigarettes causes cancer, heart disease, stroke, lung diseases, diabetes, and COPD. 
          Quitting smoking greatly reduces your risk of disease and death.
        </p>
        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium">
          Get Help Quitting
        </button>
      </div>

      <AddCigaretteForm />
    </div>
  );
};

export default TopCigarettesPage;