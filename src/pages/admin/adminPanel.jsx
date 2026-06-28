import { Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { 
    MdOutlineShoppingBag, 
    MdOutlineAccountCircle, 
    MdOutlineInventory2, 
    MdOutlineMonetizationOn, 
    MdOutlinePendingActions,
    MdCheckCircleOutline,
    MdHighlightOff,
    MdBlock,
    MdTrendingUp
} from "react-icons/md";
import { FiArrowRight } from "react-icons/fi";

import Bookings from "./Bookings";
import Products from "./products";
import Users from "./users";
import AdminMessages from "./adminMessages";

function DashboardOverview() {
    const API_URL = import.meta.env.VITE_API_URL;
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        totalProducts: 0,
        availableProducts: 0,
        totalBookings: 0,
        pendingBookings: 0,
        payedBookings: 0,
        approvedBookings: 0,
        rejectedBookings: 0,
        cancelledBookings: 0,
        totalUsers: 0,
        totalRevenue: 0,
        avgOrderValue: 0,
        recentBookings: [],
        categories: {}
    });

    useEffect(() => {
        async function fetchDashboardStats() {
            try {
                const storedUser = localStorage.getItem("user");
                if (!storedUser) return;
                const token = JSON.parse(storedUser).token;
                const headers = { Authorization: `Bearer ${token}` };

                // Run all three requests in parallel
                const [productsRes, bookingsRes, usersRes] = await Promise.all([
                    axios.get(`${API_URL}/api/products`, { headers }).catch(e => ({ data: [] })),
                    axios.get(`${API_URL}/api/order`, { headers }).catch(e => ({ data: { orders: [] } })),
                    axios.get(`${API_URL}/api/users`, { headers }).catch(e => ({ data: [] }))
                ]);

                const products = productsRes.data || [];
                const bookings = bookingsRes.data.orders || [];
                const users = usersRes.data || [];

                // Filter & calculate product stats
                const totalProducts = products.length;
                const availableProducts = products.filter(p => p.availability).length;

                // Category distribution
                const categories = {};
                products.forEach(p => {
                    const cat = p.category || "uncategorized";
                    categories[cat] = (categories[cat] || 0) + 1;
                });

                // Filter & calculate booking stats
                const totalBookings = bookings.length;
                let pendingBookings = 0;
                let payedBookings = 0;
                let approvedBookings = 0;
                let rejectedBookings = 0;
                let cancelledBookings = 0;
                let totalRevenue = 0;

                bookings.forEach(b => {
                    if (b.status === "pending") pendingBookings++;
                    else if (b.status === "payed") {
                        payedBookings++;
                        totalRevenue += b.totalAmount || 0;
                    }
                    else if (b.status === "approved") {
                        approvedBookings++;
                        totalRevenue += b.totalAmount || 0;
                    }
                    else if (b.status === "rejected") rejectedBookings++;
                    else if (b.status === "cancelled") cancelledBookings++;
                });

                const revenueGeneratingBookings = payedBookings + approvedBookings;
                const avgOrderValue = revenueGeneratingBookings > 0 ? (totalRevenue / revenueGeneratingBookings) : 0;

                // Sort bookings to get the 5 most recent ones
                const recentBookings = [...bookings].reverse().slice(0, 5);

                setData({
                    totalProducts,
                    availableProducts,
                    totalBookings,
                    pendingBookings,
                    payedBookings,
                    approvedBookings,
                    rejectedBookings,
                    cancelledBookings,
                    totalUsers: users.length,
                    totalRevenue,
                    avgOrderValue,
                    recentBookings,
                    categories
                });
            } catch (err) {
                console.error("Dashboard calculation error:", err);
                toast.error("Failed to load dashboard metrics");
            } finally {
                setLoading(false);
            }
        }

        fetchDashboardStats();
    }, [API_URL]);

    if (loading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center py-24 gap-3 text-white">
                <div className="w-10 h-10 rounded-full border-2 animate-spin"
                     style={{ borderColor: "#2A3447", borderTopColor: "#E8C547" }} />
                <span className="text-xs tracking-widest uppercase font-semibold text-[#6B7A99]">Generating stats...</span>
            </div>
        );
    }

    const statCards = [
        { label: "Total Earnings", val: `Rs. ${data.totalRevenue.toLocaleString()}`, sub: `From approved & paid bookings`, icon: <MdOutlineMonetizationOn size={24} className="text-green-400" /> },
        { label: "Total Bookings", val: data.totalBookings, sub: `${data.pendingBookings} pending approval`, icon: <MdOutlineShoppingBag size={24} className="text-blue-400" /> },
        { label: "Products Catalog", val: data.totalProducts, sub: `${data.availableProducts} currently available`, icon: <MdOutlineInventory2 size={24} className="text-[#E8C547]" /> },
        { label: "Registered Users", val: data.totalUsers, sub: `Active customer accounts`, icon: <MdOutlineAccountCircle size={24} className="text-purple-400" /> },
    ];

    const detailedStats = [
        { label: "Pending", val: data.pendingBookings, color: "#F59E0B", icon: <MdOutlinePendingActions /> },
        { label: "Paid", val: data.payedBookings, color: "#10B981", icon: <MdOutlineMonetizationOn /> },
        { label: "Approved", val: data.approvedBookings, color: "#3B82F6", icon: <MdCheckCircleOutline /> },
        { label: "Rejected", val: data.rejectedBookings, color: "#EF4444", icon: <MdHighlightOff /> },
        { label: "Cancelled", val: data.cancelledBookings, color: "#6B7A99", icon: <MdBlock /> },
    ];

    return (
        <div className="flex flex-col gap-8 animate-fade-in text-white">
            
            {/* Header */}
            <div>
                <p className="text-xs font-semibold tracking-[0.3em] uppercase mb-1" style={{ color: "#6B7A99" }}>Overview</p>
                <h1 className="text-3xl font-bold tracking-wider uppercase text-white font-mono-display">
                    Admin<span style={{ color: "#E8C547" }}>.Dashboard</span>
                </h1>
                <div className="w-16 h-0.5 mt-2" style={{ background: "linear-gradient(to right, #E8C547, transparent)" }} />
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((card, idx) => (
                    <div key={idx} className="p-5 rounded-2xl border border-[#2A3447] bg-[#111827] flex items-start justify-between shadow-lg">
                        <div className="flex flex-col gap-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B7A99]">{card.label}</span>
                            <span className="text-xl font-bold text-white font-mono-display">{card.val}</span>
                            <span className="text-[10px] text-[#6B7A99] mt-1">{card.sub}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-[#0B0F1A] border border-[#2A3447]">
                            {card.icon}
                        </div>
                    </div>
                ))}
            </div>

            {/* Detailed Row (Booking Breakdown & Categories Distribution) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Bookings Status breakdown */}
                <div className="lg:col-span-8 p-6 rounded-2xl border border-[#2A3447] bg-[#111827] flex flex-col gap-4 shadow-lg">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white">Booking Status Breakdown</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        {detailedStats.map((item, idx) => (
                            <div key={idx} className="p-4 rounded-xl bg-[#0B0F1A] border border-[#2A3447]/60 flex flex-col items-center justify-center text-center gap-1.5 transition hover:border-[#2A3447]">
                                <span className="text-lg" style={{ color: item.color }}>{item.icon}</span>
                                <span className="text-xs font-bold text-white/70 uppercase tracking-wide">{item.label}</span>
                                <span className="text-lg font-bold font-mono" style={{ color: item.color }}>{item.val}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Extra Stats Cards: Avg Booking Cost & Catalog Ratio */}
                <div className="lg:col-span-4 p-6 rounded-2xl border border-[#2A3447] bg-[#111827] flex flex-col gap-4 shadow-lg justify-between">
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-3">Additional Metrics</h3>
                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center py-2.5 border-b border-[#2A3447]/60">
                                <span className="text-xs text-[#6B7A99]">Avg Order Value</span>
                                <span className="text-xs font-bold font-mono text-[#E8C547]">
                                    Rs. {Math.round(data.avgOrderValue).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2.5 border-b border-[#2A3447]/60">
                                <span className="text-xs text-[#6B7A99]">Gear Availability</span>
                                <span className="text-xs font-bold font-mono text-green-400">
                                    {data.totalProducts > 0 ? Math.round((data.availableProducts / data.totalProducts) * 100) : 0}%
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 p-3.5 rounded-xl bg-[#0B0F1A] border border-[#2A3447]/60">
                        <MdTrendingUp size={18} className="text-[#E8C547]" />
                        <span className="text-[10px] font-bold text-[#6B7A99] uppercase tracking-wider">Dashboard fully synchronized</span>
                    </div>
                </div>

            </div>

            {/* Bottom Row: Recent Bookings Log & Category Distribution Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Recent Bookings table/preview */}
                <div className="lg:col-span-8 p-6 rounded-2xl border border-[#2A3447] bg-[#111827] flex flex-col gap-4 shadow-lg">
                    <div className="flex justify-between items-center">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-white">Recent Rentals Log</h3>
                        <Link to="bookings" className="flex items-center gap-1.5 text-xs font-bold text-[#E8C547] hover:underline uppercase tracking-wider">
                            View All Bookings <FiArrowRight />
                        </Link>
                    </div>
                    
                    {data.recentBookings.length === 0 ? (
                        <p className="text-xs text-[#6B7A99] py-6">No recent rentals found.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                    <tr className="border-b border-[#2A3447]">
                                        <th className="py-2.5 text-[#6B7A99] uppercase tracking-wider font-bold">Booking ID</th>
                                        <th className="py-2.5 text-[#6B7A99] uppercase tracking-wider font-bold">Customer Email</th>
                                        <th className="py-2.5 text-[#6B7A99] uppercase tracking-wider font-bold">Total Days</th>
                                        <th className="py-2.5 text-[#6B7A99] uppercase tracking-wider font-bold">Total Amount</th>
                                        <th className="py-2.5 text-[#6B7A99] uppercase tracking-wider font-bold">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.recentBookings.map((b, idx) => (
                                        <tr key={idx} className="border-b border-[#2A3447]/30 hover:bg-white/5 transition duration-150">
                                            <td className="py-3 font-mono font-bold text-white">{b.orderId}</td>
                                            <td className="py-3 text-white/80">{b.email}</td>
                                            <td className="py-3 font-mono">{b.days} days</td>
                                            <td className="py-3 font-mono font-semibold text-[#E8C547]">Rs. {b.totalAmount?.toLocaleString()}</td>
                                            <td className="py-3">
                                                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider"
                                                      style={{
                                                          backgroundColor: 
                                                            b.status === "approved" || b.status === "payed" ? "rgba(34,197,94,0.1)" :
                                                            b.status === "pending" ? "rgba(245,158,11,0.1)" : "rgba(239,68,68,0.1)",
                                                          color:
                                                            b.status === "approved" || b.status === "payed" ? "#22C55E" :
                                                            b.status === "pending" ? "#F59E0B" : "#EF4444",
                                                          border:
                                                            b.status === "approved" || b.status === "payed" ? "1px solid rgba(34,197,94,0.3)" :
                                                            b.status === "pending" ? "1px solid rgba(245,158,11,0.3)" : "1px solid rgba(239,68,68,0.3)"
                                                      }}>
                                                    {b.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Category distribution */}
                <div className="lg:col-span-4 p-6 rounded-2xl border border-[#2A3447] bg-[#111827] flex flex-col gap-4 shadow-lg">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white">Stock By Category</h3>
                    {Object.keys(data.categories).length === 0 ? (
                        <p className="text-xs text-[#6B7A99] py-4">No categories configured.</p>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {Object.entries(data.categories).map(([cat, count], idx) => (
                                <div key={idx} className="flex flex-col gap-1.5">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="capitalize font-bold text-white/80">{cat}</span>
                                        <span className="font-mono text-[#6B7A99] font-bold">{count} items</span>
                                    </div>
                                    <div className="w-full h-1.5 rounded-full bg-[#0B0F1A] overflow-hidden">
                                        <div className="h-full bg-[#E8C547]" 
                                             style={{ width: `${(count / data.totalProducts) * 100}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>

        </div>
    );
}

export default function AdminPanel() {
    return (
        <div className="w-full min-h-screen" style={{backgroundColor: "#0B0F1A"}}>
            <Routes>
                <Route path="/" element={<DashboardOverview />} />
                <Route path="bookings" element={<Bookings />} />
                <Route path="products" element={<Products />} />
                <Route path="users" element={<Users />} />
                <Route path="messages" element={<AdminMessages />} />
            </Routes>
        </div>
    );
}