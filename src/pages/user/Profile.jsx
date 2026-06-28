import { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../Auth/AuthProvider";
import { 
    MdOutlinePhone, 
    MdOutlineLocationOn, 
    MdOutlineEmail, 
    MdOutlineShoppingBag,
    MdOutlineCalendarToday
} from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const { user, setUser } = useAuth();
    const API_URL = import.meta.env.VITE_API_URL;
    
    // Form states
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    
    // Booking states
    const [bookings, setBookings] = useState([]);
    const [loadingBookings, setLoadingBookings] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [cancellingId, setCancellingId] = useState(null);
    const [now, setNow] = useState(Date.now());
    const intervalRef = useRef(null);
    const navigate = useNavigate()

    // Load user data into form on mount/update
    useEffect(() => {
        if (user) {
            setFirstName(user.firstName || "");
            setLastName(user.lastName || "");
            setPhone(user.phone || "");
            setAddress(user.address || "");
            fetchMyBookings();
        }
    }, [user]);

    // Tick every second so countdown timers update live
    useEffect(() => {
        intervalRef.current = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(intervalRef.current);
    }, []);

    // Fetch customer bookings
    async function fetchMyBookings() {
        try {
            setLoadingBookings(true);
            const stored = localStorage.getItem("user");
            if (!stored) return;
            const token = JSON.parse(stored).token;

            const res = await axios.get(`${API_URL}/api/order/my-orders`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Reverse so newest bookings are at the top
            const sorted = (res.data.orders || []).reverse();
            setBookings(sorted);
        } catch (error) {
            console.error("Failed to load bookings:", error);
            toast.error("Failed to load your bookings");
        } finally {
            setLoadingBookings(false);
        }
    }

    // Save profile changes
    async function handleUpdateProfile(e) {
        e.preventDefault();
        if (!firstName || !lastName || !phone || !address) {
            toast.error("Please fill in all details");
            return;
        }

        try {
            setUpdating(true);
            const stored = localStorage.getItem("user");
            if (!stored) return;
            const token = JSON.parse(stored).token;

            const res = await axios.put(`${API_URL}/api/users/profile`, {
                firstName,
                lastName,
                phone,
                address
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Save updated user & token to localStorage
            const updatedData = {
                token: res.data.token,
                user: res.data.user
            };
            localStorage.setItem("user", JSON.stringify(updatedData));
            
            // Sync context state
            setUser(res.data.user);
            toast.success("Profile updated successfully");
        } catch (error) {
            console.error("Failed to update profile:", error);
            toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
            setUpdating(false);
        }
    }

    function formatDate(dateStr) {
        if (!dateStr) return "—";
        return new Date(dateStr).toLocaleDateString("en-GB", {
            day: "2-digit", month: "short", year: "numeric"
        });
    }

    const statusColor = {
        pending:  { color: "#F59E0B", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.3)"  },
        payed: { color: "#22C55E", bg: "rgba(34,197,94,0.1)",   border: "rgba(34,197,94,0.3)"   },
        cancelled: { color: "#EF4444", bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.3)"   },
    };

    function handleViewDetails(booking) {
        setSelectedBooking(booking);
        setShowDetails(true);
    }

    const CANCEL_WINDOW_MS = 15 * 60 * 1000;

    function isCancellable(booking) {
        if (booking.status !== "pending") return false;
        const elapsed = now - new Date(booking.orderDate).getTime();
        return elapsed < CANCEL_WINDOW_MS;
    }

    function getTimeLeft(booking) {
        const elapsed = now - new Date(booking.orderDate).getTime();
        const remaining = Math.max(0, CANCEL_WINDOW_MS - elapsed);
        const mins = Math.floor(remaining / 60000);
        const secs = Math.floor((remaining % 60000) / 1000);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    }

    // Time-only check — does not depend on status
    function isWithin15Min(booking) {
        const elapsed = now - new Date(booking.orderDate).getTime();
        return elapsed < CANCEL_WINDOW_MS;
    }

    async function handleCancelOrder(booking) {
        if (!isCancellable(booking)) {
            toast.error("Cancellation window has expired");
            return;
        }
        setCancellingId(booking._id);
        try {
            const stored = localStorage.getItem("user");
            if (!stored) return;
            const token = JSON.parse(stored).token;
            await axios.delete(`${API_URL}/api/order/${booking.orderId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(`Order ${booking.orderId} cancelled`);
            // Refresh bookings list
            await fetchMyBookings();
            // Close details modal if open for this booking
            if (selectedBooking?._id === booking._id) setShowDetails(false);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to cancel order");
        } finally {
            setCancellingId(null);
        }
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 text-white min-h-[calc(100vh-64px)]">
            {/* Header */}
            <div className="mb-8">
                <p className="text-xs font-semibold tracking-[0.3em] uppercase mb-1" style={{ color: "#6B7A99" }}>Account</p>
                <h1 className="text-3xl font-bold tracking-wider uppercase text-white font-mono-display">
                    My Profile<span style={{ color: "#E8C547" }}>.Dashboard</span>
                </h1>
                <div className="w-20 h-0.5 mt-2" style={{ background: "linear-gradient(to right, #E8C547, transparent)" }} />
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Panel - Profile Settings */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="p-6 rounded-2xl flex flex-col gap-6"
                        style={{ background: "#111827", border: "1px solid #2A3447", boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}>
                        
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl font-mono-display"
                                style={{ background: "linear-gradient(135deg, #E8C547, #F59E0B)", color: "#0B0F1A" }}>
                                {(user?.firstName?.[0] || "?").toUpperCase()}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold truncate max-w-[200px]">{user?.firstName} {user?.lastName}</h3>
                                <p className="text-xs flex items-center gap-1.5 mt-1" style={{ color: "#6B7A99" }}>
                                    <MdOutlineEmail size={14}/>
                                    {user?.email}
                                </p>
                            </div>
                        </div>

                        <div className="w-full h-[1px]" style={{ background: "#2A3447" }} />

                        <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold tracking-wider uppercase" style={{ color: "#6B7A99" }}>First Name</label>
                                    <input
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg text-sm text-white transition-all duration-200 focus:outline-none"
                                        style={{ background: "#0B0F1A", border: "1px solid #2A3447" }}
                                        onFocus={e => e.target.style.borderColor = "#E8C547"}
                                        onBlur={e => e.target.style.borderColor = "#2A3447"}
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold tracking-wider uppercase" style={{ color: "#6B7A99" }}>Last Name</label>
                                    <input
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg text-sm text-white transition-all duration-200 focus:outline-none"
                                        style={{ background: "#0B0F1A", border: "1px solid #2A3447" }}
                                        onFocus={e => e.target.style.borderColor = "#E8C547"}
                                        onBlur={e => e.target.style.borderColor = "#2A3447"}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold tracking-wider uppercase flex items-center gap-1" style={{ color: "#6B7A99" }}>
                                    <MdOutlinePhone size={13}/>
                                    Phone Number
                                </label>
                                <input
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg text-sm text-white transition-all duration-200 focus:outline-none"
                                    style={{ background: "#0B0F1A", border: "1px solid #2A3447" }}
                                    onFocus={e => e.target.style.borderColor = "#E8C547"}
                                    onBlur={e => e.target.style.borderColor = "#2A3447"}
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold tracking-wider uppercase flex items-center gap-1" style={{ color: "#6B7A99" }}>
                                    <MdOutlineLocationOn size={14}/>
                                    Shipping Address
                                </label>
                                <textarea
                                    rows={3}
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg text-sm text-white transition-all duration-200 focus:outline-none resize-none"
                                    style={{ background: "#0B0F1A", border: "1px solid #2A3447" }}
                                    onFocus={e => e.target.style.borderColor = "#E8C547"}
                                    onBlur={e => e.target.style.borderColor = "#2A3447"}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={updating}
                                className="w-full py-2.5 mt-2 rounded-lg text-sm font-bold tracking-wider uppercase transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
                                style={{ background: "linear-gradient(135deg, #E8C547, #F59E0B)", color: "#0B0F1A" }}>
                                {updating ? "Saving Changes..." : "Save Profile Details"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Panel - Orders & Bookings History */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    <div className="p-6 rounded-2xl flex flex-col gap-6 min-h-[400px]"
                        style={{ background: "#111827", border: "1px solid #2A3447", boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}>
                        
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold tracking-wide flex items-center gap-2">
                                <MdOutlineShoppingBag className="text-[#E8C547]"/>
                                Order History
                            </h2>
                            <span className="text-xs px-2.5 py-1 rounded-full font-mono font-semibold"
                                style={{ background: "rgba(232,197,71,0.1)", color: "#E8C547", border: "1px solid rgba(232,197,71,0.2)" }}>
                                {bookings.length} Bookings Total
                            </span>
                        </div>

                        {loadingBookings ? (
                            <div className="flex-1 flex flex-col items-center justify-center py-16 gap-3">
                                <div className="w-8 h-8 rounded-full border-2 animate-spin"
                                    style={{ borderColor: "#2A3447", borderTopColor: "#E8C547" }} />
                                <span className="text-sm tracking-widest uppercase font-semibold" style={{ color: "#6B7A99" }}>Loading your orders...</span>
                            </div>
                        ) : bookings.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
                                <p className="text-4xl mb-4"></p>
                                <p className="font-semibold text-lg text-white">No rental bookings found</p>
                                <p className="text-sm mt-1 max-w-sm" style={{ color: "#6B7A99" }}>
                                    When you select audio equipment for rent and complete the checkout, your bookings will display here.
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4 overflow-y-auto max-h-[600px] pr-2">
                                {bookings.map((booking) => {
                                    const s = statusColor[booking.status] || statusColor.pending;
                                    return (
                                            <div key={booking._id} 
                                            className="p-5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-200 hover:border-[#2A3447]/80"
                                            style={{ background: "#0B0F1A", border: "1px solid #2A3447" }}>
                                            
                                            <div className="flex flex-col gap-1.5 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="font-bold text-sm tracking-wider uppercase text-white font-mono-display">
                                                        {booking.orderId}
                                                    </span>
                                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                                                        style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}>
                                                        {booking.status}
                                                    </span>
                                                </div>
                                                
                                                <div className="flex items-center gap-4 text-xs" style={{ color: "#6B7A99" }}>
                                                    <span className="flex items-center gap-1">
                                                        <MdOutlineCalendarToday size={13}/>
                                                        {formatDate(booking.startingDate)} - {formatDate(booking.endingDate)}
                                                    </span>
                                                    <span>•</span>
                                                    <span>{booking.days} Day{booking.days !== 1 ? "s" : ""}</span>
                                                </div>

                                                <p className="text-xs text-white/70 truncate max-w-xs sm:max-w-md">
                                                    Items: {booking.orderItems?.map(item => `${item.product?.name} (x${item.quantity})`).join(", ")}
                                                </p>
                                            </div>

                                            <div className="flex sm:flex-col items-end justify-between w-full sm:w-auto gap-2 border-t border-[#2A3447] sm:border-t-0 pt-3 sm:pt-0">
                                                <span className="text-base font-bold text-[#E8C547] font-mono-display">
                                                    Rs {booking.totalAmount?.toFixed(2)}
                                                </span>
                                                <button
                                                    onClick={() => handleViewDetails(booking)}
                                                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#111827] border border-[#2A3447] hover:border-[#E8C547] hover:bg-[#2A3447] text-white transition-all duration-200"
                                                >
                                                    View Details
                                                </button>
                                                {/* Cancel button — visible only within 15 min window for pending orders */}
                                                {booking.status === "payed" && isWithin15Min(booking) && (
                                                    <button onClick={() => navigate('/messages')} className="px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#111827] border border-[#2A3447] hover:border-[#E8C547] hover:bg-[#2A3447] text-white transition-all duration-200" style={{ color: "#6B7A99" }}>To cancel a paid order,<br/>please contact Admin. Within 15 Mins</button>
                                                )}
                                                {isCancellable(booking) && (
                                                    <button
                                                        disabled={cancellingId === booking._id}
                                                        onClick={() => handleCancelOrder(booking)}
                                                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all duration-200 disabled:opacity-50"
                                                        style={{ background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.35)", color: "#EF4444" }}
                                                    >
                                                        {cancellingId === booking._id ? (
                                                            <span>Cancelling...</span>
                                                        
                                                        ) : (
                                                            <>
                                                            
                                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                                                </svg>
                                                                Cancel
                                                                <span className="ml-1 font-mono text-[10px] opacity-80">({getTimeLeft(booking)})</span>
                                                            </>
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* Details Modal Overlay */}
            {showDetails && selectedBooking && (
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
                                <p className="text-xs font-semibold tracking-[0.3em] uppercase mb-0.5" style={{ color: "#6B7A99" }}>Booking Details</p>
                                <h2 className="text-lg font-bold tracking-wider uppercase text-white font-mono-display">
                                    Order&nbsp;<span style={{ color: "#E8C547" }}>{selectedBooking.orderId}</span>
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
                                    { label: "Billing Email", value: selectedBooking.email },
                                    { label: "Booking Status", value: selectedBooking.status, isStatus: true },
                                    { label: "Starting Date", value: formatDate(selectedBooking.startingDate) },
                                    { label: "Ending Date",   value: formatDate(selectedBooking.endingDate)   },
                                    { label: "Rental Period", value: `${selectedBooking.days} day${selectedBooking.days !== 1 ? "s" : ""}` },
                                    { label: "Payment Method", value: selectedBooking.paymentMethod || "Not specified" },
                                    { label: "Total Amount Paid", value: `Rs ${selectedBooking.totalAmount?.toFixed(2)}`, isAmount: true },
                                    { label: "Shipping Address", value: selectedBooking.shippingAddress || "N/A" },
                                ].map(({ label, value, isStatus, isAmount }) => {
                                    const s = statusColor[selectedBooking.status] || statusColor.pending;
                                    return (
                                        <div key={label} className="flex flex-col gap-1 p-3 rounded-lg" style={{ background: "#0B0F1A", border: "1px solid #2A3447" }}>
                                            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#6B7A99" }}>{label}</span>
                                            {isStatus ? (
                                                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full self-start mt-0.5"
                                                    style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}>
                                                    {value}
                                                </span>
                                            ) : (
                                                <span className={`text-sm font-medium ${isAmount ? "font-mono-display font-semibold" : ""}`}
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
                                    Rented Audio Equipment ({selectedBooking.orderItems?.length})
                                </p>
                                <div className="flex flex-col gap-2">
                                    {selectedBooking.orderItems?.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-4 p-3 rounded-xl"
                                            style={{ background: "#0B0F1A", border: "1px solid #2A3447" }}>
                                            
                                            <img
                                                src={item.product?.image}
                                                alt={item.product?.name}
                                                className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                                                style={{ border: "1px solid #2A3447" }}
                                            />
                                            
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-white truncate tracking-wide">{item.product?.name}</p>
                                                <p className="text-xs mt-0.5 font-mono" style={{ color: "#6B7A99" }}>Code: {item.product?.key}</p>
                                                <p className="text-xs mt-0.5 font-semibold text-[#E8C547]">Rs {item.product?.price?.toFixed(2)} / day</p>
                                            </div>
                                            <div className="flex flex-col items-end flex-shrink-0 gap-1">
                                                <span className="text-xs px-2 py-0.5 rounded font-semibold"
                                                    style={{ background: "rgba(232,197,71,0.1)", color: "#E8C547", border: "1px solid rgba(232,197,71,0.2)" }}>
                                                    Qty: {item.quantity}
                                                </span>
                                                <span className="text-xs font-semibold text-white">
                                                    Rs {(item.product?.price * item.quantity * selectedBooking.days).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
