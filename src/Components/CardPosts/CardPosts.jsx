import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useContext, useState } from 'react'
import { FaRegCommentDots } from 'react-icons/fa'
import { GrLike } from 'react-icons/gr'
import { AiFillLike } from "react-icons/ai";
import { RiShareForwardLine } from 'react-icons/ri'
import Comment from '../Comment/Comment'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { GoBookmark, GoBookmarkFill } from 'react-icons/go'
import { toast } from 'sonner'
import { Button, Dropdown, Label, Separator, Modal } from "@heroui/react";
import { HiOutlineDotsHorizontal } from 'react-icons/hi'
import { MdModeEditOutline } from 'react-icons/md'
import { BsTrashFill } from 'react-icons/bs'
import { deletePost } from '../../api/deletePost.api'
import { UserContext } from '../../Context/UserContext'

export default function CardPosts({ post }) {
    dayjs.extend(relativeTime)
    const { loggedUserId } = useContext(UserContext)
    const userId = post?.user?._id

    const [isLiked, setIsLiked] = useState(false)
    const [body, setbody] = useState(post?.body || "")
    const [image, setimage] = useState(null)
    const [isEditOpen, setIsEditOpen] = useState(false)

    const queryClient = useQueryClient()

    async function putLike() {
        return await axios.put(`https://route-posts.routemisr.com/posts/${post.id}/like`, {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            }
        })
    }

    async function putBookMark() {
        return await axios.put(`https://route-posts.routemisr.com/posts/${post.id}/bookmark`, {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            }
        })
    }

    function editPost() {
        return axios.put(`https://route-posts.routemisr.com/posts/${post?.id}`, formDataObj(), {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            }
        })
    }
    const { mutate: upPost3 } = useMutation({
        mutationFn: editPost,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allPosts'] })
            queryClient.invalidateQueries({ queryKey: ['postDetails'] })
            queryClient.invalidateQueries({ queryKey: ['userPosts'] })
            toast.success("Post updated successfully!")
            setIsEditOpen(false)
        }
    })
    function formDataObj() {
        const formdata = new FormData()
        formdata.append('body', body)
        if (image) {
            formdata.append('image', image)
        }
        return formdata
    }

    function handleUpdate() {
        formDataObj()
        upPost3()
    }

    const { mutate } = useMutation({
        mutationFn: putLike,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allPosts'] })
            queryClient.invalidateQueries({ queryKey: ['postDetails'] })
            queryClient.invalidateQueries({ queryKey: ['userPosts'] })
        }
    })

    const { mutate: book2 } = useMutation({
        mutationFn: putBookMark,
        onSuccess: () => {
            if (!post.bookmarked) {
                toast.success("Saved!")
            } else { toast.success("Unsaved!") }
            queryClient.invalidateQueries({ queryKey: ['allPosts'] })
            queryClient.invalidateQueries({ queryKey: ['postDetails'] })
            queryClient.invalidateQueries({ queryKey: ['userPosts'] })
        }
    })

    const { mutate: del } = useMutation({
        mutationFn: () => deletePost({ id: post?.id }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allPosts'] })
            queryClient.invalidateQueries({ queryKey: ['userPosts'] })
            toast.success('Post Deleted')
        }
    })

    return (
        <>
            <article className="card mx-auto mt-5 w-full overflow-hidden border border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md md:w-[80%]">
                <div className="card-body gap-0 p-5 sm:p-6">
                    <div className='flex items-center justify-between gap-3'>
                        <div className='flex gap-3 items-center'>
                            <div>
                                <img src={post?.user.photo} alt={post?.user.name} className='h-11 w-11 rounded-full object-cover ring-2 ring-sky-100' />
                            </div>
                            <div>
                                <h4 className='font-semibold leading-tight text-slate-900'>{post?.user.name}</h4>
                                <p className='mt-1 text-xs text-slate-400'>{dayjs(post?.createdAt).fromNow()}</p>
                            </div>
                        </div>

                        {userId === loggedUserId && <>
                            <Dropdown>
                                <Button isIconOnly aria-label="Menu" className={'rounded-full bg-transparent text-slate-400 hover:bg-slate-100 hover:text-sky-500'}>
                                    <HiOutlineDotsHorizontal className="text-lg outline-none" />
                                </Button>
                                <Dropdown.Popover>
                                    <Dropdown.Menu onAction={(key) => {
                                        if (key === 'edit-file') {
                                            setIsEditOpen(true)
                                        }
                                        if (key === 'delete-file') {
                                            del() // لو اختار حذف هنشغل الـ Delete
                                        }
                                    }}>
                                        <Dropdown.Section>
                                            <Dropdown.Item id="edit-file" textValue="Edit file">
                                                <div className="flex h-8 items-center justify-center pt-px">
                                                    <MdModeEditOutline className="size-4 shrink-0 text-muted" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <Label>Edit post</Label>
                                                </div>
                                            </Dropdown.Item>
                                        </Dropdown.Section>

                                        <Separator />

                                        <Dropdown.Section>
                                            <Dropdown.Item id="delete-file" textValue="Delete file" variant="danger">
                                                <div className="flex h-8 items-center justify-center pt-px">
                                                    <BsTrashFill className="size-4 shrink-0 text-danger" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <Label>Delete post</Label>
                                                </div>
                                            </Dropdown.Item>
                                        </Dropdown.Section>
                                    </Dropdown.Menu>
                                </Dropdown.Popover>
                            </Dropdown>
                        </>}
                    </div>
                </div>

                <Link to={`/postDetails/${post?.id}`} className="block">
                    {post?.body && <h2 className="mt-5 whitespace-pre-line text-[15px] font-normal leading-7 text-slate-700">{post?.body}</h2>}
                    {post?.image && <figure className="mt-5 overflow-hidden rounded-xl bg-slate-100">
                        <img src={post?.image} alt={post?.body} className="min-h-100 w-full object-cover transition duration-500 hover:scale-[1.01]" />
                    </figure>}
                </Link>

                <div className='mt-5 flex items-center justify-between border-t border-slate-100 pt-3'>
                    <div className='flex flex-1 items-center justify-between sm:justify-start sm:gap-6'>
                        <div onClick={() => {
                            mutate()
                            setIsLiked(!isLiked)
                        }} className='flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-500 transition-all hover:bg-sky-50 hover:text-sky-600'>
                            {isLiked ? <>
                                <AiFillLike className="text-base" />
                                <p>{post?.likesCount}</p>
                            </> : <>
                                <GrLike className="text-base" />
                                <p>{post?.likesCount}</p></>}
                        </div>
                        <Link to={`/postDetails/${post?.id}`}>
                            <div className='flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-500 transition-all hover:bg-sky-50 hover:text-sky-600'>
                                <FaRegCommentDots className="text-base" />
                                <p>{post?.commentsCount}</p>
                            </div>
                        </Link>

                        <div className='flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-500 transition-all hover:bg-sky-50 hover:text-sky-600'>
                            <RiShareForwardLine className="text-base" />
                            <p>{post?.sharesCount}</p>
                        </div>
                    </div>
                    <div onClick={() => {
                        book2()
                    }} className='flex cursor-pointer items-center rounded-lg p-2 text-lg text-slate-400 transition-all hover:bg-amber-50 hover:text-amber-500'>
                        {post?.bookmarked ? <GoBookmarkFill className="text-amber-500" /> : <GoBookmark />}
                    </div>
                </div>

                {post?.topComment && <div className='mt-4 rounded-xl border border-slate-100 bg-slate-50/70 p-3 transition-all hover:bg-slate-50'>
                    <Comment postId={post?.id} comment={post?.topComment} />
                </div>}
            </article>

            <Modal isOpen={isEditOpen} onOpenChange={setIsEditOpen}>
                <Modal.Backdrop>
                    <Modal.Container>
                        <Modal.Dialog className="sm:max-w-90">
                            <Modal.CloseTrigger onClick={() => setIsEditOpen(false)} />
                            <Modal.Header>
                                <Modal.Heading className='text-xl font-bold text-sky-500 text-center w-full'>Edit Post</Modal.Heading>
                            </Modal.Header>
                            <Modal.Body>
                                <textarea
                                    autoFocus onChange={(e) => setbody(e.target.value)} value={body}
                                    placeholder="Edit your post.."
                                    className="w-full text-xl outline-none resize-none text-black min-h-30 placeholder-gray-400 bg-transparent"
                                ></textarea>

                                <div className="flex justify-between items-center px-2">

                                    <label htmlFor="UploadPhoto" className="mx-auto cursor-pointer w-full">
                                        <div className="flex-1 flex items-center justify-center gap-2 text-gray-600 font-medium text-base hover:bg-gray-100 py-2 rounded-lg transition-colors">
                                            <span>Photo</span>
                                            <span className="text-green-500 text-xl">🖼️</span>
                                        </div>
                                        <input id="UploadPhoto" onChange={(e) => setimage(e.target.files[0])} type="file" hidden />
                                    </label>

                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button className="w-full bg-sky-500 hover:bg-sky-600" onClick={() => handleUpdate()} onPress={() => setIsEditOpen(false)}>
                                    Edit Post
                                </Button>
                            </Modal.Footer>
                        </Modal.Dialog>
                    </Modal.Container>
                </Modal.Backdrop>
            </Modal>
        </>
    )
}