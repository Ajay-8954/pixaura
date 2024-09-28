import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link, useParams } from "react-router-dom";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Heart, MessageCircle } from "lucide-react";

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);

  const [activeTab, setActiveTab] = useState("posts");

  const { userProfile , user} = useSelector(store => store.auth);
  console.log(userProfile);

  //check to profile is of loggeduser or not
  const isLoggedInUserProfile = user?.id ===userProfile?._id;

  //follow h ya nhi
  const isFollowing = false;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  //displayiing posts;

  const displayedPost =
    activeTab === "posts" ? userProfile?.posts : userProfile?.bookmarks;

  return (
    <div className="flex max-w-5xl justify-center mx-auto py-8">
      <div className="flex flex-col gap-12 p-6">
        <div className="grid grid-cols-2 items-center gap-8">
          {/* Profile Picture Section */}
          <section className="flex justify-center items-center">
            <Avatar className="h-36 w-36 rounded-full border border-gray-300">
              <AvatarImage
                src={userProfile?.profilePicture}
                alt="Profile_Picture"
              />
              <AvatarFallback >CN</AvatarFallback>
            </Avatar>
          </section>

          {/* User Info and Buttons */}
          <section>
            <div className="flex flex-col gap-4">
              {/* Username */}
              <h1 className="text-2xl font-semibold">
                {userProfile?.username}
              </h1>

              {isLoggedInUserProfile ? (
                <div className="flex gap-3">
                  <Link to="/account/edit"> <Button
                    variant="secondary"
                    className="hover:bg-gray-100 border border-gray-300 px-4 py-1 rounded-md"
                  >
                    Edit Profile
                  </Button>
                  </Link>
                  <Button
                    variant="secondary"
                    className="hover:bg-gray-100 border border-gray-300 px-4 py-1 rounded-md"
                  >
                    View Archive
                  </Button>
                  <Button
                    variant="secondary"
                    className="hover:bg-gray-100 border border-gray-300 px-4 py-1 rounded-md"
                  >
                    Ad Tools
                  </Button>
                </div>
              ) : isFollowing ? (
                <>
                  <Button
                    variant="secondary"
                    className="bg-[#0095F6] hover:bg-[#3192d2] text-white border border-gray-300 px-4 py-1 rounded-md"
                  >
                    Unfollow
                  </Button>
                  <Button
                    variant="secondary"
                    className="bg-[#0095F6] hover:bg-[#3192d2] text-white border border-gray-300 px-4 py-1 rounded-md"
                  >
                    Message
                  </Button>
                </>
              ) : (
                <Button
                  variant="secondary"
                  className="bg-[#0095F6] hover:bg-[#3192d2] text-white border border-gray-300 px-4 py-1 rounded-md"
                >
                  Follow
                </Button>
              )}

              {/* Buttons Group */}
            </div>

            <div className="flex items-center gap-4 mt-5">
              <p>
                {" "}
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
                  {userProfile?.followers.length}
                </span>
                Following
              </p>
            </div>
            <div className='flex flex-col gap-1'>
                <span className='font-semibold'>{userProfile?.bio || 'bio here...'}</span>
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
                        <Heart/>
                        <span>{post?.likes?.length}</span>
                      </Button>

                      <Button>
                        <MessageCircle/>
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
