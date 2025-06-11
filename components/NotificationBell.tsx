"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Bell, Heart, MessageCircle, UserPlus, Camera, 
  User, Award, Eye, Clock, X
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Tooltip from './Tooltip';

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
  username: string;
  userImage: string;
  content: string;
  postId?: string;
  postImage?: string;
  timestamp: string;
  read: boolean;
}

const NotificationBell = () => {
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [bellAnimating, setBellAnimating] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Mock data loading
  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      const mockNotifications: Notification[] = [
        {
          id: "1",
          type: "like",
          username: "emily_designs",
          userImage: "https://randomuser.me/api/portraits/women/44.jpg",
          content: "liked your photo",
          postId: "post1",
          postImage: "https://source.unsplash.com/random/100x100?sig=1",
          timestamp: new Date(Date.now() - 10 * 60000).toISOString(), // 10 minutes ago
          read: false
        },
        {
          id: "2",
          type: "comment",
          username: "alex_photography",
          userImage: "https://randomuser.me/api/portraits/men/32.jpg",
          content: "commented on your post",
          postId: "post2",
          timestamp: new Date(Date.now() - 30 * 60000).toISOString(), // 30 minutes ago
          read: false
        },
        {
          id: "3",
          type: "follow",
          username: "jessica_travel",
          userImage: "https://randomuser.me/api/portraits/women/68.jpg",
          content: "started following you",
          timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), // 2 hours ago
          read: false
        }
      ];
      
      setNotifications(mockNotifications);
      setNotificationCount(mockNotifications.filter(n => !n.read).length);
      setLoading(false);
      
      // Animate bell when notifications arrive
      if (mockNotifications.filter(n => !n.read).length > 0) {
        setBellAnimating(true);
        setTimeout(() => setBellAnimating(false), 2000);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Mark notification as read
  const markAsRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
    
    setNotificationCount(prev => Math.max(0, prev - 1));
  };

  // Get notification icon based on type
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "like": return <Heart className="text-red-500" size={16} />;
      case "comment": return <MessageCircle className="text-blue-500" size={16} />;
      case "follow": return <UserPlus className="text-green-500" size={16} />;
      case "mention": return <User className="text-purple-500" size={16} />;
      case "tag": return <Camera className="text-pink-500" size={16} />;
      case "story_view": return <Eye className="text-amber-500" size={16} />;
      case "milestone": return <Award className="text-yellow-500" size={16} />;
      case "reminder": return <Clock className="text-indigo-500" size={16} />;
      default: return <Bell className="text-gray-500" size={16} />;
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

  return (
    <div className="relative" ref={dropdownRef}>
      <Tooltip content={`${notificationCount > 0 ? `${notificationCount} unread notifications` : 'No notifications'}`}>
        <button 
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-dark-300 transition-colors text-gray-700 dark:text-gray-300 relative hover-bell-shake focus-ring"
          onClick={() => setShowDropdown(!showDropdown)}
          aria-label={`Notifications ${notificationCount > 0 ? `(${notificationCount} unread)` : ''}`}
          title="Notifications"
        >
          <Bell className={`h-6 w-6 ${bellAnimating ? 'animate-bell-shake' : ''}`} aria-hidden="true" />
          
          {notificationCount > 0 && (
            <span className="absolute top-0 right-0 flex h-4 w-4">
              <span className="animate-ping absolute h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative rounded-full h-4 w-4 bg-brand-500 flex items-center justify-center animate-pulse-badge">
                <span className="text-[10px] font-bold text-white">{notificationCount}</span>
              </span>
            </span>
          )}
          <span className="sr-only">View notifications</span>
        </button>
      </Tooltip>
      
      {showDropdown && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-30 backdrop-blur-modal md:bg-transparent md:backdrop-filter-none md:inset-auto md:relative">
          <div className="absolute right-0 mt-2 w-full max-w-sm insta-card p-0 overflow-hidden z-50 animate-slide-down shadow-[var(--shadow-elevation-high)] md:w-80 md:right-0 md:top-10">
            <div className="p-3 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
              <div className="flex space-x-2">
                <Link 
                  href="/notifications" 
                  className="text-xs text-brand-500 dark:text-brand-400 hover:text-brand-600 dark:hover:text-brand-500 transition-colors focus-ring rounded-md px-2 py-1"
                  onClick={() => setShowDropdown(false)}
                >
                  See all
                </Link>
                <button
                  className="p-1 rounded-full text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-300 focus-ring"
                  onClick={() => setShowDropdown(false)}
                  aria-label="Close notifications"
                >
                  <X size={16} aria-hidden="true" />
                  <span className="sr-only">Close</span>
                </button>
              </div>
            </div>
            
            <div className="max-h-[calc(100vh-200px)] md:max-h-96 overflow-y-auto">
              {loading ? (
                <div className="p-4 space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-start animate-pulse">
                      <div className="skeleton-circle w-8 h-8 mr-3"></div>
                      <div className="flex-1">
                        <div className="skeleton-text w-3/4 mb-2"></div>
                        <div className="skeleton-text w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-6 text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 dark:bg-dark-300 flex items-center justify-center mb-3">
                    <Bell size={20} className="text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">No notifications yet</p>
                </div>
              ) : (
                <div className="stagger-fade-in">
                  {notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`p-3 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-dark-200 transition-colors ${!notification.read ? 'bg-brand-50 dark:bg-brand-900/10' : ''} animate-fade-in`}
                    >
                      <div className="flex items-start">
                        <div className="relative">
                          <div className="w-8 h-8 rounded-full overflow-hidden hover-expand">
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
                          <p className="text-xs text-gray-900 dark:text-gray-100">
                            <Link href={`/profile/${notification.username}`} className="font-semibold hover:text-brand-500 dark:hover:text-brand-400 transition-colors">
                              {notification.username}
                            </Link>{' '}
                            <span className="text-gray-700 dark:text-gray-300">
                              {notification.content}
                            </span>
                          </p>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                            {formatTime(notification.timestamp)}
                          </p>
                        </div>
                        
                        {!notification.read && (
                          <Tooltip content="Mark as read">
                            <button 
                              className="ml-2 p-1 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus-ring"
                              onClick={(e) => markAsRead(notification.id, e)}
                              aria-label="Mark as read"
                              title="Mark as read"
                            >
                              <X size={14} aria-hidden="true" />
                              <span className="sr-only">Mark as read</span>
                            </button>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  <div className="p-3 text-center">
                    <Link 
                      href="/notifications" 
                      className="text-sm text-brand-500 dark:text-brand-400 hover:text-brand-600 dark:hover:text-brand-500 transition-colors focus-ring px-3 py-1 rounded-md inline-block"
                      onClick={() => setShowDropdown(false)}
                    >
                      View all notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell; 