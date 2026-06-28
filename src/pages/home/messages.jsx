import { useEffect, useState, useRef } from "react";
import { StreamChat } from "stream-chat";
import {
    Chat,
    Channel,
    Window,
    ChannelHeader,
    MessageList,
    MessageComposer,
    Thread,
} from "stream-chat-react";
import "stream-chat-react/dist/css/index.css";
import { MdSupportAgent } from "react-icons/md";
import { Link } from "react-router-dom";
import axios from "axios";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;

export default function Messages() {
    const [client, setClient] = useState(null);
    const [channel, setChannel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const clientRef = useRef(null);

    const userData = localStorage.getItem("user");
    const stored = userData ? JSON.parse(userData) : null;
    const user = stored?.user || null;
    const token = stored?.token || null;

    useEffect(() => {
        let cancelled = false;

        async function initChat() {
            if (!user || !token) {
                setLoading(false);
                return;
            }

            try {
                // Get Stream token from backend
                const response = await axios.post(
                    `${API_URL}/api/message/stream-token`,
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const { token: streamToken, userId, channelId } = response.data;

                // Create a fresh client instance
                const chatClient = new StreamChat(STREAM_API_KEY);

                // Disconnect any existing user first
                if (chatClient.userID) {
                    await chatClient.disconnectUser();
                }

                if (cancelled) return;

                await chatClient.connectUser(
                    {
                        id: userId,
                        name: user.firstName
                            ? `${user.firstName} ${user.lastName}`
                            : user.email,
                        image: user.profilePic || undefined,
                    },
                    streamToken
                );

                if (cancelled) {
                    await chatClient.disconnectUser();
                    return;
                }

                // Watch the support channel
                const chatChannel = chatClient.channel("messaging", channelId);
                await chatChannel.watch();

                clientRef.current = chatClient;
                setClient(chatClient);
                setChannel(chatChannel);
            } catch (err) {
                console.error("Stream Chat init error:", err);
                if (!cancelled) {
                    setError(err.message || "Failed to connect to chat");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        initChat();

        return () => {
            cancelled = true;
            if (clientRef.current) {
                clientRef.current.disconnectUser().catch(console.error);
                clientRef.current = null;
            }
        };
    }, [user?.email, token]);

    // Unauthenticated state
    if (!user) {
        return (
            <div
                className="w-full min-h-screen flex items-center justify-center px-4"
                style={{ background: "#0B0F1A" }}
            >
                <div className="flex flex-col items-center gap-6 text-center max-w-md">
                    <div
                        className="w-20 h-20 rounded-2xl flex items-center justify-center"
                        style={{
                            background: "rgba(232,197,71,0.08)",
                            border: "1px solid rgba(232,197,71,0.15)",
                        }}
                    >
                        <MdSupportAgent size={36} style={{ color: "#E8C547" }} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold tracking-wider uppercase text-white font-mono-display">
                            Login<span style={{ color: "#E8C547" }}>_Required</span>
                        </h2>
                        <p className="text-sm mt-3" style={{ color: "#6B7A99" }}>
                            Please login to your account to chat with our support team.
                        </p>
                    </div>
                    <Link
                        to="/login"
                        className="px-8 py-3 text-sm font-bold rounded-lg tracking-wide uppercase transition-all duration-200 hover:opacity-90"
                        style={{
                            background: "linear-gradient(135deg, #E8C547, #F59E0B)",
                            color: "#0B0F1A",
                        }}
                    >
                        Login to Continue
                    </Link>
                </div>
            </div>
        );
    }

    // Loading state
    if (loading) {
        return (
            <div
                className="w-full min-h-screen flex items-center justify-center"
                style={{ background: "#0B0F1A" }}
            >
                <div className="flex flex-col items-center gap-4">
                    <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center animate-pulse"
                        style={{
                            background: "rgba(232,197,71,0.1)",
                            border: "1px solid rgba(232,197,71,0.2)",
                        }}
                    >
                        <MdSupportAgent size={24} style={{ color: "#E8C547" }} />
                    </div>
                    <p
                        className="text-sm font-medium tracking-wider uppercase"
                        style={{ color: "#6B7A99" }}
                    >
                        Connecting to support...
                    </p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div
                className="w-full min-h-screen flex items-center justify-center px-4"
                style={{ background: "#0B0F1A" }}
            >
                <div className="flex flex-col items-center gap-4 text-center max-w-md">
                    <div
                        className="w-16 h-16 rounded-xl flex items-center justify-center"
                        style={{
                            background: "rgba(239,68,68,0.1)",
                            border: "1px solid rgba(239,68,68,0.2)",
                        }}
                    >
                        <MdSupportAgent size={28} style={{ color: "#EF4444" }} />
                    </div>
                    <p className="text-sm" style={{ color: "#EF4444" }}>
                        {error}
                    </p>
                    <button
                        onClick={() => {
                            setError(null);
                            setLoading(true);
                            initChat();
                        }}
                        className="px-6 py-2 text-xs font-bold rounded-lg tracking-wide uppercase"
                        style={{
                            background: "rgba(232,197,71,0.1)",
                            border: "1px solid rgba(232,197,71,0.2)",
                            color: "#E8C547",
                        }}
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen py-8 px-4 md:px-8" style={{ background: "#0B0F1A" }}>
            <div className="max-w-3xl mx-auto flex flex-col gap-6">
                {/* Page Header */}
                <div className="flex flex-col gap-3">
                    <p
                        className="text-xs font-semibold tracking-[0.3em] uppercase"
                        style={{ color: "#E8C547" }}
                    >
                        Support Chat
                    </p>
                    <h1 className="text-4xl font-extrabold tracking-wider uppercase text-white font-mono-display">
                        Message<span style={{ color: "#E8C547" }}>_Admin</span>
                    </h1>
                    <div
                        className="w-20 h-1"
                        style={{
                            background: "linear-gradient(to right, #E8C547, transparent)",
                        }}
                    />
                    <p className="text-sm mt-1 max-w-xl" style={{ color: "#6B7A99" }}>
                        Ask about equipment details, pricing, availability, or anything else.
                    </p>
                </div>

                {/* Info note */}
                <div
                    className="flex items-start gap-3 px-4 py-3 rounded-xl"
                    style={{
                        background: "rgba(232,197,71,0.04)",
                        border: "1px solid rgba(232,197,71,0.1)",
                    }}
                >
                    <MdSupportAgent
                        size={18}
                        style={{ color: "#E8C547", marginTop: "2px", flexShrink: 0 }}
                    />
                    <p className="text-xs leading-relaxed" style={{ color: "#6B7A99" }}>
                        Messages are reviewed by our admin team. We typically respond within a
                        few hours during business hours (9 AM – 6 PM). For urgent inquiries,
                        please call us directly.
                    </p>
                </div>

                {/* Stream Chat */}
                {client && channel && (
                    <div
                        className="rounded-xl overflow-hidden"
                        style={{
                            border: "1px solid #2A3447",
                            height: "520px",
                        }}
                    >
                        <Chat client={client} theme="str-chat__theme-dark">
                            <Channel channel={channel}>
                                <Window>
                                    {/* Custom Channel Header showing Admin Support instead of Customer Name */}
                                    <div className="flex items-center gap-3 px-5 py-3 border-b border-[#2A3447]" style={{ background: "#111827" }}>
                                        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#E8C547]/10 border border-[#E8C547]/20 text-[#E8C547]">
                                            <MdSupportAgent size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Support Admin</h3>
                                            <p className="text-[9px] text-green-500 font-bold uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                                Online
                                            </p>
                                        </div>
                                    </div>
                                    <MessageList />
                                    <MessageComposer />
                                </Window>
                                <Thread />
                            </Channel>
                        </Chat>
                    </div>
                )}
            </div>
        </div>
    );
}