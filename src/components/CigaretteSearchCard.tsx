import React from 'react';
import { Star } from 'lucide-react';

interface CigaretteSearchCardProps {
  id: string;
  name: string;
  description: string;
  rating: number;
  numberOfReviews: number;
  type: string; 
  onViewDetails?: (id: string) => void;
}

const CigaretteSearchCard: React.FC<CigaretteSearchCardProps> = ({
  id,
  name,
  description,
  rating,
  numberOfReviews,
  type,
  onViewDetails
}) => {
  const displayRating = Math.max(0, Math.min(5, rating || 0));
  
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) 
            ? 'fill-yellow-400 text-yellow-400' 
            : i < rating 
            ? 'fill-yellow-200 text-yellow-400' 
            : 'text-gray-500'
        }`}
      />
    ));
  };

  const getTypeBadge = (type: string) => {
    const typeMap: { [key: string]: { label: string; color: string } } = {
      'r': { label: 'Regular', color: 'bg-red-600 text-red-100' },
      'l': { label: 'Light', color: 'bg-blue-600 text-blue-100' },
      'ul': { label: 'Ultra Light', color: 'bg-green-600 text-green-100' },
      'm': { label: 'Menthol', color: 'bg-cyan-600 text-cyan-100' }
    };
    
    const typeInfo = typeMap[type] || { label: 'Unknown', color: 'bg-gray-600 text-gray-100' };
    
    return (
      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${typeInfo.color}`}>
        {typeInfo.label}
      </span>
    );
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(id);
    } else {
      window.location.href = `/subCigarettes/${id}`;
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 cursor-pointer transition-colors h-full flex flex-col">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-red-400 flex-1 mr-2">{name}</h3>
        {getTypeBadge(type)}
      </div>
      
      <p className="text-gray-300 mb-4 leading-relaxed flex-1 line-clamp-3">
        {description}
      </p>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="flex">{renderStars(displayRating)}</div>
          <span className="ml-2 text-sm font-medium text-gray-300">
            {displayRating.toFixed(1)}
          </span>
        </div>
        <span className="text-sm text-gray-400">
          ({numberOfReviews} {numberOfReviews === 1 ? 'review' : 'reviews'})
        </span>
      </div>
      
      <button
        onClick={handleViewDetails}
        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
      >
        View Details
      </button>
    </div>
  );
};

export default CigaretteSearchCard;
