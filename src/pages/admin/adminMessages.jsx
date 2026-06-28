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
import { MdSupportAgent, MdMenu, MdClose, MdInbox } from "react-icons/md";
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
    const [channels, setChannels] = useState([]);
    const [showContacts, setShowContacts] = useState(false);
    const clientRef = useRef(null);

    const userData = localStorage.getItem("user");
    const stored = userData ? JSON.parse(userData) : null;
    const user = stored?.user || null;
    const token = stored?.token || null;

    // Fetch the list of channels the admin is a member of
    const fetchChannels = async (chatClient, uid) => {
        try {
            const result = await chatClient.queryChannels(
                { type: "messaging", members: { $in: [uid] } },
                { last_message_at: -1 },
                { limit: 30, watch: true, state: true }
            );
            setChannels(result);
        } catch (err) {
            console.error("Failed to fetch channels:", err);
        }
    };

    useEffect(() => {
        let cancelled = false;

        async function initChat() {
            if (!user || !token) {
                setLoading(false);
                return;
            }

            try {
                const response = await axios.post(
                    `${API_URL}/api/message/stream-token`,
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const { token: streamToken, userId: streamUserId } = response.data;

                const chatClient = new StreamChat(STREAM_API_KEY);

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

                // Fetch channels manually (bypasses ChannelList component)
                await fetchChannels(chatClient, streamUserId);

                // If deep-linked to a specific channel, open it immediately
                if (targetChannelId) {
                    const channel = chatClient.channel("messaging", targetChannelId);
                    await channel.watch();
                    setActiveChannel(channel);
                }

                // Refresh channel list on new messages
                chatClient.on("message.new", () => {
                    if (!cancelled) fetchChannels(chatClient, streamUserId);
                });

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

    // Get the display name for a channel (show other member names, not admin)
    const getChannelName = (channel) => {
        const members = Object.values(channel.state?.members || {});
        const others = members.filter((m) => m.user_id !== userId);
        if (others.length > 0) {
            return others.map((m) => m.user?.name || m.user_id).join(", ");
        }
        return channel.data?.name || channel.id || "Unknown";
    };

    // Get the last message text preview
    const getLastMessage = (channel) => {
        const msgs = channel.state?.messages;
        if (msgs && msgs.length > 0) {
            const last = msgs[msgs.length - 1];
            return last.text || (last.attachments?.length > 0 ? "📎 Attachment" : "—");
        }
        return "No messages yet";
    };

    // Get first letter for avatar
    const getInitial = (channel) => {
        return getChannelName(channel).charAt(0).toUpperCase();
    };

    // ── Loading state ──
    if (loading) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "calc(100vh - 120px)" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(232,197,71,0.1)", border: "1px solid rgba(232,197,71,0.2)" }}>
                        <MdSupportAgent size={24} style={{ color: "#E8C547" }} />
                    </div>
                    <p style={{ color: "#6B7A99", fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" }}>
                        Loading messages...
                    </p>
                </div>
            </div>
        );
    }

    // ── Error state ──
    if (error) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "calc(100vh - 120px)" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center", maxWidth: 360, padding: "0 16px" }}>
                    <div style={{ width: 64, height: 64, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                        <MdSupportAgent size={28} style={{ color: "#EF4444" }} />
                    </div>
                    <p style={{ color: "#EF4444", fontSize: 13 }}>{error}</p>
                </div>
            </div>
        );
    }

    if (!client || !userId) return null;

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 80px)", background: "#0B0F1A" }}>

            {/* ─── Top Header Bar ─── */}
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 16px",
                background: "#111827",
                borderBottom: "1px solid #2A3447",
                flexShrink: 0,
            }}>
                {/* Contact drawer toggle */}
                <button
                    onClick={() => setShowContacts(!showContacts)}
                    title="Toggle conversations"
                    style={{
                        width: 38,
                        height: 38,
                        borderRadius: 8,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: showContacts ? "rgba(232,197,71,0.15)" : "rgba(255,255,255,0.04)",
                        border: `1px solid ${showContacts ? "rgba(232,197,71,0.4)" : "#2A3447"}`,
                        cursor: "pointer",
                        flexShrink: 0,
                        transition: "all 0.2s",
                    }}
                >
                    {showContacts
                        ? <MdClose size={18} style={{ color: "#E8C547" }} />
                        : <MdMenu size={18} style={{ color: "#6B7A99" }} />
                    }
                </button>

                <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: "#E8C547", fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", margin: 0 }}>
                        Customer Support
                    </p>
                    <h1 style={{ color: "white", fontSize: 16, fontWeight: 800, textTransform: "uppercase", fontFamily: "monospace", margin: 0, letterSpacing: "0.05em" }}>
                        Messages<span style={{ color: "#E8C547" }}>.Inbox</span>
                    </h1>
                </div>

                {/* Conversation count badge */}
                {channels.length > 0 && (
                    <div style={{
                        padding: "3px 10px",
                        background: "rgba(232,197,71,0.1)",
                        border: "1px solid rgba(232,197,71,0.25)",
                        borderRadius: 20,
                    }}>
                        <span style={{ color: "#E8C547", fontSize: 11, fontWeight: 700 }}>
                            {channels.length} chat{channels.length !== 1 ? "s" : ""}
                        </span>
                    </div>
                )}
            </div>

            {/* ─── Main area (relative for drawer overlay) ─── */}
            <div style={{ flex: 1, display: "flex", position: "relative", overflow: "hidden" }}>

                {/* ── Contact Drawer Overlay ── */}
                {showContacts && (
                    <>
                        {/* Dim backdrop */}
                        <div
                            onClick={() => setShowContacts(false)}
                            style={{
                                position: "absolute",
                                inset: 0,
                                background: "rgba(0,0,0,0.55)",
                                zIndex: 40,
                            }}
                        />

                        {/* Drawer panel */}
                        <div style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            bottom: 0,
                            width: 300,
                            maxWidth: "85vw",
                            background: "#111827",
                            borderRight: "1px solid #2A3447",
                            zIndex: 50,
                            display: "flex",
                            flexDirection: "column",
                            overflow: "hidden",
                        }}>
                            {/* Drawer header */}
                            <div style={{
                                padding: "14px 16px",
                                borderBottom: "1px solid #2A3447",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                flexShrink: 0,
                            }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <MdSupportAgent size={16} style={{ color: "#E8C547" }} />
                                    <span style={{ color: "#E8C547", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                                        Conversations
                                    </span>
                                </div>
                                <button
                                    onClick={() => setShowContacts(false)}
                                    style={{ background: "none", border: "none", cursor: "pointer", color: "#6B7A99", display: "flex" }}
                                >
                                    <MdClose size={18} />
                                </button>
                            </div>

                            {/* Channel list */}
                            <div style={{ flex: 1, overflowY: "auto" }}>
                                {channels.length === 0 ? (
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 16px", gap: 12 }}>
                                        <MdInbox size={32} style={{ color: "#2A3447" }} />
                                        <p style={{ color: "#6B7A99", fontSize: 13, textAlign: "center" }}>
                                            No conversations yet. They will appear here when customers send messages.
                                        </p>
                                    </div>
                                ) : (
                                    channels.map((ch) => {
                                        const isActive = activeChannel?.id === ch.id;
                                        const unread = ch.state?.unreadCount || 0;
                                        return (
                                            <button
                                                key={ch.id}
                                                onClick={() => {
                                                    setActiveChannel(ch);
                                                    setShowContacts(false);
                                                }}
                                                style={{
                                                    width: "100%",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 12,
                                                    padding: "12px 16px",
                                                    background: isActive ? "rgba(232,197,71,0.08)" : "transparent",
                                                    borderLeft: isActive ? "3px solid #E8C547" : "3px solid transparent",
                                                    borderTop: "none",
                                                    borderRight: "none",
                                                    borderBottom: "1px solid #1A2233",
                                                    cursor: "pointer",
                                                    textAlign: "left",
                                                    transition: "background 0.15s",
                                                }}
                                            >
                                                {/* Avatar */}
                                                <div style={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: "50%",
                                                    background: isActive ? "rgba(232,197,71,0.2)" : "rgba(232,197,71,0.08)",
                                                    border: `1px solid ${isActive ? "rgba(232,197,71,0.4)" : "rgba(232,197,71,0.15)"}`,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    flexShrink: 0,
                                                }}>
                                                    <span style={{ color: "#E8C547", fontWeight: 700, fontSize: 15 }}>
                                                        {getInitial(ch)}
                                                    </span>
                                                </div>

                                                {/* Name + last message */}
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <p style={{
                                                        color: "white",
                                                        fontSize: 13,
                                                        fontWeight: unread > 0 ? 700 : 500,
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        whiteSpace: "nowrap",
                                                        margin: 0,
                                                    }}>
                                                        {getChannelName(ch)}
                                                    </p>
                                                    <p style={{
                                                        color: "#6B7A99",
                                                        fontSize: 11,
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        whiteSpace: "nowrap",
                                                        marginTop: 2,
                                                        margin: "2px 0 0 0",
                                                    }}>
                                                        {getLastMessage(ch)}
                                                    </p>
                                                </div>

                                                {/* Unread badge */}
                                                {unread > 0 && (
                                                    <div style={{
                                                        width: 20,
                                                        height: 20,
                                                        borderRadius: "50%",
                                                        background: "#E8C547",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        flexShrink: 0,
                                                    }}>
                                                        <span style={{ color: "#0B0F1A", fontSize: 10, fontWeight: 700 }}>
                                                            {unread > 9 ? "9+" : unread}
                                                        </span>
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </>
                )}

                {/* ── Chat Window ── */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", height: "100%", minWidth: 0 }}>
                    {activeChannel ? (
                        <Chat client={client} theme="str-chat__theme-dark">
                            <style>{`.str-chat { height: 100% !important; width: 100% !important; }`}</style>
                            <Channel channel={activeChannel}>
                                <Window>
                                    <ChannelHeader />
                                    <MessageList />
                                    <MessageComposer />
                                </Window>
                                <Thread />
                            </Channel>
                        </Chat>
                    ) : (
                        /* Placeholder when no channel selected */
                        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center", padding: "0 32px" }}>
                                <div style={{ width: 72, height: 72, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(232,197,71,0.08)", border: "1px solid rgba(232,197,71,0.15)" }}>
                                    <MdSupportAgent size={32} style={{ color: "#E8C547" }} />
                                </div>
                                <div>
                                    <p style={{ color: "white", fontSize: 15, fontWeight: 600, margin: "0 0 6px" }}>No conversation selected</p>
                                    <p style={{ color: "#6B7A99", fontSize: 13, margin: 0 }}>
                                        Click the <strong style={{ color: "#E8C547" }}>☰</strong> icon above to browse conversations
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowContacts(true)}
                                    style={{
                                        padding: "10px 22px",
                                        background: "rgba(232,197,71,0.1)",
                                        border: "1px solid rgba(232,197,71,0.35)",
                                        borderRadius: 8,
                                        color: "#E8C547",
                                        fontSize: 11,
                                        fontWeight: 700,
                                        textTransform: "uppercase",
                                        letterSpacing: "0.1em",
                                        cursor: "pointer",
                                    }}
                                >
                                    Browse Conversations
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
