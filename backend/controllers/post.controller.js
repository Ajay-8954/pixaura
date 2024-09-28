import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import { getReceiverSocketId } from "../socket/socket.js";

export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;

    if (!image) {
      return res.status(400).json({ message: "Please upload an image" });
    }

    const optimizedImgeBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800 })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    //buffer to data uri
    const fileUri = `data:image/jpeg;base64,${optimizedImgeBuffer.toString(
      "base64"
    )}`;
    const cloudResponse = await cloudinary.uploader.upload(fileUri);
    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: authorId,
    });

    const user = await User.findById(authorId);
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }

    await post.populate({
      path: "author",
      select: "-password",
    });
    return res.status(201).json({
      message: " New post added",
      post,
      success: true,
    });
  } catch (error) {
    console.error(error);
  }
};

export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "username profilePicture",
        },
      });
    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.error(error);
  }
};

export const getUserPost = async (req, res) => {
  try {
    const authorId = req.id;
    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "username, profilePicture",
      })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "username, profilePicture",
        },
      });

    return res.status(200).json({
      posts,
      sucess: true,
    });
  } catch (error) {
    console.error(error);
  }
};

export const likePost = async (req, res) => {
  try {
    const likeKrneWalaUserKiId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "post not found", success: false });
    //like logic started

    await post.updateOne({ $addToSet: { likes: likeKrneWalaUserKiId } });
    await post.save();
    return res.status(200).json({ message: "post liked", success: true });

    //implementing socket.io for real notification

    const user= await User.findById(likeKrneWalaUserKiId).select('username profilePicture')
    const postOwnerId = post.author.toString();

    if(postOwnerId!==likeKrneWalaUserKiId){
      //emit a notification

      const notification = {
        type :'like',
        userId: likeKrneWalaUserKiId,
        postId,
        message: 'Your post was liked'
      }

      const postOwnerSocketId = getReceiverSocketId(postOwnerId);
      io.to(postOwnerSocketId).emit('notification', notification);

    }


  } catch (error) {
    console.error(error);
  }
};

export const dislikePost = async (req, res) => {
  try {
    const likeKrneWalaUserKiId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post)
      return res.status(404).json({ message: "post not found", success: false });
    //like logic started

    await post.updateOne({ $pull: { likes: likeKrneWalaUserKiId } });
    await post.save();


        //implementing socket.io for real notification

    const user= await User.findById(likeKrneWalaUserKiId).select('username profilePicture')
    const postOwnerId = post.author.toString();

    if(postOwnerId!==likeKrneWalaUserKiId){
      //emit a notification

      const notification = {
        type :'like',
        userId: likeKrneWalaUserKiId,
        postId,
        message: 'Your post was liked'
      }

      const postOwnerSocketId = getReceiverSocketId(postOwnerId);
      io.to(postOwnerSocketId).emit('notification', notification);
      
    }



    return res.status(200).json({ message: "post disliked", success: true });


  } catch (error) {
    console.error(error);
  }
};

export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const commentKrneWalaKiId = req.id;

    const { text } = req.body;
    const post = await Post.findById(postId);
    if (!text)
      return res
        .status(404)
        .json({ message: "text is required ", success: false });

    const comment = await Comment.create({
      text,
      author: commentKrneWalaKiId,
      post: postId,
    })


    await comment.populate({
        path: "author",
        select: "username profilePicture",
    })

    post.comments.push(comment._id);
    await post.save();
    return res.status(200).json({
      message: "comment added",
      success: true,
      comment,
    });
  } catch (error) {
    console.error(error);
  }
};

export const getCommentsOfPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const comments = await Comment.find({ post: postId }).populate(
      "author",
      "username, profilePicture"
    );

    if (!comments) {
      return res
        .status(404)
        .json({ message: "no comments found", success: false });
    }

    return res.status(200).json({ comments, success: true });
  } catch (error) {
    console.error(error);
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "post not found", success: false });

    //check if the logged in user is the owner of the post
    if (post.author.toString() !== authorId)
      return res.status(401).json({ message: "unauthorised " });

    //delete post
    await Post.findByIdAndDelete(postId);

    //remove the postId from the user
    let user = await User.findById(authorId);
    user.posts.filter((id) => id.toString() !== postId);
    await user.save();

    //delete associated comments
    await Comment.deleteMany({ post: postId });

    return res.status(200).json({
      message: "post deleted",
      success: true,
    });
  } catch (err) {
    console.error(err);
  }
};

export const bookmarkPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const post = await Post.findById(postId);
    if (!post)
      return res.status(404).json({ message: "post not found", success: true });

    const user = await User.findById(authorId);

    if (user.bookmarks.includes(postId)) {
      //already bookmarked => remove from the bookmark
      await user.updateOne({ $pull: { bookmarks: postId } });
      await user.save();
      return res
        .status(200)
        .json({ message: "post unbookmarked", success: true });
    } else {
      //bookmark krna pdega
      await user.updateOne({ $addToSet: { bookmarks: postId } });
      await user.save();
      return res.status(200).json({
        type: "saved",
        message: "post unbookmarked",
        success: true,
      });
    }
  } catch (error) {
    console.error(error);
  }
};
