import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Dialog, DialogContent, DialogTrigger } from "@radix-ui/react-dialog";
import { Bookmark, Heart, MoreHorizontal, Send } from "lucide-react";
import { Button } from "./ui/button";
import { MessageCircle } from "lucide-react";
import { FaHeart } from "react-icons/fa6";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { setPosts, setSelectedPost } from "@/redux/postSlice";

const Post = ({ post }) => {
  const [text, setText] = useState("");

  const { user } = useSelector(store => store.auth);

  //for comment
  const [open, setOpen] = useState(false);

  const [liked, setLiked] = useState(post.likes.includes(user?._id)|| false);

  const [comment, setComment]= useState(post.comments)

  const [postLike, setPostLike] = useState(post.likes.length);


  const { posts } = useSelector(store=> store.post);
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const likeOrDislikeHandler = async () => {
    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.get(
        `http://localhost:8000/api/v1/post/${post._id}/${action}`,
        { withCredentials: true }
      );
      console.log(res.data);

      if (res.data.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
        setLiked(!liked);

        //apne  post ko update krunga
        const updatedPostData = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter(id=> id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );
        dispatch(setPosts(updatedPostData));

        toast.success(res.data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };


  const commentHandler=  async()=>{
    try{
      const res = await axios.post(`http://localhost:8000/api/v1/post/${post._id}/comment`, {text}, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      });

      if(res.data.success){
        const updatedCommentData= [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map(p=>
          p._id === post._id ? {...p, comments: updatedCommentData} : p
        );

        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }

    } catch(err){
      console.log(err);
    }
  }

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/v1/post/delete/${post?._id}`,
        { withCredentials: true }
      );

      const updatedPostData = posts.filter(
        (postItem) => postItem._id !== post?._id
      );
      dispatch(setPosts(updatedPostData));

      if (res.data.success) {
        alert(res.data.message);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      // toast.error(error.response.data.message);
    }
  };

  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 ">
          <Avatar>
            <AvatarImage className="h-8 w-8 rounded-full " src={post.author?.profilePicture} alt="post_image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1>{post.author?.username}</h1>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>

          <DialogContent className="flex flex-col items-center space-y-4 p-6 text-sm text-center bg-white shadow-lg rounded-lg">
            <Button className="w-full py-2 text-red-600 hover:bg-red-100">
              Unfollow
            </Button>
            <Button className="w-full py-2 text-blue-600 hover:bg-blue-100">
              Add to Favourites
            </Button>

            {/* if post_id is equal to author_id then we will show delete button otherwise not */}

            {user?.id === post?.author._id && (
              <Button
                onClick={deletePostHandler}
                className="w-full py-2 text-gray-600 hover:bg-gray-100"
              >
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <img
        className="rounded-sm my-2 w-full aspect-square object-cover"
        src={post.image}
        alt="Post_img"
      />
      <div className="">
        <div className="flex  items-center justify-between my-2">
          <div className="flex items-center gap-3">


            {

              liked? <FaHeart
              size={"22px"}
              className="cursor-pointer text-red-600"
              onClick={likeOrDislikeHandler}
            /> : <FaHeart
            size={"22px"}
            className="cursor-pointer tex-white-600  hover:text-gray-600"
            onClick={likeOrDislikeHandler}
          />


            }
            

            <MessageCircle
              onClick={() => {
                dispatch(setSelectedPost(post));
                setOpen(true);
              }}
              className="cursor-pointer hover:text-gray-600"
            />

            <Send className="cursor-pointer hover:text-gray-600" />
          </div>
          <Bookmark className="cursor-pointer hover:text-gray-600" />
        </div>
        <span className="font-medium block mb-2">{postLike} likes</span>
        <p>
          <span className="font-medium mr-2">{post.author?.username}</span>
          {post.caption}
        </p>

        <span
          onClick={() => setOpen(true)}
          className="cursor-pointer text-sm text-gray-400"
        >
          View all {comment.length} comments
        </span>
        <CommentDialog open={open} setOpen={setOpen} />

        <div className="flex">
          <input
            type="text"
            placeholder="Add a comment.."
            className="outline-none text-sm w-full"
            value={text}
            onChange={changeEventHandler}
          />

          {text &&   <span onClick={commentHandler} className="text-[#3BADF8] cursor-pointer">Post</span>}
        </div>
      </div>
    </div>
  );
};

export default Post;
