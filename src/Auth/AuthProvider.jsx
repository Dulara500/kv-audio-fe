import { createContext , useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import toast from "react-hot-toast";

const authContext = createContext()

function isTokenExpired(token) {
    if (!token) return true;
    try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;
        return decoded.exp < now;
    } catch (e) {
        return true;
    }
}

export default function AuthProvider({children}){
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem("user");
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (parsed.token && !isTokenExpired(parsed.token)) {
                    return parsed.user;
                } else {
                    localStorage.removeItem("user");
                }
            } catch (e) {
                localStorage.removeItem("user");
            }
        }
        return null;
    });

    // Set a timer to automatically log out when token expires
    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (!stored || !user) return;

        try {
            const parsed = JSON.parse(stored);
            const token = parsed.token;
            if (!token) return;

            const decoded = jwtDecode(token);
            const exp = decoded.exp;

            if (exp) {
                const timeLeft = (exp * 1000) - Date.now();
                if (timeLeft <= 0) {
                    localStorage.removeItem("user");
                    setUser(null);
                    toast.error("Session expired. Please log in again.");
                } else {
                    const timer = setTimeout(() => {
                        localStorage.removeItem("user");
                        setUser(null);
                        toast.error("Session expired. Please log in again.");
                    }, timeLeft);

                    return () => clearTimeout(timer);
                }
            }
        } catch (e) {
            console.error("Error setting expiration timer:", e);
        }
    }, [user]);

    // Axios interceptor to log out on server-side 401 token invalidation
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && error.response.status === 401) {
                    const msg = error.response.data?.message;
                    if (msg === "invalid token" || msg === "login required") {
                        localStorage.removeItem("user");
                        setUser(null);
                        toast.error("Session expired. Please log in again.");
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, []);

    return(
        <authContext.Provider value={{user,setUser}}>
            {children}
        </authContext.Provider>
    )
}

export const useAuth = ()=> useContext(authContext);