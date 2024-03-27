import Chat from "@models/Chat";
import Message from "@models/Message";
import User from "@models/User";
import { connectToDB } from "@mongodb"
import { NextResponse } from "next/server"

export const GET = async (req, { params }) => {
    try {
        await connectToDB();
        const { userId } = params

        console.log("UserId", userId)

        const chat = await Chat.find({members: userId }).sort({ lastMessageAt: -1 })
        .populate({
             path: "members",
             model: User
        }) .populate({
            path: "messages",
            model: Message,
            populate: {
                path: "sender seenBy",
                model: User,
            }
        }) 
          .exec();

        return NextResponse.json(chat, { status: 200 })
    } catch (error) {
        return NextResponse.json("Failed to get UserId", { status: 500})
    }
}