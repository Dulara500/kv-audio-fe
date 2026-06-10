import { useAuth } from "../../Auth/AuthProvider";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { MdOutlineLogout } from "react-icons/md";

export default function Logout(){
   const {setUser} = useAuth();
   const navigate = useNavigate();

   const handleLogout = () => {
       setUser(null);
       localStorage.removeItem("user");
       toast.success("Logout Successfully");
       navigate("/");
   };

   return(
    <button
        onClick={handleLogout}
        className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-red-500/10 hover:text-red-400"
        style={{color: "#6B7A99"}}>
        <MdOutlineLogout size={16}/>
        Logout
    </button>
   )
}