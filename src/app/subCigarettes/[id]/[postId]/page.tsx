import React from 'react';
import { notFound } from 'next/navigation';
import connectDB from '@/lib/connectDB';
import subCigarettes from '@/models/subCigarettes';
import Navigation from '@/components/NavBar';
import CommentSection from '@/components/CommentSection';
import UserAvatar from '@/components/UserAvatar';

interface Post {
  id: string;
  title: string;
  body: string;
  user: string;
  userEmail: string;
  userImage: string;
  rating: number;
  createdAt: string;
  votes: {
    id: string;
    noOfUpvotes: number;
    noOfDownvotes: number;
    userUp: string[];
    userDown: string[];
  };
  comments: any[];
}

interface SubCigarette {
  id: string;
  name: string;
  description: string;
}

interface PageProps {
  params: Promise<{
    id: string;
    postId: string;
  }>;
}

async function getPostById(cigaretteId: string, postId: string): Promise<{ post: Post; cigarette: SubCigarette } | null> {
  try {
    await connectDB();
    
    const subCigarette = await subCigarettes
      .findOne({ id: cigaretteId })
      .select('id name description posts')
      .lean() as any;
    
    if (!subCigarette) {
      return null;
    }

    const post = subCigarette.posts.find((p: any) => p.id === postId);
    
    if (!post) {
      return null;
    }

    const serializedPost = {
      id: post.id || post._id?.toString(),
      title: post.title || 'Untitled Review',
      body: post.body || '',
      user: post.user || 'Anonymous',
      userEmail: post.userEmail || '',
      userImage: post.userImage || '/defaultPFP.png',
      rating: post.rating || 0,
      createdAt: post.createdAt ? post.createdAt.toISOString() : new Date().toISOString(),
      votes: post.votes ? {
        id: post.votes.id || post.votes._id?.toString(),
        noOfUpvotes: post.votes.noOfUpvotes || 0,
        noOfDownvotes: post.votes.noOfDownvotes || 0,
        userUp: post.votes.userUp || [],
        userDown: post.votes.userDown || []
      } : {
        id: '',
        noOfUpvotes: 0,
        noOfDownvotes: 0,
        userUp: [],
        userDown: []
      },
      comments: (post.comments || []).map((comment: any) => ({
        id: comment.id || comment._id?.toString(),
        body: comment.body || '',
        user: comment.user || 'Anonymous',
        userEmail: comment.userEmail || '',
        userImage: comment.userImage || '/defaultPFP.png',
        rating: comment.rating || 0,
        parentId: comment.parentId || null,
        replyingTo: comment.replyingTo || null,
        depth: comment.depth || 0,
        createdAt: comment.createdAt ? comment.createdAt.toISOString() : new Date().toISOString(),
        votes: comment.votes ? {
          id: comment.votes.id || comment.votes._id?.toString(),
          noOfUpvotes: comment.votes.noOfUpvotes || 0,
          noOfDownvotes: comment.votes.noOfDownvotes || 0,
          userUp: comment.votes.userUp || [],
          userDown: comment.votes.userDown || []
        } : {
          id: '',
          noOfUpvotes: 0,
          noOfDownvotes: 0,
          userUp: [],
          userDown: []
        }
      }))
    };

    const cigarette = {
      id: subCigarette.id || subCigarette._id?.toString(),
      name: subCigarette.name,
      description: subCigarette.description
    };

    return { post: serializedPost, cigarette };
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

const IndividualPostPage: React.FC<PageProps> = async ({ params }) => {
  const { id: cigaretteId, postId } = await params;
  const result = await getPostById(cigaretteId, postId);
  
  if (!result) {
    notFound();
  }

  const { post, cigarette } = result;
  const netVotes = (post.votes.noOfUpvotes || 0) - (post.votes.noOfDownvotes || 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Navigation />
      </div>

      <div className="mb-6">
        <nav className="text-sm text-gray-400">
          <a href="/subCigarettes" className="hover:text-red-400">
            Cigarettes
          </a>
          <span className="mx-2">›</span>
          <a href={`/subCigarettes/${cigaretteId}`} className="hover:text-red-400">
            {cigarette.name}
          </a>
          <span className="mx-2">›</span>
          <span className="text-white">{post.title}</span>
        </nav>
      </div>

      {/* Main Post */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <div className="flex items-start space-x-4">
          <UserAvatar 
            src={post.userImage}
            alt={post.user}
            className="w-12 h-12 rounded-full"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className="text-white font-semibold text-lg">{post.user}</span>
                <div className="flex items-center space-x-1">
                  <span className="text-gray-400 text-sm">rated</span>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, starIndex) => (
                      <span
                        key={starIndex}
                        className={`text-lg ${
                          starIndex < post.rating
                            ? 'text-yellow-400'
                            : 'text-gray-500'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-gray-400 text-sm">for {cigarette.name}</span>
                </div>
              </div>
              <div className="text-sm text-gray-400">
                {new Date(post.createdAt).toLocaleDateString()}
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-4">{post.title}</h1>
            <p className="text-gray-300 text-lg leading-relaxed mb-4">{post.body}</p>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <button className="text-gray-400 hover:text-green-400 transition-colors">
                  ↑
                </button>
                <span className="text-white font-medium">{netVotes}</span>
                <button className="text-gray-400 hover:text-red-400 transition-colors">
                  ↓
                </button>
              </div>
              <span className="text-gray-400 text-sm">
                💬 {post.comments.length} comments
              </span>
            </div>
          </div>
        </div>
      </div>

      <CommentSection 
        postId={postId}
        cigaretteId={cigaretteId}
        cigaretteName={cigarette.name}
        initialComments={post.comments}
      />

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
          href={`/subCigarettes/${cigaretteId}`}
          className="inline-flex items-center text-red-400 hover:text-red-300 font-medium"
        >
          ← Back to {cigarette.name}
        </a>
      </div>
    </div>
  );
};

export default IndividualPostPage;