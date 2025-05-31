import React from 'react';
import Profile from '@/components/profile';
type ProfilePageProps = {
  params: Promise<{username: string}>;
};
const ProfilePage = async ({params}: ProfilePageProps) => {
  const username = (await params).username;
  return (
    <div className='flex flex-col gap-4 justify-center items-center'>
        <Profile user={username}/>
    </div>  
  );
};

export default ProfilePage;
