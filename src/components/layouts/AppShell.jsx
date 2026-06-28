import Sidebar from "./sidebar";
import Navbar from "./navbar";
import Footer from "./footer";
import { Outlet } from "react-router-dom";
import { useState } from "react";

export default function AppShell() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (    
        <div className="flex w-full min-h-screen" style={{backgroundColor: "#0B0F1A"}}>
            {/* Sidebar with toggle state */}
            <div className={`fixed top-0 left-0 z-50 h-screen transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <Sidebar onClose={() => setSidebarOpen(false)} />
            </div>

            {/* Backdrop overlay for mobile */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content Area */}
            <div className="lg:ml-[280px] flex-1 flex flex-col justify-between min-h-screen w-full overflow-x-hidden">
                <div className="flex-1 flex flex-col">
                    {/* Fixed Navbar with menu callback */}
                    <div className="fixed top-0 right-0 left-0 lg:left-[280px] z-30">
                        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
                    </div>
                    <div className="mt-[60px] p-4 md:p-6 flex-1 w-full overflow-x-hidden">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}