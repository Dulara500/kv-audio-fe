import Sidebar from "./sidebar";
import Navbar from "./navbar";
import { Outlet } from "react-router-dom";

export default function AppShell() {
    return (    
        <div className="flex w-full h-screen">
            <Sidebar/>
            <div className="flex-1 flex flex-col">
                <Navbar/>
                <Outlet/>
            </div>
        </div>
    );
}