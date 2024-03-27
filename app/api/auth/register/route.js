import User from "@models/User";
import { connectToDB } from "@mongodb"
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";

export const POST = async (req) => {
    try {
        await connectToDB();

        const body = await req.json();
        
        const { username, email, password, profileImage } = body;

        console.log(username, email, password, profileImage);

        const existingUser = await User.findOne({ email})

        if(existingUser) {
          return new Response("User Already Exist", { status: 400 });
         }

        const hashPassword = await hash(password, 10);

        const newUser = await User.create({
            username,
            email,
            profileImage,
            password: hashPassword,
        })

        await newUser.save();

        return NextResponse.json(newUser, { status: 200 })

    } catch (error) {
        console.log(error);
        return NextResponse.json("Failed to create User!", {status: 500})
    }
}