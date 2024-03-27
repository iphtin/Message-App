"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CldUploadButton } from 'next-cloudinary';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { signIn } from "next-auth/react"
 
export default function SignUp({type}) {
  const[img, setImage] = useState(null);
  const { register, handleSubmit, setValue,
    watch,reset, formState: { errors } } = useForm();
    const router = useRouter();

  const uploadPhoto = (result) => {
    setValue("profileImage", result?.info?.secure_url);
    setImage(result?.info?.secure_url);
}

  const onSubmit = async (data) => {
      if(type === "register") {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(data),
      });

        if(res.ok) {
          router.push("/")
        }

        if(res.error) {
          toast.error("something Went Wrong!");
        }

      }

      if(type === "login") {
        const res = await signIn("credentials", {
          ...data,
          redirect: false,
        });

        if (res.ok) {
          router.push("/chats");
        }
  
        if (res.error) {
          toast.error("Invalid email or password");
        }

      }


  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-semibold mb-6 text-[#000]">
          {type === "register" ? "Sign Up" : "LogIn" }
          </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          {type === "register" && (
          <div className="mb-4">
            <label htmlFor="username" className="block font-bold text-gray-700">Username:</label>
            <input type="text" id="username"
             {...register("username", { required: true })} className="mt-1 p-2 border border-gray-300 text-[#000] w-full rounded-md" />
            {errors.username && <span className="text-red-500">Username is required</span>}
          </div>
          )}
          <div className="mb-4">
            <label htmlFor="email" className="block font-bold text-gray-700">Email:</label>
            <input type="email"
             id="email" {...register("email", { required: true })} className="mt-1 p-2 border text-[#000] border-gray-300 w-full rounded-md" />
            {errors.email && <span className="text-red-500">Email is required</span>}
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block font-bold text-gray-700">Password:</label>
            <input type="password" 
            id="password" {...register("password", { required: true })} className="mt-1 text-[#000] p-2 border border-gray-300 w-full rounded-md" />
            {errors.password && <span className="text-red-500">Password is required</span>}
          </div>
          {type === "register" && (
          <div className='flex items-center mb-2'>
            <img 
            className="w-40 h-40 rounded-full"
            src={watch("profileImage") || img || "https://images.pexels.com/photos/3889661/pexels-photo-3889661.jpeg"} alt="profileImage" />
            <CldUploadButton options={{maxFiles: 1}} onUpload={uploadPhoto} uploadPreset='uewxgvm2'>
            <p className="text-[#000] ml-8 font-bold">Upload New Photo</p>
            </CldUploadButton>
         </div>
          )}
          <button className='w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600' 
          type='submit'>
                {type === "register" ? "Join free" : "Let's chat"}
            </button>
        </form>

             {type === "register" ? (
                  <Link href="/" className='link'>
                      <p className='text-red-400 mt-2'>Already have an account? Sign In Here</p>
                  </Link>
                ) : (
                    <Link href="/register" className='link'>
                        <p className='text-red-400 mt-2'>Don't have an account ? Register Here</p>
                    </Link>
                )}
      </div>
    </div>
  );
}
