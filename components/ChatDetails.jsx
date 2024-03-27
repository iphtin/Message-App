"use client";

import { useEffect, useRef, useState } from 'react';
import Messages from './Messages';
import Loader from './Loading';
import { pusherClient } from '@libs/Pusher';
import Link from 'next/link';

const ChatDetails = ({chatId, currentUser}) => {
  const [otherMembers, setOtherMembers] = useState([]);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [photo, setPhoto] = useState("");
  const bottomRef = useRef(null);

  const getChatDetail = async () => {
      try {
        const res = await fetch(`/api/chats/${chatId}`,  {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });
        const data = await res.json();
        console.log("Data", data);
        setOtherMembers(data?.members?.filter(othermember => othermember._id !== currentUser._id));
        setChats(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
  }

  useEffect(() => {
      if(chatId && currentUser) {
        getChatDetail();
      }
  }, [chatId, currentUser])

  const handleSendMessage = async () => {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text,
          chatId: chats._id,
          currentUserId: currentUser._id,
          photo
        })
      })

      const data = await res.json();

      setText("");
  }

  useEffect(() => {
     pusherClient.subscribe(chatId);

     const handleMessage = (newMessage) => {
       setChats((prevMessage) => {
        return {
          ...prevMessage,
          messages: [...prevMessage.messages, newMessage]
        }
       })
     }

     pusherClient.bind("newMessage", handleMessage);

     return () => {
      pusherClient.unsubscribe(chatId);
      pusherClient.unbind("newMessage", handleMessage);
     }

  }, [currentUser, chatId])

   useEffect(() => {
    bottomRef.current?.scrollIntoView({
     behavior: "smooth",
    })
  }, [chats?.messages])

  return loading ? <Loader /> : (
    <div className="h-[90%] overflow-hidden flex flex-col bg-[#111827] text-white">
      {/* Top bar with user profile picture and username */}
      {chats?.isGroup ? (
         <div className="flex items-center py-4">
          <Link href={`/chats/${chatId}/group-info`}>
         <img
           src={chats.groupPhoto || "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg"} 
           alt="Profile Picture"
           className="w-10 h-10 rounded-full mr-2"
         />
          </Link>
         <span className="font-semibold">{chats.name}</span> {/* Replace with actual username */}
       </div>
      ) : (
      <div className="flex items-center py-4">
        <img
          src={ otherMembers[0].profileImage || "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg"} // Replace with actual profile picture URL
          alt="Profile Picture"
          className="w-10 h-10 rounded-full mr-2"
        />
        <span className="font-semibold">{otherMembers[0].username}</span> {/* Replace with actual username */}
      </div>

      )}

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto px-4">
        {chats?.messages?.map((message, index)=> (
          <div key={index}>
            <Messages message={message} currentUser={currentUser} />
            <div ref={bottomRef} />
          </div>
        ))}
      </div>

      {/* Message input */}
      <div className="p-4 flex">
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type your message..."
          className="w-full p-2 rounded-md bg-gray-800 border-none outline-none text-white"
        />
        <button onClick={handleSendMessage}
         className='text-white ml-2 bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700'>
            Send
        </button>
      </div>
    </div>
  );
};

export default ChatDetails;
