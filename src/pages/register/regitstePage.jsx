import toast from "react-hot-toast";
import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { LuAudioWaveform } from "react-icons/lu";

export default function RegisterPage(){
    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleRegister(){
        try{
            const response = await axios.post(`${API_URL}/api/users`,{
                firstName,
                lastName,
                phone,
                address,
                email,
                password
            })
            toast.success("Registration successful")
            console.log(response.data)
            navigate("/login")
        }catch(error){
            toast.error("Registration failed: " + error.response.data.message)
            console.log(error)
        }
    }

    const inputStyle = {
        background: "#0B0F1A",
        border: "1px solid #2A3447",
    };

    const handleFocus = (e) => { e.target.style.borderColor = "#E8C547"; };
    const handleBlur = (e) => { e.target.style.borderColor = "#2A3447"; };

    const inputClass = "w-full px-4 py-3 rounded-lg text-sm text-white transition-all duration-200 focus:outline-none";

    return(
        <div className="bg-picture w-full min-h-screen flex justify-center items-center py-10">
            {/* Overlay */}
            <div className="absolute inset-0" style={{background: "rgba(11,15,26,0.75)"}}/>

            <div className="relative z-10 w-[440px] p-8 rounded-2xl flex flex-col gap-5"
                style={{
                    background: "rgba(17,24,39,0.9)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid #2A3447",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.6)"
                }}>

                {/* Logo */}
                <div className="flex flex-col items-center gap-3 mb-1">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{background: "linear-gradient(135deg, #E8C547, #F59E0B)"}}>
                        <LuAudioWaveform className="text-2xl text-[#0B0F1A]"/>
                    </div>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold tracking-widest uppercase text-white font-mono-display">
                            REN<span style={{color: "#E8C547"}}>TEC</span>
                        </h1>
                        <p className="text-xs tracking-widest uppercase mt-1" style={{color: "#6B7A99"}}>Create your account</p>
                    </div>
                </div>

                {/* Form Grid */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold tracking-wider uppercase" style={{color: "#6B7A99"}}>First Name</label>
                        <input type="text" className={inputClass} style={inputStyle} placeholder="John"
                            onFocus={handleFocus} onBlur={handleBlur}
                            value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold tracking-wider uppercase" style={{color: "#6B7A99"}}>Last Name</label>
                        <input type="text" className={inputClass} style={inputStyle} placeholder="Doe"
                            onFocus={handleFocus} onBlur={handleBlur}
                            value={lastName} onChange={(e) => setLastName(e.target.value)}/>
                    </div>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold tracking-wider uppercase" style={{color: "#6B7A99"}}>Phone Number</label>
                    <input type="text" className={inputClass} style={inputStyle} placeholder="+94 XX XXX XXXX"
                        onFocus={handleFocus} onBlur={handleBlur}
                        value={phone} onChange={(e) => setPhoneNumber(e.target.value)}/>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold tracking-wider uppercase" style={{color: "#6B7A99"}}>Address</label>
                    <input type="text" className={inputClass} style={inputStyle} placeholder="Your address"
                        onFocus={handleFocus} onBlur={handleBlur}
                        value={address} onChange={(e) => setAddress(e.target.value)}/>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold tracking-wider uppercase" style={{color: "#6B7A99"}}>Email</label>
                    <input type="text" className={inputClass} style={inputStyle} placeholder="your@email.com"
                        onFocus={handleFocus} onBlur={handleBlur}
                        value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold tracking-wider uppercase" style={{color: "#6B7A99"}}>Password</label>
                    <input type="password" className={inputClass} style={inputStyle} placeholder="••••••••"
                        onFocus={handleFocus} onBlur={handleBlur}
                        value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>

                <button
                    onClick={handleRegister}
                    className="w-full py-3 rounded-lg text-sm font-bold tracking-wide uppercase transition-all duration-200 hover:opacity-90 active:scale-[0.98] mt-1"
                    style={{background: "linear-gradient(135deg, #E8C547, #F59E0B)", color: "#0B0F1A"}}>
                    Create Account
                </button>

                <p className="text-center text-xs" style={{color: "#6B7A99"}}>
                    Already have an account?{" "}
                    <Link to="/login" className="font-semibold hover:opacity-80 transition-colors" style={{color: "#E8C547"}}>
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}