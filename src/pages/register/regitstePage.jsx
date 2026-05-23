import toast from "react-hot-toast";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function RegisterPage(){
    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const [firstName,setFirstName] = useState("");
    const [lastName,setLastName] = useState("");
    const [phone,setPhoneNumber] = useState("");
    const [address,setAddress] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

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
    return(
        <div className="bg-picture w-full h-screen flex justify-center items-center">
            <div className="w-[400px] backdrop-blur-lg rounded-2xl relative flex flex-col justify-center items-center gap-4 p-5 pb-[50px]">
                <h1 className="font-bold text-2xl text-white">Register</h1>
                <input type="text" className="text-white border-white border-b-[1px] rounded-[5px] focus:outline-none focus:border-blue-500 w-full p-2" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
                <input type="text" className="text-white border-white border-b-[1px] rounded-[5px] focus:outline-none focus:border-blue-500 w-full p-2" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)}/>
                <input type="text" className="text-white border-white border-b-[1px] rounded-[5px] focus:outline-none focus:border-blue-500 w-full p-2" placeholder="Phone Number" value={phone} onChange={(e) => setPhoneNumber(e.target.value)}/>
                <input type="text" className="text-white border-white border-b-[1px] rounded-[5px] focus:outline-none focus:border-blue-500 w-full p-2" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)}/>
                <input type="text" className="text-white border-white border-b-[1px] rounded-[5px] focus:outline-none focus:border-blue-500 w-full p-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                <input type="password" className="text-white border-white border-b-[1px] rounded-[5px] focus:outline-none focus:border-blue-500 w-full p-2" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>

                <button className="bg-blue-500 hover:bg-blue-700 mt-4 text-white font-bold py-2 px-4 rounded-[5px]" onClick={()=>{handleRegister()}}>
                    Register
                </button>
            </div>
            
        </div>
    )
}