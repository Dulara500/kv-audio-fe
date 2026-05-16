import { createContext , useContext, useState, useEffect } from "react";

const authContext = createContext()

export default function AuthProvider({children}){
    const [user,setUser] = useState(null);

    useEffect(()=>{
        const storedUser=localStorage.getItem("user");
        setUser(JSON.parse(storedUser));
    },[])

    return(
        <authContext.Provider value={{user,setUser}}>
            {children}
        </authContext.Provider>
    )
}

export const useAuth = ()=> useContext(authContext);