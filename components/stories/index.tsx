"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PlusCircle } from "lucide-react";
import { BASE_URL } from '@/utils/config';

const Stories = () => {
    const router = useRouter();
    const [username, setUsername] = useState<string | null>(null);
    const [stories, setStories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchStories = async () => {
            try {
                setLoading(true);
                const username = localStorage.getItem("username");
                if(!username){
                    router.push("/signup");
                }
                setUsername(username);
                const response = await fetch(`${BASE_URL}/api/stories?username=${username}`);
                const data = await response.json();
                setStories(data.stories);
            } catch (error) {
                console.error("Failed to fetch stories:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStories();
    }, []);

    if (loading) {
        return (
            <div className="flex gap-2 overflow-x-auto p-4 border-b border-gray-200 dark:border-gray-800 scrollbar-hide">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex flex-col items-center space-y-1 flex-shrink-0">
                        <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
                        <div className="w-12 h-2 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (!username) {
        return null;
    }

    return (
        <div className="flex gap-4 overflow-x-auto py-4 px-2 border-b border-gray-200 dark:border-gray-800 scrollbar-hide">
            {/* Add Story Button */}
            <div className="flex flex-col items-center space-y-1 flex-shrink-0" onClick={() => router.push(`/add/story?username=${username}`)}>
                <div className="w-16 h-16 rounded-full relative group cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full opacity-80 group-hover:opacity-100 transition-opacity duration-200"></div>
                    <div className="absolute inset-0.5 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center">
                        <PlusCircle className="w-8 h-8 text-blue-500" />
                    </div>
                </div>
                <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">Add Story</span>
            </div>

            {/* Story Items */}
            {stories.map((story: any, index: number) => (
                <div 
                    key={story._id || story.id} 
                    className="flex flex-col items-center space-y-1 flex-shrink-0"
                    onClick={() => router.push(`/stories/${index}/${username}`)}
                >
                    <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 cursor-pointer hover:scale-105 transition-transform duration-200">
                        <div className="w-full h-full rounded-full overflow-hidden border-2 border-white dark:border-gray-900">
                            <img 
                                src={story.story || "https://via.placeholder.com/150"} 
                                alt={story.username} 
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                    <span className="text-xs text-gray-700 dark:text-gray-300 truncate max-w-[64px] text-center">
                        {story.username}
                    </span>
                </div>
            ))}

            {/* Show empty placeholders if less than 4 stories */}
            {stories.length < 4 && username && Array.from({ length: 4 - stories.length }).map((_, i) => (
                <div key={`empty-${i}`} className="flex flex-col items-center space-y-1 flex-shrink-0 opacity-40">
                    <div className="w-16 h-16 rounded-full p-0.5 bg-gray-300 dark:bg-gray-700">
                        <div className="w-full h-full rounded-full overflow-hidden border-2 border-white dark:border-gray-900 bg-gray-100 dark:bg-gray-800"></div>
                    </div>
                    <span className="text-xs text-gray-400 dark:text-gray-600 truncate max-w-[64px] text-center">
                        --------
                    </span>
                </div>
            ))}
        </div>
    );
}

export default Stories;