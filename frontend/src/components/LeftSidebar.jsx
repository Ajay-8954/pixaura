import React, { useState } from "react";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import CreatePost from "./CreatePost";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import logo from '../images/pixAura_logo.png';

const LeftSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // getting user value from store =>redux
  const { user } = useSelector(store => store.auth);
  const [open, setOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      const res = await axios.post("https://pixaura.onrender.com/api/v1/user/logout", {
        withCrendentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));

        navigate("/login");
        toast(res.data.message);
      }
    } catch (error) {
      alert(error);
    }
  };

  const sidebarHandler = (textType) => {
    if (textType === "Logout") {
      logoutHandler();
    } else if (textType === "Create") {
      setOpen(true);
    } else if (textType==="Profile"){
      navigate(`/profile/${user?.id}`)
    } else if (textType==="Home"){
      navigate(`/`);
    }
    else if (textType==="Messages"){
      navigate('/chat');
    }
      else if(textType==="Search"){
      navigate('/search');
    }
  };

  const sidebarItems = [
    {
      icon: <Home />,
      text: "Home",
    },
    {
      icon: <Search />,
      text: "Search",
    },
    {
      icon: <TrendingUp />,
      text: "Explore",
    },
    {
      icon: <MessageCircle />,
      text: "Messages",
    },
    {
      icon: <Heart />,
      text: "Notifications",
    },
    {
      icon: <PlusSquare />,
      text: "Create",
    },
    {
      icon: (
        <Avatar className="w-6 h-6">
          <AvatarImage  className="rounded-full" src={user?.profilePicture} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    {
      icon: <LogOut />,
      text: "Logout",
    },
  ];


   return (
    <>
      {/* Sidebar for medium and larger screens */}
      <div className="hidden md:block fixed top-0 z-30 left-0 w-[16%] h-screen px-4 border-r border-gray-300 bg-white transition-colors duration-300 overflow-y-auto">
        <div className="flex flex-col">
          <div className="flex justify-center mt-4 mb-6">
            <img
              src={logo}
              alt="Logo"
              className="w-48 h-auto md:w-64 lg:w-72"
            />
          </div>
          <div>
            {sidebarItems.map((item, index) => (
              <div
                onClick={() => sidebarHandler(item.text)}
                key={index}
                className="flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3"
              >
                {item.icon}
                {/* Only show text on screens medium and above */}
                <span className="hidden md:block">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom navigation bar for mobile screens */}
      <div className="fixed z-50 bottom-0 left-0 right-0 bg-white shadow-lg flex justify-around p-2 md:hidden">
        {sidebarItems
          .filter(item => item.text !== "Explore" && item.text !== "Notifications") // Exclude unneeded items for mobile
          .map((item, index) => (
            <div
              onClick={() => sidebarHandler(item.text)}
              key={index}
              className="flex flex-col items-center cursor-pointer text-gray-600 hover:text-purple-600"
            >
              {item.icon}
              {/* Hide labels in the bottom navigation bar for mobile */}
              <span className="hidden">{item.text}</span>
            </div>
          ))}
      </div>

      <CreatePost open={open} setOpen={setOpen} />
    </>
  );
};

export default LeftSidebar;

 
