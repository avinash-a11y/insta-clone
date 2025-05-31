"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { 
  Heart, 
  MessageCircle, 
  Bookmark, 
  Share2, 
  MoreHorizontal, 
  ArrowLeft,
  MapPin,
  Send,
  User
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BASE_URL } from '@/utils/config';

type PostType = {
  _id: string;
  username: string;
  image: string;
  caption: string;
  likes: string[];
  comments: any[];
  createdAt: string;
  __v: number;
};

const IndividualPost = ({ post }: { post: PostType }) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    setUsername(storedUsername);
    
    if (storedUsername) {
      setLiked(post.likes.includes(storedUsername));
    }
  }, [post.likes]);

  const handleLike = async () => {
    if (!username) return;
    
    try {
      setLiked(prev => !prev);
      
      const response = await fetch(`${BASE_URL}/api/posts/`, {
        method: 'PUT',
        body: JSON.stringify({ id: post._id, username }),
      });
      
      if (!response.ok) {
        setLiked(prev => !prev); // Revert if failed
      }
    } catch (error) {
      console.error('Error liking post:', error);
      setLiked(prev => !prev); // Revert if failed
    }
  };

  const handleSave = () => {
    setSaved(prev => !prev);
    // API implementation would go here
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !username) return;
    
    try {
      const response = await fetch(`${BASE_URL}/api/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          postId: post._id, 
          username, 
          text: comment 
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add comment');
      }
      
      const data = await response.json();
      
      // Optimistic update - would typically refresh comments from API
      // but for demo purposes, we can manually update
      post.comments.push(data.comment);
      
      setComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return 'recently';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 px-4">
      {/* Back Button - Mobile only */}
      <div className="md:hidden mb-4">
        <button 
          onClick={() => router.back()}
          className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span>Back</span>
        </button>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden md:flex">
          {/* Post Image */}
          <div className="md:w-3/5 bg-gray-100 dark:bg-gray-900 relative">
            <div className="aspect-square relative overflow-hidden flex items-center justify-center">
              <Image 
                src={post.image} 
                alt={post.caption} 
                width={1000}
                height={1000}
                className="object-contain w-full h-full"
                priority
              />
            </div>
          </div>
          
          {/* Post Details */}
          <div className="md:w-2/5 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center">
                <Link href={`/profile/${post.username}`} className="block">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mr-3 flex items-center justify-center">
                    {/* Replace with actual user profile pic if available */}
                    <User className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                  </div>
                </Link>
                <div>
                  <Link href={`/profile/${post.username}`} className="font-medium text-gray-900 dark:text-white hover:underline">
                    {post.username}
                  </Link>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatTimestamp(post.createdAt)}
                  </p>
                </div>
              </div>
              <button 
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                aria-label="More options"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
            
            {/* Caption */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <p className="text-gray-800 dark:text-gray-200">
                <Link href={`/profile/${post.username}`} className="font-medium hover:underline">
                  {post.username}
                </Link>{' '}
                {post.caption}
              </p>
            </div>
            
            {/* Comments */}
            <div className="flex-grow overflow-y-auto max-h-[320px] p-4">
              {post.comments && post.comments.length > 0 ? (
                <div className="space-y-4">
                  {post.comments.map((comment, index) => (
                    <p key={index} className='text-gray-800 dark:text-gray-200 font-medium '>{comment}</p>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-32 text-gray-500 dark:text-gray-400">
                  <MessageCircle className="w-10 h-10 mb-2 opacity-50" />
                  <p>No comments yet</p>
                </div>
              )}
            </div>
            
            {/* Actions */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <div className="flex space-x-4">
                  <button 
                    onClick={handleLike}
                    className="flex items-center focus:outline-none group"
                    aria-label={liked ? "Unlike post" : "Like post"}
                  >
                    <Heart 
                      className={`w-6 h-6 ${liked ? 'fill-red-500 text-red-500' : 'text-gray-700 dark:text-gray-300 group-hover:text-red-500'}`} 
                    />
                  </button>
                  <button 
                    onClick={() => {}}
                    className="flex items-center focus:outline-none group"
                    aria-label="Comment on post"
                  >
                    <MessageCircle className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-blue-500" />
                  </button>
                  <button 
                    onClick={() => {}}
                    className="flex items-center focus:outline-none group"
                    aria-label="Share post"
                  >
                    <Share2 className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-green-500" />
                  </button>
                </div>
                <button 
                  onClick={handleSave}
                  className="flex items-center focus:outline-none group"
                  aria-label={saved ? "Unsave post" : "Save post"}
                >
                  <Bookmark 
                    className={`w-6 h-6 ${saved ? 'fill-yellow-500 text-yellow-500' : 'text-gray-700 dark:text-gray-300 group-hover:text-yellow-500'}`} 
                  />
                </button>
              </div>
              
              <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                {post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}
              </div>
              
              {/* Add Comment */}
              <form onSubmit={handleSubmitComment} className="flex items-center">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="flex-grow bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-l-lg py-2 px-3 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={!comment.trim()}
                  className={`px-4 py-2 rounded-r-lg ${
                    comment.trim()
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                  aria-label="Post comment"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndividualPost; 