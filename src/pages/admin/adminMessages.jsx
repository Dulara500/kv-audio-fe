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
        <div className="flex flex-col gap-5">
            {/* Page Header */}
            <div className="flex flex-col gap-3">
                <p
                    className="text-xs font-semibold tracking-[0.3em] uppercase"
                    style={{ color: "#E8C547" }}
                >
                    Customer Support
                </p>
                <h1 className="text-3xl font-bold tracking-wider uppercase text-white font-mono-display">
                    Messages<span style={{ color: "#E8C547" }}>.Inbox</span>
                </h1>
                <div
                    className="w-16 h-0.5"
                    style={{
                        background: "linear-gradient(to right, #E8C547, transparent)",
                    }}
                />
                <p className="text-sm" style={{ color: "#6B7A99" }}>
                    View and respond to customer support conversations in real time.
                </p>
            </div>

            {/* Chat Interface */}
            <div
                className="rounded-xl overflow-hidden"
                style={{
                    border: "1px solid #2A3447",
                    height: "calc(100vh - 240px)",
                    minHeight: "500px",
                }}
            >
                <Chat client={client} theme="str-chat__theme-dark">
                    <div className="flex h-full w-full">
                        {/* Channel List — Left Panel */}
                        <div
                            className={`flex-shrink-0 border-[#2A3447] md:border-r h-full w-full md:w-[320px] ${
                                activeChannel ? "hidden md:block" : "block"
                            }`}
                        >
                            <div
                                className="px-4 py-3 flex items-center gap-2"
                                style={{
                                    borderBottom: "1px solid #2A3447",
                                    background: "#111827",
                                }}
                            >
                                <MdSupportAgent size={18} style={{ color: "#E8C547" }} />
                                <span
                                    className="text-xs font-bold tracking-wider uppercase"
                                    style={{ color: "#E8C547" }}
                                >
                                    Conversations
                                </span>
                            </div>
                            <ChannelList
                                filters={filters}
                                sort={sort}
                                options={options}
                                EmptyStateIndicator={EmptyStateIndicator}
                                showChannelSearch
                                onSelect={(channel) => setActiveChannel(channel)}
                            />
                        </div>

                        {/* Active Channel — Right Panel */}
                        <div 
                            className={`flex-1 flex flex-col h-full min-w-0 ${
                                activeChannel ? "block" : "hidden md:flex"
                            }`}
                        >
                            {/* Back button for mobile view */}
                            {activeChannel && (
                                <div className="md:hidden flex items-center px-4 py-2 bg-[#111827] border-b border-[#2A3447]">
                                    <button
                                        onClick={() => setActiveChannel(null)}
                                        className="text-xs font-bold uppercase tracking-wider text-[#E8C547] flex items-center gap-1 hover:underline"
                                    >
                                        ← Back to Conversations
                                    </button>
                                </div>
                            )}

                            <Channel channel={activeChannel || undefined}>
                                <Window>
                                    <ChannelHeader />
                                    <MessageList />
                                    <MessageComposer />
                                </Window>
                                <Thread />
                            </Channel>
                        </div>
                    </div>
                </Chat>
            </div>
        </div>
    );
}
