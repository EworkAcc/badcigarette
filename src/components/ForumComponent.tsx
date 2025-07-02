import React, { useState } from 'react';

interface ForumPost {
  id: number;
  title: string;
  author: string;
  replies: number;
  views: number;
  lastActivity: string;
  lastAuthor: string;
  isPinned?: boolean;
  isLocked?: boolean;
}

interface ForumCategory {
  id: string;
  name: string;
  description: string;
  postCount: number;
  topicCount: number;
  lastPost?: {
    title: string;
    author: string;
    time: string;
  };
}

interface ForumComponentProps {
  title?: string;
  description?: string;
  cigaretteName?: string;
  forumType?: 'general' | 'cigarette-specific';
  categories?: ForumCategory[];
  posts?: ForumPost[];
}

const ForumComponent: React.FC<ForumComponentProps> = ({
  title = "Community Forums",
  description = "Join the discussion about cigarettes, reviews, and smoking culture",
  cigaretteName,
  forumType = 'general',
  categories = [],
  posts = []
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showNewTopicModal, setShowNewTopicModal] = useState<boolean>(false);

  // Default categories if none provided
  const defaultCategories: ForumCategory[] = [
    {
      id: 'general',
      name: 'General Discussion',
      description: 'General cigarette talk and community discussions',
      postCount: 1247,
      topicCount: 183,
      lastPost: { title: 'Welcome new members!', author: 'moderator', time: '2 hours ago' }
    },
    {
      id: 'reviews',
      name: 'Reviews & Ratings',
      description: 'Share your detailed cigarette reviews and ratings',
      postCount: 2856,
      topicCount: 421,
      lastPost: { title: 'Marlboro Gold review', author: 'smoker123', time: '1 hour ago' }
    },
    {
      id: 'brands',
      name: 'Brand Discussions',
      description: 'Discuss specific cigarette brands and their history',
      postCount: 1834,
      topicCount: 267,
      lastPost: { title: 'American Spirit vs Natural', author: 'tobaccoFan', time: '3 hours ago' }
    },
    {
      id: 'help',
      name: 'Help & Support',
      description: 'Get help with quitting, harm reduction, and health questions',
      postCount: 892,
      topicCount: 156,
      lastPost: { title: 'Day 30 smoke free!', author: 'quitter2024', time: '45 minutes ago' }
    }
  ];

  // Default posts if none provided
  const defaultPosts: ForumPost[] = [
    {
      id: 1,
      title: 'Welcome to Bad Cigarettes Community!',
      author: 'admin',
      replies: 45,
      views: 1250,
      lastActivity: '2 hours ago',
      lastAuthor: 'newUser123',
      isPinned: true
    },
    {
      id: 2,
      title: 'Forum Rules and Guidelines - READ FIRST',
      author: 'moderator',
      replies: 12,
      views: 890,
      lastActivity: '1 day ago',
      lastAuthor: 'moderator',
      isPinned: true,
      isLocked: true
    },
    {
      id: 3,
      title: cigaretteName ? `${cigaretteName} - First Impressions Thread` : 'Best menthol cigarettes in 2024?',
      author: 'smokerReviewer',
      replies: 28,
      views: 456,
      lastActivity: '1 hour ago',
      lastAuthor: 'mentholLover'
    },
    {
      id: 4,
      title: cigaretteName ? `Where to buy ${cigaretteName}?` : 'Vintage cigarette collecting',
      author: 'collector789',
      replies: 15,
      views: 234,
      lastActivity: '3 hours ago',
      lastAuthor: 'vintageSmoke'
    },
    {
      id: 5,
      title: 'Health effects discussion',
      author: 'healthAdvocate',
      replies: 67,
      views: 1123,
      lastActivity: '30 minutes ago',
      lastAuthor: 'quitHelper'
    }
  ];

  const displayCategories = categories.length > 0 ? categories : defaultCategories;
  const displayPosts = posts.length > 0 ? posts : defaultPosts;

  const filteredPosts = displayPosts.filter(post => 
    searchTerm === '' || post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-red-400">
                {cigaretteName ? `${cigaretteName} Forum` : title}
              </h1>
              <p className="text-gray-400 mt-2">
                {cigaretteName ? `Discuss everything about ${cigaretteName}` : description}
              </p>
            </div>
            <button 
              onClick={() => setShowNewTopicModal(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-medium mt-4 sm:mt-0"
            >
              New Topic
            </button>
          </div>

          {/* Breadcrumb */}
          <nav className="text-sm text-gray-400">
            <a href="#" className="hover:text-white">Forums</a>
            {cigaretteName && (
              <>
                <span className="mx-2">›</span>
                <a href="#" className="hover:text-white">Cigarettes</a>
                <span className="mx-2">›</span>
                <span className="text-white">{cigaretteName}</span>
              </>
            )}
          </nav>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="space-y-6">
              
              {/* Search */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="font-semibold mb-3 text-red-400">Search Forum</h3>
                <input
                  type="text"
                  placeholder="Search topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Categories Filter */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="font-semibold mb-3 text-red-400">Categories</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                      selectedCategory === 'all' 
                        ? 'bg-red-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    All Categories
                  </button>
                  {displayCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                        selectedCategory === category.id 
                          ? 'bg-red-600 text-white' 
                          : 'text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Forum Stats */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="font-semibold mb-3 text-red-400">Forum Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Topics:</span>
                    <span className="text-white">1,027</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Posts:</span>
                    <span className="text-white">6,829</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Members:</span>
                    <span className="text-white">2,341</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Online Now:</span>
                    <span className="text-green-400">47</span>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="font-semibold mb-3 text-red-400">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="text-gray-300 hover:text-white">Recent Posts</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white">My Topics</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white">Subscriptions</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white">Forum Guidelines</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            
            {/* Categories Overview (only for general forums) */}
            {forumType === 'general' && (
              <div className="bg-gray-800 rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-6 text-red-400">Forum Categories</h2>
                <div className="space-y-4">
                  {displayCategories.map((category) => (
                    <div key={category.id} className="border-b border-gray-700 pb-4 last:border-b-0">
                      <div className="flex flex-col sm:flex-row justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg hover:text-red-400 cursor-pointer">
                            {category.name}
                          </h3>
                          <p className="text-gray-400 text-sm mt-1">{category.description}</p>
                          <div className="text-xs text-gray-500 mt-2">
                            {category.topicCount} topics, {category.postCount} posts
                          </div>
                        </div>
                        {category.lastPost && (
                          <div className="text-right mt-2 sm:mt-0">
                            <div className="text-sm text-gray-400">Last post:</div>
                            <div className="text-sm font-medium">{category.lastPost.title}</div>
                            <div className="text-xs text-gray-500">
                              by {category.lastPost.author} • {category.lastPost.time}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Forum Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="recent">Most Recent</option>
                  <option value="popular">Most Popular</option>
                  <option value="replies">Most Replies</option>
                  <option value="views">Most Viewed</option>
                </select>
              </div>
              <div className="text-sm text-gray-400">
                Showing {filteredPosts.length} topics
              </div>
            </div>

            {/* Forum Posts */}
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="hidden sm:grid sm:grid-cols-12 gap-4 p-4 bg-gray-700 text-sm font-medium text-gray-300">
                <div className="col-span-6">Topic</div>
                <div className="col-span-2 text-center">Author</div>
                <div className="col-span-1 text-center">Replies</div>
                <div className="col-span-1 text-center">Views</div>
                <div className="col-span-2 text-center">Last Activity</div>
              </div>
              
              <div className="divide-y divide-gray-700">
                {filteredPosts.map((post) => (
                  <div key={post.id} className="p-4 hover:bg-gray-750">
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                      
                      {/* Topic */}
                      <div className="sm:col-span-6">
                        <div className="flex items-start space-x-2">
                          <div className="flex flex-col space-y-1">
                            {post.isPinned && (
                              <span className="text-xs text-yellow-400 font-medium flex items-center">
                                📌 Pinned
                              </span>
                            )}
                            {post.isLocked && (
                              <span className="text-xs text-red-400 font-medium flex items-center">
                                🔒 Locked
                              </span>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-white hover:text-red-400 cursor-pointer">
                              {post.title}
                            </h3>
                            <div className="sm:hidden text-sm text-gray-400 mt-1">
                              by {post.author} • {post.replies} replies • {post.views} views
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Author */}
                      <div className="hidden sm:block sm:col-span-2 text-center">
                        <div className="text-sm text-gray-300">{post.author}</div>
                      </div>

                      {/* Replies */}
                      <div className="hidden sm:block sm:col-span-1 text-center">
                        <div className="text-sm text-gray-300">{post.replies}</div>
                      </div>

                      {/* Views */}
                      <div className="hidden sm:block sm:col-span-1 text-center">
                        <div className="text-sm text-gray-300">{post.views}</div>
                      </div>

                      {/* Last Activity */}
                      <div className="hidden sm:block sm:col-span-2 text-center">
                        <div className="text-sm text-gray-300">{post.lastActivity}</div>
                        <div className="text-xs text-gray-500">by {post.lastAuthor}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-8">
              <div className="flex space-x-2">
                <button className="px-3 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600">
                  Previous
                </button>
                <button className="px-3 py-2 bg-red-600 text-white rounded-md">1</button>
                <button className="px-3 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600">2</button>
                <button className="px-3 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600">3</button>
                <button className="px-3 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Topic Modal */}
      {showNewTopicModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-red-400">Create New Topic</h3>
              <button
                onClick={() => setShowNewTopicModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Topic Title</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter topic title..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <select className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500">
                  {displayCategories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                <textarea
                  rows={6}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Write your message..."
                ></textarea>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowNewTopicModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Create Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForumComponent;