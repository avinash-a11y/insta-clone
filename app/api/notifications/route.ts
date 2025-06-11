import { NextResponse } from 'next/server';

// Simulate a database of notifications
const notificationDatabase = [
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

export async function GET(request: Request) {
  // Simulate delay for realistic loading experience
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Parse query parameters
  const url = new URL(request.url);
  const limit = url.searchParams.get('limit');
  const filter = url.searchParams.get('filter');
  
  let notifications = [...notificationDatabase];
  
  // Apply filters if provided
  if (filter === 'unread') {
    notifications = notifications.filter(notification => !notification.read);
  } else if (filter && filter !== 'all') {
    notifications = notifications.filter(notification => notification.type === filter);
  }
  
  // Apply limit if provided
  if (limit) {
    notifications = notifications.slice(0, parseInt(limit));
  }
  
  return NextResponse.json({ 
    notifications,
    unreadCount: notificationDatabase.filter(n => !n.read).length
  });
}

export async function POST(request: Request) {
  try {
    const { id, action } = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: 'Notification ID is required' }, { status: 400 });
    }
    
    if (action === 'markAsRead') {
      // Find notification and mark as read
      const notificationIndex = notificationDatabase.findIndex(n => n.id === id);
      
      if (notificationIndex === -1) {
        return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
      }
      
      notificationDatabase[notificationIndex].read = true;
      
      return NextResponse.json({ 
        success: true,
        notification: notificationDatabase[notificationIndex],
        unreadCount: notificationDatabase.filter(n => !n.read).length
      });
    } else if (action === 'markAllAsRead') {
      // Mark all notifications as read
      notificationDatabase.forEach(notification => {
        notification.read = true;
      });
      
      return NextResponse.json({ 
        success: true,
        unreadCount: 0
      });
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error handling notification update:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 