import { useEffect, useState, useRef } from "react";
import { StreamChat } from "stream-chat";
import {
    Chat,
    Channel,
    ChannelList,
    Window,
    ChannelHeader,
    MessageList,
    MessageComposer,
    Thread,
} from "stream-chat-react";
import "stream-chat-react/dist/css/index.css";
import { MdSupportAgent, MdInbox } from "react-icons/md";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;

export default function AdminMessages() {
    const [searchParams] = useSearchParams();
    const targetChannelId = searchParams.get("channelId");

    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);
    const [activeChannel, setActiveChannel] = useState(null);
    const clientRef = useRef(null);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

    useEffect(() => {
        const handler = () => setIsDesktop(window.innerWidth >= 768);
        window.addEventListener("resize", handler);
        return () => window.removeEventListener("resize", handler);
    }, []);

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

                const { token: streamToken, userId: streamUserId } = response.data;

                // Create a fresh client instance
                const chatClient = new StreamChat(STREAM_API_KEY);

                // Disconnect any existing user first
                if (chatClient.userID) {
                    await chatClient.disconnectUser();
                }

                if (cancelled) return;

                await chatClient.connectUser(
                    {
                        id: streamUserId,
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

                clientRef.current = chatClient;
                setUserId(streamUserId);
                setClient(chatClient);

                if (targetChannelId) {
                    const channel = chatClient.channel("messaging", targetChannelId);
                    await channel.watch();
                    setActiveChannel(channel);
                }
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

    // Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-120px)]">
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
                        Loading messages...
                    </p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-120px)]">
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

    if (!client || !userId) return null;

    // Channel list filters — show all messaging channels where admin is a member
    const filters = { type: "messaging", members: { $in: [userId] } };
    const sort = { last_message_at: -1 };
    const options = { limit: 20 };

    // Custom empty state for when no conversations exist yet
    const EmptyStateIndicator = () => (
        <div className="flex flex-col items-center justify-center h-full gap-4 px-6 py-12">
            <div
                className="w-16 h-16 rounded-xl flex items-center justify-center"
                style={{
                    background: "rgba(232,197,71,0.08)",
                    border: "1px solid rgba(232,197,71,0.15)",
                }}
            >
                <MdInbox size={28} style={{ color: "#E8C547" }} />
            </div>
            <p className="text-sm text-center" style={{ color: "#6B7A99" }}>
                No customer conversations yet. Conversations will appear here when customers
                send messages.
            </p>
        </div>
    );

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Page Header */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <p style={{ color: "#E8C547", fontSize: 11, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" }}>
                    Customer Support
                </p>
                <h1 style={{ color: "white", fontSize: 28, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "monospace" }}>
                    Messages<span style={{ color: "#E8C547" }}>.Inbox</span>
                </h1>
                <div style={{ width: 64, height: 2, background: "linear-gradient(to right, #E8C547, transparent)" }} />
                <p style={{ color: "#6B7A99", fontSize: 14 }}>
                    View and respond to customer support conversations in real time.
                </p>
            </div>

            {/* Chat Interface — single Chat context, single connection */}
            <div style={{
                border: "1px solid #2A3447",
                borderRadius: 12,
                overflow: "hidden",
                height: "calc(100vh - 240px)",
                minHeight: 500,
                display: "flex",
            }}>
                <Chat client={client} theme="str-chat__theme-dark">
                    {/* force str-chat wrapper to fill its parent */}
                    <style>{`.str-chat { height: 100% !important; width: 100% !important; }`}</style>

                    {/* Outer flex row */}
                    <div style={{ display: "flex", width: "100%", height: "100%" }}>

                        {/* ── LEFT PANEL: Channel List ── */}
                        {/* On mobile: show only when no active channel. On desktop: always show as 320px sidebar */}
                        {(!activeChannel || isDesktop) && (
                            <div style={{
                                width: isDesktop ? 320 : "100%",
                                height: "100%",
                                flexShrink: 0,
                                display: "flex",
                                flexDirection: "column",
                                borderRight: isDesktop ? "1px solid #2A3447" : "none",
                            }}>
                                {/* Panel header */}
                                <div style={{
                                    padding: "12px 16px",
                                    background: "#111827",
                                    borderBottom: "1px solid #2A3447",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    flexShrink: 0,
                                }}>
                                    <MdSupportAgent size={18} style={{ color: "#E8C547" }} />
                                    <span style={{ color: "#E8C547", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                                        Conversations
                                    </span>
                                </div>
                                {/* ChannelList fills remaining height */}
                                <div style={{ flex: 1, overflow: "hidden" }}>
                                    <ChannelList
                                        filters={filters}
                                        sort={sort}
                                        options={options}
                                        EmptyStateIndicator={EmptyStateIndicator}
                                        showChannelSearch
                                        onSelect={(channel) => setActiveChannel(channel)}
                                    />
                                </div>
                            </div>
                        )}

                        {/* ── RIGHT PANEL: Active Chat or Desktop placeholder ── */}
                        {/* On mobile: show only when a channel is active. On desktop: always show. */}
                        {(activeChannel || isDesktop) && (
                            <div style={{ flex: 1, height: "100%", display: "flex", flexDirection: "column", minWidth: 0 }}>
                                {/* Mobile back-button bar */}
                                {activeChannel && !isDesktop && (
                                    <div style={{
                                        padding: "8px 16px",
                                        background: "#111827",
                                        borderBottom: "1px solid #2A3447",
                                        flexShrink: 0,
                                    }}>
                                        <button
                                            onClick={() => setActiveChannel(null)}
                                            style={{ color: "#E8C547", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", background: "none", border: "none", cursor: "pointer" }}
                                        >
                                            ← Back to Conversations
                                        </button>
                                    </div>
                                )}

                                {/* Active channel chat */}
                                {activeChannel ? (
                                    <div style={{ flex: 1, overflow: "hidden" }}>
                                        <Channel channel={activeChannel}>
                                            <Window>
                                                <ChannelHeader />
                                                <MessageList />
                                                <MessageComposer />
                                            </Window>
                                            <Thread />
                                        </Channel>
                                    </div>
                                ) : (
                                    /* Desktop placeholder when nothing selected */
                                    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#0B0F1A" }}>
                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center", padding: "0 32px" }}>
                                            <div style={{ width: 64, height: 64, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(232,197,71,0.08)", border: "1px solid rgba(232,197,71,0.15)" }}>
                                                <MdSupportAgent size={28} style={{ color: "#E8C547" }} />
                                            </div>
                                            <p style={{ color: "#6B7A99", fontSize: 14 }}>Select a conversation to start responding</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </Chat>
            </div>
        </div>
    );
}
