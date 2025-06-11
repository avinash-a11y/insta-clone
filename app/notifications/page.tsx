"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Heart, MessageCircle, UserPlus, Camera, Bell, 
  Star, Award, Clock, User, Settings, Filter, ChevronDown, 
  CheckCircle, Calendar, Eye, ArrowLeft
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Tooltip from "@/components/Tooltip";

// Types for our notifications
type NotificationType = 
  | "like" 
  | "comment" 
  | "follow" 
  | "mention" 
  | "tag"
  | "story_view" 
  | "milestone"
  | "reminder";

interface Notification {
  id: string;
  type: NotificationType;
  userId: string;
  username: string;
  userImage: string;
  content: string;
  postId?: string;
  postImage?: string;
  timestamp: string;
  read: boolean;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [viewMode, setViewMode] = useState<"all" | "detail">("all");
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  // Mock data for notifications
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockNotifications: Notification[] = [
        {
          id: "1",
          type: "like",
          userId: "user1",
          username: "emily_designs",
          userImage: "https://randomuser.me/api/portraits/women/44.jpg",
          content: "liked your photo",
          postId: "post1",
          postImage: "https://source.unsplash.com/random/300x300?sig=1",
          timestamp: new Date(Date.now() - 10 * 60000).toISOString(), // 10 minutes ago
          read: false
        },
        {
          id: "2",
          type: "comment",
          userId: "user2",
          username: "alex_photography",
          userImage: "https://randomuser.me/api/portraits/men/32.jpg",
          content: "commented: \"This is amazing! Where was this taken?\"",
          postId: "post2",
          postImage: "https://source.unsplash.com/random/300x300?sig=2",
          timestamp: new Date(Date.now() - 30 * 60000).toISOString(), // 30 minutes ago
          read: true
        },
        {
          id: "3",
          type: "follow",
          userId: "user3",
          username: "jessica_travel",
          userImage: "https://randomuser.me/api/portraits/women/68.jpg",
          content: "started following you",
          timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), // 2 hours ago
          read: false
        },
        {
          id: "4",
          type: "mention",
          userId: "user4",
          username: "mark_adventure",
          userImage: "https://randomuser.me/api/portraits/men/78.jpg",
          content: "mentioned you in a comment: \"@you should check this out!\"",
          postId: "post3",
          timestamp: new Date(Date.now() - 5 * 3600000).toISOString(), // 5 hours ago
          read: true
        },
        {
          id: "5",
          type: "tag",
          userId: "user5",
          username: "sarah_creative",
          userImage: "https://randomuser.me/api/portraits/women/91.jpg",
          content: "tagged you in a post",
          postId: "post4",
          postImage: "https://source.unsplash.com/random/300x300?sig=3",
          timestamp: new Date(Date.now() - 23 * 3600000).toISOString(), // 23 hours ago
          read: false
        },
        {
          id: "6",
          type: "story_view",
          userId: "user6",
          username: "david_design",
          userImage: "https://randomuser.me/api/portraits/men/86.jpg",
          content: "viewed your story",
          timestamp: new Date(Date.now() - 25 * 3600000).toISOString(), // 25 hours ago
          read: true
        },
        {
          id: "7",
          type: "milestone",
          userId: "system",
          username: "Insta",
          userImage: "/logo.png",
          content: "Congratulations! You've reached 100 followers 🎉",
          timestamp: new Date(Date.now() - 2 * 86400000).toISOString(), // 2 days ago
          read: false
        },
        {
          id: "8",
          type: "reminder",
          userId: "system",
          username: "Insta",
          userImage: "/logo.png",
          content: "You haven't posted in a while. Share a moment with your followers!",
          timestamp: new Date(Date.now() - 4 * 86400000).toISOString(), // 4 days ago
          read: true
        }
      ];
      
      setNotifications(mockNotifications);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter notifications based on selected filter
  const filteredNotifications = notifications.filter(notification => {
    if (filter === "all") return true;
    if (filter === "unread") return !notification.read;
    return notification.type === filter;
  });

  // Mark a notification as read
  const markAsRead = (id: string) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
  };

  // Get notification icon based on type
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "like": return <Heart className="text-red-500" size={20} />;
      case "comment": return <MessageCircle className="text-blue-500" size={20} />;
      case "follow": return <UserPlus className="text-green-500" size={20} />;
      case "mention": return <User className="text-purple-500" size={20} />;
      case "tag": return <Camera className="text-pink-500" size={20} />;
      case "story_view": return <Eye className="text-amber-500" size={20} />;
      case "milestone": return <Award className="text-yellow-500" size={20} />;
      case "reminder": return <Clock className="text-indigo-500" size={20} />;
      default: return <Bell className="text-gray-500" size={20} />;
    }
  };

  // Format timestamp to relative time
  const formatTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      return "some time ago";
    }
  };

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    
    if (notification.postId) {
      setViewMode("detail");
      setSelectedNotification(notification);
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <div className="w-24 h-8 bg-gray-100 dark:bg-dark-300 rounded-md animate-pulse"></div>
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="insta-card p-4">
              <div className="flex items-start">
                <div className="skeleton-circle w-10 h-10 mr-3"></div>
                <div className="flex-1">
                  <div className="skeleton-text w-3/4 mb-2"></div>
                  <div className="skeleton-text w-1/2"></div>
                </div>
                <div className="skeleton-image w-10 h-10 ml-2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Notification detail view
  if (viewMode === "detail" && selectedNotification) {
    return (
      <div className="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8 min-h-screen animate-fade-in">
        <div className="insta-card overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <button 
              onClick={() => setViewMode("all")}
              className="flex items-center text-gray-700 dark:text-gray-300 hover:text-brand-500 dark:hover:text-brand-400 transition-colors focus-ring rounded-md p-1"
              aria-label="Back to notifications"
            >
              <ArrowLeft size={20} className="mr-2" />
              <span>Back to notifications</span>
            </button>
          </div>
          
          {/* Notification detail */}
          <div className="p-6">
            <div className="flex items-center mb-6">
              <div className="relative">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white dark:border-dark-300 shadow-md">
                  <img 
                    src={selectedNotification.userImage} 
                    alt={selectedNotification.username}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 p-1 bg-white dark:bg-dark-100 rounded-full shadow-sm">
                  {getNotificationIcon(selectedNotification.type)}
                </div>
              </div>
              
              <div className="ml-4">
                <div className="flex items-center">
                  <Link href={`/profile/${selectedNotification.username}`} className="font-semibold text-gray-900 dark:text-white hover:text-brand-500 dark:hover:text-brand-400 transition-colors">
                    {selectedNotification.username}
                  </Link>
                  <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">
                    {formatTime(selectedNotification.timestamp)}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mt-1">
                  {selectedNotification.content}
                </p>
              </div>
            </div>
            
            {selectedNotification.postImage && (
              <div className="rounded-lg overflow-hidden shadow-lg hover-lift">
                <img 
                  src={selectedNotification.postImage} 
                  alt="Post"
                  className="w-full h-auto object-cover"
                />
                <div className="p-4 bg-gray-50 dark:bg-dark-200">
                  <Link 
                    href={`/posts/${selectedNotification.postId}`}
                    className="insta-button-primary w-full flex justify-center items-center"
                  >
                    <span>Go to post</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8 min-h-screen bg-gray-50 dark:bg-dark-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Stay updated with your activity
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Tooltip content="Filter notifications">
              <button 
                className="insta-button-secondary flex items-center space-x-2 text-sm focus-ring"
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                aria-haspopup="true"
                aria-expanded="false"
              >
                <Filter size={16} />
                <span>Filter: {filter.charAt(0).toUpperCase() + filter.slice(1)}</span>
                <ChevronDown size={16} className={`transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
              </button>
            </Tooltip>
            
            {showFilterDropdown && (
              <div className="absolute right-0 mt-2 w-48 insta-card p-2 z-10 animate-slide-down shadow-[var(--shadow-elevation-medium)]">
                <div className="space-y-1">
                  {["all", "unread", "like", "comment", "follow", "mention", "tag", "story_view", "milestone", "reminder"].map((option) => (
                    <button
                      key={option}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors focus-ring ${
                        filter === option 
                          ? 'bg-brand-50 dark:bg-brand-900/10 text-brand-600 dark:text-brand-400' 
                          : 'hover:bg-gray-100 dark:hover:bg-dark-200 text-gray-700 dark:text-gray-300'
                      }`}
                      onClick={() => {
                        setFilter(option);
                        setShowFilterDropdown(false);
                      }}
                    >
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <Tooltip content="Mark all notifications as read">
            <button 
              className="insta-button-secondary text-sm flex items-center space-x-2 focus-ring"
              onClick={markAllAsRead}
              aria-label="Mark all notifications as read"
            >
              <CheckCircle size={16} />
              <span>Mark all as read</span>
            </button>
          </Tooltip>
        </div>
      </div>
      
      {/* Notifications */}
      {filteredNotifications.length === 0 ? (
        <div className="insta-card p-10 flex flex-col items-center justify-center text-center animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-dark-300 flex items-center justify-center mb-4">
            <Bell size={24} className="text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No notifications found</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {filter === "all" 
              ? "You don't have any notifications yet" 
              : `You don't have any ${filter} notifications`}
          </p>
        </div>
      ) : (
        <div className="space-y-3 stagger-fade-in">
          {/* Today */}
          <div className="animate-fade-in">
            <div className="sticky top-0 z-10 flex items-center py-2 px-1 bg-gray-50 dark:bg-dark-100">
              <Calendar size={14} className="text-gray-500 dark:text-gray-400 mr-2" />
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Today</h2>
            </div>
            {filteredNotifications
              .filter(notification => 
                new Date(notification.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
              )
              .map(notification => (
                <div 
                  key={notification.id}
                  className={`insta-card p-4 transition-all duration-300 ${
                    !notification.read 
                      ? 'border-l-4 border-l-brand-500 dark:border-l-brand-400' 
                      : ''
                  } hover-lift cursor-pointer`}
                  onClick={() => handleNotificationClick(notification)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Notification from ${notification.username}: ${notification.content}`}
                >
                  <div className="flex items-start">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full overflow-hidden hover-expand">
                        <img 
                          src={notification.userImage} 
                          alt={notification.username}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 p-0.5 bg-white dark:bg-dark-100 rounded-full">
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>
                    
                    <div className="ml-3 flex-1">
                      <p className="text-sm text-gray-900 dark:text-gray-100">
                        <Link 
                          href={`/profile/${notification.username}`} 
                          className="font-semibold hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {notification.username}
                        </Link>{' '}
                        <span className="text-gray-700 dark:text-gray-300">
                          {notification.content}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatTime(notification.timestamp)}
                      </p>
                    </div>
                    
                    {notification.postImage && (
                      <div className="ml-2">
                        <div className="w-14 h-14 rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-700 transition-colors">
                          <img 
                            src={notification.postImage} 
                            alt="Post"
                            className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
          
          {/* This Week */}
          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="sticky top-0 z-10 flex items-center py-2 px-1 bg-gray-50 dark:bg-dark-100">
              <Calendar size={14} className="text-gray-500 dark:text-gray-400 mr-2" />
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">This Week</h2>
            </div>
            {filteredNotifications
              .filter(notification => {
                const date = new Date(notification.timestamp);
                return date <= new Date(Date.now() - 24 * 60 * 60 * 1000) && 
                       date > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
              })
              .map(notification => (
                <div 
                  key={notification.id}
                  className={`insta-card p-4 transition-all duration-300 ${
                    !notification.read 
                      ? 'border-l-4 border-l-brand-500 dark:border-l-brand-400' 
                      : ''
                  } hover-lift cursor-pointer`}
                  onClick={() => handleNotificationClick(notification)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Notification from ${notification.username}: ${notification.content}`}
                >
                  <div className="flex items-start">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full overflow-hidden hover-expand">
                        <img 
                          src={notification.userImage} 
                          alt={notification.username}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 p-0.5 bg-white dark:bg-dark-100 rounded-full">
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>
                    
                    <div className="ml-3 flex-1">
                      <p className="text-sm text-gray-900 dark:text-gray-100">
                        <Link 
                          href={`/profile/${notification.username}`} 
                          className="font-semibold hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {notification.username}
                        </Link>{' '}
                        <span className="text-gray-700 dark:text-gray-300">
                          {notification.content}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatTime(notification.timestamp)}
                      </p>
                    </div>
                    
                    {notification.postImage && (
                      <div className="ml-2">
                        <div className="w-14 h-14 rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-700 transition-colors">
                          <img 
                            src={notification.postImage} 
                            alt="Post"
                            className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
      
      {/* Settings Button */}
      <div className="mt-8 flex justify-center">
        <Tooltip content="Configure notification preferences">
          <Link 
            href="/settings/notifications" 
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 flex items-center transition-colors focus-ring rounded-md px-3 py-2"
          >
            <Settings size={14} className="mr-1" />
            <span>Notification Settings</span>
          </Link>
        </Tooltip>
      </div>
    </div>
  );
} 