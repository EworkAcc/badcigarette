import React from 'react';
import connectDB from '@/lib/connectDB';
import subCigarettes from '@/models/subCigarettes';
import { calculateOverallRating } from '@/lib/ratingCalculator';
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
  type: string;
  posts: any[];
  score: number; 
}

interface TopCigarettesPageProps {
  topCigarettes: SubCigarette[];
}

function getTypeDisplayName(type: string): string {
  const typeMap: { [key: string]: string } = {
    'r': 'Regular',
    'l': 'Light',
    'ul': 'Ultra Light',
    'm': 'Menthol'
  };
  return typeMap[type] || 'Unknown';
}

// Calculate ranking score based on rating and review count
function calculateRankingScore(rating: number, reviewCount: number): number {
  if (reviewCount === 0) return 0;
  
  // Wilson score confidence interval for a Bernoulli parameter
  // This gives a lower bound on the "true" rating with statistical confidence
  const positiveRatings = (rating / 5) * reviewCount; // Convert 5-star to ratio
  const totalRatings = reviewCount;
  
  if (totalRatings === 0) return 0;
  
  const z = 1.96; // 95% confidence
  const phat = positiveRatings / totalRatings;
  const score = (phat + z * z / (2 * totalRatings) - z * Math.sqrt((phat * (1 - phat) + z * z / (4 * totalRatings)) / totalRatings)) / (1 + z * z / totalRatings);
  
  const baseScore = score * 5;
  const reviewBonus = Math.log(reviewCount + 1) * 0.1; // Logarithmic bonus for review count
  
  return baseScore + reviewBonus;
}

async function getTopCigarettes(): Promise<SubCigarette[]> {
  try {
    await connectDB();
    
    const cigarettes = await subCigarettes
      .find({})
      .select('id name description rating noOfReviews type posts')
      .lean();
    
    const processedCigarettes = cigarettes.map(cig => {
      const serializedPosts = (cig.posts || []).map((post: any) => ({
        id: post.id || post._id?.toString(),
        title: post.title || 'Untitled Review',
        body: post.body || '',
        user: post.user || 'Anonymous',
        userImage: post.userImage || '/defaultPFP.png',
        rating: post.rating || 0,
        createdAt: post.createdAt ? post.createdAt.toISOString() : new Date().toISOString(),
        updatedAt: post.updatedAt ? post.updatedAt.toISOString() : new Date().toISOString(),
        votes: post.votes ? {
          id: post.votes.id || post.votes._id?.toString(),
          noOfUpvotes: post.votes.noOfUpvotes || 0,
          noOfDownvotes: post.votes.noOfDownvotes || 0,
          userUp: post.votes.userUp || [],
          userDown: post.votes.userDown || []
        } : {
          id: '',
          noOfUpvotes: post.upvotes || 0,
          noOfDownvotes: post.downvotes || 0,
          userUp: [],
          userDown: []
        },
        comments: (post.comments || []).map((comment: any) => ({
          id: comment.id || comment._id?.toString(),
          body: comment.body || '',
          user: comment.user || 'Anonymous',
          rating: comment.rating || 0,
          createdAt: comment.createdAt ? comment.createdAt.toISOString() : new Date().toISOString()
        }))
      }));

      const { rating: realRating, totalReviews } = calculateOverallRating(serializedPosts);
      const rankingScore = calculateRankingScore(realRating, totalReviews);

      return {
        id: cig.id || cig._id?.toString(),
        name: cig.name,
        description: cig.description,
        rating: realRating,
        noOfReviews: totalReviews,
        type: cig.type || 'r',
        posts: serializedPosts,
        score: rankingScore
      };
    });

    // Sort by ranking score instead of just rating
    return processedCigarettes
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
      
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
          Discover the highest rated cigarettes based on community reviews, ratings, and review volume.
        </p>
        <p className="text-sm text-gray-400 mt-2">
          Rankings consider both average rating and number of reviews to provide more reliable results.
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
                <div className="relative">
                  <CigaretteCard
                    name={cigarette.name}
                    description={cigarette.description}
                    id={cigarette.id}
                    rating={cigarette.rating}
                    noOfReviews={cigarette.noOfReviews}
                    reviews={cigarette.posts.length}
                  />
                  {/* Type badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      cigarette.type === 'r' ? 'bg-gray-600 text-gray-200' :
                      cigarette.type === 'l' ? 'bg-blue-600 text-blue-200' :
                      cigarette.type === 'ul' ? 'bg-sky-600 text-sky-200' :
                      cigarette.type === 'm' ? 'bg-green-600 text-green-200' :
                      'bg-gray-600 text-gray-200'
                    }`}>
                      {getTypeDisplayName(cigarette.type)}
                    </span>
                  </div>
                  {/* Ranking score for debugging - remove in production */}
                  <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                    Score: {cigarette.score.toFixed(2)}
                  </div>
                </div>
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