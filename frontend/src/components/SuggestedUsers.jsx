import React from "react";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";

const SuggestedUsers = () => {
  const { suggestedUsers } = useSelector((store) => store.auth);

  return (
    <div className="my-8 p-6 bg-gradient-to-r from-white to-gray-50 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-semibold text-sm text-gray-800 ">Suggested for You</h1>
        <span className="font-medium text-blue-500 hover:text-blue-700 hover:underline cursor-pointer transition duration-200">
          See All
        </span>
      </div>

      {/* Check if suggestedUsers exists and is an array */}
      {Array.isArray(suggestedUsers) && suggestedUsers.length > 0 ? (
        <div className="space-y-4">
          {suggestedUsers.map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-1 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <Link to={`/profile/${user.id}`}>
                <Avatar className="w-9 h-12">
                  <AvatarImage src={user.profilePicture} alt="profile_image" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <h1 className="font-semibold text-sm text-gray-800">
                  {user.username}
                </h1>
                <span className="text-xs text-gray-500">
                  {user.bio || "No bio available"}
                </span>
              </div>
              <span className="text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#3495d6]"> Follow</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No suggested users available</p>
      )}
    </div>
  );
};

export default SuggestedUsers;
