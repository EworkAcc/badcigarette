import React from 'react';

interface CigaretteCardProps {
  name: string;
  description: string;
  rating?: number;
  reviews?: number;
}

const CigaretteCard: React.FC<CigaretteCardProps> = ({ 
  name, 
  description, 
  rating = 0, 
  reviews = 0 
}) => {
  const displayRating = Math.max(0, Math.min(5, rating)); 
  
  return (
    <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 cursor-pointer transition-colors">
      <h3 className="text-xl font-semibold mb-3 text-red-400">{name}</h3>
      <p className="text-gray-300 mb-4 leading-relaxed">{description}</p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex text-yellow-400">
            {'★'.repeat(Math.floor(displayRating))}
            {'☆'.repeat(5 - Math.floor(displayRating))}
          </div>
          <span className="ml-2 text-sm text-gray-400">
            {displayRating > 0 ? displayRating.toFixed(1) : 'No rating'}
          </span>
        </div>
        {reviews > 0 && (
          <span className="text-xs text-gray-400">{reviews} reviews</span>
        )}
      </div>
    </div>
  );
};

export default CigaretteCard;