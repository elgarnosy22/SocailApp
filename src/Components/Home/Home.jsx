import React, { useEffect, useState } from 'react'
import CardPosts from '../CardPosts/CardPosts'
import Loader from '../Loader/Loader'
import { useQuery } from '@tanstack/react-query'
import { VscErrorCompact } from 'react-icons/vsc'
import { allPosts } from './../../api/getAllPosts.api';
import CreatePost from '../CreatePost/CreatePost'
export default function Home() {
  // const [posts, setPosts] = useState([])

  const { data, isLoading, isError, isFetching, error } = useQuery({
    queryKey: ['allPosts'],
    queryFn: allPosts,
    select: (data) => data?.data?.data?.posts,
    retry: 3
  })

  // console.log(data);



  if (isLoading) {
    return <Loader />
  }
  if (isError) {
    return <div className='min-h-screen'>
      <div role="alert" className="alert alert-error ">
        <VscErrorCompact />
        <span className='text-white text-center mx-auto'>Error! {error.message}</span>
      </div>
    </div>
  }

  return (
    <>
    <div className="pt-25">
    <CreatePost/>
    </div>
      <div className="container w-[85%] flex flex-col pt-20 items-center m-auto">
        {data.map((post) => <CardPosts key={post.id} post={post} />)}
      </div>
    </>
  )
}
