import axios from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FiMessageCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function Bookings() {
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDetails, setShowDetails] = useState(false);
    const [seletedBooking, setSelectedBooking] = useState({});
    const [search, setSearch] = useState("");

    useEffect(() => {
        getBookings();
    }, []);

    async function handleMessage() {
        if (!seletedBooking?.email) return;
        try {
            const data = localStorage.getItem("user");
            const token = JSON.parse(data).token;
            // Fetch users to map email to user ID
            const res = await axios.get(`${API_URL}/api/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const users = res.data;
            const targetUser = users.find(u => u.email === seletedBooking.email);
            if (targetUser) {
                const streamUserId = targetUser._id.toString().replace(/[^a-zA-Z0-9_\-@]/g, "_");
                const channelId = `support-${streamUserId}`;
                navigate(`/admin/messages?channelId=${channelId}`);
            } else {
                toast.error("Could not find the customer account associated with this booking");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load customer details for chat");
        }
    }

    function approveBooking() {
        toast.error("Order approval endpoint not implemented in backend");
    }

    function rejectBooking() {
        toast.error("Order rejection endpoint not implemented in backend");
    }

    async function getBookings() {
        try {
            const data = localStorage.getItem("user");
            const token = JSON.parse(data).token;
            const res = await axios.get(`${API_URL}/api/order`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const sorted = res.data.orders.reverse()
            setBookings(sorted);
        } catch (error) {
            toast.error(error.response?.data?.message || "Bookings not found");
        } finally {
            setLoading(false);
        }
    }

    function formatDate(dateStr) {
        if (!dateStr) return "—";
        return new Date(dateStr).toLocaleDateString("en-GB", {
            day: "2-digit", month: "short", year: "numeric"
        });
    }

    function rerender(){
        getBookings();
    }

    function handleShowDetails(booking){
        setSelectedBooking(booking);
        setShowDetails(true)
        console.log(booking);
    }

    async function loadImages(key){
        const data = localStorage.getItem("user");
        const token = JSON.parse(data).token;
        try {
             const product = await axios.get(`${API_URL}/api/products/${key}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            console.log(product);
        } catch (error) {
            toast.error(error.response?.data?.message || "Product not found");
        }
    }
        

    const statusColor = {
        pending:  { color: "#F59E0B", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.3)"  },
        payed: { color: "#22C55E", bg: "rgba(34,197,94,0.1)",   border: "rgba(34,197,94,0.3)"   },
        cancelled: { color: "#EF4444", bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.3)"   },
    };

    const filteredBookings = bookings.filter((u)=>{
        const q = search.toLowerCase();
        return(
            u.orderId.toLowerCase().includes(q) ||
            u.orderDate.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q) ||
            u.paymentMethod.toLowerCase().includes(q)||
            u.status.toLowerCase().includes(q)
        )
    })

    return (
        <div className="relative">
            {/* Header */}
            <div className="mb-6">
                <p className="text-xs font-semibold tracking-[0.3em] uppercase mb-1" style={{ color: "#6B7A99" }}>Manage</p>
                <h1 className="text-2xl font-bold tracking-wider uppercase text-white font-mono-display">
                    Bookings<span style={{ color: "#E8C547" }}>.Orders</span>
                </h1>
                <div className="w-16 h-0.5 mt-2" style={{ background: "linear-gradient(to right, #E8C547, transparent)" }} />
            </div>
            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search bookings by ID, email, method, status..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm text-white transition-all duration-200 focus:outline-none"
                        style={{ background: "#111827", border: "1px solid #2A3447" }}
                        onFocus={(e) => e.target.style.borderColor = "#E8C547"}
                        onBlur={(e) => e.target.style.borderColor = "#2A3447"}
                    />
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" fill="none" stroke="#6B7A99" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                <button 
                    onClick={rerender}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold tracking-wider uppercase bg-[#111827] border border-[#2A3447] text-white hover:bg-[#2A3447] hover:border-[#E8C547] transition-all duration-200 cursor-pointer"
                >
                    <svg className="w-4 h-4 text-[#E8C547]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.5" />
                    </svg>
                    Refresh
                </button>
            </div>


            {/* Loading */}
            {loading && (
                <div className="flex items-center gap-3 py-8">
                    <div className="w-8 h-8 rounded-full border-2 animate-spin"
                        style={{ borderColor: "#2A3447", borderTopColor: "#E8C547" }} />
                    <span className="text-sm tracking-widest uppercase" style={{ color: "#6B7A99" }}>Loading bookings...</span>
                </div>
            )}

            {/* Empty state */}
            {!loading && bookings.length === 0 && (
                <div className="py-16 text-center">
                    <p className="text-3xl mb-3">📋</p>
                    <p className="font-semibold text-white">No bookings found</p>
                    <p className="text-sm mt-1" style={{ color: "#6B7A99" }}>Orders will appear here once customers place them.</p>
                </div>
            )}

            {/* Table */}
            {!loading && bookings.length > 0 && (
                <div className="overflow-x-auto rounded-xl" style={{ border: "1px solid #2A3447" }}>
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr style={{ background: "#111827", borderBottom: "1px solid #2A3447" }}>
                                {["Order ID", "Customer", "Items", "Start Date", "End Date", "Days", "Total","Payment Method", "Status"].map((h) => (
                                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold tracking-widest uppercase"
                                        style={{ color: "#6B7A99" }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBookings.map((booking) => {
                                const s = statusColor[booking.status] || statusColor.pending;
                                return (
                                    <tr key={booking.orderId}
                                        className="transition-colors duration-150 hover:bg-white/[0.02]"
                                        style={{ borderBottom: "1px solid #2A3447" }} onClick={() => { handleShowDetails(booking)}}>

                                        {/* Order ID */}
                                        <td className="px-4 py-3 font-mono font-bold" style={{ color: "#E8C547" }}>
                                            {booking.orderId}
                                        </td>

                                        {/* Customer email */}
                                        <td className="px-4 py-3 text-white">{booking.email}</td>

                                        {/* Items count */}
                                        <td className="px-4 py-3">
                                            <span className="px-2 py-0.5 rounded text-xs font-semibold"
                                                style={{ background: "rgba(232,197,71,0.1)", color: "#E8C547", border: "1px solid rgba(232,197,71,0.2)" }}>
                                                {booking.orderItems?.length} item{booking.orderItems?.length !== 1 ? "s" : ""}
                                            </span>
                                        </td>
                                        

                                        {/* Start date */}
                                        <td className="px-4 py-3 font-mono text-xs" style={{ color: "#6B7A99" }}>
                                            {formatDate(booking.startingDate)}
                                        </td>

                                        {/* End date */}
                                        <td className="px-4 py-3 font-mono text-xs" style={{ color: "#6B7A99" }}>
                                            {formatDate(booking.endingDate)}
                                        </td>

                                        {/* Days */}
                                        <td className="px-4 py-3 text-center text-white font-semibold">
                                            {booking.days}
                                        </td>

                                        {/* Total */}
                                        <td className="px-4 py-3 font-bold font-mono-display" style={{ color: "#E8C547" }}>
                                            Rs {booking.totalAmount?.toFixed(2)} + shippingFee(1500)
                                        </td>
                                        {/* Payment Method */}
                                        <td className="px-4 py-3 font-bold font-mono-display" style={{ color: "#E8C547" }}>
                                            {booking.paymentMethod}
                                        </td>

                                        {/* Status */}
                                        <td className="px-4 py-3">
                                            <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                                                style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}>
                                                {booking.status}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
            {/* Details Modal Overlay */}
            {showDetails && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ background: "rgba(11,15,26,0.85)", backdropFilter: "blur(6px)" }}
                    onClick={() => setShowDetails(false)}
                >
                    <div
                        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl flex flex-col"
                        style={{
                            background: "#111827",
                            border: "1px solid #2A3447",
                            boxShadow: "0 24px 80px rgba(0,0,0,0.7)"
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #2A3447" }}>
                            <div>
                                <p className="text-xs font-semibold tracking-[0.3em] uppercase mb-0.5" style={{ color: "#6B7A99" }}>Booking</p>
                                <h2 className="text-lg font-bold tracking-wider uppercase text-white font-mono-display">
                                    Order&nbsp;<span style={{ color: "#E8C547" }}>{seletedBooking.orderId}</span>
                                </h2>
                            </div>
                            <button
                                onClick={() => setShowDetails(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-white transition-all duration-200 hover:bg-white/10"
                                style={{ border: "1px solid #2A3447", color: "#6B7A99" }}
                            >
                                ✕
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex flex-col gap-5 px-6 py-5">

                            {/* Info Grid */}
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { label: "Customer", value: seletedBooking.email },
                                    { label: "Status", value: seletedBooking.status, isStatus: true },
                                    { label: "Start Date", value: formatDate(seletedBooking.startingDate) },
                                    { label: "End Date",   value: formatDate(seletedBooking.endingDate)   },
                                    { label: "Total Days", value: `${seletedBooking.days} day${seletedBooking.days !== 1 ? "s" : ""}` },
                                    { label: "Total Amount", value: `Rs ${seletedBooking.totalAmount?.toFixed(2)}`, isAmount: true },
                                ].map(({ label, value, isStatus, isAmount }) => {
                                    const s = statusColor[seletedBooking.status] || statusColor.pending;
                                    return (
                                        <div key={label} className="flex flex-col gap-1 p-3 rounded-lg" style={{ background: "#0B0F1A", border: "1px solid #2A3447" }}>
                                            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#6B7A99" }}>{label}</span>
                                            {isStatus ? (
                                                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full self-start mt-0.5"
                                                    style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}>
                                                    {value}
                                                </span>
                                            ) : (
                                                <span className={`text-sm font-semibold ${isAmount ? "font-mono-display" : ""}`}
                                                    style={{ color: isAmount ? "#E8C547" : "white" }}>
                                                    {value}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Ordered Items */}
                            <div>
                                <p className="text-xs font-semibold tracking-[0.3em] uppercase mb-3" style={{ color: "#6B7A99" }}>
                                    Ordered Items ({seletedBooking.orderItems?.length})
                                </p>
                                <div className="flex flex-col gap-2">
                                    {seletedBooking.orderItems?.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-4 p-3 rounded-xl"
                                            style={{ background: "#0B0F1A", border: "1px solid #2A3447" }}>
                                            
                                            <img
                                                
                                                src={item.product.image}
                                                alt={item.product.name}
                                                className="w-14 h-14 object-cover rounded-lg flex-shrink-0"
                                                style={{ border: "1px solid #2A3447" }}
                                            />
                                            
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-white truncate tracking-wide">{item.product.name}</p>
                                                <p className="text-xs mt-0.5 font-mono" style={{ color: "#6B7A99" }}>{item.product.key}</p>
                                                <p className="text-xs mt-1" style={{ color: "#E8C547" }}>Rs {item.product.price?.toFixed(2)} / day</p>
                                            </div>
                                            <div className="flex flex-col items-end flex-shrink-0 gap-1">
                                                <span className="text-xs px-2 py-0.5 rounded font-semibold"
                                                    style={{ background: "rgba(232,197,71,0.1)", color: "#E8C547", border: "1px solid rgba(232,197,71,0.2)" }}>
                                                    Qty: {item.quantity}
                                                </span>
                                                <span className="text-xs font-semibold text-white">
                                                    Rs {(item.product.price * item.quantity * seletedBooking.days).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer — Actions */}
                        <div className="flex gap-3 px-6 py-4" style={{ borderTop: "1px solid #2A3447" }}>
                            <button
                                className="flex-1 py-2.5 rounded-lg text-sm font-bold tracking-wide uppercase transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                                style={{ background: "linear-gradient(135deg, #10B981, #059669)", color: "white" }}
                                onClick={() => handleMessage()}
                            >
                                <FiMessageCircle className="ml-3 absolute mt-[3px] ml-[25px] size-4 font-bold"/> Message 
                            </button>
                            <button
                                className="flex-1 py-2.5 rounded-lg text-sm font-bold tracking-wide uppercase transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                                style={{ background: "linear-gradient(135deg, #10B981, #059669)", color: "white" }}
                                onClick={() => approveBooking()}
                            >
                                ✓ Approve
                            </button>
                            <button
                                className="flex-1 py-2.5 rounded-lg text-sm font-bold tracking-wide uppercase transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                                style={{ background: "linear-gradient(135deg, #EF4444, #DC2626)", color: "white" }}
                                onClick={() => rejectBooking()}
                            >
                                ✕ Reject
                            </button>
                            <button
                                className="px-5 py-2.5 rounded-lg text-sm font-semibold tracking-wide uppercase transition-all duration-200 hover:bg-white/10"
                                style={{ border: "1px solid #2A3447", color: "#6B7A99" }}
                                onClick={() => setShowDetails(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
                </div>
            )}
        </div>
    );
}