import axios from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { MdOutlineAccountCircle, MdOutlineEmail, MdOutlinePhone, MdOutlineLocationOn } from "react-icons/md";

export default function Users() {
    const API_URL = import.meta.env.VITE_API_URL;
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        getUsers();
    }, []);

    async function getUsers() {
        try {
            const data = localStorage.getItem("user");
            const token = JSON.parse(data).token;
            const res = await axios.get(`${API_URL}/api/users`, {  
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data);
        } catch (error) {
            toast.error(error.response?.data?.message || "Users not found");
        } finally {
            setLoading(false);
        }
    }


    async function handleStatus(email, status) {
        try {
            const data = localStorage.getItem("user");
            const token = JSON.parse(data).token;
            // backend reads req.body.status, so key must be 'status'
            await axios.put(`${API_URL}/api/users/${email}`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(`User ${status ? "blocked" : "unblocked"} successfully`);
            getUsers(); // re-fetch full updated list
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update user status");
        }
    }

    const filtered = users.filter((u) => {
        const q = search.toLowerCase();
        return (
            u.email?.toLowerCase().includes(q) ||
            u.firstName?.toLowerCase().includes(q) ||
            u.lastName?.toLowerCase().includes(q) ||
            u.phone?.toLowerCase().includes(q)
        );
    });

    

    return (
        <div className="relative">

            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <p className="text-xs font-semibold tracking-[0.3em] uppercase mb-1" style={{ color: "#6B7A99" }}>Manage</p>
                    <h1 className="text-2xl font-bold tracking-wider uppercase text-white font-mono-display">
                        Users<span style={{ color: "#E8C547" }}>.Directory</span>
                    </h1>
                    <div className="w-16 h-0.5 mt-2" style={{ background: "linear-gradient(to right, #E8C547, transparent)" }} />
                </div>

                {/* Total count badge */}
                {!loading && (
                    <div className="px-4 py-2 rounded-lg text-sm font-semibold"
                        style={{ background: "rgba(232,197,71,0.1)", border: "1px solid rgba(232,197,71,0.2)", color: "#E8C547" }}>
                        {users.length} registered user{users.length !== 1 ? "s" : ""}
                    </div>
                )}
            </div>

            {/* Search bar */}
            {!loading && users.length > 0 && (
                <div className="mb-4 relative">
                    <input
                        type="text"
                        placeholder="Search by name, email or phone..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full max-w-sm px-4 py-2.5 pl-10 rounded-lg text-sm text-white transition-all duration-200 focus:outline-none"
                        style={{ background: "#111827", border: "1px solid #2A3447" }}
                        onFocus={(e) => e.target.style.borderColor = "#E8C547"}
                        onBlur={(e) => e.target.style.borderColor = "#2A3447"}
                    />
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" fill="none" stroke="#6B7A99" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div className="flex items-center gap-3 py-8">
                    <div className="w-8 h-8 rounded-full border-2 animate-spin"
                        style={{ borderColor: "#2A3447", borderTopColor: "#E8C547" }} />
                    <span className="text-sm tracking-widest uppercase" style={{ color: "#6B7A99" }}>Loading users...</span>
                </div>
            )}

            {/* Empty state */}
            {!loading && users.length === 0 && (
                <div className="py-20 text-center rounded-xl" style={{ border: "1px solid #2A3447", background: "#111827" }}>
                    <MdOutlineAccountCircle className="mx-auto text-5xl mb-3" style={{ color: "#2A3447" }} />
                    <p className="font-semibold text-white">No users registered</p>
                    <p className="text-sm mt-1" style={{ color: "#6B7A99" }}>Users will appear here once they sign up.</p>
                </div>
            )}

            {/* No search results */}
            {!loading && users.length > 0 && filtered.length === 0 && (
                <div className="py-12 text-center rounded-xl" style={{ border: "1px solid #2A3447", background: "#111827" }}>
                    <p className="font-semibold text-white">No results for "{search}"</p>
                    <p className="text-sm mt-1" style={{ color: "#6B7A99" }}>Try a different name or email.</p>
                </div>
            )}

            {/* User Cards Grid */}
            {!loading && filtered.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filtered.map((user) => (
                        <div key={user.email}
                            className="p-5 rounded-xl flex flex-col gap-4 transition-all duration-200 hover:border-[#2A3447]/80"
                            style={{ background: "#111827", border: "1px solid #2A3447" }}>

                            {/* Avatar + Name */}
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-lg font-mono-display"
                                    style={{ background: "linear-gradient(135deg, #E8C547, #F59E0B)", color: "#0B0F1A" }}>
                                    {(user.firstName?.[0] || "?").toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-white truncate">
                                        {user.firstName} {user.lastName}
                                    </p>
                                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider"
                                        style={{
                                            color: user.role === "admin" ? "#1E90FF" : "#E8C547",
                                            background: user.role === "admin" ? "rgba(30,144,255,0.1)" : "rgba(232,197,71,0.1)",
                                            border: `1px solid ${user.role === "admin" ? "rgba(30,144,255,0.2)" : "rgba(232,197,71,0.2)"}`
                                        }}>
                                        {user.role || "customer"}
                                    </span>
                                </div>
                                <button
                                    onClick={() => {handleStatus(user.email, !user.isBlocked);}}
                                    className={`ml-auto text-xs px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider border transition-all duration-200 hover:opacity-80 ${user.isBlocked ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"}`}>
                                    {user.isBlocked ? "Unblock" : "Block"}
                                </button>

                            </div>

                            {/* Divider */}
                            <div className="h-px" style={{ background: "#2A3447" }} />

                            {/* Details */}
                            <div className="flex flex-col gap-2.5">
                                <div className="flex items-center gap-2.5">
                                    <MdOutlineEmail className="flex-shrink-0" style={{ color: "#6B7A99" }} size={15} />
                                    <span className="text-xs truncate" style={{ color: "#6B7A99" }}>{user.email}</span>
                                </div>
                                {user.phone && (
                                    <div className="flex items-center gap-2.5">
                                        <MdOutlinePhone className="flex-shrink-0" style={{ color: "#6B7A99" }} size={15} />
                                        <span className="text-xs" style={{ color: "#6B7A99" }}>{user.phone}</span>
                                    </div>
                                )}
                                {user.address && (
                                    <div className="flex items-center gap-2.5">
                                        <MdOutlineLocationOn className="flex-shrink-0" style={{ color: "#6B7A99" }} size={15} />
                                        <span className="text-xs truncate" style={{ color: "#6B7A99" }}>{user.address}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}