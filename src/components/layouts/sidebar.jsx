import { LuAudioWaveform } from "react-icons/lu";
import { Link } from "react-router-dom";
import { useAuth } from "../../Auth/AuthProvider";
import Logout from "../../pages/login/logout";

export default function Sidebar() {
    const {user} = useAuth();
    const role = user?.role;   

    console.log(user);

    const adminNav = [
        {id:1 , name:"Dashboard", path:"/admin"},
        {id:2 , name:"Bookings", path:"/admin/bookings"},
        {id:3 , name:"Products", path:"/admin/products"},
        {id:4 , name:"Users", path:"/admin/users"}

    ];

    const userNav = [
        {id:1 , name:"Dashboard", path:"/user"},
        {id:2 , name:"Songs", path:"/user/songs"},
        {id:3 , name:"Artists", path:"/user/artists"},
        {id:4 , name:"Albums", path:"/user/albums"},
        {id:5 , name:"Playlists", path:"/user/playlists"},
        {id:6 , name:"Settings", path:"/user/settings"},
    ];

    const navItems = role === "admin" ? adminNav : userNav;
    
    return (

        <div className="w-[300px] h-screen bg-[#0C0C0C] text-white ">
            <h2 className="text-white font-bold text-2xl p-4 flex gap-2 items-center"><LuAudioWaveform />KV Audio</h2>
            
            <div className="flex flex-col gap-2 p-4">
                {navItems.map((item) => (
                    <Link key={item.id} to={item.path} className="w-full text-left p-2 hover:bg-[#1A1A1A]">
                        {item.name}
                    </Link>
                ))}
                <Logout/>
            </div>

        </div>
    );
}
