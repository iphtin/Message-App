import { format } from 'date-fns';
import React from 'react'

const Messages = ({message, currentUser}) => {

  const isCurrentUserSender = message.sender._id === currentUser._id;

  return (
    <div
    key={message.id}
    className={`flex ${
      isCurrentUserSender ? "justify-end" : "justify-start"
    } mb-2`}
  >
    {!isCurrentUserSender ? (
 <div className="flex items-start gap-2.5">
    <img className="w-8 h-8 rounded-full" src={ message.sender.profileImage || "https://images.pexels.com/photos/2773977/pexels-photo-2773977.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"} alt="Bonnie Green image" />
     <div className="flex flex-col gap-1">
      <div className="flex flex-col w-full max-w-[500px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
         <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">{ message.sender.username}</span>
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{format(new Date(message?.createdAt), "p")}</span>
         </div>
         <p className="text-sm font-normal text-gray-900 dark:text-white">{message.text} </p>
         <span className="text-sm mt-2 font-normal text-gray-500 dark:text-gray-400">Delivered</span>
        </div>
    </div>
  </div>
    ): (
    <div
      className={``}
    >
      <span className="text-sm flex justify-end font-normal mb-2 text-[#fff]">{format(new Date(message?.createdAt), "p")}</span>
      <div className='p-2 w-full max-w-[500px] rounded-b-lg bg-blue-600 text-white rounded-tl-lg'>
      <p>{message.text}</p>
      <span className="text-sm mt-1 flex justify-end font-normal text-[#fff]">Delivered</span>
     </div>
    </div>
    )}
  </div>
  )
}

export default Messages