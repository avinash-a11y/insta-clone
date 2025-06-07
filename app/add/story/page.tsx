"use client"
import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BASE_URL } from '@/utils/config';

const AddStoryPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const username = searchParams.get('username');
    
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!username) {
        router.push('/signin');
        return null;
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Clear any previous errors
            setError(null);
            
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError("Image size should be less than 5MB");
                return;
            }
            
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!imagePreview) {
            setError("Please select an image");
            return;
        }
        
        setIsSubmitting(true);
        setError(null);
        
        try {
            const formData = new FormData(e.currentTarget);
            
            const response = await fetch(`${BASE_URL}/api/stories`, {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                router.push('/');
            } else {
                const data = await response.json();
                setError(data.error || "Failed to upload story");
                setIsSubmitting(false);
            }
        } catch (error) {
            console.error("Error uploading story:", error);
            setError("Network error. Please try again.");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
            <div className="w-full max-w-md bg-zinc-900 p-6 rounded-xl shadow-lg border border-zinc-800">
                <h1 className="text-2xl font-bold text-white mb-6 text-center">Add to Your Story</h1>
                
                {error && (
                    <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <input type="hidden" name="username" value={username} />
                    
                    <div className="mb-6">
                        <div 
                            className={`aspect-square w-full rounded-lg border-2 border-dashed 
                                ${imagePreview ? 'border-blue-500 bg-blue-900/20' : 'border-zinc-700 bg-zinc-800/50'} 
                                flex items-center justify-center overflow-hidden cursor-pointer transition-all hover:bg-zinc-800/80`}
                        >
                            <input 
                                type="file" 
                                id="storyImage" 
                                name="story" 
                                className="hidden" 
                                accept="image/*"
                                onChange={handleImageChange}
                                required
                            />
                            
                            {imagePreview ? (
                                <div className="relative w-full h-full">
                                    <img 
                                        src={imagePreview} 
                                        alt="Story preview" 
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
                                        <label htmlFor="storyImage" className="bg-blue-600 text-white py-2 px-4 rounded-lg text-sm cursor-pointer">
                                            Change Image
                                        </label>
                                    </div>
                                </div>
                            ) : (
                                <label htmlFor="storyImage" className="text-center p-4 cursor-pointer">
                                    <div className="flex flex-col items-center space-y-3">
                                        <div className="w-16 h-16 rounded-full bg-zinc-700 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </div>
                                        <span className="text-zinc-400 font-medium">Upload an image</span>
                                        <span className="text-zinc-500 text-xs">JPG, PNG, GIF (max 5MB)</span>
                                    </div>
                                </label>
                            )}
                        </div>
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={isSubmitting || !imagePreview}
                        className={`w-full py-3 px-4 rounded-lg font-medium text-white
                            ${isSubmitting || !imagePreview ? 
                                'bg-zinc-700 cursor-not-allowed' : 
                                'bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:opacity-90'
                            } transition-all duration-200`}
                    >
                        {isSubmitting ? 'Uploading...' : 'Share to Story'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddStoryPage;