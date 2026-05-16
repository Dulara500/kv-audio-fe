import { Routes, Route } from "react-router-dom";
import Bookings from "./Bookings";
import Products from "./products";
import Users from "./users";

export default function AdminPanel() {
    return (
        <div className="w-full h-screen bg-white">
            <Routes path>
                <Route path="/" element={<h1>Admin Panel</h1>} />
                <Route path="bookings" element={<Bookings />} />
                <Route path="products" element={<Products />} />
                <Route path="users" element={<Users />} />
            </Routes>
        </div>

    );
}