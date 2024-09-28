
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import SuggestedUsers from './SuggestedUsers';

const RightSidebar = () => {

  const {user} = useSelector(store=>store.auth);

  return (

    
    <div className=" my-8  pr-6">
    <div className="flex items-center gap-2 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
      <Link to={`/profile/${user?._id}`} className="flex-shrink-0">
        <Avatar className="w-12 h-12">
          <AvatarImage src={user?.profilePicture} alt="profile_image" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </Link>
      <div className="ml-3">
        <h1 className="font-bold text-gray-800 text-sm">{user?.username}</h1>
        <span className="text-gray-500 text-xs">{user?.bio || 'bio here...'}</span>
      </div>
    </div>

  

    <SuggestedUsers/>
    </div>
  )
}

export default RightSidebar;
