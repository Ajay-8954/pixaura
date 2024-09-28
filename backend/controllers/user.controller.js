import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import getDataUri from "../utils/datauri.js";
import jwt from 'jsonwebtoken';
import cloudinary from "../utils/cloudinary.js";
import {Post} from '../models/post.model.js';

export const register = async (req,res)=>{
    try{
        const {username,email,password} = req.body;

        if(!username || !email || !password){
            return res.status(400).json({message: "Please fill in all fields.",
                success: false,
            });
        }
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({
                message: "Email already exists.",
                success: false,
                });
            }
            const hashedPassword = await bcrypt.hash(password,10);
    
            await User.create({
                username,
                email,
                password: hashedPassword,
            });
            res.status(201).json({
                message: "User created successfully.",
                success: true,
                });

        } catch(error){
            console.log(error);
        }

}  

export const login = async (req, res)=>{
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({message: "Please fill in all fields.",
                success: false,
            });
        }
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                message: "Email does not exist.",
                success: false,
                });
            }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch){
            return res.status(400).json({
                message: "Password is incorrect.",
                success: false,
                });
            }



        const token = jwt.sign({userId: user._id}, process.env.SECRET_KEY, {expiresIn:'1d'});
        

        const populatedPosts= await Promise.all(
            user.posts.map(async (postId) => {
                const post = await Post.findById(postId);
                if(post &&  post.author.equals(user._id)){
                    return post;
                }
                return null;
            })
        )

        user={
            id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            posts: populatedPosts,
        }
        


        return res.cookie('token', token, {httpOnly:true, sameSite:'strict', maxAge:1*24*60*60*1000}).json({
            message: `Welcome back ${user.username}`,
            success: true,
            user
        });

    } catch(error){
        console.log(error);
    }

};

export const logout  = async (_, res)=>{
    try{
        return res.cookie('token', '', {maxAge:0}).json({
            message: "Logged out successfully.",
            success: true,
        });

    } catch(error){
        console.log(error);
    }

}

export const getProfile= async(req,res)=>{
    try{
        const userId = req.params.id;
        let user = await User.findById(userId).populate({path:'posts', createdAt:-1}).populate('bookmarks');
        return res.status(200).json({
            user,
            success: true,
        });
        } catch(error){
            console.log(error);
            }
    
};

export const editProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { bio, gender } = req.body;
        const profilePicture = req.file;
        let cloudResponse;

        if (profilePicture) {
            const fileUri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({
                message: 'User not found.',
                success: false
            });
        };
        if (bio) user.bio = bio;
        if (gender) user.gender = gender;
        if (profilePicture) user.profilePicture = cloudResponse.secure_url;

        await user.save();

        return res.status(200).json({
            message: 'Profile updated.',
            success: true,
            user
        });

    } catch (error) {
        console.log(error);
    }
};

export const getSuggestedUsers= async (req, res)=>{
    try{
        const SuggestedUsers= await User.find({_id:{$ne: req.id}}). select("-password");  //returning users except password
        if(!SuggestedUsers){
            return res.status(404).json({
                message: "currently don't have any user",
            });
        }
        return  res.status(200).json({
            success: true,
            users: SuggestedUsers
        });

    } catch(error){
        console.log(error);

    }
}




export const followOrUnfollow = async (req, res) =>{
    try{
        const followKrneWala= req.id;
        const jiskofollowKrunga= req.params.id;

        if(followKrneWala=== jiskofollowKrunga){
            return res.status(400).json({
                message: "you can't follow yourself",
                });
        }
        const user= await User.findById(followKrneWala);
        const targetUser= await User.findById(jiskofollowKrunga);

        //now we have to check we follow our target or not
        if(!user || !targetUser){
            return res.status(404).json({
                message: "User not found.",
                success: false  
            })
        }
        //check krunga ki follow krna h ya unfollow
        const isFollowing= user.following.includes(jiskofollowKrunga);
        if(isFollowing){
            //unfollow krna h
            await Promise.all([
                User.updateOne({_id: followKrneWala},{$pull: {following: jiskofollowKrunga}}),
                User.updateOne({_id: jiskofollowKrunga},{$pull: {followers: followKrneWala}}),
            ])
            return res.status(200).json({
                message: "unfollowed successfully",
                success: true
                })
        }
        else{
            //follow krna h
            await Promise.all([
                User.updateOne({_id: followKrneWala},{$push: {following: jiskofollowKrunga}}),
                User.updateOne({_id: jiskofollowKrunga},{$push: {followers: followKrneWala}}),
            ])
            return res.status(200).json({
                message: "followed successfully",
                success: true
                });
        }

    } catch( error){
        console.log(error);
    }
}