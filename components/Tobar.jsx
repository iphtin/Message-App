"use client";

import { Logout } from '@mui/icons-material';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const TopBar = () => {

  const pathname = usePathname();

  const { data: session } = useSession();
  const user = session?.user;

  const handleLogout = async () => {
    signOut({ callbackUrl: "/" });
  }
  return (
    <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
    {/* Logo and App Name */}
    <div className="flex items-center">
      <img src="/assets/logo.jpeg" alt="logo" className="w-8 h-8 mr-2" />
      <h2 className="font-bold text-lg">Iphtin Chat</h2>
    </div>

    {/* Menu */}
    <div className="flex items-center space-x-4">
      {/* Chats */}
      <Link href="/chats">
        <p className={`font-bold ${pathname === "/chats" ? "text-red-500" : "text-gray-300 hover:text-gray-100"}`}>Chats</p>
      </Link>

      {/* Contacts */}
      <Link href="/contacts">
        <p className={`font-bold ${pathname === "/contacts" ? "text-red-500" : "text-gray-300 hover:text-gray-100"}`}>Contacts</p>
      </Link>

      {/* Profile Photo */}
      <Link href="/profile">
          <img src={ user?.profileImage || "https://images.pexels.com/photos/3889661/pexels-photo-3889661.jpeg"} alt="profile" className="w-8 h-8 rounded-full hover:opacity-80" />
      </Link>

      {/* Logout */}
      <button onClick={handleLogout} className="font-bold text-gray-300 hover:text-gray-100">Sign Out</button>
    </div>
  </div>
  )
}

export default TopBar