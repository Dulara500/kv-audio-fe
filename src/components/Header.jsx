import { LuAudioWaveform } from "react-icons/lu";
import { Link } from "react-router-dom";

export default function Header(){
    return(
        <div>
            <header className="w-full h-[60px] shadow-lg bg-white flex justify-center items-center gap-12 text-black cursor-pointer  relative">
                <LuAudioWaveform className="text-4xl absolute left-4 border border-1px border-black rounded-3xl bg-blue-500"/>
                <div className="flex gap-6">
                    <Link to="/" className="hover:text-black hover:font-bold transition-all duration-200 cursor-pointer">Home</Link>
                    <Link to="/gallery" className="hover:text-black hover:font-bold transition-all duration-200 cursor-pointer">Gallery</Link>
                    <Link to="/items" className="hover:text-black hover:font-bold transition-all duration-200 cursor-pointer">Items</Link>
                    <Link to="/contact" className="hover:text-black hover:font-bold transition-all duration-200 cursor-pointer">Contact</Link>
                </div>
                <div className = "absolute right-8 flex justify-around gap-4">
                    <Link to="/login" className="hover:text-black hover:font-bold transition-all duration-200 cursor-pointer">Login</Link>
                    <Link to="/register" className="hover:text-black hover:font-bold transition-all duration-200 cursor-pointer">Register</Link>
                </div>
            </header>
        </div>
    );  
}