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
      <div className="max-w-xl mx-auto py-6 space-y-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-sm overflow-hidden animate-pulse">
            <div className="flex items-center px-4 py-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 mr-3"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/5"></div>
              </div>
            </div>
            <div className="w-full aspect-square bg-gray-200 dark:bg-gray-700"></div>
            <div className="px-4 py-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
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
    <div className="max-w-xl mx-auto py-6 space-y-6">
      {posts.map((post) => (
        <div
          key={post._id}
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md"
        >
          {/* Header: User Info */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center">
              <Link href={`/profile/${post.username}`}>
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white dark:border-gray-800 shadow-sm mr-3">
                  <img
                    src={'https://png.pngtree.com/png-vector/20191110/ourmid/pngtree-avatar-icon-profile-icon-member-login-vector-isolated-png-image_1978396.jpg'}
                    alt={post.username}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>
              <div>
                <Link href={`/profile/${post.username}`} className="hover:underline">
                  <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{post.username}</p>
                </Link>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {formatTimestamp(post.createdAt)}
                </p>
              </div>
            </div>
            <button className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200" aria-label="More options">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* Image */}
          <div className="relative">
            <img
              src={post.image}
              alt={post.caption}
              className="w-full aspect-square object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-4">
              <button 
                className="flex items-center space-x-1 group"
                onClick={() => handleLike(post._id)}
                aria-label={likedPosts[post._id] ? "Unlike post" : "Like post"}
              >
                <Heart 
                  className={`w-6 h-6 transition-all duration-300 ${
                    likedPosts[post._id] 
                      ? 'text-red-500 fill-red-500 scale-110' 
                      : 'text-zinc-700 dark:text-zinc-300 group-hover:text-red-500'
                  }`} 
                />
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {post.likes.length + (likedPosts[post._id] && !post.likes.includes(username) ? 1 : 0)}
                </span>
              </button>
              <button className="flex items-center space-x-1 group" aria-label="Comment on post">
                <MessageCircle className="w-6 h-6 text-zinc-700 dark:text-zinc-300 group-hover:text-blue-500" />
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {post.comments.length}
                </span>
              </button>
              <button className="flex items-center space-x-1 group" aria-label="Share post" onClick={() => handleShare(post._id)}>
                <Share2 className="w-6 h-6 text-zinc-700 dark:text-zinc-300 group-hover:text-green-500" />
              </button>
            </div>
            <button 
              className="flex items-center space-x-1 group"
              onClick={() => handleSave(post._id)}
              aria-label={savedPosts[post._id] ? "Unsave post" : "Save post"}
            >
              <Bookmark 
                className={`w-6 h-6 transition-all duration-300 ${
                  savedPosts[post._id] 
                    ? 'text-yellow-500 fill-yellow-500' 
                    : 'text-zinc-700 dark:text-zinc-300 group-hover:text-yellow-500'
                }`} 
              />
            </button>
          </div>

          {/* Caption */}
          <div className="px-4 pb-3">
            <p className="text-sm text-zinc-800 dark:text-zinc-100">
              <Link href={`/profile/${post.username}`} className="font-semibold hover:underline">
                {post.username}
              </Link>{' '}
              {expandedCaptions[post._id] || post.caption.length < 100 
                ? post.caption 
                : post.caption.substring(0, 100) + '... '}
              
              {post.caption.length > 100 && !expandedCaptions[post._id] && (
                <button 
                  onClick={() => toggleCaption(post._id)}
                  className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 font-medium"
                >
                  more
                </button>
              )}
            </p>
          </div>

          {/* Comments */}
          {post.comments.length > 0 && (
            <div className="px-4 pt-1 pb-3">
              <Link href={`/comments/${post._id}`} className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200">
                View all {post.comments.length} comments
              </Link>
            </div>
          )}

          {/* Add Comment */}
          <div className="px-4 py-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center">
            <input
              type="text"
              placeholder="Add a comment..."
              className="flex-1 bg-transparent text-sm text-zinc-800 dark:text-zinc-100 outline-none placeholder:text-zinc-500 dark:placeholder:text-zinc-400"
              value={commentInputs[post._id] || ''}
              onChange={(e) => handleCommentChange(post._id, e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submitComment(post._id)}
            />
            <button 
              className={`ml-2 ${
                commentInputs[post._id]?.trim() 
                  ? 'text-blue-500 hover:text-blue-600' 
                  : 'text-zinc-400 cursor-not-allowed'
              }`}
              disabled={!commentInputs[post._id]?.trim()}
              onClick={() => submitComment(post._id)}
              aria-label="Post comment"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Posts;
