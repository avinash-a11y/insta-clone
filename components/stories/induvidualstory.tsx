"use client";
// import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X, Clock, User } from "lucide-react";
import { BASE_URL } from '@/utils/config';

const IndividualStory = ({index, username}: {index: string, username: string}) => {
    const [currentStory, setCurrentStory] = useState<any>({});
    const [allStoriesData, setAllStoriesData] = useState<any>([]);
    const [currentStoryIndex, setCurrentStoryIndex] = useState<number>(Number(index));
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchStories = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${BASE_URL}/api/stories?username=${username}`);
                const data = await response.json();
                setAllStoriesData(data.stories || []);
                setCurrentStory(data.stories[index] || {});
            } catch (error) {
                console.error("Error fetching stories:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStories();
    }, [index, username]);
    
    const router = useRouter();
    
    const goToPrevious = () => {
        if(currentStoryIndex > 0) {
            router.push(`/stories/${currentStoryIndex - 1}/${username}`);
        } else {
            router.push(`/`);
        }
    };
    
    const goToNext = () => {
        if(currentStoryIndex < allStoriesData.length - 1) {
            router.push(`/stories/${currentStoryIndex + 1}/${username}`);
        } else {
            router.push(`/`);
        }
    };
    
    const closeStory = () => {
        router.push('/');
    };
    
    const formatTimestamp = (timestamp: string) => {
        if (!timestamp) return '';
        
        try {
            const date = new Date(timestamp);
            const now = new Date();
            const diffMs = now.getTime() - date.getTime();
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMins / 60);
            
            if (diffMins < 60) {
                return `${diffMins}m ago`;
            } else if (diffHours < 24) {
                return `${diffHours}h ago`;
            } else {
                return date.toLocaleDateString();
            }
        } catch (error) {
            return '';
        }
    };
    
    if (loading) {
        return (
            <div className="w-full h-screen bg-black flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full"></div>
            </div>
        );
    }
    
    return (
        <div className="w-full h-screen bg-black flex flex-col items-center justify-center relative">
            {/* Progress bar */}
            <div className="absolute top-0 left-0 right-0 p-2 px-4 flex gap-1">
                {allStoriesData.map((_: any, i: number) => (
                    <div 
                        key={i} 
                        className={`h-1 flex-grow rounded-full ${i <= currentStoryIndex ? 'bg-white' : 'bg-gray-600'}`}
                    ></div>
                ))}
            </div>
            
            {/* Header */}
            <div className="absolute top-4 left-0 right-0 px-4 flex justify-between items-center z-10">
                <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center mr-3">
                        {currentStory.userProfilePic ? (
                            <img 
                                src={currentStory.userProfilePic} 
                                alt={currentStory.username} 
                                className="w-full h-full rounded-full object-cover"
                            />
                        ) : (
                            <User className="w-6 h-6 text-white" />
                        )}
                    </div>
                    <div>
                        <p className="text-white font-medium">{currentStory.username}</p>
                        <div className="flex items-center text-gray-400 text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            <span>{formatTimestamp(currentStory.createdAt)}</span>
                        </div>
                    </div>
                </div>
                <button 
                    onClick={closeStory}
                    className="text-white p-2"
                    aria-label="Close story"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>
            
            {/* Main content */}
            <div className="relative max-w-md h-full w-full flex items-center justify-center">
                <img 
                    src={currentStory.story} 
                    alt={currentStory.username || "Story"} 
                    className="max-h-[80vh] max-w-full object-contain" 
                    width={1000}
                    height={1000}
                />
                
                {/* Caption */}
                {currentStory.caption && (
                    <div className="absolute bottom-20 left-0 right-0 px-6 py-3 text-center">
                        <p className="text-white text-lg font-medium bg-black/50 p-3 rounded-lg backdrop-blur-sm">
                            {currentStory.caption}
                        </p>
                    </div>
                )}
            </div>
            

            <div className="absolute left-0 h-full w-1/4 flex items-center justify-start">
                <button 
                    onClick={goToPrevious} 
                    className="text-white p-4 focus:outline-none"
                    aria-label="Previous story"
                >
                    <ChevronLeft className="w-8 h-8" />
                </button>
            </div>
            
            <div className="absolute right-0 h-full w-1/4 flex items-center justify-end">
                <button 
                    onClick={goToNext} 
                    className="text-white p-4 focus:outline-none"
                    aria-label="Next story"
                >
                    <ChevronRight className="w-8 h-8" />
                </button>
            </div>
            
            {/* Footer - Story count */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center">
                <div className="bg-gray-900/70 text-white text-sm font-medium px-4 py-2 rounded-full">
                    {currentStoryIndex + 1} of {allStoriesData.length}
                </div>
            </div>
        </div>
    );
};

export default IndividualStory;