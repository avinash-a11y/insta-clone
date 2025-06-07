"use client";
import React, { useState } from 'react';

export default function AddPostClient({ username }: { username: string }) {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [caption, setCaption] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        const formData = new FormData(e.currentTarget);
        
        try {
            const response = await fetch(`/api/posts`, {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                window.location.href = `/profile/${username}`;
            } else {
                console.error("Failed to create post");
                setIsSubmitting(false);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            setIsSubmitting(false);
        }
    };

    return (
        <div className='flex flex-col gap-4 justify-center items-center mt-10 mb-10'>
            <div className='flex flex-col gap-4 justify-center items-center w-full max-w-md px-4'>
                <h1 className="text-2xl font-bold text-center text-white">Add Post</h1>
                <form onSubmit={handleSubmit} className="w-full" encType="multipart/form-data">
                    <input type="hidden" name="username" value={username} />
                    
                    <div className="mb-4">
                        <label htmlFor="caption" className="block text-sm font-medium text-gray-300 mb-2">Caption</label>
                        <textarea 
                            id="caption"
                            placeholder="Write a caption..." 
                            name="caption" 
                            rows={3}
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            className="w-full border-2 border-gray-700 bg-gray-800 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                    </div>
                    
                    <div className="mb-6">
                        <label htmlFor="image" className="block text-sm font-medium text-gray-300 mb-2">Upload Image</label>
                        <div className={`w-full border-2 border-dashed ${imagePreview ? 'border-blue-500' : 'border-gray-700'} bg-gray-800 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-700 transition-all duration-200`}>
                            <input 
                                type="file" 
                                id="image"
                                name="image" 
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden" 
                                required
                            />
                            <label htmlFor="image" className="cursor-pointer flex flex-col items-center justify-center">
                                {!imagePreview ? (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="text-gray-400 text-sm">Click to upload an image</span>
                                        <span className="text-gray-500 text-xs mt-1">(JPG, PNG, GIF up to 10MB)</span>
                                    </>
                                ) : (
                                    <span className="text-blue-400 text-sm">Change image</span>
                                )}
                            </label>
                        </div>
                        {imagePreview && (
                            <div className="mt-3 rounded-lg overflow-hidden">
                                <img src={imagePreview} className="w-full h-auto" alt="Preview" />
                            </div>
                        )}
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={isSubmitting || !imagePreview}
                        className={`w-full font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-md 
                            ${isSubmitting || !imagePreview 
                                ? 'bg-gray-600 cursor-not-allowed' 
                                : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
                            } text-white`}
                    >
                        {isSubmitting ? 'Posting...' : 'Share Post'}
                    </button>
                </form>
            </div>
        </div>
    );
} 