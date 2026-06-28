import { useEffect, useState } from "react";
import axios from "axios";
import Card from "../../components/card/Card";

export default function Items(){
    const API_URL = import.meta.env.VITE_API_URL;
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState("loading");
    const [search, setSearch] = useState("");

    useEffect(() => {
        axios.get(`${API_URL}/api/products`).then((response) => {
            setItems(response.data);
            setLoading("success");
        }).catch((error) => {
            console.log(error);
            setLoading("error");
        });
    }, []);

    const filtered = items.filter((i)=>{
        const q= search.toLowerCase();
        return (i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q) || i.category.toLowerCase().includes(q));
    })

    return(
        <div className="min-h-screen px-6 py-10" style={{backgroundColor: "#0B0F1A"}}>
            {/* Header */}
            <div className="mb-8">
                <p className="text-xs font-semibold tracking-[0.3em] uppercase mb-2" style={{color: "#6B7A99"}}>Browse Collection</p>
                <h1 className="text-3xl font-bold tracking-wider uppercase font-mono-display text-white">
                    Equipment<span style={{color: "#E8C547"}}>.Catalog</span>
                </h1>
                <div className="w-16 h-0.5 mt-3" style={{background: "linear-gradient(to right, #E8C547, transparent)"}}/>
            </div>

            <div className="relative flex-1 max-w-md mb-6">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search bookings by ID, email, method, status..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm text-white transition-all duration-200 focus:outline-none"
                        style={{ background: "#111827", border: "1px solid #2A3447" }}
                        onFocus={(e) => e.target.style.borderColor = "#E8C547"}
                        onBlur={(e) => e.target.style.borderColor = "#2A3447"}
                    />
                </div>

            {/* Loading */}
            {loading === "loading" && (
                <div className="flex flex-col items-center justify-center py-32 gap-4">
                    <div className="w-12 h-12 rounded-full border-2 border-t-[#E8C547] animate-spin"
                        style={{borderColor: "#2A3447", borderTopColor: "#E8C547"}}/>
                    <p className="text-sm tracking-widest uppercase" style={{color: "#6B7A99"}}>Loading gear...</p>
                </div>
            )}

            {/* Error */}
            {loading === "error" && (
                <div className="flex items-center justify-center py-32">
                    <div className="text-center">
                        <p className="text-4xl mb-4">⚠</p>
                        <p className="text-lg font-semibold text-white">Failed to load catalog</p>
                        <p className="text-sm mt-1" style={{color: "#6B7A99"}}>Please check your connection and try again</p>
                    </div>
                </div>
            )}

            

            {/* Items Grid */}
            {loading === "success" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
                    {filtered.map((item) => (
                        <Card
                            key={item.key}
                            id={item.key}
                            name={item.name}
                            description={item.description}
                            price={item.price}
                            image={item.image[0]}
                            category={item.category}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}