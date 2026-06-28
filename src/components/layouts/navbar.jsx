import Logout from "../../pages/login/logout";
import { useAuth } from "../../Auth/AuthProvider";
import { MdOutlineNotifications, MdOutlineAccountCircle, MdMenu } from "react-icons/md";
import { Link } from "react-router-dom";

export default function Navbar({ onMenuClick }) {
    const {user} = useAuth();
    const role = user?.role;
    if(!role) {return null}

    return (
        <div className="w-full h-[60px]" style={{background: "#0B0F1A", borderBottom: "1px solid #2A3447"}}>
            <nav className="p-4 flex justify-between items-center w-full bg-[#0B0F1A]">
                {/* Mobile Menu Hamburger Trigger */}
                <button 
                    onClick={onMenuClick}
                    className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-[#2A3447] text-white hover:bg-white/5 transition"
                >
                    <MdMenu size={20} />
                </button>

                {/* Right profile info & actions */}
                <div className="flex items-center gap-3 ml-auto">
                    <button className="w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200 hover:bg-white/5"
                        style={{color: "#6B7A99"}}>
                        <MdOutlineNotifications size={20}/>
                    </button>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#2A3447]">
                        <MdOutlineAccountCircle size={18} style={{color: "#6B7A99"}}/>
                        <span className="text-sm font-medium text-white">{user?.firstName || "User"}</span>
                    </div>
                    <Logout/>
                </div>
            </nav>
        </div>
    );
}