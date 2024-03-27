"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Loader from "./Loading";
import ChatBox from "./ChatBox";
import { pusherClient } from "@libs/Pusher";

const ChatList = () => {
   const [search, setSearch] = useState('');
   const [loading, setLoading] = useState(true);
   const [chats, setChats] = useState([]);
   const [filteredChats, setFilteredChats] = useState([]);

   const { data: session } = useSession();
   const currentUser = session?.user


   // Function to handle search input change
   const handleSearchChange = (event) => {
      setSearch(event.target.value);
   };

   useEffect(() => {
      // Filter chats based on search value
      const filteredChats = chats?.filter(chat => {
         // Check if chat name matches search value
         const nameMatch = chat.name.toLowerCase().includes(search.toLowerCase());
         // Check if any member's username matches search value
         const memberMatch = chat?.members?.some(member => member.username?.toLowerCase().includes(search.toLowerCase()));
         return nameMatch || memberMatch;
      });
      setFilteredChats(filteredChats); // Update the state of filtered chats
   }, [search, chats]);;

   const handleChats = async () => {
      try {
         const res = await fetch(`/api/users/${currentUser._id}`);
         const data = await res.json();
         setChats(data);
         setLoading(false);
      } catch (error) {
         console.log(error)
      }
   }

   useEffect(() => {
      if (currentUser) {
         handleChats();
      }
   }, [currentUser])

   useEffect(() => {

      if (currentUser && currentUser._id) {
         pusherClient.subscribe(currentUser._id)

         const handleUpdatedChat = (updatedChat) => {
            setChats((allChats) => allChats.map(chat => {
               if (chat._id === updatedChat.id) {
                  return { ...chat, messages: updatedChat.messages, lastMessageAt: updatedChat.lastMessageAt }
               } else {
                  return chat;
               }
            }))
         }

         const handleChats = (chat) => {
            setChats((allChat) => [...allChat, chat]);
         }

         pusherClient.bind("update-chat", handleUpdatedChat)
         pusherClient.bind("new-chat", handleChats)

         return () => {
            pusherClient.unsubscribe(currentUser._id)
            pusherClient.unbind("update-chat", handleUpdatedChat)
            pusherClient.unbind("new-chat", handleChats)
         }
      }


   }, [currentUser])

   return loading ? <Loader /> : (
      <div className='p-4'>
         <div className='mb-4'>
            <input type="text" placeholder='Search...'
               value={search}
               onChange={handleSearchChange}
               className='bg-gray-50 border border-gray-300
        text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
            />
         </div>
         {filteredChats?.map((chat, index) => (
            <ChatBox
               chat={chat}
               key={index}
               currentUser={currentUser}
            />
         ))}
      </div>
   )
}

export default ChatList