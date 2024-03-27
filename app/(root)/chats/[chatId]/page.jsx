"use client"

import ChatDetails from '@components/ChatDetails'
import ChatList from '@components/ChatList'
import {useEffect} from 'react'
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation'

const ChatPage = () => {
    const { chatId } = useParams();
    const { data: session } = useSession();
    const currentUser = session?.user;

    const seenMessages = async () => {
      try {
         await fetch(`/api/chats/${chatId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            currentUserId: currentUser._id
          })
         })
      } catch (error) {
        console.log(error)
      }
  }

  useEffect(() => {
    if(currentUser && chatId) {
     seenMessages();
    }
 }, [currentUser, chatId])

  return (
    <div className="w-full h-[100vh] overflow-hidden flex">
    <div className="w-1/3 bg-[#111827] max-lg:w-1/2 max-md:hidden">
      <ChatList />
    </div>
    <div className="w-2/3 overflow-hidden bg-[#111827] max-lg:w-1/2 max-md:w-full">
      <ChatDetails chatId={chatId} currentUser={currentUser} />
    </div>
  </div>
  )
}

export default ChatPage