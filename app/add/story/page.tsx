"use client"
import React, { Suspense } from 'react'; // Import Suspense
import { useRouter, useSearchParams } from 'next/navigation'; // Keep these client-side imports
import { BASE_URL } from '@/utils/config';

// This will be your client-side component that uses useSearchParams
const AddStoryForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const username = searchParams.get('username'); // This is the problematic line during prerendering

    return (
        <div className='flex flex-col items-center justify-center h-screen'>
            <h1>Add Story</h1>
            <form action={async (formData) => {
                const story = formData.get('story');
                const response = await fetch(`${BASE_URL}/api/stories`, {
                    method: 'POST',
                    body: JSON.stringify({ story , username }),
                });
                if(response.ok){
                    router.push(`/`);
                }
            }}>
                <input type="text" placeholder='Story Image URL' name='story' className='border-2 border-gray-300 rounded-md p-2' />
                <button type='submit' className='bg-blue-500 text-white p-2 rounded-md'>Add Story</button>
            </form>
        </div>
    );
}

// This is your default export for the page.
// It can be a Server Component, and it wraps the client-side logic in Suspense.
const AddStoryPage = () => {
    return (
        // Wrap the client-side component (AddStoryForm) in a Suspense boundary
        <Suspense fallback={<div>Loading form...</div>}>
            <AddStoryForm />
        </Suspense>
    );
};

export default AddStoryPage;