import Sidebar from "./sidebar";
import Navbar from "./navbar";
import { Outlet } from "react-router-dom";

export default function AppShell() {
    return (    
        <div className="flex w-full h-screen relative">
            <div className="fixed top-0 z-50">
                <Sidebar/>
            </div>
            <div className="ml-[300px] flex-1 flex flex-col">
                <div className="fixed w-full z-60">
                    <Navbar />
                </div>
                <div className="mt-[60px]">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}