import { Story } from '@/mongoose/schema';
import IndividualStory from '@/components/stories/induvidualstory';
import React from 'react'

type StoryPageProps = { 
  params: Promise<{id: string , username: string}>;
};

const page = async ({params}: StoryPageProps) => {
  const {id , username} = await params;
  return (
    <div className='w-full h-full bg-black '>       
        <IndividualStory index={id} username={username}/>
    </div>
  )
}
export default page;