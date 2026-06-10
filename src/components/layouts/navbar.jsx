import Logout from "../../pages/login/logout";
import { useAuth } from "../../Auth/AuthProvider";
import { MdOutlineNotifications, MdOutlineAccountCircle } from "react-icons/md";

export default function Navbar() {
    const {user} = useAuth();

    return (
        <div className="w-full h-[60px]" style={{background: "#0B0F1A", borderBottom: "1px solid #2A3447"}}>
            <nav className="p-4 flex justify-end gap-4 items-center fixed top-0 right-0 left-[280px]">
                <button className="w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200 hover:bg-white/5"
                    style={{color: "#6B7A99"}}>
                    <MdOutlineNotifications size={20}/>
                </button>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{border: "1px solid #2A3447"}}>
                    <MdOutlineAccountCircle size={18} style={{color: "#6B7A99"}}/>
                    <span className="text-sm font-medium text-white">{user?.firstName || "User"}</span>
                </div>
                <Logout/>
            </nav>
        </div>
    );
}