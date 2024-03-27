import User from "@models/User";
import { connectToDB } from "@mongodb";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            async authorize(credentials) {
                const { email, password } = credentials;

                try {
                  await connectToDB();
                  const user = await User.findOne({ email });
        
                  if (!user) {
                    return null;
                  }
        
        
                  const passwordsMatch = await compare(password, user.password);
        
                  if (!passwordsMatch) {
                    return null;
                  }
        
                  return user;
        
                } catch (error) {
                  console.log("Error: ", error);
                }
            }
        })
    ],
    callbacks: {
      async session({session}) {
        const mongodbUser = await User.findOne({ email: session.user.email })
        session.user.id = mongodbUser._id.toString()
  
        session.user = {...session.user, ...mongodbUser._doc}
  
        return session
      }
    },
      secret: process.env.NEXTAUTH_SECRET,
      session: {
        strategy: "jwt",
      }, 
});

export { handler as GET, handler as POST };