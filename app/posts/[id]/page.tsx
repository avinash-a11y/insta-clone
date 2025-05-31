import { Post } from "@/mongoose/schema";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { 
  Heart, 
  MessageCircle, 
  Bookmark, 
  Share2, 
  MoreHorizontal, 
  ArrowLeft,
  MapPin,
  Send
} from "lucide-react";
import IndividualPost from "@/components/posts/IndividualPost";
import { BASE_URL } from '@/utils/config';


async function getPost(id: string) {
  try {
    const response = await fetch(`${BASE_URL}/api/posts/${id}`, {
      cache: "no-store"
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch post");
    }
    
    return response.json();
  } catch (error) {
    console.error("Error fetching post:", error);
    return { post: null };
  }
}

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;  
  const data = await getPost(id);
  const post = data.post;

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <MessageCircle className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Post Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-md">
            The post you're looking for doesn't exist or has been removed.
          </p>
          <Link 
            href="/" 
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return <IndividualPost post={post} />;
}