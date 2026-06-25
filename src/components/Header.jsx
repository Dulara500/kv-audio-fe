import { LuAudioWaveform } from "react-icons/lu";
import { MdOutlineShoppingCart, MdOutlineAccountCircle, MdOutlineMessage } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import Logout from "../pages/login/logout";

export default function Header(){
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem("user"))?.user || null;

    const navLinks = [
        { to: "/", label: "Home" },
        { to: "/gallery", label: "Gallery" },
        { to: "/items", label: "Catalog" },
        { to: "/contact", label: "Contact" },
    ];

    return(
        <div>
            <header className="w-full h-[64px] fixed top-0 z-50 flex items-center justify-between px-6"
                style={{background: "rgba(11,15,26,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid #2A3447"}}>
                
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                        style={{background: "linear-gradient(135deg, #E8C547 0%, #F59E0B 100%)"}}>
                        <LuAudioWaveform className="text-[#0B0F1A] text-lg font-bold"/>
                    </div>
                    <span className="font-bold text-lg tracking-wider text-white font-mono-display">
                        KV<span className="text-[#E8C547]">_AUDIO</span>
                    </span>
                </Link>

                {/* Nav Links */}
                <nav className="flex gap-1">
                    {navLinks.map((link) => {
                        const isActive = location.pathname === link.to;
                        return (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`px-4 py-2 text-sm font-medium tracking-wide uppercase transition-all duration-200 rounded-md
                                    ${isActive 
                                        ? "text-[#E8C547] bg-[#E8C547]/10" 
                                        : "text-[#6B7A99] hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                    
                    <Link to="/messages" className="relative w-9 h-9 flex items-center justify-center rounded-lg text-[#6B7A99] hover:text-[#E8C547] hover:bg-[#E8C547]/10 transition-all duration-200" title="Message Admin">
                        <MdOutlineMessage size={22}/>
                    </Link>
                    <Link to="/cart" className="relative w-9 h-9 flex items-center justify-center rounded-lg text-[#6B7A99] hover:text-[#E8C547] hover:bg-[#E8C547]/10 transition-all duration-200">
                        <MdOutlineShoppingCart size={22}/>
                    </Link>
                    {!user && (
                        <Link to="/login"
                            className="px-4 py-2 text-sm font-semibold text-[#6B7A99] hover:text-white transition-colors duration-200">
                            Login
                        </Link>
                    )}
                    {user && (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{border: "1px solid #2A3447"}}>
                            <MdOutlineAccountCircle size={18} style={{color: "#6B7A99"}}/>
                            <span className="text-sm font-medium text-white">{user?.firstName || "User"}</span>
                        </div>
                    )}
                    {user && (
                        <Logout/>
                    )}
                    {!user &&(
                        <Link to="/register"
                            className="px-4 py-2 text-sm font-semibold rounded-lg text-[#0B0F1A] transition-all duration-200 hover:opacity-90"
                            style={{background: "linear-gradient(135deg, #E8C547, #F59E0B)"}}>
                            Register
                        </Link>
                    )}
                </div>
            </header>
        </div>
    );  
}