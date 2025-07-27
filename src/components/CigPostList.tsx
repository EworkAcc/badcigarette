'use client';

import React, { useState } from 'react';
import CigarettePost from './CigPost';

interface CigarettePostsListProps {
  posts: any[];
}

const CigarettePostsList: React.FC<CigarettePostsListProps> = ({ posts }) => {
  const [allPosts, setAllPosts] = useState(posts); 
  const [displayedPosts, setDisplayedPosts] = useState(posts.slice(0, 20));
  const [currentIndex, setCurrentIndex] = useState(20);
  const [isLoading, setIsLoading] = useState(false);

  const loadMorePosts = () => {
    setIsLoading(true);
    setTimeout(() => {
      const nextPosts = allPosts.slice(currentIndex, currentIndex + 20);
      setDisplayedPosts(prev => [...prev, ...nextPosts]);
      setCurrentIndex(prev => prev + 20);
      setIsLoading(false);
    }, 500); 
  };

  const handleVoteUpdate = (postId: string, newVotes: any) => {
    setDisplayedPosts(prev => 
      prev.map(post => 
        post.id === postId 
          ? { ...post, votes: newVotes }
          : post
      )
    );
    
    setAllPosts(prev => 
      prev.map(post => 
        post.id === postId 
          ? { ...post, votes: newVotes }
          : post
      )
    );
  };

  const handlePostDelete = (postId: string) => {
    setDisplayedPosts(prev => prev.filter(post => post.id !== postId));
    setAllPosts(prev => prev.filter(post => post.id !== postId));
    
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const hasMorePosts = currentIndex < allPosts.length;

  if (allPosts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No reviews yet.</p>
        <p className="text-gray-500 text-sm mt-2">
          Be the first to leave a review!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {displayedPosts.map((post: any) => (
        <CigarettePost
          key={post.id}
          post={{
            id: post.id,
            title: post.title,
            user: post.user,
            userImage: post.userImage,
            rating: post.rating,
            body: post.body,
            createdAt: post.createdAt,
            votes: post.votes,
            comments: post.comments
          }}
          onVoteUpdate={handleVoteUpdate}
          onPostDelete={handlePostDelete}
        />
      ))}
      
      {hasMorePosts && (
        <div className="text-center pt-6">
          <button
            onClick={loadMorePosts}
            disabled={isLoading}
            className={`px-6 py-3 rounded-md font-medium transition-colors ${
              isLoading
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {isLoading ? 'Loading...' : 'Load More Reviews'}
          </button>
        </div>
      )}
      
      {displayedPosts.length === 0 && allPosts.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">All posts have been deleted.</p>
        </div>
      )}
    </div>
  );
};

export default CigarettePostsList;