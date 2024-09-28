import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setMessages } from "@/redux/chatSlice.js";

const useGetAllMessage= ()=>{
    const dispatch= useDispatch();
    const {selectedUser} = useSelector(store=>store.auth);

    useEffect(()=>{
        const fetchAllMessage= async()=>{
            try{

               const res= await axios.get(`https://pixaura.onrender.com/api/v1/message/all/${selectedUser?._id}`,{withCredentials:true});

               if(res.data.success){
                dispatch(setMessages(res.data.message));
                console.log("your Messages:")
                console.log(res.data);
                
               }


            } catch(err){
                console.error(err)
            }
        }
        fetchAllMessage();
    },[selectedUser])
};

export default useGetAllMessage;