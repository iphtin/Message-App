"use client";

import Link from 'next/link';
import React from 'react'
import { usePathname } from 'next/navigation'
import { format } from 'date-fns';

const ChatBox = ({chat, currentUser}) => {
    const pathname = usePathname();
    const pathUrl = pathname.slice(7, 45);
    const isChatClick = pathUrl === chat._id;

    const lastMessage = chat?.messages.length > 0 && chat?.messages[chat?.messages.length - 1];
   
    const seen = lastMessage?.seenBy?.some(
     (member) => member._id === currentUser._id
   );

    const otherMembers = chat?.members.filter((member) => member._id !== currentUser?._id);

  return (
    <Link className={`max-w-md divide-y mb-2 divide-gray-200 dark:divide-gray-700 bg-red-400`} href={`/chats/${chat._id}`}>
    <div className="pb-3 sm:pb-4">
       <div className={`flex items-center p-2 space-x-4 rtl:space-x-reverse ${isChatClick ? "bg-purple-700 rounded-md" : ""}`}>
          <div className="flex-shrink-0">
          {chat?.isGroup ? (
          <img className="w-8 h-8 rounded-full" 
          src={chat?.groupPhoto || "https://images.pexels.com/photos/17504188/pexels-photo-17504188/free-photo-of-wing-of-flying-airplane-at-sunset.jpeg"}
           alt="profileImage" />
        ) : (
          <img
            className='w-8 h-8 rounded-full'
            src={otherMembers[0]?.profileImage || "https://images.pexels.com/photos/17504188/pexels-photo-17504188/free-photo-of-wing-of-flying-airplane-at-sunset.jpeg"} alt="profilePhot" />
        )}
          </div>
          <div className="flex-1 min-w-0">  
          {chat?.isGroup ? (
               <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
               {chat?.name}
            </p>
          ): (
             <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                 {otherMembers[0]?.username }
             </p>
          ) }

             <p className={`text-sm ${seen ? "text-gray-500 dark:text-gray-400 truncate" : "text-white font-bold truncate"}`}>
               {lastMessage ? `${lastMessage.text}` : "Start Chart..."}
             </p>
          </div>
          <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
          {!lastMessage ? format(new Date(chat?.createdAt), "p") : format(new Date(chat?.lastMessageAt), "p")}
          </div>
       </div>
    </div>
</Link>
  )
}

export default ChatBox