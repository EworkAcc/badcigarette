import React from 'react';
import { notFound } from 'next/navigation';
import connectDB from '../../../lib/connectDB';
import subCigarettes from '../../../models/subCigarettes';
import Navigation from '../../../components/NavBar';
import ClientSideWrapper from '../../../components/ClientSideWrapper';

interface SubCigarette {
  id: string;
  name: string;
  description: string;
  rating: number;
  noOfReviews: number;
  posts: any[];
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getCigaretteById(id: string): Promise<SubCigarette | null> {
  try {
    await connectDB();
   
    const cigarette = await subCigarettes
      .findOne({ id })
      .select('id name description rating noOfReviews posts')
      .lean() as any;
   
    if (!cigarette) {
      return null;
    }
   
    return {
      id: cigarette.id || cigarette._id?.toString(),
      name: cigarette.name,
      description: cigarette.description,
      rating: cigarette.rating || 0,
      noOfReviews: cigarette.noOfReviews || 0,
      posts: cigarette.posts || []
    };
  } catch (error) {
    console.error('Error fetching cigarette:', error);
    return null;
  }
}

const CigarettePage: React.FC<PageProps> = async ({ params }) => {
  const { id } = await params;
  const cigarette = await getCigaretteById(id);
  
  if (!cigarette) {
    notFound();
  }

  const realRating = cigarette.posts.length > 0 
    ? cigarette.posts.reduce((acc: number, post: any) => acc + (post.rating || 0), 0) / cigarette.posts.length
    : cigarette.rating || 0;
 
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Navigation/>
      </div>
     
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg p-8 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-4xl font-bold text-white">{cigarette.name}</h1>
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <span className="text-yellow-400 text-2xl">★</span>
              <span className="text-xl font-semibold text-white ml-1">
                {realRating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
        <p className="text-xl text-gray-300">
          {cigarette.description}
        </p>
        <div className="mt-4 text-gray-400">
          <p>Reviews: {cigarette.posts.length}</p>
          <p>ID: {cigarette.id}</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-red-400">About {cigarette.name}</h2>
            <p className="text-gray-300 leading-relaxed">
              {cigarette.description}
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-red-400">
              Reviews ({cigarette.posts.length})
            </h2>
            {cigarette.posts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">No reviews yet.</p>
                <p className="text-gray-500 text-sm mt-2">
                  Be the first to leave a review!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {cigarette.posts.map((post: any, index: number) => (
                  <div key={index} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      {post.userImage && (
                        <img 
                          src={post.userImage} 
                          alt={post.user || 'User'}
                          className="w-10 h-10 rounded-full"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-white font-medium">{post.user || 'Anonymous'}</span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, starIndex) => (
                              <span
                                key={starIndex}
                                className={`text-sm ${
                                  starIndex < (post.rating || 0) 
                                    ? 'text-yellow-400' 
                                    : 'text-gray-500'
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-300">{post.body || post.content || 'No review content'}</p>
                        <div className="mt-2 text-sm text-gray-400">
                          {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Recently'}
                        </div>
                        
                        <div className="flex items-center space-x-4 mt-3">
                          <div className="flex items-center space-x-1">
                            <button className="text-gray-400 hover:text-green-400 transition-colors">
                              ↑
                            </button>
                            <span className="text-sm text-gray-300">
                              {(post.upvotes || 0) - (post.downvotes || 0)}
                            </span>
                            <button className="text-gray-400 hover:text-red-400 transition-colors">
                              ↓
                            </button>
                          </div>
                          <button className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
                            💬 {post.comments?.length || 0} comments
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4 text-red-400">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Overall Rating:</span>
                <span className="text-white font-semibold">{realRating.toFixed(1)}/5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Reviews:</span>
                <span className="text-white font-semibold">{cigarette.posts.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Cigarette ID:</span>
                <span className="text-white font-semibold text-sm">{cigarette.id}</span>
              </div>
            </div>
          </div>

          <ClientSideWrapper cigaretteId={cigarette.id} />
        </div>
      </div>

      <div className="bg-red-900 border border-red-700 rounded-lg p-6 mt-8">
        <h3 className="text-lg font-semibold mb-2 text-red-300">Health Warning</h3>
        <p className="text-sm text-red-200 mb-3">
          Smoking cigarettes causes cancer, heart disease, stroke, lung diseases, diabetes, and COPD.
          Quitting smoking greatly reduces your risk of disease and death.
        </p>
        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium">
          Get Help Quitting
        </button>
      </div>

      <div className="mt-8 text-center">
        <a
          href="/subCigarettes"
          className="inline-flex items-center text-red-400 hover:text-red-300 font-medium"
        >
          ← Back to Top Cigarettes
        </a>
      </div>
    </div>
  );
};

export default CigarettePage;