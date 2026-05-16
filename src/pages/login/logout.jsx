import { useAuth } from "../../Auth/AuthProvider";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
export default function Logout(){
   const {setUser} = useAuth();
   const navigate = useNavigate();

   const handleLogout =()=>{
       setUser(null);
       localStorage.removeItem("user");
       toast.success("Logout Successfully");
       navigate("/")
   };

   return(
    <button onClick={()=>handleLogout()}>Logout</button>
   )
}