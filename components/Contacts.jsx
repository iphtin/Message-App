"use client";

import { useEffect, useState } from 'react';
import Loader from './Loading';
import { CheckCircle, RadioButtonUnchecked } from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const Contacts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGroup, setIsGroup] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [name, setName] = useState("");
  const [groupPhoto, setGroupPhoto] = useState();
  const router = useRouter();

  const { data: session } = useSession();
  const currentUser = session?.user

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const getAllUser = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();

        setUsers(data.filter(user => user._id !== currentUser._id));
        setLoading(false);
      
    } catch (error) {
      console.log(error)
    }

  }

  useEffect(() => {
    if (currentUser && currentUser._id) {
      getAllUser();
    }
  }, [currentUser]);
  

  const isGroupSelected = selectedContacts.length > 1;

  const handleSelected = (contact) => {
    if (selectedContacts.includes(contact)) {
        setSelectedContacts((prevSelected) => prevSelected.filter(item => item !== contact))
    } else {
        setSelectedContacts((prevSelected) => [...prevSelected, contact])
    }
}
   const handleCreateGroup = async () => {
    if(selectedContacts.length > 1) {
      const res = await fetch("/api/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
              currentUserId: currentUser._id,
              members: selectedContacts.map((contact) => contact._id),
              isGroup: isGroupSelected,
              groupPhoto,
              name,
        })
      })
  
      const chat = await res.json();
  
      if(chat) {
        router.push(`/chats/${chat._id}`);
        setSelectedContacts([]);
     }
    }
   }

   const handleSubmit = async (user) => {
    // setSelectedContacts((prevSelected) => [...prevSelected, user]);

    if(selectedContacts) {
      const res = await fetch("/api/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
              currentUserId: currentUser._id,
              members: user._id,
              isGroup: isGroupSelected,
              groupPhoto,
              name,
        })
      })

      const chat = await res.json();

      if(chat) {
         router.push(`/chats/${chat._id}`);
         setSelectedContacts([]);
      }

    }
   }

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return loading ? <Loader /> : (
    <div className=" p-4 flex flex-col">
      {/* Search input */}
      <input
        type="text"
        placeholder="Search users"
        value={searchTerm}
        onChange={handleSearchChange}
        className="bg-gray-50 border mb-4 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />

      {/* List of users */}
      <div className='flex flex-wrap w-[100%]'>
        <div className='w-[100%]'>
          {filteredUsers.map(user => (
            <div key={user._id} className="flex items-center justify-between rounded-lg w-[100%] py-2 bg-[#000] px-3 mb-2">
              {/* Profile photo */}
              <div className='flex items-center space-x-4'>
                <img
                  src={user.profileImage}
                  alt={user.username}
                  className="w-10 h-10 rounded-full"
                />

                {/* User name */}
                <span className="font-bold">{user.username}</span>
              </div>
              {isGroup ? (
                <div onClick={() => {handleSelected(user)}}>
                 {selectedContacts.find((item) => item === user) ? (
                  <CheckCircle sx={{color: "red"}} />
              ) : (
                  <RadioButtonUnchecked />
              )} 
                </div>
              ): (
              <button onClick={() => handleSubmit(user)}
                className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                Start Chat..
              </button>
              )}

            </div>
          ))}
        </div>
        <div className='ml-4 w-[40%] h-full'>
          {isGroupSelected ? (
            <>
            <div className='flex items-center justify-between'>
              <h2 className='font-bold ml-4 mb-3'>Members:</h2>
               <span 
               onClick={() => {
                setIsGroup(false);
                setSelectedContacts([]);
              }}
               className='font-bold text-[24px] mr-4 cursor-pointer text-red-500'>X</span>
            </div>
              <div className='flex flex-wrap'>
                {selectedContacts.map((contact, index) => (
                  <span key={index}
                  className='rounded-full mb-2 font-semibold py-3 px-6 bg-blue-500 text-white'>
                  {contact.username}
                </span>
                ))}
                <input type="text" onChange={e => setName(e.target.value)} value={name}
                  className='outline-none pl-2 rounded-full text-black w-full h-[40px] mt-2'
                  placeholder='Group Name'
                />
              </div>
              <button onClick={handleCreateGroup}
              className="w-full mt-4 font-bold text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
                Create Group
              </button>
            </>
          ) : (
          <div className='mt-2'>
            <button 
            onClick={() => setIsGroup(true)}
            className='font-bold text-white text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br rounded-full h-[48px] w-full'>
              Start Group
              </button>
           </div>
     )}
        </div>
      </div>
    </div>
  );
};

export default Contacts;
