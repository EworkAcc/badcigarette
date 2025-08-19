"use client";

import { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Star, ChevronDown, SortAsc, SortDesc } from 'lucide-react';
import CigaretteSearchCard from './CigaretteSearchCard';
import { useSearchParams } from 'next/navigation';

interface Cigarette {
  _id: string;
  id: string;
  name: string;
  description: string;
  rating: number;
  noOfReviews: number;
  type: string; 
}

const CigaretteSearchClient: React.FC = () => {
  const searchParams = useSearchParams();
  const initialSearchTerm = searchParams.get('search') || '';
  const initialFilterType = searchParams.get('type') || 'all';

  const [cigarettes, setCigarettes] = useState<Cigarette[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [sortBy, setSortBy] = useState('rating');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterType, setFilterType] = useState(initialFilterType);
  const [minRating, setMinRating] = useState(0);

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'r', label: 'Regular' },
    { value: 'l', label: 'Light' },
    { value: 'ul', label: 'Ultra Light' },
    { value: 'm', label: 'Menthol' }
  ];

  useEffect(() => {
    const fetchCigarettes = async () => {
      try {
        const response = await fetch('/api/subCigarettesRetrieval');
        if (response.ok) {
          const data = await response.json();
          const cigaretteList = Array.isArray(data) ? data : data.cigarettes || [];
          setCigarettes(cigaretteList);
        } else {
          console.error('Failed to fetch cigarettes');
          setCigarettes([
            {
              _id: "1",
              id: "marlboro-red",
              name: "Marlboro Red",
              description: "Full flavor cigarette with a bold taste",
              rating: 4.2,
              noOfReviews: 150,
              type: "r"
            },
            {
              _id: "2", 
              id: "camel-lights",
              name: "Camel Lights",
              description: "Light cigarette with smooth flavor",
              rating: 3.8,
              noOfReviews: 89,
              type: "l"
            },
            {
              _id: "3",
              id: "newport-menthol", 
              name: "Newport Menthol",
              description: "Cool menthol taste with refreshing finish",
              rating: 4.5,
              noOfReviews: 210,
              type: "m"
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching cigarettes:', error);
        setCigarettes([
          {
            _id: "1",
            id: "marlboro-red",
            name: "Marlboro Red", 
            description: "Full flavor cigarette with a bold taste",
            rating: 4.2,
            noOfReviews: 150,
            type: "r"
          },
          {
            _id: "2",
            id: "camel-lights",
            name: "Camel Lights",
            description: "Light cigarette with smooth flavor", 
            rating: 3.8,
            noOfReviews: 89,
            type: "l"
          },
          {
            _id: "3",
            id: "newport-menthol",
            name: "Newport Menthol",
            description: "Cool menthol taste with refreshing finish",
            rating: 4.5,
            noOfReviews: 210,
            type: "m"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCigarettes();
  }, []);

  const filteredAndSortedCigarettes = useMemo(() => {
    let filtered = cigarettes.filter((cigarette: Cigarette) => {
      const matchesSearch = cigarette.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           cigarette.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || cigarette.type === filterType;
      const matchesRating = cigarette.rating >= minRating;
      
      return matchesSearch && matchesType && matchesRating;
    });

    filtered.sort((a: Cigarette, b: Cigarette) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'numRatings':
          aValue = a.noOfReviews;
          bValue = b.noOfReviews;
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [cigarettes, searchTerm, sortBy, sortOrder, filterType, minRating]);

  const handleViewDetails = (id: string) => {
    window.location.href = `/subCigarettes/${id}`;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-gray-400">Loading cigarettes...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-red-400 mb-2">Search Cigarettes</h1>
        <p className="text-gray-300">Find and compare cigarettes from our database</p>
        <div className="text-sm text-gray-400 mt-2">
          {filteredAndSortedCigarettes.length} products found
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search cigarettes or descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {typeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="rating">Overall Rating</option>
              <option value="numRatings">Number of Reviews</option>
              <option value="name">Name</option>
            </select>
          </div>

          <div>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="w-full flex items-center justify-center px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {sortOrder === 'asc' ? (
                <>
                  <SortAsc className="w-4 h-4 mr-2" />
                  Ascending
                </>
              ) : (
                <>
                  <SortDesc className="w-4 h-4 mr-2" />
                  Descending
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-700">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Minimum Rating: {minRating} stars
          </label>
          <input
            type="range"
            min="0"
            max="5"
            step="0.5"
            value={minRating}
            onChange={(e) => setMinRating(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0</span>
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAndSortedCigarettes.map((cigarette: Cigarette) => (
          <CigaretteSearchCard
            key={cigarette._id}
            id={cigarette.id}
            name={cigarette.name}
            description={cigarette.description}
            rating={cigarette.rating}
            numberOfReviews={cigarette.noOfReviews}
            type={cigarette.type}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>

      {filteredAndSortedCigarettes.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🚬</div>
          <h3 className="text-lg font-medium text-gray-300 mb-2">No cigarettes found</h3>
          <p className="text-gray-400">Try adjusting your search criteria or filters.</p>
        </div>
      )}
    </div>
  );
};

export default CigaretteSearchClient;