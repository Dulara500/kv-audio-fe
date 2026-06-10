import { useEffect, useState } from "react";
import axios from "axios";
import Card from "../../components/card/Card";

export default function Items(){
    const API_URL = import.meta.env.VITE_API_URL;
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState("loading");

    useEffect(() => {
        axios.get(`${API_URL}/api/products`).then((response) => {
            setItems(response.data);
            setLoading("success");
        }).catch((error) => {
            console.log(error);
            setLoading("error");
        });
    }, []);

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
                <div className="flex flex-wrap gap-5 justify-start">
                    {items.map((item) => (
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