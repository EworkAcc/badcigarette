'use client';

import React, { useState } from 'react';
import { getAuthCookie } from '@/lib/authUtils.client';
import CommentForm from './CommentForm';

interface Comment {
  id: string;
  body: string;
  user: string;
  userEmail: string;
  userImage: string;
  rating: number;
  parentId: string | null;
  replyingTo: string | null;
  depth: number;
  createdAt: string;
  votes: {
    id: string;
    noOfUpvotes: number;
    noOfDownvotes: number;
    userUp: string[];
    userDown: string[];
  };
}

interface CommentWithReplies extends Comment {
  replies: CommentWithReplies[];
}

interface CommentCardProps {
  comment: CommentWithReplies;
  postId: string;
  cigaretteId: string;
  cigaretteName: string;
  onVoteUpdate: (commentId: string, newVotes: any) => void;
  onCommentDelete: (commentId: string) => void;
  onNewReply: (data: {
    body: string;
    rating: number;
    parentId?: string;
    replyingTo?: string;
  }) => Promise<void>;
  depth: number;
}

const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  postId,
  cigaretteId,
  cigaretteName,
  onVoteUpdate,
  onCommentDelete,
  onNewReply,
  depth
}) => {
  const [isVoting, setIsVoting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleteHovered, setIsDeleteHovered] = useState(false);
  const [replyError, setReplyError] = useState<string>('');
 
  const userData = getAuthCookie();

  const votes = comment.votes || {
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
      const response = await fetch(`/api/subCigarettes/${cigaretteId}/posts/${postId}/comments/${comment.id}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          voteType
        })
      });

      if (response.ok) {
        const data = await response.json();
        onVoteUpdate(comment.id, data.votes);
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

  const handleDeleteComment = async () => {
    if (!userData) {
      alert('Please log in to delete comments');
      return;
    }

    const confirmed = window.confirm('Are you sure you want to delete this comment? This action cannot be undone.');
    if (!confirmed) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/subCigarettes/${cigaretteId}/posts/${postId}/comments/${comment.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        onCommentDelete(comment.id);
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReplySubmit = async (replyData: {
    body: string;
    rating: number;
    parentId?: string;
    replyingTo?: string;
  }) => {
    const parentId = comment.parentId || comment.id;
    const newDepth = Math.min(depth + 1, 1);
   
    setReplyError('');
    
    try {
      await onNewReply({
        ...replyData,
        parentId,
        replyingTo: comment.user
      });
     
      setShowReplyForm(false);
    } catch (error: any) {
      console.error('Error submitting reply:', error);
      
      if (error.message && error.message.includes('wait')) {
        setReplyError(error.message);
      } else {
        setReplyError('Failed to post reply. Please try again.');
      }
    }
  };

  const currentUserUpvoted = userData && Array.isArray(votes.userUp) && votes.userUp.includes(userData.id);
  const currentUserDownvoted = userData && Array.isArray(votes.userDown) && votes.userDown.includes(userData.id);
  const netVotes = (votes.noOfUpvotes || 0) - (votes.noOfDownvotes || 0);
  const isCommentOwner = userData && userData.name === comment.user;

  const shouldIndent = depth > 0;
  const indentClass = shouldIndent ? 'ml-8' : '';

  return (
    <div className={`${indentClass}`}>
      <div
        className="bg-gray-700 rounded-lg p-4 mb-3"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-start space-x-3">
          <img
            src={comment.userImage || '/defaultPFP.png'}
            alt={comment.user}
            className="w-10 h-10 rounded-full"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/defaultPFP.png';
            }}
          />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-white font-medium">{comment.user}</span>
                {comment.rating > 0 && (
                  <>
                    <span className="text-gray-400 text-sm">•</span>
                    <div className="flex items-center space-x-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, starIndex) => (
                          <span
                            key={starIndex}
                            className={`text-xs ${
                              starIndex < comment.rating
                                ? 'text-yellow-400'
                                : 'text-gray-500'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-gray-400">for {cigaretteName}</span>
                    </div>
                  </>
                )}
                {comment.replyingTo && depth > 0 && (
                  <>
                    <span className="text-gray-400 text-sm">•</span>
                    <span className="text-blue-400 text-sm">
                      replying to {comment.replyingTo}
                    </span>
                  </>
                )}
              </div>
             
              {isCommentOwner && isHovered && (
                <button
                  onClick={handleDeleteComment}
                  disabled={isDeleting}
                  onMouseEnter={() => setIsDeleteHovered(true)}
                  onMouseLeave={() => setIsDeleteHovered(false)}
                  className={`transition-opacity duration-200 ${
                    isDeleting ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
                  }`}
                  title="Delete this comment"
                >
                  <img
                    src={isDeleteHovered ? '/deleteRed.png' : '/deleteGray.png'}
                    alt="Delete comment"
                    className="w-4 h-4"
                  />
                </button>
              )}
            </div>
           
            <p className="text-gray-300 mb-3">{comment.body}</p>
           
            <div className="flex items-center justify-between">
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
               
                <button
                  onClick={() => {
                    setShowReplyForm(!showReplyForm);
                    setReplyError('');
                  }}
                  className="text-gray-400 hover:text-blue-400 text-sm transition-colors"
                >
                  Reply
                </button>
               
                {comment.replies && comment.replies.length > 0 && (
                  <span className="text-xs text-gray-500">
                    {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                  </span>
                )}
              </div>
             
              <div className="text-xs text-gray-400">
                {new Date(comment.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showReplyForm && (
        <div className={shouldIndent ? 'ml-8' : ''}>
          {replyError && (
            <div className="bg-red-900 border border-red-700 rounded-lg p-3 mb-4">
              <p className="text-red-200 text-sm">{replyError}</p>
            </div>
          )}
          <CommentForm
            onSubmit={handleReplySubmit}
            isLoading={false}
            cigaretteName={cigaretteName}
            cigaretteId={cigaretteId}
            placeholder={`Reply to ${comment.user}...`}
            parentId={comment.parentId || comment.id}
            replyingTo={comment.user}
            onCancel={() => {
              setShowReplyForm(false);
              setReplyError('');
            }}
            showRating={true}
          />
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-3">
          {comment.replies.map((reply) => (
            <CommentCard
              key={reply.id}
              comment={reply}
              postId={postId}
              cigaretteId={cigaretteId}
              cigaretteName={cigaretteName}
              onVoteUpdate={onVoteUpdate}
              onCommentDelete={onCommentDelete}
              onNewReply={onNewReply}
              depth={1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentCard;