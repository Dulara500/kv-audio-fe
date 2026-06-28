import { useState, useEffect, useRef } from "react";
import { LuAudioWaveform } from "react-icons/lu";
import { MdOutlineShoppingCart, MdOutlineAccountCircle, MdOutlineMessage } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import Logout from "../pages/login/logout";
import { StreamChat } from "stream-chat";
import axios from "axios";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;

export default function Header(){
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem("user"))?.user || null;
    const token = JSON.parse(localStorage.getItem("user"))?.token || null;
    const [cartCount, setCartCount] = useState(0);
    const [unreadCount, setUnreadCount] = useState(0);
    const chatClientRef = useRef(null);
    const isOnMessages = location.pathname === "/messages";

    // Clear unread badge when user navigates to the messages page
    useEffect(() => {
        if (isOnMessages) {
            setUnreadCount(0);
        }
    }, [isOnMessages]);

    // Cart count listener
    useEffect(() => {
        const updateCount = () => {
            try {
                const cartStr = localStorage.getItem("cart");
                if (!cartStr) { setCartCount(0); return; }
                const cart = JSON.parse(cartStr);
                setCartCount(cart.orderedItems?.length || 0);
            } catch (e) {
                setCartCount(0);
            }
        };

        updateCount();
        window.addEventListener("cart-updated", updateCount);
        window.addEventListener("storage", updateCount);
        return () => {
            window.removeEventListener("cart-updated", updateCount);
            window.removeEventListener("storage", updateCount);
        };
    }, []);

    // Connect a background Stream Chat client to listen for new messages
    useEffect(() => {
        if (!user || !token) return;

        let cancelled = false;

        async function connectBackground() {
            try {
                const res = await axios.post(
                    `${API_URL}/api/message/stream-token`,
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const { token: streamToken, userId, channelId } = res.data;

                if (cancelled) return;

                const client = new StreamChat(STREAM_API_KEY);
                if (client.userID) await client.disconnectUser();

                await client.connectUser(
                    {
                        id: userId,
                        name: user.firstName ? `${user.firstName} ${user.lastName}` : user.email,
                    },
                    streamToken
                );

                if (cancelled) { await client.disconnectUser(); return; }

                const ch = client.channel("messaging", channelId);
                await ch.watch();

                // Set initial unread from Stream's stored state
                if (!isOnMessages && ch.countUnread() > 0) {
                    setUnreadCount(ch.countUnread());
                }

                // Listen for incoming messages that are NOT from the current user
                const handleNewMessage = (event) => {
                    if (event.user?.id !== userId && !window.location.pathname.includes("/messages")) {
                        setUnreadCount(prev => prev + 1);
                    }
                };

                client.on("message.new", handleNewMessage);
                chatClientRef.current = { client, handleNewMessage };
            } catch (err) {
                console.error("Header chat init error:", err);
            }
        }

        connectBackground();

        return () => {
            cancelled = true;
            if (chatClientRef.current) {
                const { client, handleNewMessage } = chatClientRef.current;
                client.off("message.new", handleNewMessage);
                client.disconnectUser().catch(() => {});
                chatClientRef.current = null;
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.email]);

    const navLinks = [
        { to: "/", label: "Home" },
        { to: "/gallery", label: "Gallery" },
        { to: "/items", label: "Catalog" },
        { to: "/contact", label: "Contact" },
    ];

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return(
        <div>
            <header className="w-full h-[64px] fixed top-0 z-50 flex items-center justify-between px-4 md:px-6"
                style={{background: "rgba(11,15,26,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid #2A3447"}}>
                
                {/* Hamburger and Logo */}
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="flex md:hidden items-center justify-center w-8 h-8 rounded-lg border border-[#2A3447] text-white hover:bg-white/5"
                    >
                        {mobileMenuOpen ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                    
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                            style={{background: "linear-gradient(135deg, #E8C547 0%, #F59E0B 100%)"}}>
                            <LuAudioWaveform className="text-[#0B0F1A] text-lg font-bold"/>
                        </div>
                        <span className="font-bold text-base md:text-lg tracking-wider text-white font-mono-display">
                            REN<span className="text-[#E8C547]">TEC</span>
                        </span>
                    </Link>
                </div>

                {/* Nav Links (Desktop) */}
                <nav className="hidden md:flex gap-1">
                    {navLinks.map((link) => {
                        const isActive = location.pathname === link.to;
                        return (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`px-4 py-2 text-sm font-medium tracking-wide uppercase transition-all duration-200 rounded-md
                                    ${isActive 
                                        ? "text-[#E8C547] bg-[#E8C547]/10" 
                                        : "text-[#6B7A99] hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-2 md:gap-3">
                    
                    {/* Message icon with unread badge */}
                    <Link to="/messages" className="relative w-9 h-9 flex items-center justify-center rounded-lg text-[#6B7A99] hover:text-[#E8C547] hover:bg-[#E8C547]/10 transition-all duration-200" title="Message Admin">
                        <MdOutlineMessage size={22}/>
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-0.5 flex items-center justify-center rounded-full text-[10px] font-bold animate-pulse"
                                style={{ background: "#EF4444", color: "white" }}>
                                {unreadCount > 9 ? "9+" : unreadCount}
                            </span>
                        )}
                    </Link>
                    <Link to="/cart" className="relative w-9 h-9 flex items-center justify-center rounded-lg text-[#6B7A99] hover:text-[#E8C547] hover:bg-[#E8C547]/10 transition-all duration-200">
                        <MdOutlineShoppingCart size={22} />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center rounded-full bg-[#E8C547] text-[#0B0F1A] text-xs font-bold">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                    {!user && (
                        <Link to="/login"
                            className="hidden sm:inline-block px-4 py-2 text-sm font-semibold text-[#6B7A99] hover:text-white transition-colors duration-200">
                            Login
                        </Link>
                    )}
                    {user && (
                        <Link to="/profile" className="flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1.5 rounded-lg hover:border-[#E8C547] transition-all duration-200" style={{border: "1px solid #2A3447"}} title="View Profile">
                            <MdOutlineAccountCircle size={18} style={{color: "#6B7A99"}}/>
                            <span className="hidden sm:inline text-sm font-medium text-white">{user?.firstName || "User"}</span>
                        </Link>
                    )}
                    {user && (
                        <div className="hidden sm:block">
                            <Logout/>
                        </div>
                    )}
                    {!user &&(
                        <Link to="/register"
                            className="hidden sm:inline-block px-4 py-2 text-sm font-semibold rounded-lg text-[#0B0F1A] transition-all duration-200 hover:opacity-90"
                            style={{background: "linear-gradient(135deg, #E8C547, #F59E0B)"}}>
                            Register
                        </Link>
                    )}
                </div>
            </header>

            {/* Mobile Menu Dropdown Overlay */}
            {mobileMenuOpen && (
                <div 
                    className="fixed inset-0 top-[64px] z-40 bg-[#0B0F1A]/95 backdrop-blur-md md:hidden flex flex-col p-6 gap-6 animate-fade-in border-t border-[#2A3447]"
                    style={{ height: "calc(100vh - 64px)" }}
                >
                    <nav className="flex flex-col gap-2">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.to;
                            return (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`px-4 py-3 text-base font-semibold tracking-wider uppercase rounded-xl transition duration-200
                                        ${isActive 
                                            ? "text-[#E8C547] bg-[#E8C547]/10 border border-[#E8C547]/20" 
                                            : "text-[#6B7A99] hover:text-white hover:bg-white/5"
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Account Buttons inside Mobile Menu for Mobile Widths */}
                    <div className="flex flex-col gap-3 mt-auto border-t border-[#2A3447] pt-6">
                        {user ? (
                            <div className="flex flex-col gap-3">
                                <Link 
                                    to="/profile" 
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center justify-center gap-2 py-3 rounded-xl border border-[#2A3447] text-white hover:border-[#E8C547] transition"
                                >
                                    <MdOutlineAccountCircle size={20} style={{color: "#E8C547"}}/>
                                    My Profile Dashboard ({user.firstName})
                                </Link>
                                <div onClick={() => setMobileMenuOpen(false)}>
                                    <Logout />
                                </div>
                            </div>
                        ) : (
                            <div className="flex gap-3">
                                <Link
                                    to="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex-1 py-3 text-center text-sm font-semibold rounded-xl text-white border border-[#2A3447] hover:bg-white/5 transition"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex-1 py-3 text-center text-sm font-semibold rounded-xl text-[#0B0F1A] transition"
                                    style={{background: "linear-gradient(135deg, #E8C547, #F59E0B)"}}
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );  
}