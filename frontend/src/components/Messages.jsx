import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import useGetAllMessage from "@/hooks/useGetAllMessage";
import useGetRTM from "@/hooks/useGetRTM";

const Messages = ({ selectedUser }) => {
  useGetRTM();
  useGetAllMessage();

  const { user } = useSelector(store=> store.auth);
  const { messages } = useSelector(store => store.chat);
  console.log(messages);

  return (
    <div className="overflow-y-auto flex-1 p-4">
      <div className="flex justify-center">
        <div className="flex flex-col items-center justify-center">
          <Avatar>
            <AvatarImage src={selectedUser?.profilePicture} alt="Profile" />
            <AvatarFallback>cn</AvatarFallback>
          </Avatar>
          <span>{selectedUser?.username}</span>
          <Link to={`/profile/${selectedUser?._id}`}>
            <Button variant="Secondary" className="h-8 my-2">View Profile</Button>
          </Link>
        </div>
      </div>

      {/* Displaying messages */}
      <div className="flex flex-col gap-3 mt-4">
        {messages && messages.map((msg) => {
          return (
            <div key={msg._id} className={`flex w-full ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-2 rounded-lg max-w-xs break-words ${msg.senderId === user?.id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                {msg.message}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Messages;
