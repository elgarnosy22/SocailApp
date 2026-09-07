import axios from "axios"

export async function getPostDetails({id}) {
    return await axios.get(`https://route-posts.routemisr.com/posts/${id}`,{
        headers:{
            Authorization: `Bearer ${localStorage.getItem('userToken')}`
        }
    })
} 