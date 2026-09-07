import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useRef, useState } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { toast } from 'sonner';
import { myProfile } from "../../api/getMyProfile.api";
export default function CreatePost() {
    // للتحكم في فتح وقفل الـ Modal
    const [isOpen, setIsOpen] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false);
    const textInput = useRef(null)
    const imageInput = useRef(null)
    const queryClient = useQueryClient()
    function createdPost() {
        return axios.post(`https://route-posts.routemisr.com/posts`, getPostCreation(), {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            }
        })
    }

    const { data:user1, isError, error, isLoading, isFetching } = useQuery({
        queryKey: ['myProfile'],
        queryFn: myProfile,
        select: (user1) => user1?.data?.data?.user
    })

    const { data, isSuccess, mutate } = useMutation({
        mutationFn: createdPost,
        onSuccess: () => {
            toast.success("Post Created!")
            setIsUploaded(false);
            queryClient.invalidateQueries({
                queryKey: ['allPosts']
            })
            queryClient.invalidateQueries({
                queryKey: ['userPosts']
            })
        }
    })
    function getPostCreation() {
        const formdata = new FormData()
        if (textInput.current.value) {
            formdata.append('body', textInput.current.value)
        }
        if (imageInput.current.files[0]) {
            formdata.append('image', imageInput.current.files[0])
        }
        return formdata
    }
    function habdlePhoto(e) {
        const path = URL.createObjectURL(e.target.files[0])
        setIsUploaded(path)
    }
    function handleRemovePhoto() {
        setIsUploaded(false)

    }

    return (
        <>
            {/* 1. الكارد الأساسي */}
            <div className=" w-[85%] md:w-[69%] mx-auto bg-white rounded-xl shadow-md border border-gray-200 p-4">
                <div className="flex items-center gap-3">
                    <img
                        src={user1?.photo}
                        alt={user1?.name}
                        className="w-10 h-10 rounded-full cursor-pointer"
                    />
                    <div
                        onClick={() => setIsOpen(true)}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 cursor-pointer rounded-full px-5 py-3 text-gray-500 text-base select-none"
                    >
                        What's your mind...
                    </div>
                </div>


            </div>

            {/* 2.Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl p-0 overflow-hidden m-4">

                        {/* هيدر الـ Modal */}
                        <div className="flex items-center justify-between border-b border-gray-100 p-4 relative">
                            <h2 className="text-xl font-bold text-sky-500 text-center w-full">Create a Post</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute left-4 w-9 h-9 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 font-bold transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        {/* محتوى الـ Modal */}
                        <div className="p-4">
                            <div className="flex items-center gap-2 mb-4">
                                <img
                                    src={user1?.photo}
                                    alt={user1?.name}
                                    className="w-10 h-10 rounded-full"
                                />
                                <div>
                                    <p className="font-semibold text-sm">{user1?.name}</p>
                                    <div className="bg-gray-200 text-xs px-2 py-1 rounded-md flex items-center gap-1 w-fit mt-1">
                                        🌎 Public
                                    </div>
                                </div>
                            </div>

                            <textarea
                                autoFocus ref={textInput}
                                placeholder="write a post.."
                                className="w-full text-xl outline-none resize-none min-h-[120px] placeholder-gray-400 bg-transparent"
                            ></textarea>
                            {isUploaded && <div className="relative">
                                <img src={isUploaded} className="w-[69%] mx-auto mb-2" />
                                <IoMdCloseCircleOutline onClick={handleRemovePhoto} className="absolute top-4 text-2xl cursor-pointer right-22" />
                            </div>}

                            <div className="flex justify-between items-center px-2">

                                <label htmlFor="UploadPhoto" className="mx-auto w-full">
                                    <div className="flex-1 flex items-center justify-center gap-2 text-gray-600 font-medium text-base hover:bg-gray-100 py-2 rounded-lg transition-colors">
                                        <span>Photo</span>
                                        <span className="text-green-500 text-xl">🖼️</span>
                                    </div>
                                    <input id="UploadPhoto" ref={imageInput} onChange={habdlePhoto} type="file" hidden />
                                </label>

                            </div>
                        </div>

                        {/* فوتر الـ Modal (زرار النشر) */}
                        <div className="p-4">
                            <button
                                onClick={() => {
                                    mutate()
                                    setIsOpen(false)
                                }}
                                className="w-full bg-sky-500 hover:bg-sky-700 text-white font-bold py-2.5 px-4 rounded-lg transition-colors text-lg"
                            >
                                Post
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
}