import { Post } from "@/mongoose/schema";
import Link from "next/link";
import { redirect } from "next/navigation";
type AddPostProps = {
    params: Promise<{
      username: string;
    }>;
  };
const AddPost = async ({params}: AddPostProps) => {
    const username = (await params).username;
    if(!username){
        return <div>Invalid username go to <Link href="/signup" className="text-blue-500">Signup</Link></div>
    }
    return (
        <div className='flex flex-col gap-4 justify-center items-center mt-10'>
            <div className='flex flex-col gap-4 justify-center items-center'>
                <h1 className="text-2xl font-bold text-center text-white">Add Post</h1>
                <form action={async (formData: FormData) => {
                    "use server";
                    const caption = formData.get("caption");
                    const image = formData.get("image");
                    const response = await Post.create({
                        caption,
                        image,
                        username
                    });
                    redirect("/profile/" + username)
                }}>
                    <input type="text" placeholder="Caption" name="caption" className="border-2 border-gray-300 rounded-md p-2"/>
                    <br/>   
                    <br/>
                    <input type="text" placeholder="Image URL" name="image" className="border-2 border-gray-300 rounded-md p-2"/>
                    <br/>
                    <br/>
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded-md w-full">Add Post</button>
                </form>
            </div>
        </div>
    )
}

export default AddPost;