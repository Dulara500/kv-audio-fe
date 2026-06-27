import { LuAudioWaveform } from "react-icons/lu";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../Auth/AuthProvider";
import Logout from "../../pages/login/logout";
import { MdDashboard, MdBookmarks, MdInventory, MdPeople, MdMessage } from "react-icons/md";

export default function Sidebar() {
    const {user} = useAuth();
    const role = user?.role;
    const location = useLocation();

    const adminNav = [
        {id:1, name:"Dashboard", path:"/admin", icon: MdDashboard},
        {id:2, name:"Bookings", path:"/admin/bookings", icon: MdBookmarks},
        {id:3, name:"Products", path:"/admin/products", icon: MdInventory},
        {id:4, name:"Users", path:"/admin/users", icon: MdPeople},
        {id:5, name:"Messages", path:"/admin/messages", icon: MdMessage},
    ];


    if(!role){ return null; }
   

    return (
        <div className="w-[280px] h-screen flex flex-col"
            style={{background: "#0B0F1A", borderRight: "1px solid #2A3447"}}>

            {/* Logo */}
            <div className="flex items-center gap-3 px-6 py-5" style={{borderBottom: "1px solid #2A3447"}}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{background: "linear-gradient(135deg, #E8C547, #F59E0B)"}}>
                    <LuAudioWaveform className="text-[#0B0F1A] text-lg"/>
                </div>
                <span className="font-bold text-lg tracking-wider text-white font-mono-display">
                    REN<span style={{color: "#E8C547"}}>TEC</span>
                </span>
            </div>

            {/* Role Badge */}
            <div className="px-6 py-3">
                <span className="text-xs font-semibold tracking-[0.2em] uppercase px-2 py-1 rounded"
                    style={{color: "#E8C547", background: "rgba(232,197,71,0.1)", border: "1px solid rgba(232,197,71,0.2)"}}>
                    {role} panel
                </span>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-4 py-2 flex flex-col gap-1">
                {adminNav.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.id}
                            to={item.path}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
                            style={{
                                color: isActive ? "#E8C547" : "#6B7A99",
                                background: isActive ? "rgba(232,197,71,0.1)" : "transparent",
                                border: isActive ? "1px solid rgba(232,197,71,0.2)" : "1px solid transparent",
                            }}>
                            <Icon size={16}/>
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="px-4 py-4" style={{borderTop: "1px solid #2A3447"}}>
                <Logout/>
            </div>
        </div>
    );
}
