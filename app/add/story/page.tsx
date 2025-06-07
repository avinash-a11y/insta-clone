import { Suspense } from 'react';
import AddStoryClient from "./AddStoryClient";

export default function AddStoryPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
            <AddStoryClient />
        </Suspense>
    );
}