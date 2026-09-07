import React from 'react'
import { RiSendPlaneFill } from 'react-icons/ri'
import { IoImage } from "react-icons/io5";
import {Description, InputGroup, Label, TextField} from "@heroui/react";
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ImSpinner4 } from 'react-icons/im';
export default function CommentCreation({id}) {
    function createComment(){
        return axios.post(`https://route-posts.routemisr.com/posts/${id}/comments`,formData,{
            headers:{
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            }
        })
    }
    const queryClient = useQueryClient()
    const commentCreated = {
        content: '',
        image: ''
    }
    const form = useForm({
        defaultValues:{
            content:'',
            image:''
        }
    })
    const {data, isPending, mutate} = useMutation({
        mutationFn: createComment,
        onSuccess: ()=>{
            queryClient.invalidateQueries({
                queryKey:['getComments']
            })
            queryClient.invalidateQueries({
                queryKey:['postDetails']
            })
            reset()
        }
    })
    const {register, handleSubmit, reset} = form
    const formData = new FormData()
    function handleCreateComment(values){
        console.log(values.content);
        console.log(values.image[0]);
        if ( !values.content && !values.image[0]){ return}
        if (values.content) {
            formData.append('content', values.content)
        }
        if (values.image[0]) {
            formData.append('image', values.image[0])
        }
        mutate()
    }
    return (
        <>
            <div>
                <form onSubmit={handleSubmit(handleCreateComment)} >
                    <TextField className="w-full" name="text" aria-label='comment'>
                        <InputGroup>
                            <InputGroup.Input {...register('content')} className="w-full" placeholder="write a comment" />
                            <InputGroup.Suffix>
                                <div className='flex gap-4'>
                                    <div className='img'>
                                        <label htmlFor="img"><IoImage className='size-6 text-black cursor-pointer' /></label>
                                        <input type="file" {...register('image')} id='img' hidden />
                                    </div>
                                    <button type='submit' disabled={isPending} className='cursor-pointer'>{isPending? <ImSpinner4 className='animate-spin' /> : <RiSendPlaneFill className="size-6  text-sky-500" />}</button>
                                </div>
                            </InputGroup.Suffix>
                        </InputGroup>
                    </TextField>
                </form>
            </div>
        </>
    )
}
