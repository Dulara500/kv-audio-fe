import Sidebar from "./sidebar";
import Navbar from "./navbar";
import { Outlet } from "react-router-dom";

export default function AppShell() {
    return (    
        <div className="flex w-full min-h-screen" style={{backgroundColor: "#0B0F1A"}}>
            <div className="fixed top-0 left-0 z-50 h-screen">
                <Sidebar/>
            </div>
            <div className="ml-[280px] flex-1 flex flex-col">
                <div className="fixed w-full z-40" style={{left: "280px"}}>
                    <Navbar />
                </div>
                <div className="mt-[60px] p-6">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}