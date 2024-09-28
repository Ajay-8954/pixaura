import axios from "axios";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setPosts } from "@/redux/postSlice.js";

const useGetAllPost= ()=>{
    const dispatch= useDispatch();

    useEffect(()=>{
        const fetchAllPost= async()=>{
            try{

               const res= await axios.get('https://pixaura.onrender.com/api/v1/post/all',{withCredentials:true});

               if(res.data.success){
                dispatch(setPosts(res.data.posts));
                console.log(res.data);
                
               }


            } catch(err){
                console.error(err)
            }
        }
        fetchAllPost();
    },[])
};

export default useGetAllPost;