"use client"
import React, { useEffect, useState } from 'react'
import { Grid, User, Heart, Settings, MapPin, Link as LinkIcon, Calendar, Edit3, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { BASE_URL } from '@/utils/config';

const ProfilePage = ({ user }: { user: string }) => {
  const [username, setUsername] = useState<string | null>(null)
  const [userData, setUserData] = useState<any>(null)
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('posts')
  const [following, setFollowing] = useState(false)
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)
        const storedUsername = localStorage.getItem("username")
        setUsername(storedUsername)

        const response = await fetch(`${BASE_URL}/api/profile?username=${user}`)
        const data = await response.json()
        setUserData(data)
        
        // Determine if logged in user is following this profile
        const followResponse = await fetch(`${BASE_URL}/api/follow?username=${storedUsername}&usernameToFollow=${user}`)
        const followData = await followResponse.json()
        setFollowing(followData.isFollowing)

        const postsResponse = await fetch(`${BASE_URL}/api/getuserposts?username=${user}`)
        const postsData = await postsResponse.json()
        setPosts(postsData)
      } catch (error) {
        console.error("Error fetching profile data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [user])

  const handleFollow = async () => {
    // Toggle follow state optimistically
    setFollowing(prev => !prev)
    
    try {
      // Implement API call for following/unfollowing
      const response = await fetch(`${BASE_URL}/api/follow`, {
        method: 'POST',
        body: JSON.stringify({ username: username, usernameToFollow: user }),
      })
      const data = await response.json();
      console.log(data);
      // In case of error, revert state
      // if (!response.ok) setFollowing(prev => !prev)
    } catch (error) {
      console.error("Error following user:", error)
      setFollowing(prev => !prev)
    }
  }


  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 animate-pulse">
          <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div className="flex-1 w-full">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="flex gap-6 mt-4 justify-center sm:justify-start">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            </div>
            <div className="mt-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!username || !userData) {
    return null
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full opacity-75 group-hover:opacity-100 blur group-hover:blur-md transition duration-1000"></div>
          <img
            src={userData.profilePicture || "https://i.pravatar.cc/150?img=10"}
            alt="Profile"
            className="relative w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-900 shadow-lg"
          />
        </div>
        
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row items-center sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{userData.username}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {userData.location || "Earth"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                <LinkIcon className="h-4 w-4 mr-1" />
                <a href={userData.website || "#"} className="text-blue-500 hover:underline">
                  {userData.website || "No website"}
                </a>
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Joined {new Date(userData.createdAt || Date.now()).toLocaleDateString()}
              </p>
            </div>
            
            <div className="mt-4 sm:mt-0 flex gap-2">
              {username === userData.username ? (
                <>
                  <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center" onClick={() => {
                    router.push("/profile/editprofile/" + userData.username);
                  }}>
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </button>
                  <button className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label="Settings">
                    <Settings className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <button 
                  onClick={handleFollow}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    following 
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600' 
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {following ? 'Following' : 'Follow'}
                </button>
              )}
            </div>
          </div>
          
          <div className="flex gap-8 mt-6 justify-center sm:justify-start text-sm">
            <div className="text-center">
              <p className="font-semibold text-gray-900 dark:text-white text-lg">{posts.length}</p>
              <p className="text-gray-600 dark:text-gray-400">posts</p>
            </div>
            <div className="text-center cursor-pointer hover:opacity-80 transition-opacity">
              <p className="font-semibold text-gray-900 dark:text-white text-lg">{userData.followers?.length || 0}</p>
              <p className="text-gray-600 dark:text-gray-400">followers</p>
            </div>
            <div className="text-center cursor-pointer hover:opacity-80 transition-opacity">
              <p className="font-semibold text-gray-900 dark:text-white text-lg">{userData.following?.length || 0}</p>
              <p className="text-gray-600 dark:text-gray-400">following</p>
            </div>
          </div>
          
          <div className="mt-6">
            <p className="text-gray-800 dark:text-gray-200 text-sm">
              {userData.bio || "No bio yet."}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-10 border-b border-gray-200 dark:border-gray-800">
        <div className="flex">
          <button 
            className={`flex items-center px-4 py-2 text-sm font-medium ${
              activeTab === 'posts' 
                ? 'text-blue-500 border-b-2 border-blue-500' 
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('posts')}
          >
            <Grid className="h-4 w-4 mr-2" />
            Posts
          </button>
          <button 
            className={`flex items-center px-4 py-2 text-sm font-medium ${
              activeTab === 'saved' 
                ? 'text-blue-500 border-b-2 border-blue-500' 
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('saved')}
          >
            <Heart className="h-4 w-4 mr-2" />
            Saved
          </button>
          <button 
            className={`flex items-center px-4 py-2 text-sm font-medium ${
              activeTab === 'tagged' 
                ? 'text-blue-500 border-b-2 border-blue-500' 
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('tagged')}
          >
            <User className="h-4 w-4 mr-2" />
            Tagged
          </button>
        </div>
      </div>

      {/* Posts Grid */}
      {activeTab === 'posts' && (
        posts.length > 0 ? (
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {posts.map((post) => (
              <div key={post._id} className="aspect-square group relative overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
                <img
                  src={post.image}
                  alt={post.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex items-center space-x-4 text-white">
                    <div className="flex items-center">
                      <Heart className="h-5 w-5 mr-1 fill-white" />
                      <span className="text-sm font-semibold">{post.likes.length}</span>
                    </div>
                    <div className="flex items-center">
                      <MessageCircle className="h-5 w-5 mr-1" />
                      <span className="text-sm font-semibold">{post.comments.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-10 text-center p-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <Grid className="h-10 w-10 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">No Posts Yet</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              {username === userData.username ? 
                "Start sharing your moments by creating your first post!" :
                `${userData.username} hasn't posted anything yet.`
              }
            </p>
            {username === userData.username && (
              <Link href={"/add/post/" + username} className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Create Post 
              </Link>
            )}
          </div>
        )
      )}

      {/* Saved Posts - Empty State */}
      {activeTab === 'saved' && username === userData.username && (
        <div className="mt-10 text-center p-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <Heart className="h-10 w-10 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">No Saved Posts</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Save posts you'd like to see again by tapping the bookmark icon.
          </p>
        </div>
      )}

      {/* Tagged Posts - Empty State */}
      {activeTab === 'tagged' && (
        <div className="mt-10 text-center p-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <User className="h-10 w-10 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">No Tagged Posts</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            When people tag you in posts, they'll appear here.
          </p>
        </div>
      )}
    </div>
  )
}

export default ProfilePage
