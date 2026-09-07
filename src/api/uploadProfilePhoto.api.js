import axios from "axios"

export const uploadPhoto = (body)=>{
    return axios.put(`https://route-posts.routemisr.com/users/upload-photo`, body, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`
        }
    })
}