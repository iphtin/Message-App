import Chat from "@models/Chat";
import Message from "@models/Message";
import User from "@models/User";
import { connectToDB } from "@mongodb"
import { NextResponse } from "next/server"

export const GET = async (req, {params}) => {
     try {
        await connectToDB();

        const { chatId } = params

        const chat = await Chat.findById(chatId).populate( {
            path: "members",
            model: User
        })
        .populate({
            path: "messages",
            model: Message,
            populate: {
                path: "sender seenBy",
                model: User
            }
        })
        .exec();

        return NextResponse.json(chat, { status: 200 })
     } catch (error) {
        console.log(error.message)
        return new NextResponse.json("Failed to Get the Chats", { status: 500 })
     }
}

export const POST = async (req, { params }) => {
   try {
       await connectToDB();

       const { chatId } = params;

       const body = await req.json();
       const { currentUserId } = body;

       await Message.updateMany(
           {chat: chatId },
           { $addToSet: { seenBy: currentUserId }},
           { new: true }
       ).populate({
           path: "sender seenBy",
           model: User
       }).exec()

       return new Response("Seen All Messages By currentUser", {status: 200})
   } catch (error) {
       return new Response("Failed to Upadate seenBy ", { status: 500 })
   }
}