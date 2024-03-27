import { pusherServer } from "@libs/Pusher";
import Chat from "@models/Chat";
import Message from "@models/Message";
import User from "@models/User";
import { connectToDB } from "@mongodb"
import { NextResponse } from "next/server";

export const POST = async (req) => {
    try {
        await connectToDB();
        const body = await req.json();

        const { chatId, currentUserId, text, photo } = body

        const currretUser = await User.findById(currentUserId);

        const newMessage = await Message.create({
            chat: chatId,
            sender: currretUser,
            text,
            photo
        })

        const updatedChat = await Chat.findByIdAndUpdate(chatId, {
           $push: { messages: newMessage._id },
           $set: {lastMessageAt: newMessage.createdAt, sender: newMessage.sender }
        }, {new: true}).populate({
          path: "messages",
          model: Message,
          populate: { path: "sender seenBy", model: User }
      }).populate({
          path: "members",
          model: User
      }).exec();

        console.log("UPDatedChat", updatedChat)
        
      await pusherServer.trigger(chatId, "newMessage", newMessage);

      const lastMessage = updatedChat.messages[updatedChat.messages.length - 1];
      const lastMessageAt = updatedChat.lastMessageAt;

      console.log("LastMessage", lastMessageAt)

      updatedChat.members.forEach(async (member) => {
         try {
           await pusherServer.trigger(member._id.toString(), "update-chat", {
             id: chatId,
             messages: [lastMessage],
             lastMessageAt: lastMessageAt
           });
         } catch (err) {
           console.error(`Failed to trigger update-chat event`);
         }
       });

     return NextResponse.json(newMessage, { status: 200 })

    } catch (error) {
        console.log(error.message)
        return NextResponse.json("Failed to Create Message", {status: 500})  
    }
}