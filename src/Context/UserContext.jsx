import { createContext, useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode"
export let UserContext = createContext()

export default function UserContextProvider({ children }) {
    const [userLogin, setuserLogin] = useState(localStorage.getItem('userToken'))
    const [loggedUserId, setloggedUserId] = useState(null)
    useEffect(() => {
        if (localStorage.getItem('userToken')){
            const {user}  =jwtDecode(localStorage.getItem('userToken'))
            setloggedUserId(user)
        }
    

    }, [userLogin])
    
    return (
        <UserContext.Provider value={{ userLogin, setuserLogin, loggedUserId }}>
            {children}
        </UserContext.Provider>
    )
}