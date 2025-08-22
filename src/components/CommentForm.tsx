'use client';

import React, { useState } from 'react';
import { getAuthCookie } from '@/lib/authUtils.client';
import RateLimitWarning from './RateLimitWarning';

interface CommentFormProps {
  onSubmit: (data: {
    body: string;
    rating: number;
    parentId?: string;
    replyingTo?: string;
  }) => Promise<void>;
  isLoading: boolean;
  cigaretteName: string;
  cigaretteId: string; 
  placeholder?: string;
  parentId?: string;
  replyingTo?: string;
  onCancel?: () => void;
  showRating?: boolean;
}

const CommentForm: React.FC<CommentFormProps> = ({
  onSubmit,
  isLoading,
  cigaretteName,
  cigaretteId,
  placeholder = "Write a comment...",
  parentId,
  replyingTo,
  onCancel,
  showRating = true
}) => {
  const [body, setBody] = useState('');
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canComment, setCanComment] = useState(true);
  const [rateLimitError, setRateLimitError] = useState<string>('');
 
  const userData = getAuthCookie();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; 
   
    if (!userData) {
      alert('Please log in to comment');
      return;
    }

    if (!canComment) {
      alert('Please wait before commenting again');
      return;
    }

    if (!body.trim()) {
      alert('Please enter a comment');
      return;
    }

    if (showRating && rating === 0) {
      alert(`Please rate ${cigaretteName}`);
      return;
    }

    setIsSubmitting(true);
    setRateLimitError('');
   
    try {
      await onSubmit({
        body: body.trim(),
        rating: showRating ? rating : 0,
        parentId,
        replyingTo
      });
     
      setBody('');
      setRating(0);
      setHoveredStar(0);
     
      if (onCancel) {
        onCancel();
      }
    } catch (error: any) {
      console.error('Error submitting comment:', error);
      
      if (error.message && error.message.includes('wait')) {
        setRateLimitError(error.message);
      } else {
        alert('Failed to post comment. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        window.location.reload();
      }, 0);
    }
  };

  const handleRateLimitStatusChange = (canAct: boolean) => {
    setCanComment(canAct);
    if (canAct) {
      setRateLimitError('');
    }
  };

  if (!userData) {
    return (
      <div className="bg-gray-700 rounded-lg p-4 text-center">
        <p className="text-gray-400 mb-3">Please log in to leave a comment</p>
        <a
          href="/signIn"
          className="inline-block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Sign In
        </a>
      </div>
    );
  }

  return (
    <div>
      <RateLimitWarning 
        type="comment" 
        cigaretteId={cigaretteId}
        onStatusChange={handleRateLimitStatusChange}
      />
      
      {rateLimitError && (
        <div className="bg-red-900 border border-red-700 rounded-lg p-3 mb-4">
          <p className="text-red-200 text-sm">{rateLimitError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-gray-700 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <img
            src={userData.image || '/defaultPFP.png'}
            alt={userData.name}
            className="w-10 h-10 rounded-full"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/defaultPFP.png';
            }}
          />
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-white font-medium">{userData.name}</span>
              {showRating && (
                <>
                  <span className="text-gray-400 text-sm">•</span>
                  <span className="text-gray-400 text-sm">Rate {cigaretteName}:</span>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(0)}
                        className={`text-lg transition-colors ${
                          star <= (hoveredStar || rating)
                            ? 'text-yellow-400 hover:text-yellow-300'
                            : 'text-gray-500 hover:text-gray-400'
                        }`}
                        disabled={!canComment}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  {rating > 0 && (
                    <span className="text-sm text-gray-400">
                      ({rating}/5)
                    </span>
                  )}
                </>
              )}
              {replyingTo && (
                <>
                  <span className="text-gray-400 text-sm">•</span>
                  <span className="text-blue-400 text-sm">Replying to {replyingTo}</span>
                </>
              )}
            </div>
           
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={canComment ? placeholder : "Please wait before commenting again..."}
              className="w-full bg-gray-600 text-white rounded-md p-3 border border-gray-500 focus:border-red-400 focus:outline-none resize-none"
              rows={3}
              disabled={isLoading || isSubmitting || !canComment}
            />
           
            <div className="flex items-center justify-between mt-3">
              <div className="text-sm text-gray-400">
                {showRating && rating === 0 && canComment && (
                  <span className="text-red-400">Please rate the cigarette</span>
                )}
                {!canComment && (
                  <span className="text-yellow-400">Rate limit active - please wait</span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {onCancel && (
                  <button
                    type="button"
                    onClick={onCancel}
                    disabled={isLoading || isSubmitting}
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isLoading || isSubmitting || !body.trim() || (showRating && rating === 0) || !canComment}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isLoading || isSubmitting || !body.trim() || (showRating && rating === 0) || !canComment
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  {isSubmitting ? 'Posting...' : !canComment ? 'Rate Limited' : parentId ? 'Reply' : 'Comment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CommentForm;