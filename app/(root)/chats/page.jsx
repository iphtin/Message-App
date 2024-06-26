import ChatList from '@components/ChatList'
import Contacts from '@components/Contacts'
import React from 'react'

const Chats = () => {
  return (
    <div className="w-full h-[100vh] overflow-hidden flex">
    <div className="w-1/3 bg-[#111827] max-lg:w-1/2 max-md:w-full">
      <ChatList />
    </div>
    <div className="w-2/3 bg-[#111827] max-lg:w-1/2 max-md:hidden">
      <Contacts />
    </div>
  </div>
  )
}

export default Chats