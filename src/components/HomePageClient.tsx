"use client";

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Cigarette {
  _id: string;
  name: string;
  description: string;
  rating: number;
  noOfReviews: number;
  type: string;
}

interface CigaretteResponse {
  cigarettes: Cigarette[];
  pagination: {
    total: number;
    limit: number;
    skip: number;
    hasMore: boolean;
  };
}

interface UserPost {
  id: string;
  title: string;
  body: string;
  rating: number;
  cigaretteName: string;
  cigaretteId: string;
  createdAt: string;
  updatedAt: string;
  votes: {
    upvotes: number;
    downvotes: number;
    total: number;
  };
  commentsCount: number;
  recentActivity: {
    recentVotes: number;
    recentComments: number;
    activityScore: number;
    hasRecentActivity: boolean;
  };
}

interface UserPostsResponse {
  posts: UserPost[];
  totalPosts: number;
}

const HomePageClient: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [topRatedCigarettes, setTopRatedCigarettes] = useState<Cigarette[]>([]);
  const [recentReviews, setRecentReviews] = useState<Cigarette[]>([]);
  const [userPosts, setUserPosts] = useState<UserPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchTopRatedCigarettes = async () => {
      try {
        const response = await fetch('/api/subCigarettesRetrieval?sortBy=rating&sortOrder=desc&limit=6');
        if (!response.ok) {
          throw new Error('Failed to fetch cigarettes');
        }
        const data: CigaretteResponse = await response.json();
        setTopRatedCigarettes(data.cigarettes);
      } catch (err) {
        console.error('Error fetching top rated cigarettes:', err);
        setError('Failed to load cigarettes');
      }
    };

    fetchTopRatedCigarettes();
  }, []);

  useEffect(() => {
    const fetchRecentReviews = async () => {
      try {
        const response = await fetch('/api/subCigarettesRetrieval?sortBy=rating&sortOrder=desc&limit=3');
        if (!response.ok) {
          throw new Error('Failed to fetch recent reviews');
        }
        const data: CigaretteResponse = await response.json();
        setRecentReviews(data.cigarettes);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching recent reviews:', err);
        setError('Failed to load recent reviews');
        setLoading(false);
      }
    };

    fetchRecentReviews();
  }, []);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const response = await fetch('/api/user/posts');
        if (response.status === 401) {
          setIsAuthenticated(false);
          return;
        }
        if (!response.ok) {
          throw new Error('Failed to fetch user posts');
        }
        const data: UserPostsResponse = await response.json();
        setUserPosts(data.posts.slice(0, 3));
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Error fetching user posts:', err);
        setIsAuthenticated(false);
      }
    };

    fetchUserPosts();
  }, []);

  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    if (searchTerm) {
      queryParams.append('search', searchTerm);
    }
    if (selectedFilter && selectedFilter !== 'all') {
      const typeMap: { [key: string]: string } = {
        'regular': 'r',
        'menthol': 'm',
        'light': 'l',
        'ultra-light': 'ul',
      };
      queryParams.append('type', typeMap[selectedFilter] || selectedFilter);
    }
    router.push(`/search?${queryParams.toString()}`);
  };

  const getTypeDisplayName = (type: string): string => {
    const typeMap: { [key: string]: string } = {
      'r': 'Regular',
      'm': 'Menthol',
      'l': 'Light',
      'ul': 'Ultra Light',
    };
    return typeMap[type] || type;
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <>
        {'★'.repeat(fullStars)}
        {hasHalfStar && '☆'}
        {'☆'.repeat(emptyStars)}
      </>
    );
  };

  const getActivityText = (post: UserPost): string => {
    const { recentActivity } = post;
    if (!recentActivity.hasRecentActivity) {
      return 'No recent activity';
    }
    
    const activities = [];
    if (recentActivity.recentVotes > 0) {
      activities.push(`${recentActivity.recentVotes} vote${recentActivity.recentVotes > 1 ? 's' : ''}`);
    }
    if (recentActivity.recentComments > 0) {
      activities.push(`${recentActivity.recentComments} comment${recentActivity.recentComments > 1 ? 's' : ''}`);
    }
    
    return activities.join(', ');
  };

  const getTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks}w ago`;
    
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths}mo ago`;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-white">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-8 py-8">
        
        <div className="lg:w-1/4">
          <div className="space-y-6">
            
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-red-400">Find Cigarettes</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Search cigarettes, brands..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                  suppressHydrationWarning
                />
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="all">All Categories</option>
                  <option value="regular">Regular</option>
                  <option value="menthol">Menthol</option>
                  <option value="light">Light</option>
                  <option value="ultra-light">Ultra Light</option>
                </select>
                <button 
                  className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium"
                  onClick={handleSearch}
                  suppressHydrationWarning
                >
                  Search
                </button>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-red-400">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">Top Rated</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Most Reviewed</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">New Releases</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Popular Brands</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Store Locator</a></li>
              </ul>
            </div>

            <div className="bg-red-900 border border-red-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2 text-red-300">Health Warning</h3>
              <p className="text-sm text-red-200">
                Smoking cigarettes causes cancer, heart disease, stroke, lung diseases, diabetes, and COPD. 
                Quitting smoking greatly reduces your risk of disease and death.
              </p>
              <button className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                Get Help Quitting
              </button>
            </div>
          </div>
        </div>

        <div className="lg:w-3/4">
          
          <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg p-8 mb-8">
            <h1 className="text-4xl font-bold mb-4">Welcome to Bad Cigarettes</h1>
            <p className="text-xl text-gray-300 mb-6">
              The most comprehensive cigarette rating and review platform. Rate, review, and discover cigarettes 
              while supporting tobacco harm reduction efforts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md font-medium">
                Browse Cigarettes
              </button>
              <button className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-md font-medium">
                Join Community
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 text-red-400">Recent Reviews</h2>
              {error ? (
                <div className="text-red-400">Error loading reviews</div>
              ) : (
                <div className="space-y-4">
                  {recentReviews.map((cigarette, index) => (
                    <div key={cigarette._id} className="border-b border-gray-700 pb-4 last:border-b-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{cigarette.name}</h3>
                          <p className="text-sm text-gray-400">{getTypeDisplayName(cigarette.type)}</p>
                          <div className="flex items-center mt-1">
                            <div className="flex text-yellow-400">
                              {renderStars(cigarette.rating)}
                            </div>
                            <span className="ml-2 text-sm text-gray-400">{cigarette.rating.toFixed(1)}/5</span>
                          </div>
                        </div>
                        <span className="text-xs text-gray-400">{cigarette.noOfReviews} reviews</span>
                      </div>
                      <p className="text-sm text-gray-300 mt-2">
                        {cigarette.description.length > 80 
                          ? `${cigarette.description.substring(0, 80)}...` 
                          : cigarette.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              <button className="mt-4 text-red-400 hover:text-red-300 text-sm font-medium">
                View All Reviews →
              </button>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 text-red-400">Your Posts</h2>
              {!isAuthenticated ? (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-4">Sign in to see your posts and activity</p>
                  <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                    Sign In
                  </button>
                </div>
              ) : userPosts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-4">You haven't posted any reviews yet</p>
                  <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                    Write Your First Review
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {userPosts.map((post) => (
                    <div key={post.id} className="border-b border-gray-700 pb-4 last:border-b-0">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-medium hover:text-red-400 cursor-pointer">{post.title}</h3>
                          <p className="text-sm text-gray-400">on {post.cigaretteName}</p>
                          <div className="flex items-center mt-1">
                            <div className="flex text-yellow-400 text-sm">
                              {renderStars(post.rating)}
                            </div>
                            <span className="ml-2 text-sm text-gray-400">{post.rating}/5</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-gray-400">{getTimeAgo(post.createdAt)}</span>
                          {post.recentActivity.hasRecentActivity && (
                            <div className="text-xs text-green-400 mt-1">
                              {getActivityText(post)}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-4 text-xs text-gray-400">
                          <span>↑{post.votes.upvotes} ↓{post.votes.downvotes}</span>
                          <span>{post.commentsCount} comments</span>
                        </div>
                        {post.recentActivity.hasRecentActivity && (
                          <span className="text-xs bg-green-900 text-green-300 px-2 py-1 rounded">
                            Active
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Link href="/subCigarettes" className="mt-4 text-red-400 hover:text-red-300 text-sm font-medium">
                View All Posts →
              </Link>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-red-400">Top Rated Cigarettes</h2>
            {error ? (
              <div className="text-red-400">Error loading cigarettes</div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {topRatedCigarettes.map((cigarette) => (
                  <div key={cigarette._id} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 cursor-pointer transition-colors">
                    <h3 className="font-medium mb-2">{cigarette.name}</h3>
                    <p className="text-xs text-gray-400 mb-2">{getTypeDisplayName(cigarette.type)}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex text-yellow-400 text-sm">
                          {renderStars(cigarette.rating)}
                        </div>
                        <span className="ml-2 text-sm text-gray-400">{cigarette.rating.toFixed(1)}</span>
                      </div>
                      <span className="text-xs text-gray-400">{cigarette.noOfReviews} reviews</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-red-400">Stay Updated</h2>
            <p className="text-gray-300 mb-4">
              Get the latest reviews, news, and harm reduction information delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                suppressHydrationWarning
              />
              <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-medium"
                suppressHydrationWarning
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePageClient;
