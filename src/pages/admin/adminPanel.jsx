import { Routes, Route } from "react-router-dom";
import Bookings from "./Bookings";
import Products from "./products";
import Users from "./users";

export default function AdminPanel() {
    return (
        <div className="w-full min-h-screen" style={{backgroundColor: "#0B0F1A"}}>
            <Routes path>
                <Route path="/" element={
                    <div className="flex flex-col gap-4">
                        <p className="text-xs font-semibold tracking-[0.3em] uppercase" style={{color: "#6B7A99"}}>Overview</p>
                        <h1 className="text-3xl font-bold tracking-wider uppercase text-white font-mono-display">
                            Admin<span style={{color: "#E8C547"}}>.Panel</span>
                        </h1>
                        <div className="w-16 h-0.5" style={{background: "linear-gradient(to right, #E8C547, transparent)"}}/>
                        <p className="text-sm mt-2" style={{color: "#6B7A99"}}>Welcome back. Select a section from the sidebar to manage your content.</p>
                    </div>
                } />
                <Route path="bookings" element={<Bookings />} />
                <Route path="products" element={<Products />} />
                <Route path="users" element={<Users />} />
            </Routes>
        </div>
    );
}