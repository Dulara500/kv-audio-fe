import "./login.css";
import { LuAudioWaveform } from "react-icons/lu";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../Auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function LoginPage(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {setUser} = useAuth();
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;

    async function handleLogin(){
        try{
            const response = await axios.post(`${API_URL}/api/users/login`,{
                email: email,
                password: password
            })
            const userdetails = response.data.user
            setUser(userdetails)
            localStorage.setItem("user", JSON.stringify(response.data))
            console.log(localStorage.getItem("user"))
            toast.success("Login Successful")
            userdetails.role === "admin" ? navigate("/admin") : navigate("/user")
        }catch(error){
            toast.error("Login failed")
            console.log(error)
        }
    }

    return(
        <div className="bg-picture w-full min-h-screen flex justify-center items-center">
            {/* Overlay */}
            <div className="absolute inset-0" style={{background: "rgba(11,15,26,0.75)"}}/>

            <div className="relative z-10 w-[420px] p-8 rounded-2xl flex flex-col gap-6"
                style={{
                    background: "rgba(17,24,39,0.9)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid #2A3447",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.6)"
                }}>

                {/* Logo */}
                <div className="flex flex-col items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{background: "linear-gradient(135deg, #E8C547, #F59E0B)"}}>
                        <LuAudioWaveform className="text-2xl text-[#0B0F1A]"/>
                    </div>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold tracking-widest uppercase text-white font-mono-display">
                            KV<span style={{color: "#E8C547"}}>_AUDIO</span>
                        </h1>
                        <p className="text-xs tracking-widest uppercase mt-1" style={{color: "#6B7A99"}}>Sign in to your account</p>
                    </div>
                </div>

                {/* Form */}
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold tracking-wider uppercase" style={{color: "#6B7A99"}}>Email</label>
                        <input
                            type="text"
                            placeholder="your@email.com"
                            className="w-full px-4 py-3 rounded-lg text-sm text-white transition-all duration-200 focus:outline-none"
                            style={{
                                background: "#0B0F1A",
                                border: "1px solid #2A3447",
                            }}
                            onFocus={e => e.target.style.borderColor = "#E8C547"}
                            onBlur={e => e.target.style.borderColor = "#2A3447"}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold tracking-wider uppercase" style={{color: "#6B7A99"}}>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full px-4 py-3 rounded-lg text-sm text-white transition-all duration-200 focus:outline-none"
                            style={{
                                background: "#0B0F1A",
                                border: "1px solid #2A3447",
                            }}
                            onFocus={e => e.target.style.borderColor = "#E8C547"}
                            onBlur={e => e.target.style.borderColor = "#2A3447"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={handleLogin}
                        className="w-full py-3 mt-2 rounded-lg text-sm font-bold tracking-wide uppercase transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                        style={{background: "linear-gradient(135deg, #E8C547, #F59E0B)", color: "#0B0F1A"}}>
                        Sign In
                    </button>
                </div>

                {/* Footer */}
                <p className="text-center text-xs" style={{color: "#6B7A99"}}>
                    Don't have an account?{" "}
                    <Link to="/register" className="font-semibold transition-colors hover:opacity-80" style={{color: "#E8C547"}}>
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    )
}