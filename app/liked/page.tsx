"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import Posts from '@/components/posts';
import { BASE_URL } from '@/utils/config';

export default function LikedPostsPage() {
  const [username, setUsername] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (!storedUsername) {
      router.push('/signin');
      return;
    }
    
    setUsername(storedUsername);
    fetchLikedPosts(storedUsername);
  }, [router]);

  const fetchLikedPosts = async (username: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`${BASE_URL}/api/posts/liked?username=${username}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch liked posts');
      }
      
      const data = await response.json();
      setLikedPosts(data.likedPosts || []);
    } catch (error) {
      console.error('Error fetching liked posts:', error);
      setError('Failed to load liked posts. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!username) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-center mb-8">
        <Heart className="w-8 h-8 text-red-500 fill-red-500 mr-3" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Posts You've Liked</h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-gray-300 dark:bg-gray-700 h-12 w-12"></div>
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 p-4 bg-red-100 dark:bg-red-900/20 rounded-lg">
          {error}
        </div>
      ) : likedPosts.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-4">
            <Heart className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto" />
          </div>
          <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No liked posts yet</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            When you like posts, they'll appear here so you can easily find them again.
          </p>
          <button 
            onClick={() => router.push('/')} 
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Explore Posts
          </button>
        </div>
      ) : (
        <Posts posts={likedPosts} />
      )}
    </div>
  );
} 