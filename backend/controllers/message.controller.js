//for chatting
import {Conversation} from '../models/conversation.model.js';
import { Message } from '../models/message.model.js';
import { getReceiverSocketId, io } from '../socket/socket.js';

export const sendMessage = async (req, res)=>{
    try{
        const senderId= req.id;
        const receiverId = req.params.id;
        const {textMessage:message} = req.body;

        console.log(message);

    let conversation = await Conversation.findOne({
        participants:{$all:[senderId, receiverId]}
    });

    //establish the conversation if not started\
    if(!conversation){
        conversation = await Conversation.create({
            participants: [senderId, receiverId],
        });
    }
     const newMessage= await Message.create({
        senderId,
        receiverId,
        message
     });   

     if(newMessage) conversation.messages.push(newMessage._id)
        await Promise.all([conversation.save(), newMessage.save()]);
    

//implement socket io for real time data transfer
//jisko send krna h uski receiverId chahiye

const receiverSocketId = getReceiverSocketId(receiverId);  //socket.js


if(receiverSocketId){
    io.to(receiverSocketId).emit('newMessage', newMessage);
}



return res.status(201).json({
    newMessage,
    success:true
});
    } catch(error){
        console.log(error);
    }
}

export const getMessage= async ( req, res )=>{
    try{
        const senderId= req.id;
        const receiverId = req.params.id;
        const conversation= await Conversation.findOne({
            participants:{$all:[senderId, receiverId]}
        }).populate('messages');

        if(!conversation){
            return res.status(200).json({
                success:true,
                messages:[]
            });
        } 
        return res.status(200).json({
            success:true,
            message:conversation?.messages
        });


    } catch(error){
        console.error(error);
    }
}