import { Dialog } from "@radix-ui/react-dialog";
import React, { useState } from "react";
import { DialogContent, DialogTrigger } from "./ui/dialog";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import Comment from "./Comment";

const CommentDialog = ({ open, setOpen }) => {

  const [text, setText] = useState("");

  const {selectedPost}= useSelector(store=>store.post)

  const changeEventHandler= (e)=>{
    const inputText= e.target.value;

    if(inputText.trim()){
      setText(inputText);
    } else{
      setText("");
    }
  }


  const sendMessageHandler= async () =>{
    alert(text)
  }

  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="max-w-5xl p-0 flex flex-col"
      >
        <div className="flex flex-1">
          {/* Left side - Image */}
          <div className="w-1/2">
            <img
              src={selectedPost?.image}  alt="Dialog Content"
              className="w-full h-full object-cover rounded-l-lg"
            />
          </div>

          {/* Right side - Comments, User info */}
          <div className="w-1/2 flex flex-col justify-between bg-white p-4">
            {/* User Info Section */}
            <div className="flex items-center justify-between">
              <div className="flex gap-3 items-center">
                <Link>
                  <Avatar>
                    <AvatarImage src={selectedPost?.author?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link  className="font-semibold text-sm">{selectedPost?.author?.username}</Link>
                </div>
              </div>

{/* //next popup open */}

<Dialog>
      <DialogTrigger asChild>
        <MoreHorizontal className="cursor-pointer" />
      </DialogTrigger>

      {/* Dialog content with white background */}
      <DialogContent className="flex flex-col text-center bg-white p-4 rounded-lg shadow-lg">
        <div className="space-y-2">
          <div className="cursor-pointer text-red-500 font-bold hover:bg-gray-100 p-2 rounded">
            Unfollow
          </div>
          <div className="cursor-pointer hover:bg-gray-100 p-2 rounded">
            Add to Favourite
          </div>
        </div>
      </DialogContent>
    </Dialog>

            </div>
            <hr />

            <div className="flex-1 overflow-y-auto max-h-96 p-4">
              {
                selectedPost?.comments.map((comment)=> <Comment key= {comment._id} comment= {comment}/>  )
              }
            </div>
            <div className="p-1">
              <div className="flex items-center gap-2">
                <input onChange={changeEventHandler} value={text} type="text" placeholder="Add a comment..." className="w-full outline-none border-gray-400 p-2 rounded" />
                <Button disabled={!text.trim()} onClick={sendMessageHandler} variant="outline">Send</Button>
              </div>
            </div>

            
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
