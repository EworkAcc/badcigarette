'use client';

import React, { useState } from 'react';
import CommentForm from './CommentForm';
import CommentCard from './CommentCard';

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

interface CommentSectionProps {
  postId: string;
  cigaretteId: string;
  cigaretteName: string;
  initialComments: Comment[];
}

interface CommentWithReplies extends Comment {
  replies: CommentWithReplies[];
}

const organizeComments = (comments: Comment[]): CommentWithReplies[] => {
  const commentMap = new Map<string, CommentWithReplies>();
  const rootComments: CommentWithReplies[] = [];

  comments.forEach(comment => {
    commentMap.set(comment.id, { ...comment, replies: [] });
  });

  comments.forEach(comment => {
    const commentWithReplies = commentMap.get(comment.id)!;
    
    if (comment.parentId && commentMap.has(comment.parentId)) {
      const parent = commentMap.get(comment.parentId)!;
      parent.replies.push(commentWithReplies);
    } else {
      rootComments.push(commentWithReplies);
    }
  });

  rootComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const sortReplies = (comment: CommentWithReplies): void => {
    comment.replies.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    comment.replies.forEach(reply => sortReplies(reply));
  };

  rootComments.forEach(sortReplies);

  return rootComments;
};

const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
  cigaretteId,
  cigaretteName,
  initialComments
}) => {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');

  const organizedComments = organizeComments(comments);

  const handleNewComment = async (commentData: {
    body: string;
    rating: number;
    parentId?: string;
    replyingTo?: string;
  }) => {
    setIsLoading(true);
    setSubmitError('');
    
    try {
      const response = await fetch(`/api/subCigarettes/${cigaretteId}/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData)
      });

      if (response.ok) {
        const data = await response.json();
        setComments(prev => [...prev, data.comment]);
        
        if (data.ratingAffected) {
          console.log('Your comment affected the cigarette rating!');
        }
      } else {
        const errorData = await response.json();
        
        if (response.status === 429) {
          setSubmitError(errorData.message || 'Comment limit exceeded. Please wait before commenting again.');
        } else {
          setSubmitError(errorData.message || 'Failed to post comment');
        }
        throw new Error(errorData.message || 'Failed to post comment');
      }
    } catch (error: any) {
      console.error('Error posting comment:', error);
      
      if (!submitError) {
        setSubmitError('Failed to post comment. Please try again.');
      }
      
      throw error; 
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoteUpdate = (commentId: string, newVotes: any) => {
    setComments(prev =>
      prev.map(comment =>
        comment.id === commentId
          ? { ...comment, votes: newVotes }
          : comment
      )
    );
  };

  const handleCommentDelete = (commentId: string) => {
    setComments(prev => prev.filter(comment => comment.id !== commentId));
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-6 text-red-400">
        Comments ({comments.length})
      </h2>

      {submitError && (
        <div className="bg-red-900 border border-red-700 rounded-lg p-4 mb-6">
          <h3 className="text-red-300 font-medium mb-2">Comment Error</h3>
          <p className="text-red-200 text-sm">{submitError}</p>
        </div>
      )}

      <div className="mb-8">
        <CommentForm
          onSubmit={handleNewComment}
          isLoading={isLoading}
          cigaretteName={cigaretteName}
          cigaretteId={cigaretteId}
          placeholder={`Share your thoughts about this review...`}
        />
      </div>

      <div className="space-y-4">
        {organizedComments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No comments yet.</p>
            <p className="text-gray-500 text-sm mt-2">
              Be the first to leave a comment!
            </p>
          </div>
        ) : (
          organizedComments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              postId={postId}
              cigaretteId={cigaretteId}
              cigaretteName={cigaretteName}
              onVoteUpdate={handleVoteUpdate}
              onCommentDelete={handleCommentDelete}
              onNewReply={handleNewComment}
              depth={0}
            />
          ))
        )}
      </div>

      {isLoading && (
        <div className="text-center py-4">
          <div className="inline-flex items-center space-x-2 text-gray-400">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-400 border-t-transparent"></div>
            <span>Posting comment...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentSection;