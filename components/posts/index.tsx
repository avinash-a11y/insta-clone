"use client"
import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal, Send } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { BASE_URL } from '@/utils/config';

const Posts = ({ posts }: { posts: any[] }) => {
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [savedPosts, setSavedPosts] = useState<Record<string, boolean>>({});
  const [username, setUsername] = useState<string | null>(null);
  const [expandedCaptions, setExpandedCaptions] = useState<Record<string, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Initialize states with posts data
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    setUsername(storedUsername);

    // Create initial liked state based on API data
    const initialLikedState: Record<string, boolean> = {};
    const initialSavedState: Record<string, boolean> = {};
    const initialExpandedState: Record<string, boolean> = {};
    const initialCommentInputs: Record<string, string> = {};

    posts.forEach(post => {
      initialLikedState[post._id] = post.likes.includes(storedUsername);
      initialSavedState[post._id] = false; // You would need an API for saved posts
      initialExpandedState[post._id] = false;
      initialCommentInputs[post._id] = '';
    });

    setLikedPosts(initialLikedState);
    setSavedPosts(initialSavedState);
    setExpandedCaptions(initialExpandedState);
    setCommentInputs(initialCommentInputs);
    setIsLoading(false);
  }, [posts]);

  const handleLike = async (id: string) => {
    try {
      setLikedPosts(prev => ({ ...prev, [id]: !prev[id] }));
      
      const response = await fetch(`${BASE_URL}/api/posts/`, {
        method: 'PUT',
        body: JSON.stringify({ id: id, username: username }),
      });
      
      if (!response.ok) {
        // Revert state if API call fails
        setLikedPosts(prev => ({ ...prev, [id]: !prev[id] }));
        console.error('Failed to update like status');
      }
    } catch (error) {
      console.error('Error liking post:', error);
      // Revert state if exception occurs
      setLikedPosts(prev => ({ ...prev, [id]: !prev[id] }));
    }
  };

  const handleShare = (id: string) => {
    console.log(`Sharing post ${id}`);
    const url = `${BASE_URL}/posts/${id}`;
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard');
  };

  const handleSave = (id: string) => {
    setSavedPosts(prev => ({ ...prev, [id]: !prev[id] }));
    // You would implement API call here to save post to user's collection
  };

  const toggleCaption = (id: string) => {
    setExpandedCaptions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCommentChange = (id: string, value: string) => {
    setCommentInputs(prev => ({ ...prev, [id]: value }));
  };

  const submitComment = (id: string) => {
    if (!commentInputs[id]?.trim()) return;
    
    // You would implement API call here to submit comment
    console.log(`Submitting comment for post ${id}: ${commentInputs[id]}`);
    
    // Clear input after submission
    setCommentInputs(prev => ({ ...prev, [id]: '' }));
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return 'recently';
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-xl mx-auto py-6 space-y-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="insta-card overflow-hidden animate-pulse" style={{ animationDelay: `${i * 0.15}s` }}>
            <div className="flex items-center px-5 py-4">
              <div className="w-11 h-11 rounded-full bg-gray-100 dark:bg-dark-300 mr-3"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-100 dark:bg-dark-300 rounded-full w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-100 dark:bg-dark-300 rounded-full w-1/5"></div>
              </div>
              <div className="w-8 h-8 bg-gray-50 dark:bg-dark-200 rounded-full"></div>
            </div>
            <div className="w-full aspect-square bg-gray-100 dark:bg-dark-300">
              <div className="h-full w-full bg-gradient-to-b from-gray-50 to-gray-100 dark:from-dark-200 dark:to-dark-300 shimmer"></div>
            </div>
            <div className="px-5 py-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex space-x-3">
                  <div className="w-8 h-8 bg-gray-100 dark:bg-dark-300 rounded-full"></div>
                  <div className="w-8 h-8 bg-gray-100 dark:bg-dark-300 rounded-full"></div>
                  <div className="w-8 h-8 bg-gray-100 dark:bg-dark-300 rounded-full"></div>
                </div>
                <div className="w-8 h-8 bg-gray-100 dark:bg-dark-300 rounded-full"></div>
              </div>
              <div className="h-4 bg-gray-100 dark:bg-dark-300 rounded-full w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-100 dark:bg-dark-300 rounded-full w-1/2 mb-3"></div>
              <div className="h-10 bg-gray-50 dark:bg-dark-200 rounded-full w-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!username) {
    return null;
  }

  return (
    <div className="max-w-xl mx-auto py-6 space-y-8">
      {posts.map((post, index) => (
        <div
          key={post._id}
          style={{ animationDelay: `${index * 0.1}s` }}
          className="bg-white dark:bg-dark-200 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md animate-slide-up"
        >
          {/* Header: User Info */}
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center">
              <Link href={`/profile/${post.username}`} className="relative group">
                <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white dark:border-dark-100 shadow-md group-hover:shadow-lg transition-all duration-300 mr-3 group-hover:scale-105">
                  <img
                    src={'https://png.pngtree.com/png-vector/20191110/ourmid/pngtree-avatar-icon-profile-icon-member-login-vector-isolated-png-image_1978396.jpg'}
                    alt={post.username}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 bg-gradient-to-tr from-brand-400/20 to-brand-600/20 transition-opacity duration-300"></div>
              </Link>
              <div>
                <Link href={`/profile/${post.username}`} className="hover:text-brand-500 dark:hover:text-brand-400 transition-colors">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{post.username}</p>
                </Link>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatTimestamp(post.createdAt)}
                </p>
              </div>
            </div>
            <button className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-300 hover:text-gray-700 dark:hover:text-gray-200 transition-all" aria-label="More options">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* Image */}
          <div className="relative group overflow-hidden">
            <img
              src={post.image}
              alt={post.caption}
              className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {likedPosts[post._id] && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none transform scale-150 opacity-0 heart-animation">
                <Heart className="w-24 h-24 text-white drop-shadow-lg" fill="white" />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center space-x-5">
              <button 
                className="group relative"
                onClick={() => handleLike(post._id)}
                aria-label={likedPosts[post._id] ? "Unlike post" : "Like post"}
              >
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-full group-hover:bg-red-50 dark:group-hover:bg-red-900/20 transition-colors">
                    <Heart 
                      className={`w-6 h-6 transition-all duration-300 ${
                        likedPosts[post._id] 
                          ? 'text-red-500 fill-red-500 scale-110' 
                          : 'text-gray-700 dark:text-gray-300 group-hover:text-red-500'
                      }`} 
                    />
                  </div>
                  <span className={`text-sm font-medium transition-colors ${
                    likedPosts[post._id] 
                      ? 'text-red-500' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {post.likes.length + (likedPosts[post._id] && !post.likes.includes(username) ? 1 : 0)}
                  </span>
                </div>
              </button>
              
              <button className="group relative" aria-label="Comment on post">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                    <MessageCircle className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-500 transition-colors">
                    {post.comments.length}
                  </span>
                </div>
              </button>
              
              <button className="group relative" aria-label="Share post" onClick={() => handleShare(post._id)}>
                <div className="p-1.5 rounded-full group-hover:bg-green-50 dark:group-hover:bg-green-900/20 transition-colors">
                  <Share2 className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-green-500 transition-colors" />
                </div>
              </button>
            </div>
            
            <button 
              className="group relative"
              onClick={() => handleSave(post._id)}
              aria-label={savedPosts[post._id] ? "Unsave post" : "Save post"}
            >
              <div className="p-1.5 rounded-full group-hover:bg-yellow-50 dark:group-hover:bg-yellow-900/20 transition-colors">
                <Bookmark 
                  className={`w-6 h-6 transition-all duration-300 ${
                    savedPosts[post._id] 
                      ? 'text-yellow-500 fill-yellow-500' 
                      : 'text-gray-700 dark:text-gray-300 group-hover:text-yellow-500'
                  }`} 
                />
              </div>
            </button>
          </div>

          {/* Caption */}
          <div className="px-5 pb-4">
            <div className="flex items-start space-x-2">
              <div className="bg-gray-50 dark:bg-dark-300 px-4 py-3 rounded-2xl flex-1">
                <p className="text-sm text-gray-800 dark:text-gray-100">
                  <Link href={`/profile/${post.username}`} className="font-semibold text-brand-600 dark:text-brand-400 hover:underline">
                    {post.username}
                  </Link>{' '}
                  <span className="text-gray-700 dark:text-gray-200">
                    {expandedCaptions[post._id] || post.caption.length < 100 
                      ? post.caption 
                      : post.caption.substring(0, 100) + '... '}
                  </span>
                  
                  {post.caption.length > 100 && !expandedCaptions[post._id] && (
                    <button 
                      onClick={() => toggleCaption(post._id)}
                      className="text-brand-500 dark:text-brand-400 hover:text-brand-600 dark:hover:text-brand-500 font-medium ml-1"
                    >
                      more
                    </button>
                  )}
                </p>
                
                <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>{formatTimestamp(post.createdAt)}</span>
                  {post.likes.length > 0 && (
                    <span className="mx-2">•</span>
                  )}
                  {post.likes.length > 0 && (
                    <span>{post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Comments */}
          {post.comments.length > 0 && (
            <div className="px-5 pb-4">
              <Link 
                href={`/posts/${post._id}`} 
                className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
              >
                <span className="mr-1 font-medium">View all {post.comments.length} comments</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Posts;
