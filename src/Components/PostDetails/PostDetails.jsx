import dayjs from 'dayjs'
import { useState } from 'react'
import { FaRegCommentDots } from 'react-icons/fa'
import { GrLike } from 'react-icons/gr'
import { RiShareForwardLine } from 'react-icons/ri'
import relativeTime from 'dayjs/plugin/relativeTime';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getPostDetails } from '../../api/getPostDetails.api'
import { useParams } from 'react-router-dom'
import Loader from '../Loader/Loader'
import { getComments } from '../../api/getComments.api'
import Comment from '../Comment/Comment'
import CommentCreation from '../CommentCreation/CommentCreation'
import axios from 'axios'
import { AiFillLike } from 'react-icons/ai'
export default function PostDetails() {
    dayjs.extend(relativeTime)
    const { id } = useParams()
    const [isLiked, setIsLiked] = useState(false)
    const queryClient = useQueryClient()
    async function putLike() {
        return await axios.put(`https://route-posts.routemisr.com/posts/${id}/like`, {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            }
        })
    }
    const { mutate } = useMutation({
        mutationFn: putLike,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['allPosts']
            })
            queryClient.invalidateQueries({
                queryKey: ['postDetails']
            })
            queryClient.invalidateQueries({
                queryKey: ['userPosts']
            })
        }
    })
    const { data, isLoading } = useQuery({
        queryKey: ['postDetails', id],
        queryFn: () => getPostDetails({ id }),
        select: (data) => data?.data?.data?.post
    })
    const { data: comments } = useQuery({
        queryKey: ['getComments', id],
        queryFn: () => getComments({ id }),
        select: (comments) => comments?.data?.data?.comments
    })
    if (isLoading) {
        return <Loader />
    }
    return (
        <main className='min-h-screen bg-slate-50 px-4 py-24 sm:px-6'>
            <article className="card mx-auto w-full max-w-3xl overflow-hidden border border-slate-200 bg-white shadow-sm">
                <div className="card-body gap-0 p-5 sm:p-7">
                    <div className='flex items-center gap-3'>
                        <img src={data.user.photo} alt={data.user.name} className='h-12 w-12 rounded-full object-cover ring-2 ring-sky-100' />
                        <div>
                            <h4 className='font-semibold leading-tight text-slate-900'>{data.user.name}</h4>
                            <p className='mt-1 text-xs text-slate-400'>{dayjs(data.createdAt).fromNow()}</p>
                        </div>
                    </div>

                    {data.body && <h1 className="mt-6 whitespace-pre-line text-lg font-normal leading-8 text-slate-700">{data.body}</h1>}
                    {data.image && <figure className="mt-6 overflow-hidden rounded-2xl bg-slate-100">
                        <img src={data.image} alt={data.body} className="max-h-140 w-full object-cover" />
                    </figure>}

                    <div className='mt-6 flex items-center border-t border-slate-100 pt-3'>
                        <div className='flex flex-1 items-center justify-between sm:justify-start sm:gap-8'>
                            <div onClick={() => {
                                mutate()
                                setIsLiked(!isLiked)
                            }} className='flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-500 transition-all hover:bg-sky-50 hover:text-sky-600'>
                                {isLiked ? <><AiFillLike className="text-base" /><p>{data?.likesCount}</p></> : <><GrLike className="text-base" /><p>{data?.likesCount}</p></>}
                            </div>
                            <div className='flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-500 transition-all hover:bg-sky-50 hover:text-sky-600'>
                                <FaRegCommentDots className="text-base" />
                                <p>{data.commentsCount}</p>
                            </div>
                            <div className='flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-500 transition-all hover:bg-sky-50 hover:text-sky-600'>
                                <RiShareForwardLine className="text-base" />
                                <p>{data.sharesCount}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 border-t border-slate-100 pt-6">
                        <CommentCreation id={id} />
                    </div>

                    <section className="mt-8">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-base font-semibold text-slate-900">Comments</h2>
                            <span className="text-xs font-medium text-slate-400">{comments?.length || 0} comments</span>
                        </div>
                        <div className="space-y-3">
                            {comments?.map((comment) => <Comment key={comment._id} postId={id} comment={comment} />)}
                        </div>
                    </section>
                </div>
            </article>
        </main>
    )
}
