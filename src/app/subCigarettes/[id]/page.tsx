import React from 'react';
import { notFound } from 'next/navigation';
import connectDB from '@/lib/connectDB';
import subCigarettes from '@/models/subCigarettes';
import { calculateOverallRating } from '@/lib/ratingCalculator';
import Navigation from '@/components/NavBar';
import ClientSideWrapper from '@/components/ClientSideWrapper';
import CigarettePostsList from '@/components/CigPostList';

interface SubCigarette {
  id: string;
  name: string;
  description: string;
  rating: number;
  noOfReviews: number;
  type: string;
  posts: any[];
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
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

function getTypeColor(type: string): string {
  const colorMap: { [key: string]: string } = {
    'r': 'bg-gray-600 text-gray-200',
    'l': 'bg-blue-600 text-blue-200',
    'ul': 'bg-sky-600 text-sky-200',
    'm': 'bg-green-600 text-green-200'
  };
  return colorMap[type] || 'bg-gray-600 text-gray-200';
}

async function getCigaretteById(id: string): Promise<SubCigarette | null> {
  try {
    await connectDB();
   
    const cigarette = await subCigarettes
      .findOne({ id })
      .select('id name description rating noOfReviews type posts')
      .lean() as any;
   
    if (!cigarette) {
      return null;
    }

    const serializedPosts = (cigarette.posts || []).map((post: any) => ({
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
   
    return {
      id: cigarette.id || cigarette._id?.toString(),
      name: cigarette.name,
      description: cigarette.description,
      rating: realRating,
      noOfReviews: totalReviews,
      type: cigarette.type || 'r',
      posts: serializedPosts
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
 
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navigation/>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
     
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-4xl font-bold text-red-400">{cigarette.name}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(cigarette.type)}`}>
                {getTypeDisplayName(cigarette.type)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <span className="text-yellow-400 text-2xl">★</span>
                <span className="text-xl font-semibold text-white ml-1">
                  {cigarette.rating.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
          <p className="text-xl text-gray-300">
            {cigarette.description}
          </p>
          <div className="mt-4 text-gray-400">
            <p>Total Reviews: {cigarette.noOfReviews} (including posts and comments)</p>
            <p>Posts: {cigarette.posts.length}</p>
            <p>Type: {getTypeDisplayName(cigarette.type)}</p>
            <p>ID: {cigarette.id}</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-red-400">About {cigarette.name}</h2>
              <div className="flex items-center mb-3">
                <span className="text-gray-400 mr-2">Type:</span>
                <span className={`px-2 py-1 rounded text-sm font-medium ${getTypeColor(cigarette.type)}`}>
                  {getTypeDisplayName(cigarette.type)}
                </span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                {cigarette.description}
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 text-red-400">
                Posts ({cigarette.posts.length})
              </h2>
              <CigarettePostsList posts={cigarette.posts} />
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4 text-red-400">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Overall Rating:</span>
                  <span className="text-white font-semibold">{cigarette.rating.toFixed(1)}/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Reviews:</span>
                  <span className="text-white font-semibold">{cigarette.noOfReviews}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Posts:</span>
                  <span className="text-white font-semibold">{cigarette.posts.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Type:</span>
                  <span className="text-white font-semibold">{getTypeDisplayName(cigarette.type)}</span>
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
    </div>
  );
};

export default CigarettePage;