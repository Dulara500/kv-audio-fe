import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { addcart, loadCart, formatDate } from "../../utills/cart";
import { MdOutlineShoppingCart, MdCalendarToday, MdShield, MdTune, MdTimer, MdPlayArrow } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa";
import { LuAudioWaveform } from "react-icons/lu";
import { Link } from "react-router-dom";

export default function ProductView() {
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;
    const { id } = useParams();
    const [loaded, setLoaded] = useState("loading");
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState("");

    // Rental period state
    const todayStr = formatDate(new Date());
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = formatDate(tomorrow);

    const [fromDate, setFromDate] = useState(todayStr);
    const [toDate, setToDate] = useState(tomorrowStr);
    const [days, setDays] = useState(1);

    // Mock Audio Player state
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        axios.get(`${API_URL}/api/products/${id}`).then((response) => {
            if (!response.data) {
                toast.error("Product not found");
                setLoaded("error");
                return;
            }
            setProduct(response.data);
            setSelectedImage(response.data.image?.[0] || "");
            setLoaded("success");
        }).catch((error) => {
            console.error(error);
            toast.error("Product not found");
            setLoaded("error");
        });
    }, [id, API_URL]);

    // Recalculate days count whenever dates change
    useEffect(() => {
        if (fromDate && toDate) {
            const start = new Date(fromDate);
            const end = new Date(toDate);
            const diffTime = end - start;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setDays(diffDays > 0 ? diffDays : 1);
        }
    }, [fromDate, toDate]);

    if (loaded === "loading") {
        return (
            <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: "#0B0F1A" }}>
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-2 animate-spin"
                        style={{ borderColor: "#2A3447", borderTopColor: "#E8C547" }} />
                    <p className="text-sm tracking-widest uppercase" style={{ color: "#6B7A99" }}>Loading gear...</p>
                </div>
            </div>
        );
    }

    if (loaded === "error" || !product) {
        return (
            <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: "#0B0F1A" }}>
                <div className="flex flex-col items-center gap-5 text-center">
                    <p className="text-6xl">⚠</p>
                    <h1 className="text-2xl font-bold tracking-wider uppercase text-white font-mono-display">Product not found</h1>
                    <button
                        onClick={() => navigate("/items")}
                        className="px-6 py-3 text-sm font-semibold rounded-lg tracking-wide uppercase transition-all duration-200 hover:opacity-90"
                        style={{ background: "linear-gradient(135deg, #E8C547, #F59E0B)", color: "#0B0F1A" }}>
                        Back to Catalog
                    </button>
                </div>
            </div>
        );
    }

    // Pricing calculation logic
    const baseDailyPrice = product.price || 0;
    const totalAmount = baseDailyPrice * days;

    // Fast proceed: rental sequence without adding to generic cart
    const handleInitiateRental = () => {
        const authData = localStorage.getItem("user");
        if (!authData) {
            toast.error("Please login to continue with checkout");
            navigate("/login");
            return;
        }

        // Setup checkout cart containing only this specific product
        const directCart = {
            orderedItems: [
                {
                    key: product.key,
                    price: product.price,
                    quantity: 1,
                    product: {
                        key: product.key,
                        name: product.name,
                        image: product.image?.[0] || "",
                        price: product.price
                    }
                }
            ],
            days: days,
            startingDate: fromDate,
            endingDate: toDate
        };

        // Save to cart for checkout page redirect
        localStorage.setItem("cart", JSON.stringify(directCart));
        window.dispatchEvent(new Event("cart-updated"));
        navigate("/rent");
    };

    return (
        <div className="min-h-screen text-white font-sans px-4 md:px-8 py-10" style={{ backgroundColor: "#0B0F1A" }}>
            <div className="max-w-7xl mx-auto flex flex-col gap-6">
                
                {/* Back button link */}
                <button 
                    onClick={() => navigate("/items")}
                    className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] transition hover:text-[#E8C547] self-start"
                    style={{ color: "#6B7A99" }}
                >
                    <FaArrowLeft size={10} />
                    Back to Catalog
                </button>

                {/* Main Content Layout Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Column: Product Details & Assets */}
                    <div className="lg:col-span-8 flex flex-col gap-8">
                        
                        {/* Main Media Showcase */}
                        <div className="flex flex-col gap-4">
                            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-[#2A3447] bg-[#111827]">
                                <img
                                    src={selectedImage || product.image?.[0]}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                                {/* Badges overlay */}
                                <div className="absolute bottom-4 left-4 flex gap-2">
                                    <span className="px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded bg-white text-[#0B0F1A]">
                                        {product.availability ? "AVAILABLE" : "UNAVAILABLE"}
                                    </span>
                                    <span className="px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded bg-black/60 backdrop-blur border border-white/10 text-white">
                                        {product.category?.toUpperCase() || "ANALOG GEAR"}
                                    </span>
                                </div>
                            </div>

                            {/* Thumbnail selection list */}
                            <div className="grid grid-cols-4 gap-3">
                                {product.image?.slice(0, 3).map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(img)}
                                        className="aspect-[4/3] rounded-xl overflow-hidden border transition duration-200 focus:outline-none"
                                        style={{
                                            borderColor: selectedImage === img ? "#E8C547" : "#2A3447",
                                            boxShadow: selectedImage === img ? "0 0 10px rgba(232,197,71,0.2)" : "none"
                                        }}
                                    >
                                        <img src={img} alt="Product view" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                                {/* View All placeholder */}
                                <div className="aspect-[4/3] rounded-xl flex items-center justify-center border border-[#2A3447] bg-[#111827]/60 cursor-pointer hover:border-white/30 transition">
                                    <span className="text-[10px] font-bold tracking-widest uppercase text-[#6B7A99]">View All</span>
                                </div>
                            </div>
                        </div>

                        {/* Title Header */}
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold tracking-wider uppercase text-white font-mono-display">
                                {product.name}
                            </h1>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[11px] font-bold uppercase tracking-wider text-green-500">
                                    In Stock • Ready for Deployment
                                </span>
                            </div>
                        </div>

                        {/* Long Description */}
                        <div className="flex flex-col gap-4 text-sm leading-relaxed" style={{ color: "#9CA3AF" }}>
                            <p>{product.description}</p>
                            <p>Designed and built as the pinnacle of professional sound systems, this gear introduces high-fidelity components, robust casing, and standard inputs to serve any workspace or stage layout without compromise.</p>
                        </div>
                    </div>

                    {/* Right Column: Floating Rental Checkout Config Card */}
                    <div className="lg:col-span-4 flex flex-col gap-6 sticky top-24">
                        <div className="p-6 rounded-2xl border border-[#2A3447] bg-[#111827] flex flex-col gap-6"
                             style={{ boxShadow: "0 20px 50px rgba(0, 0, 0, 0.4)" }}>
                            
                            {/* Pricing Header */}
                            <div>
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-3xl font-bold tracking-wider font-mono-display text-white">
                                        Rs. {product.price?.toLocaleString()}
                                    </span>
                                    <span className="text-xs" style={{ color: "#6B7A99" }}>/ PER DAY</span>
                                </div>
                                <p className="text-[10px] uppercase font-bold mt-1" style={{ color: "#6B7A99" }}>Excl. Tax & Insurance</p>
                            </div>

                            {/* Rental Period Date Pickers */}
                            <div className="flex flex-col gap-3">
                                <label className="text-xs font-bold uppercase tracking-wider text-white">Rental Period</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[9px] font-bold text-[#6B7A99] uppercase tracking-wider">From</span>
                                        <input
                                            type="date"
                                            value={fromDate}
                                            min={todayStr}
                                            onChange={(e) => {
                                                const d = e.target.value;
                                                setFromDate(d);
                                                if (toDate <= d) {
                                                    const next = new Date(d);
                                                    next.setDate(next.getDate() + 1);
                                                    setToDate(formatDate(next));
                                                }
                                            }}
                                            className="px-3 py-2 rounded-lg text-xs font-mono font-semibold bg-[#0B0F1A] border border-[#2A3447] focus:outline-none focus:border-[#E8C547]"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[9px] font-bold text-[#6B7A99] uppercase tracking-wider">To</span>
                                        <input
                                            type="date"
                                            value={toDate}
                                            min={fromDate}
                                            onChange={(e) => setToDate(e.target.value)}
                                            className="px-3 py-2 rounded-lg text-xs font-mono font-semibold bg-[#0B0F1A] border border-[#2A3447] focus:outline-none focus:border-[#E8C547]"
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* Cost Summary Breakdown */}
                            <div className="flex flex-col gap-3 pt-4 border-t border-[#2A3447]">
                                <div className="flex justify-between text-xs">
                                    <span style={{ color: "#6B7A99" }}>{days} Day Rental</span>
                                    <span className="font-mono font-semibold">Rs. {totalAmount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-baseline mt-2 pt-3 border-t border-[#2A3447]/60">
                                    <span className="text-sm font-bold uppercase tracking-wider text-white">Total</span>
                                    <span className="text-2xl font-bold font-mono-display text-[#E8C547]">
                                        Rs. {totalAmount.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            {/* Call to Actions */}
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={handleInitiateRental}
                                    className="w-full py-3 rounded-lg text-xs font-bold tracking-widest uppercase transition-all duration-200 active:scale-[0.98]"
                                    style={{ background: "linear-gradient(135deg, #E8C547, #F59E0B)", color: "#0B0F1A" }}
                                >
                                    Initiate Rental Sequence
                                </button>
                                
                                <button
                                    onClick={() => addcart(product.key, product.price, 1)}
                                    className="w-full py-3 rounded-lg text-xs font-bold tracking-widest uppercase border border-[#2A3447] text-white transition hover:text-[#E8C547] hover:border-[#E8C547] active:scale-[0.98]"
                                >
                                    Add to Cart
                                </button>
                            </div>

                            <p className="text-[10px] text-center" style={{ color: "#6B7A99" }}>
                                <Link to="/messages" className="text-[#E8C547] hover:text-[#F59E0B]">Ask in chat</Link> for more details or customization options
                            </p>

                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}