import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link, useParams } from "react-router-dom";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Heart, MessageCircle } from "lucide-react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setFollowing } from "@/redux/userSlice";

const Profile = () => {
  const dispatch = useDispatch();

  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);

  const [activeTab, setActiveTab] = useState("posts");

  const { userProfile, user } = useSelector((store) => store.auth);
  console.log(userProfile);

  //check to profile is of loggeduser or not
  const isLoggedInUserProfile = user?.id === userProfile?._id;

  // State for follow/unfollow
  //  const [isFollowing, setIsFollowing] = useState(false);
  const isFollowing = useSelector(
    (state) => state.user.following[userId] || false
  );

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  //displayiing posts;

  const displayedPost =
    activeTab === "posts" ? userProfile?.posts : userProfile?.bookmarks;

  //follow- unfollow logic

  const handleFollowToggle = async () => {
    try {
      console.log("123");
      console.log(user.token);

      const response = await axios.post(
        `https://pixaura.onrender.com/api/v1/user/followorunfollow/${userId}`,
        {},
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        // Toggle the follow state
        dispatch(setFollowing({ userId, isFollowing: !isFollowing }));
        useGetUserProfile(userId);
      }
      console.log(response.data); // Log response if needed
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col max-w-5xl justify-center mx-auto py-8">
      <div className="flex flex-col gap-12 p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-8">
          {/* Profile Picture Section */}
          <section className="flex justify-center items-center">
            <Avatar className="h-24 w-24 sm:h-36 sm:w-36 rounded-full border border-gray-300">
              <AvatarImage
                src={userProfile?.profilePicture}
                alt="Profile_Picture"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>

          {/* User Info and Buttons */}
          <section>
            <div className="flex flex-col gap-4 ">
              {/* Username */}
              <h1 className="text-xl sm:text-2xl font-semibold text-center">
                {userProfile?.username}
              </h1>

              {isLoggedInUserProfile ? (
                <div className="flex flex-col  gap-3">
                  <Link to="/account/edit">
                    <Button
                      variant="secondary"
                      className="hover:bg-gray-100 w-full border border-gray-300 px-3 py-1 rounded-md text-sm sm:text-base"
                    >
                      Edit Profile
                    </Button>
                  </Link>
                  <Button
                    variant="secondary"
                    className="hover:bg-gray-100 border border-gray-300 px-3 py-1 rounded-md text-sm sm:text-base"
                  >
                    View Archive
                  </Button>
                  <Button
                    variant="secondary"
                    className="hover:bg-gray-100 border border-gray-300 px-3 py-1 rounded-md text-sm sm:text-base"
                  >
                    Ad Tools
                  </Button>
                </div>
              ) : (
                <Button
                  variant="secondary"
                  onClick={handleFollowToggle}
                  className={`${
                    isFollowing ? "bg-red-500" : "bg-[#0095F6]"
                  } hover:bg-opacity-75 text-white border border-gray-300 px-3 py-1 rounded-md text-sm sm:text-base`}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </Button>
              )}
            </div>

            <div className="flex items-center gap-4 mt-5 text-sm sm:text-base">
              <p>
                <span className="font-semibold">
                  {userProfile?.posts.length}
                </span>
                Posts
              </p>
              <p>
                <span className="font-semibold">
                  {userProfile?.followers.length}
                </span>
                Followers
              </p>
              <p>
                <span className="font-semibold">
                  {userProfile?.following.length}
                </span>
                Following
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <span className="font-semibold">
                {userProfile?.bio || "bio here..."}
              </span>
            </div>
          </section>
        </div>

        <div className="border-t border-t-gray-200">
          <div className="flex items-center justify-center gap-10 text-sm">
            <span
              className={`py-3 cursor-pointer   ${
                activeTab === "posts" ? "font-bold" : " "
              }`}
              onClick={() => handleTabChange("posts")}
            >
              POSTS
            </span>

            <span
              className={`py-3 cursor-pointer   ${
                activeTab === "saved" ? "font-bold" : " "
              }`}
              onClick={() => handleTabChange("saved")}
            >
              SAVED
            </span>

            <span className="py-3 cursor-pointer">REELS</span>

            <span className="py-3 cursor-pointer">TAGS</span>
          </div>

          <div className="grid grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {displayedPost?.map((post) => {
              return (
                <div
                  key={post?.id}
                  className="relative group overflow-hidden rounded-lg"
                >
                  <img
                    src={post?.image}
                    alt="postImage"
                    className="object-cover w-full h-full rounded-lg transition-transform duration-300 ease-in-out transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-white font-semibold text-lg">
                      <Button>
                        <Heart />
                        <span>{post?.likes?.length}</span>
                      </Button>

                      <Button>
                        <MessageCircle />
                        <span>{post?.comment?.length}</span>
                      </Button>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
