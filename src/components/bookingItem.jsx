import { useEffect, useState } from "react";
import { removeFromCart, incrementQuentity, decrementQuentity } from "../utills/cart";
import axios from "axios";
import { FiTrash2, FiMinus, FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";


export default function BookingItem(props){
    const {keys, qty, refresh} = props;
    const [quantity, setQuantity] = useState(qty);
    const [item, setItem] = useState(null);
    const [status, setStatus] = useState("loading");

    useEffect(() => {
        const API_URL = import.meta.env.VITE_API_URL;
        if(status === "loading"){
            try{
                async function getItem(){
                    const response = await axios.get(`${API_URL}/api/products/${keys}`);
                    setItem(response.data);
                    setStatus("success");
                }
                getItem();
            }catch(error){
                console.log(error);
                setStatus("error");
                removeFromCart(keys);
                refresh();
            }
        }
    }, [status]);

    

    return (
        <div className="w-full max-w-2xl">
            {status === "loading" && (
                <div className="p-4 rounded-xl animate-pulse flex gap-4" style={{background: "#111827", border: "1px solid #2A3447"}}>
                    <div className="w-24 h-24 rounded-lg" style={{background: "#1A2233"}}/>
                    <div className="flex-1 flex flex-col gap-2 justify-center">
                        <div className="h-4 rounded w-2/3" style={{background: "#1A2233"}}/>
                        <div className="h-3 rounded w-1/2" style={{background: "#1A2233"}}/>
                    </div>
                </div>
            )}

            {status === "error" && (
                <div className="p-4 rounded-xl text-sm" style={{background: "#1A0A0A", border: "1px solid #7F1D1D", color: "#FCA5A5"}}>
                    ⚠ Failed to load item
                </div>
            )}

            {status === "success" && item && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl transition-all duration-200 hover:border-[#E8C547]/30"
                    style={{background: "#111827", border: "1px solid #2A3447"}}>

                    {/* Image & Main Info Wrapper */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                        {/* Image */}
                        <Link to={`/product/${keys}`} className="flex-shrink-0 hover:opacity-85 transition-opacity">
                            <img
                                src={item.image[0] || "https://via.placeholder.com/100"}
                                alt={item.name}
                                className="w-16 h-16 sm:w-24 sm:h-24 object-cover rounded-lg"
                                style={{border: "1px solid #2A3447"}}
                            />
                        </Link>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <Link to={`/product/${keys}`} className="inline-block max-w-full hover:text-[#E8C547] transition-colors">
                                <h2 className="text-sm font-bold tracking-wider uppercase text-white font-mono-display truncate">
                                    {item.name}
                                </h2>
                            </Link>
                            <p className="text-xs mt-1 line-clamp-1" style={{color: "#6B7A99"}}>
                                {item.description}
                            </p>
                            <p className="text-sm mt-1 font-semibold" style={{color: "#E8C547"}}>
                                Rs. {item.price} / day
                            </p>
                        </div>
                    </div>

                    {/* Quantity controls and totals/remove wrapper */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start w-full sm:w-auto gap-4 border-t border-[#2A3447]/60 sm:border-t-0 pt-3 sm:pt-0 mt-2 sm:mt-0">
                        {/* Qty controls */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => { decrementQuentity(keys); setQuantity(q => q - 1); refresh(); }}
                                className="w-7 h-7 rounded-md flex items-center justify-center text-white transition-all duration-150 hover:bg-[#E8C547] hover:text-[#0B0F1A]"
                                style={{background: "#1A2233", border: "1px solid #2A3447"}}>
                                <FiMinus size={12}/>
                            </button>
                            <span className="text-sm font-semibold text-white w-8 text-center">{quantity}</span>
                            <button
                                onClick={() => { incrementQuentity(keys); setQuantity(q => q + 1); refresh(); }}
                                className="w-7 h-7 rounded-md flex items-center justify-center text-white transition-all duration-150 hover:bg-[#E8C547] hover:text-[#0B0F1A]"
                                style={{background: "#1A2233", border: "1px solid #2A3447"}}>
                                <FiPlus size={12}/>
                            </button>
                        </div>

                        {/* Right: Total + Remove */}
                        <div className="flex items-center sm:items-end gap-3 sm:flex-col">
                            <p className="text-base font-bold font-mono-display" style={{color: "#E8C547"}}>
                                Rs. {(item.price * quantity).toFixed(2)}
                            </p>
                            <button
                                onClick={() => { removeFromCart(keys); refresh(); }}
                                className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md transition-all duration-200 hover:bg-red-500/20"
                                style={{color: "#EF4444", border: "1px solid #7F1D1D"}}>
                                <FiTrash2 size={12}/>
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}