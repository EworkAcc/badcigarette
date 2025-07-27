'use client';

import React, { useState } from 'react';
import { getAuthCookie } from '@/lib/authUtils.client';

interface CigarettePostProps {
  post: {
    id: string;
    title: string;
    user: string;
    userImage: string;
    rating: number;
    body: string;
    createdAt: string;
    votes: {
      noOfUpvotes: number;
      noOfDownvotes: number;
      userUp: string[];
      userDown: string[];
    };
    comments?: any[];
  };
  onVoteUpdate: (postId: string, newVotes: any) => void;
  onPostDelete?: (postId: string) => void; 
}

const CigarettePost: React.FC<CigarettePostProps> = ({ post, onVoteUpdate, onPostDelete }) => {
  const [isVoting, setIsVoting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleteHovered, setIsDeleteHovered] = useState(false);
  const userData = getAuthCookie();

  const votes = post.votes || {
    noOfUpvotes: 0,
    noOfDownvotes: 0,
    userUp: [],
    userDown: []
  };

  const handleVote = async (voteType: 'upvote' | 'downvote') => {
    if (!userData) {
      alert('Please log in to vote');
      return;
    }

    if (isVoting) return;

    setIsVoting(true);

    try {
      const response = await fetch('/api/votePost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: post.id,
          voteType,
          userId: userData.id
        })
      });

      if (response.ok) {
        const data = await response.json();
        onVoteUpdate(post.id, data.votes);
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to vote');
      }
    } catch (error) {
      console.error('Error voting:', error);
      alert('Failed to vote. Please try again.');
    } finally {
      setIsVoting(false);
    }
  };

  const handleDeletePost = async () => {
    if (!userData) {
      alert('Please log in to delete posts');
      return;
    }

    const confirmed = window.confirm('Are you sure you want to delete this post? This action cannot be undone.');
    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch('/api/removePost', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: post.id,
          userEmail: userData.email 
        })
      });

      if (response.ok) {
        const data = await response.json();
        alert('Post deleted successfully!');
        
        if (onPostDelete) {
          onPostDelete(post.id);
        } else {
          window.location.reload();
        }
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const currentUserUpvoted = userData && Array.isArray(votes.userUp) && votes.userUp.includes(userData.id);
  const currentUserDownvoted = userData && Array.isArray(votes.userDown) && votes.userDown.includes(userData.id);
  const netVotes = (votes.noOfUpvotes || 0) - (votes.noOfDownvotes || 0);
  
  const isPostOwner = userData && userData.name === post.user;

  return (
    <div 
      className="bg-gray-700 rounded-lg p-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start space-x-3">
        <img 
          src={post.userImage || '/defaultPFP.png'} 
          alt={post.user || 'User'}
          className="w-10 h-10 rounded-full"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/defaultPFP.png';
          }}
        />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
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
            
            {isPostOwner && isHovered && (
              <button
                onClick={handleDeletePost}
                disabled={isDeleting}
                onMouseEnter={() => setIsDeleteHovered(true)}
                onMouseLeave={() => setIsDeleteHovered(false)}
                className={`transition-opacity duration-200 ${
                  isDeleting ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
                }`}
                title="Delete this post"
              >
                <img
                  src={isDeleteHovered ? '/deleteRed.png' : '/deleteGray.png'}
                  alt="Delete post"
                  className="w-5 h-5"
                />
              </button>
            )}
          </div>
          
          <a 
            href="#" 
            className="text-lg font-semibold text-red-400 hover:text-red-300 transition-colors mb-2 block"
          >
            {post.title || 'Untitled Review'}
          </a>
          
          <p className="text-gray-300 mb-3">{post.body || 'No review content'}</p>
          
          <div className="mt-2 text-sm text-gray-400 mb-3">
            {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Recently'}
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <button 
                onClick={() => handleVote('upvote')}
                disabled={isVoting}
                className={`transition-colors ${
                  currentUserUpvoted 
                    ? 'text-green-400' 
                    : 'text-gray-400 hover:text-green-400'
                } ${isVoting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                ↑
              </button>
              <span className="text-sm text-gray-300 min-w-[20px] text-center">
                {netVotes}
              </span>
              <button 
                onClick={() => handleVote('downvote')}
                disabled={isVoting}
                className={`transition-colors ${
                  currentUserDownvoted 
                    ? 'text-red-400' 
                    : 'text-gray-400 hover:text-red-400'
                } ${isVoting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
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
  );
};

export default CigarettePost;