import Link from "next/link";
import AddPostClient from './AddPostClient';

export default function AddPost({ params }: { params: { username: string } }) {
    const { username } = params;
    
    if(!username){
        return <div>Invalid username go to <Link href="/signup" className="text-blue-500">Signup</Link></div>
    }
    
    return <AddPostClient username={username} />;
}