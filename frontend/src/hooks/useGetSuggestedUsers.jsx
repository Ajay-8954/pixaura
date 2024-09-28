import axios from "axios";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setPosts } from "@/redux/postSlice.js";
import { setSuggestedUsers } from "@/redux/authSlice";

const useGetSuggestedUsers= ()=>{
    const dispatch= useDispatch();

    useEffect(()=>{
        const fetchSuggestedUsers= async()=>{
            try{

               const res= await axios.get('https://pixaura.onrender.com/api/v1/user/suggested',{withCredentials:true});

               if(res.data.success){
                dispatch(setSuggestedUsers(res.data.users));
                console.log(res.data);
                
               }


            } catch(err){
                console.error(err)
            }
        }
        fetchSuggestedUsers();
    },[])
};

export default useGetSuggestedUsers;