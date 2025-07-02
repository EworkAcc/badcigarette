"use client";

import React, { useState } from 'react';

const HomePageClient: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

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
                <button className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium">
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
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="border-b border-gray-700 pb-4 last:border-b-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">Marlboro Red</h3>
                        <p className="text-sm text-gray-400">by user{item}</p>
                        <div className="flex items-center mt-1">
                          <div className="flex text-yellow-400">
                            {'★'.repeat(5 - item)}{'☆'.repeat(item)}
                          </div>
                          <span className="ml-2 text-sm text-gray-400">{5 - item}.0/5</span>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">2h ago</span>
                    </div>
                    <p className="text-sm text-gray-300 mt-2">
                      "Strong flavor with a harsh finish. Not recommended for beginners..."
                    </p>
                  </div>
                ))}
              </div>
              <button className="mt-4 text-red-400 hover:text-red-300 text-sm font-medium">
                View All Reviews →
              </button>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 text-red-400">Forum Activity</h2>
              <div className="space-y-4">
                {[
                  { title: "Best menthol alternatives?", replies: 23, user: "smoker123" },
                  { title: "New to reviewing - tips?", replies: 15, user: "newbie456" },
                  { title: "Vintage cigarette discussion", replies: 8, user: "collector789" }
                ].map((topic, index) => (
                  <div key={index} className="border-b border-gray-700 pb-4 last:border-b-0">
                    <h3 className="font-medium hover:text-red-400 cursor-pointer">{topic.title}</h3>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-sm text-gray-400">by {topic.user}</p>
                      <span className="text-xs text-gray-400">{topic.replies} replies</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-4 text-red-400 hover:text-red-300 text-sm font-medium">
                Visit Forums →
              </button>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-red-400">Top Rated Cigarettes</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: "Camel Turkish Gold", rating: 4.2, reviews: 1247 },
                { name: "Newport Menthol", rating: 3.8, reviews: 2156 },
                { name: "American Spirit Blue", rating: 4.0, reviews: 892 },
                { name: "Parliament Lights", rating: 3.6, reviews: 756 },
                { name: "Pall Mall Red", rating: 3.4, reviews: 1834 },
                { name: "Lucky Strike", rating: 3.9, reviews: 634 }
              ].map((cigarette, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 cursor-pointer transition-colors">
                  <h3 className="font-medium mb-2">{cigarette.name}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex text-yellow-400 text-sm">
                        {'★'.repeat(Math.floor(cigarette.rating))}
                        {'☆'.repeat(5 - Math.floor(cigarette.rating))}
                      </div>
                      <span className="ml-2 text-sm text-gray-400">{cigarette.rating}</span>
                    </div>
                    <span className="text-xs text-gray-400">{cigarette.reviews} reviews</span>
                  </div>
                </div>
              ))}
            </div>
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
              />
              <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-medium">
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