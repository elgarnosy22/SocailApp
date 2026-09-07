import axios from "axios";

export function userPosts({data}) {
    return axios.get(`https://route-posts.routemisr.com/users/${data?.id}/posts`,{
        headers:{
            Authorization:`Bearer ${localStorage.getItem('userToken')}`
        }
    })
}