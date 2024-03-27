"use client";

import Loader from "@components/Loading";
import { GroupOutlined } from "@mui/icons-material";
import { CldUploadButton } from "next-cloudinary";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const GroupInfo = () => {
  const [loading, setLoading] = useState(true);
  const [chat, setChat] = useState({});

  const { chatId } = useParams();

  const getChatDetails = async () => {
    try {
      const res = await fetch(`/api/chats/${chatId}`);
      const data = await res.json();
      setChat(data);
      setLoading(false);
      reset({
        name: data?.name,
        groupPhoto: data?.groupPhoto,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (chatId) {
      getChatDetails();
    }
  }, [chatId]);

  const {
    register,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { error },
  } = useForm();

  const uploadPhoto = (result) => {
    setValue("groupPhoto", result?.info?.secure_url);
  };

  const router = useRouter();

  const updateGroupChat = async (data) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/chats/${chatId}/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      setLoading(false);

      if (res.ok) {
        router.push(`/chats/${chatId}`);
      }

    } catch (error) {
      console.log(error);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="flex justify-center items-center h-screen bg-gray-900">
    <div className="bg-gray-800 p-8 rounded-lg">
      <h1 className="text-3xl font-bold text-white mb-6">Edit Group Info</h1>
  
      <form className="space-y-4" onSubmit={handleSubmit(updateGroupChat)}>
        <div className="relative">
          <input
            {...register("name", {
              required: "Group chat name is required",
            })}
            type="text"
            placeholder="Group chat name"
            className="input-field w-full px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring focus:border-blue-300"
          />
          <GroupOutlined className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400" />
        </div>
        {error?.name && <p className="text-red-500">{error.name.message}</p>}
  
        <div className="flex items-center justify-between">
          <img
            src={watch("groupPhoto") || "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg"}
            alt="profile"
            className="w-40 h-40 rounded-full"
          />
          <CldUploadButton
            options={{ maxFiles: 1 }}
            onUpload={uploadPhoto}
            uploadPreset="uewxgvm2"
          >
            <p className="text-white font-bold cursor-pointer">Upload new photo</p>
          </CldUploadButton>
        </div>
  
        <div className="flex flex-wrap gap-3">
          {chat?.members?.map((member, index) => (
            <p className="selected-contact text-white bg-gray-700 px-2 py-1 rounded-md" key={index}>{member.username}</p>
          ))}
        </div>
  
        <button className="btn bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md" type="submit">
          Save Changes
        </button>
      </form>
    </div>
  </div>  
  );
};

export default GroupInfo;