import { useRef, useState } from 'react'
import { myProfile } from './../../api/getMyProfile.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Loader from '../Loader/Loader';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { userPosts } from '../../api/getUserPosts.api';
import CardPosts from '../CardPosts/CardPosts';
import CreatePost from '../CreatePost/CreatePost';
import { FiCamera, FiEdit3, FiGrid, FiInfo, FiShare2, FiUsers } from 'react-icons/fi';
import { Button, Modal } from '@heroui/react';
import { uploadPhoto } from '../../api/uploadProfilePhoto.api';
import { toast } from 'sonner';
import { IoMdCloseCircleOutline } from 'react-icons/io';
export default function Profile() {
  dayjs.extend(relativeTime)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const imageInput = useRef(null)
  const [isUploaded, setIsUploaded] = useState(false);
  const [activeTab, setActiveTab] = useState('posts')
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['myProfile'],
    queryFn: myProfile,
    select: (data) => data?.data?.data?.user
  })
  const { data: userPO, isLoading: userPO3 } = useQuery({
    queryKey: ['userPosts'],
    queryFn: () => userPosts({ data }),
    select: (userPO) => userPO?.data?.data?.posts
  })
  const { mutate } = useMutation({
    mutationFn: () => uploadPhoto(getUploadPhoto()),
    onSuccess: () => {
      setIsUploaded(false);
      queryClient.invalidateQueries({
        queryKey: ['myProfile']
      })
      queryClient.invalidateQueries({
        queryKey: ['userPosts']
      })
      queryClient.invalidateQueries({
        queryKey: ['allPosts']
      })
      toast.success('Uploaded photo successfully!')
    }
  })
  console.log(data);
  
  function getUploadPhoto() {
    const formdata = new FormData()
    if (imageInput.current.files[0]) {
      formdata.append('photo', imageInput.current.files[0])
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
  function handle(){
    mutate()
    setIsEditOpen(false)
  }
  if (isLoading) {
    return <Loader />
  }
  if (userPO3) {
    return <Loader />
  }
  
  return (
    <main className="min-h-screen bg-slate-50 pb-12 pt-18">
      <div className="relative h-56 overflow-hidden bg-sky-500 sm:h-72">
        <img
          src={data?.cover}
          alt="Cover"
          className="h-full w-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-900/50 via-transparent to-sky-900/10" />
        <button type="button" onClick={() => setIsEditOpen(true)} aria-label="Change cover photo" className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-xl bg-white/90 px-4 py-2 text-sm font-semibold text-slate-700 shadow-lg backdrop-blur transition hover:bg-white">
          <FiCamera size={17} /> Change cover
        </button>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <section className="relative z-10 -mt-20 rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60 sm:-mt-24 sm:p-7">
          <div className="flex flex-col gap-6 md:flex-row md:items-end">
            <div className="relative shrink-0 self-center md:self-auto">
              <img
                src={data?.photo}
                alt={data?.name || 'Profile'}
                className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-xl ring-4 ring-sky-50 sm:h-40 sm:w-40"
              />
              <button type="button" onClick={() => setIsEditOpen(true)} aria-label="Change profile photo" className="absolute cursor-pointer bottom-1 right-1 rounded-full bg-sky-500 p-3 text-white shadow-lg transition hover:bg-sky-600">
                <FiCamera size={17} />
              </button>
              <Modal isOpen={isEditOpen} onOpenChange={setIsEditOpen}>
                <Modal.Backdrop>
                  <Modal.Container>
                    <Modal.Dialog className="sm:max-w-90">
                      <Modal.CloseTrigger onClick={() => setIsEditOpen(false)} />
                      <Modal.Header>
                        <Modal.Heading className='text-xl font-bold text-sky-500 text-center w-full'>Upload your photo</Modal.Heading>
                      </Modal.Header>
                      <Modal.Body>

                        {isUploaded && <div className="relative">
                          <img src={isUploaded} className="w-[69%] mx-auto mb-2" />
                          <IoMdCloseCircleOutline onClick={handleRemovePhoto} className="absolute top-0 text-white text-2xl cursor-pointer right-12" />
                        </div>}

                        <div className="flex justify-between items-center px-2">

                          <label htmlFor="UploadPhoto" className="mx-auto cursor-pointer w-full">
                            <div className="flex-1 flex items-center justify-center gap-2 text-gray-600 font-medium text-base hover:bg-gray-100 py-2 rounded-lg transition-colors">
                              <span>Photo</span>
                              <span className="text-green-500 text-xl">🖼️</span>
                            </div>
                            <input id="UploadPhoto" ref={imageInput} onChange={habdlePhoto} type="file" hidden />
                          </label>

                        </div>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button className="w-full bg-sky-500 hover:bg-sky-600" onClick={() => handle()} >
                          Upload photo
                        </Button>
                      </Modal.Footer>
                    </Modal.Dialog>
                  </Modal.Container>
                </Modal.Backdrop>
              </Modal>
            </div>

            <div className="min-w-0 flex-1 text-center md:text-left">
              <p className="mb-1 text-sm font-semibold uppercase tracking-[0.16em] text-sky-500">My profile</p>
              <h1 className="truncate text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{data?.name}</h1>
              <p className="mt-1 text-base text-slate-500">@{data?.username}</p>
              <div className="mt-5 flex flex-wrap justify-center gap-6 md:justify-start md:gap-8">
                <div><p className="text-xl font-bold text-slate-900">{data?.followersCount}</p><p className="text-xs text-slate-400">Followers</p></div>
                <div><p className="text-xl font-bold text-slate-900">{data?.followingCount}</p><p className="text-xs text-slate-400">Following</p></div>
                <div><p className="text-xl font-bold text-slate-900">{userPO?.length}</p><p className="text-xs text-slate-400">Posts</p></div>
              </div>
            </div>
          </div>
        </section>

        <nav className="mt-6 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
          <div className="grid grid-cols-3 gap-1">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition ${activeTab === 'posts' ? 'bg-sky-50 text-sky-600' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <FiGrid size={17} /> <span>Posts</span>
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition ${activeTab === 'about' ? 'bg-sky-50 text-sky-600' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <FiInfo size={17} /> <span>About</span>
            </button>
            <button
              onClick={() => setActiveTab('friends')}
              className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition ${activeTab === 'friends' ? 'bg-sky-50 text-sky-600' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <FiUsers size={17} /> <span>Friends</span>
            </button>
          </div>
        </nav>

        <div className="mt-6"><CreatePost userInfo={data} /></div>
        {/* Posts Section */}
        {activeTab === 'posts' && (
          <div className="space-y-6">
            {userPO?.map((post) => (<CardPosts key={post.id} post={post} />))}
          </div>
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="mb-6 text-2xl font-bold text-slate-900">About</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Gender</p>
                <p className="mt-2 text-sm capitalize text-slate-700">{data?.gender}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Joined</p>
                <p className="mt-2 text-sm text-slate-700">{dayjs(data?.createdAt).fromNow()}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}