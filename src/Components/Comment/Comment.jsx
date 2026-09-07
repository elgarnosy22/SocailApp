import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime';
import { useContext, useState } from 'react';
import { UserContext } from '../../Context/UserContext';
import { Button, Dropdown, Label, Modal, Separator } from '@heroui/react';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { MdModeEditOutline } from 'react-icons/md';
import { BsTrashFill } from 'react-icons/bs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import axios from 'axios';

export default function Comment({ postId, comment: { commentCreator: { name, photo, _id: creatorId }, content, createdAt, image, _id: commentId } }) {
    dayjs.extend(relativeTime)
    const { loggedUserId } = useContext(UserContext)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const queryClient = useQueryClient()
    const [body, setbody] = useState(content || "")
    const [image1, setimage1] = useState(null)
    function deleteComment() {
        return axios.delete(`https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            }
        })
    }
    
    function editComment() {
        return axios.put(`https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}`, formDataObj(), {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            }
        })
    }
    const { mutate: upComment3 } = useMutation({
        mutationFn: editComment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allPosts'] })
            queryClient.invalidateQueries({ queryKey: ['postDetails'] })
            queryClient.invalidateQueries({ queryKey: ['userPosts'] })
            queryClient.invalidateQueries({ queryKey: ['getComments'] })
            toast.success("Comment updated successfully!")
            setIsEditOpen(false)
        }
    })
    function formDataObj() {
        const formdata = new FormData()
        formdata.append('content', body)
        if (image1) {
            formdata.append('image', image1)
        }
        return formdata
    }

    function handleUpdate() {
        upComment3()
    }
    const { mutate: del } = useMutation({
        mutationFn:deleteComment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allPosts'] })
            queryClient.invalidateQueries({ queryKey: ['userPosts'] })
            queryClient.invalidateQueries({ queryKey: ['postDetails'] })
            queryClient.invalidateQueries({ queryKey: ['getComments'] })
            toast.success('Comment Deleted')
        }
    })
    return (
        <article className='flex gap-3 rounded-xl border border-slate-100 bg-white p-3 transition hover:border-sky-100 hover:bg-sky-50/30 sm:p-4'>
            <img src={photo} alt={name} className='h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-sky-100' />
            <div className='min-w-0 flex-1'>
                <div className="flex justify-between items-center">
                    <div className='flex flex-wrap items-baseline gap-x-2 gap-y-1'>
                        <h4 className='text-sm font-semibold text-slate-800'>{name}</h4>
                        <span className='text-xs text-slate-400'>{dayjs(createdAt).fromNow()}</span>
                    </div>
                    {creatorId === loggedUserId && <>
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
                                        del()
                                    }
                                }}>
                                    <Dropdown.Section>
                                        <Dropdown.Item id="edit-file" textValue="Edit file">
                                            <div className="flex h-8 items-center justify-center pt-px">
                                                <MdModeEditOutline className="size-4 shrink-0 text-muted" />
                                            </div>
                                            <div className="flex flex-col">
                                                <Label>Edit comment</Label>
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
                                                <Label>Delete comment</Label>
                                            </div>
                                        </Dropdown.Item>
                                    </Dropdown.Section>
                                </Dropdown.Menu>
                            </Dropdown.Popover>
                        </Dropdown>
                    </>}

                </div>
                {content && <p className='mt-2 whitespace-pre-line text-sm leading-6 text-slate-600'>{content}</p>}
                {image && <img src={image} alt="Comment attachment" className='mt-3 max-h-56 w-auto max-w-full rounded-xl border border-slate-100 object-cover' />}
            </div>

            <Modal isOpen={isEditOpen} onOpenChange={setIsEditOpen}>
                <Modal.Backdrop>
                    <Modal.Container>
                        <Modal.Dialog className="sm:max-w-90">
                            <Modal.CloseTrigger onClick={() => setIsEditOpen(false)} />
                            <Modal.Header>
                                <Modal.Heading className='text-xl font-bold text-sky-500 text-center w-full'>Edit Comment</Modal.Heading>
                            </Modal.Header>
                            <Modal.Body>
                                <textarea
                                    autoFocus onChange={(e) => setbody(e.target.value)} value={body}
                                    placeholder="Edit your comment..."
                                    className="w-full text-xl outline-none resize-none text-black min-h-30 placeholder-gray-400 bg-transparent"
                                ></textarea>

                                <div className="flex justify-between items-center px-2">

                                    <label htmlFor="UploadPhoto" className="mx-auto cursor-pointer w-full">
                                        <div className="flex-1 flex items-center justify-center gap-2 text-gray-600 font-medium text-base hover:bg-gray-100 py-2 rounded-lg transition-colors">
                                            <span>Photo</span>
                                            <span className="text-green-500 text-xl">🖼️</span>
                                        </div>
                                        <input id="UploadPhoto" onChange={(e) => setimage1(e.target.files[0])} type="file" hidden />
                                    </label>

                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button className="w-full bg-sky-500 hover:bg-sky-600" onClick={handleUpdate}>
                                    Edit Comment
                                </Button>
                            </Modal.Footer>
                        </Modal.Dialog>
                    </Modal.Container>
                </Modal.Backdrop>
            </Modal>
        </article>

    )
}
