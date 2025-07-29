import Link from 'next/link';
import React from 'react';
import { calculateOverallRating } from '@/lib/ratingCalculator';

interface CigaretteCardProps {
  name: string;
  description: string;
  id: string;
  rating?: number;
  noOfReviews?: number;
  reviews?: number;
}

const CigaretteCard: React.FC<CigaretteCardProps> = ({ 
  name, 
  description, 
  id,
  rating = 0, 
  noOfReviews = 0,
  reviews = 0 
}) => {
  const displayRating = Math.max(0, Math.min(5, rating || 0));
  const reviewCount = noOfReviews || reviews || 0;
  
  return (
    <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 cursor-pointer transition-colors">
      <Link href={`/subCigarettes/${id}`} className="text-xl font-semibold mb-3 text-red-400 block">
        {name}
      </Link>
      <p className="text-gray-300 mb-4 leading-relaxed">{description}</p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, index) => (
              <span key={index}>
                {index < Math.floor(displayRating) ? '★' : '☆'}
              </span>
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-400">
            {reviewCount > 0 ? `${displayRating.toFixed(1)} (${reviewCount})` : 'No ratings'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CigaretteCard;
