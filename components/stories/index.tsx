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
            <div className="flex gap-4 overflow-x-auto p-4 border-b border-gray-100 dark:border-gray-800 scrollbar-hide">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex flex-col items-center space-y-2 flex-shrink-0" style={{ animationDelay: `${i * 0.1}s` }}>
                        <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-dark-300 animate-pulse relative">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-dark-200 dark:to-dark-400 opacity-60"></div>
                        </div>
                        <div className="w-14 h-2.5 bg-gray-100 dark:bg-dark-300 rounded-full animate-pulse"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (!username) {
        return null;
    }

    return (
        <div className="flex gap-5 overflow-x-auto py-6 px-4 border-b border-gray-100 dark:border-gray-800 scrollbar-hide">
            {/* Add Story Button */}
            <div 
                className="flex flex-col items-center space-y-2 flex-shrink-0 cursor-pointer group" 
                onClick={() => router.push(`/add/story?username=${username}`)}
            >
                <div className="w-20 h-20 rounded-full relative shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                    <div className="absolute inset-0 insta-gradient opacity-90 rounded-full"></div>
                    <div className="absolute inset-1 bg-white dark:bg-dark-100 rounded-full flex items-center justify-center">
                        <PlusCircle className="w-9 h-9 text-brand-500 group-hover:text-brand-600 transition-colors" />
                    </div>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors">
                    Add Story
                </span>
            </div>

            {/* Story Items */}
            {stories.map((story: any, index: number) => (
                <div 
                    key={story._id || story.id} 
                    className="flex flex-col items-center space-y-2 flex-shrink-0 cursor-pointer group"
                    onClick={() => router.push(`/stories/${index}/${username}`)}
                    style={{ animationDelay: `${index * 0.1}s` }}
                >
                    <div className="relative">
                        <div className="w-20 h-20 rounded-full story-ring p-0.5 shadow-lg group-hover:shadow-xl transition-all duration-300">
                            <div className="w-full h-full rounded-full overflow-hidden border-2 border-white dark:border-dark-100">
                                <img 
                                    src={story.story || "https://via.placeholder.com/150"} 
                                    alt={story.username} 
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />
                            </div>
                        </div>
                        <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-2 border-white dark:border-dark-100 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[80px] text-center group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors">
                        {story.username}
                    </span>
                </div>
            ))}

            {/* Show empty placeholders if less than 4 stories */}
            {stories.length < 4 && username && Array.from({ length: 4 - stories.length }).map((_, i) => (
                <div key={`empty-${i}`} className="flex flex-col items-center space-y-2 flex-shrink-0 opacity-40">
                    <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-dark-400 p-0.5 shadow-sm">
                        <div className="w-full h-full rounded-full overflow-hidden border-2 border-white dark:border-dark-100 bg-gray-100 dark:bg-dark-300">
                            <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-dark-200 dark:to-dark-400 opacity-60"></div>
                        </div>
                    </div>
                    <span className="text-sm font-medium text-gray-400 dark:text-gray-600 truncate max-w-[80px] text-center">
                        --------
                    </span>
                </div>
            ))}
        </div>
    );
}

export default Stories;