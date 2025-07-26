'use client';

import React, { useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  loginType: string;
}

interface ReviewPopupProps {
  onClose: () => void;
  onSubmit: (rating: number, reviewText: string) => void;
  user: User | null;
}

const ReviewPopup: React.FC<ReviewPopupProps> = ({ onClose, onSubmit, user }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please log in to submit a review');
      return;
    }

    if (!reviewText.trim()) {
      alert('Please enter a review');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(rating, reviewText.trim());
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStarClick = (starRating: number) => {
    setRating(starRating);
  };

  const handleStarHover = (starRating: number) => {
    setHoveredStar(starRating);
  };

  const handleStarLeave = () => {
    setHoveredStar(0);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white">Add Review</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {!user ? (
          <div className="text-center py-8">
            <p className="text-red-400 mb-4">Please log in to submit a review</p>
            <button
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-md font-medium transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="flex items-center space-x-3 mb-6">
              {user.image && (
                <img 
                  src={user.image} 
                  alt={user.name}
                  className="w-12 h-12 rounded-full"
                />
              )}
              <div>
                <p className="text-white font-medium">{user.name}</p>
                <p className="text-gray-400 text-sm">{user.email}</p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-white font-medium mb-3">
                Rating
              </label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => handleStarHover(star)}
                    onMouseLeave={handleStarLeave}
                    className="text-3xl transition-colors duration-150 hover:scale-110 transform"
                  >
                    <span
                      className={`${
                        star <= (hoveredStar || rating)
                          ? 'text-yellow-400'
                          : 'text-gray-500'
                      }`}
                    >
                      ★
                    </span>
                  </button>
                ))}
                <span className="ml-3 text-white">
                  {rating > 0 ? `${rating}/5` : 'No rating'}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <label 
                htmlFor="reviewText" 
                className="block text-white font-medium mb-3"
              >
                Review *
              </label>
              <textarea
                id="reviewText"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your thoughts about this cigarette..."
                rows={4}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                required
              />
              <p className="text-gray-400 text-sm mt-1">
                {reviewText.length}/500 characters
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-md font-medium transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !reviewText.trim()}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2 px-4 rounded-md font-medium transition-colors"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReviewPopup;