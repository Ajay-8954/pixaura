import { Dialog } from '@radix-ui/react-dialog'
import React, { useRef, useState } from 'react'
import { DialogContent, DialogHeader } from './ui/dialog'
import { Avatar } from '@radix-ui/react-avatar'
import { AvatarFallback, AvatarImage } from './ui/avatar'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button';
import { readFileAsDataURL } from '@/lib/utils'
import { toast } from 'react-toastify'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { setPosts } from '@/redux/postSlice'

const CreatePost = ({open, setOpen}) => {
    const imageRef= useRef();
    const [file, setFile]= useState("");
    const [caption, setCaption] = useState("");

    const [imagePreview, setImagePreview]= useState("");

    const [loading, setLoading]= useState(false);

    const {user}= useSelector(store=>store.auth);

    //dispatching al the posts from the store
    const {posts} = useSelector(store=>store.post);
    const dispatch = useDispatch();



const FileChangeHandler= async (e)=>{
    const file = e.target.files?.[0];
    if(file){
        setFile(file);
        const dataUrl= await readFileAsDataURL(file);
        setImagePreview(dataUrl);
        console.log(dataUrl);
    }
    

}

const createPostHandler= async (e)=>{
    const formData= new FormData();

    formData.append('caption', caption);
    if(imagePreview) formData.append('image', file);
    try{
        setLoading(true);
        const res= await axios.post("http://localhost:8000/api/v1/post/addpost", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                },
                withCredentials:true
        });

        if(res.data.success){

            //dispatching all the posts so that we can get our latest posts without refreshing
            dispatch(setPosts([ res.data.post , ...posts ])) //->[1]->[1,2]->total element
            
            toast.success(res.data.message);

        }

    } catch(error){
        console.log(error);
        toast.error(error.response.data.message)
    }
    finally{
        setLoading(false);
    }
    
}

  return (
    <Dialog open={open}>
        <DialogContent className="bg-white" onInteractOutside={()=>{setOpen(false) }}>
            <DialogHeader className="text-center font-semibold"> Create New Post</DialogHeader>

        <div className='flex gap-3 items-center'>
        <Avatar className="w-10 h-10"> {/* Adjusted size */}
        <AvatarImage className="object-cover" src={user?.profilePicture} alt="" />
        <AvatarFallback>CN</AvatarFallback>
        </Avatar>


            <div>
                <h1 className='font-semibold text-xs'>{user?.username}</h1>
                <span className="text-gray-600 text-xs">Bio here...</span>
            </div>
        </div>

        <Textarea  value={caption} onChange={(e)=>setCaption(e.target.value)} className="focus-visible:ring-transparent border-none" placeHolder="Write a caption..."/>

        {
            imagePreview && (
                <div className='w-full h-64 flex items-center justify-center'>
                    <img src={imagePreview} alt="previewing" className='object-cover h-full rounded-md' />
                </div>
            )
        }


        <input ref={imageRef} type="file" className='hidden' onChange={FileChangeHandler} />
        <Button onClick={()=>imageRef.current.click()} className="w-fit text-white mx-auto bg-[#0095F6] hover:bg-[#258bcf]">Select from device</Button>
        {
            imagePreview && (
            loading?(
                <Button>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                    Please wait
                </Button>
            ):
            (
            <Button onClick={createPostHandler} type="submit" className="w-full">Post</Button>
            )
        )
        }

        </DialogContent>
    </Dialog>
  )
}

export default CreatePost