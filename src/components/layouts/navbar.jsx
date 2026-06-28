import Logout from "../../pages/login/logout";
import { useAuth } from "../../Auth/AuthProvider";
import { MdOutlineNotifications, MdOutlineAccountCircle, MdMenu } from "react-icons/md";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { StreamChat } from "stream-chat";
import axios from "axios";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;

export default function Navbar({ onMenuClick }) {
    const {user} = useAuth();
    const role = user?.role;
    const navigate = useNavigate();
    const location = useLocation();
    
    const [unreadCount, setUnreadCount] = useState(0);
    const chatClientRef = useRef(null);
    const isOnMessages = location.pathname === "/admin/messages";

    // Clear unread count when on the admin messages section
    useEffect(() => {
        if (isOnMessages) {
            setUnreadCount(0);
        }
    }, [isOnMessages]);

    // Connect background client to track notifications
    useEffect(() => {
        const stored = localStorage.getItem("user");
        const token = stored ? JSON.parse(stored).token : null;
        if (!user || !token || role !== "admin") return;

        let cancelled = false;

        async function initBackgroundChat() {
            try {
                const res = await axios.post(
                    `${API_URL}/api/message/stream-token`,
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const { token: streamToken, userId } = res.data;

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

                if (cancelled) {
                    await client.disconnectUser();
                    return;
                }

                // Set initial total unread count from user state
                if (!isOnMessages) {
                    setUnreadCount(client.user.total_unread_count || 0);
                }

                // Listen to global unread state changes
                const handleNewMessage = (event) => {
                    if (event.user?.id !== userId && !window.location.pathname.includes("/admin/messages")) {
                        setUnreadCount(prev => prev + 1);
                    }
                };

                client.on("message.new", handleNewMessage);
                chatClientRef.current = { client, handleNewMessage };
            } catch (err) {
                console.error("Admin navbar background chat error:", err);
            }
        }

        initBackgroundChat();

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
    }, [user?.email, role]);

    if(!role) {return null}

    return (
        <div className="w-full h-[60px]" style={{background: "#0B0F1A", borderBottom: "1px solid #2A3447"}}>
            <nav className="p-4 flex justify-between items-center w-full bg-[#0B0F1A]">
                {/* Mobile Menu Hamburger Trigger */}
                <button 
                    onClick={onMenuClick}
                    className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-[#2A3447] text-white hover:bg-white/5 transition"
                >
                    <MdMenu size={20} />
                </button>

                {/* Right profile info & actions */}
                <div className="flex items-center gap-3 ml-auto">
                    {/* Responsive Notification Button */}
                    <button 
                        onClick={() => navigate("/admin/messages")}
                        className="relative w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200 hover:bg-white/5 text-[#6B7A99] hover:text-[#E8C547]"
                        title="Unread Messages Support"
                    >
                        <MdOutlineNotifications size={20}/>
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#EF4444] animate-ping" />
                        )}
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#EF4444]" />
                        )}
                    </button>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#2A3447]">
                        <MdOutlineAccountCircle size={18} style={{color: "#6B7A99"}}/>
                        <span className="text-sm font-medium text-white">{user?.firstName || "User"}</span>
                    </div>
                    <Logout/>
                </div>
            </nav>
        </div>
    );
}