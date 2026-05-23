import "./login.css";
import { LuAudioWaveform } from "react-icons/lu";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../Auth/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function LoginPage(){
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const {setUser} = useAuth();
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;

    async function handleLogin(){
        try{
            const response = await axios.post(`${API_URL}/api/users/login`,{
                email: email,
                password: password
            })
            console.log(response.data)
            const userdetails  = response.data.user
            setUser(userdetails)
            localStorage.setItem("user",JSON.stringify(response.data))
            toast.success("Login Successful")
            
            userdetails.role==="admin" ? navigate("/admin") : navigate("/user")

        }catch(error){
            toast.error("Login failed")
            console.log(error)
        }
    }

    return(
        <div className="bg-picture w-full h-screen flex justify-center items-center">
            <div className="w-[400px] h-[400px] backdrop-blur-lg rounded-2xl relative flex flex-col justify-center items-center gap-4">
                <LuAudioWaveform className="text-4xl border border-1px border-black rounded-3xl bg-blue-500 absolute top-7"/>
                <h1 className="font-bold text-2xl text-white absolute top-[70px]">KV Audio</h1>
                <div className="w-[350px] flex flex-col justify-center items-center gap-4 mt-12">
                    
                    <input type="text" placeholder="Email" className="w-full text-white p-2 border-b-2 border-gray-400 focus:border-2px focus:border-blue-500 outline-none" value={email} onChange={(e)=> setEmail(e.target.value)}/>
                    <input type="password" placeholder="Password" className="w-full text-white p-2 border-b-2 border-gray-400 focus:border-2px focus:border-blue-500 outline-none" value={password} onChange={(e)=> setPassword(e.target.value)}/>
                    <button className="w-full p-2 mt-4 bg-blue-500 text-white rounded-2xl hover:bg-blue-600" onClick={handleLogin}>Login</button>
                </div>
            </div>
        </div>
    )
}