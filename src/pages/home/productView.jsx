import axios from "axios";
import {useParams} from "react-router-dom";
import {useEffect,useState} from "react";
import toast from "react-hot-toast";
import ImageSlider from "../../components/imageSlider";
import { addcart,loadCart } from "../../utills/cart";
import { MdOutlineShoppingCart } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function ProductView(){
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;
    const {id} = useParams();
    const [loaded,setLoaded] = useState("loading");
    const [product,setProduct] = useState([]);

    useEffect(() => {
        axios.get(`${API_URL}/api/products/${id}`).then((response) => {
            if(!response.data){
                toast.error("Product not found");
                setLoaded("error")
                return;
            }
            setProduct(response.data);
            setLoaded("success");
        }).catch((error) => {
            toast.error("Product not found");
            setLoaded("error");
        });
    }, []);

    if(loaded === "loading"){
        return(
            <div className="flex items-center justify-center min-h-screen" style={{backgroundColor: "#0B0F1A"}}>
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-2 animate-spin"
                        style={{borderColor: "#2A3447", borderTopColor: "#E8C547"}}/>
                    <p className="text-sm tracking-widest uppercase" style={{color: "#6B7A99"}}>Loading gear...</p>
                </div>
            </div>
        );
    }

    if(loaded === "error"){
        return(
            <div className="flex items-center justify-center min-h-screen" style={{backgroundColor: "#0B0F1A"}}>
                <div className="flex flex-col items-center gap-5 text-center">
                    <p className="text-6xl">⚠</p>
                    <h1 className="text-2xl font-bold tracking-wider uppercase text-white font-mono-display">Product not found</h1>
                    <button
                        onClick={() => window.location.href="/"}
                        className="px-6 py-3 text-sm font-semibold rounded-lg tracking-wide uppercase transition-all duration-200 hover:opacity-90"
                        style={{background: "linear-gradient(135deg, #E8C547, #F59E0B)", color: "#0B0F1A"}}>
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return(
        <div className="min-h-screen flex items-center justify-center px-6 py-12" style={{backgroundColor: "#0B0F1A"}}>
            
            <div className="flex flex-col md:flex-row gap-8 max-w-4xl w-full p-8 rounded-2xl"
                style={{background: "#111827", border: "1px solid #2A3447", boxShadow: "0 8px 40px rgba(0,0,0,0.5)"}}>
                <FaArrowLeft className="hover:opacity-70 cursor-pointer transition" onClick={()=>window.history.back()}/>   
                {/* Left: Image */}
                <div className="md:w-1/2">
                    <ImageSlider images={product.image} name={product.name} />
                </div>

                {/* Right: Content */}
                <div className="md:w-1/2 flex flex-col gap-4">
                    {/* Category */}
                    <p className="text-xs font-semibold tracking-[0.3em] uppercase" style={{color: "#6B7A99"}}>
                        {product.category || "Audio Gear"}
                    </p>

                    {/* Name */}
                    <h1 className="text-3xl font-bold tracking-wider uppercase text-white font-mono-display leading-tight">
                        {product.name}
                    </h1>

                    {/* Price */}
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold font-mono-display" style={{color: "#E8C547"}}>
                            Rs.{product.price}
                        </span>
                        <span className="text-sm" style={{color: "#6B7A99"}}>/day</span>
                    </div>

                    {/* Divider */}
                    <div className="h-px" style={{background: "#2A3447"}}/>

                    {/* Availability */}
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/>
                        <p className="text-sm font-semibold text-green-400 tracking-wide uppercase">
                            {product.availability || "Available"}
                        </p>
                    </div>

                    {/* Description */}
                    <p className="text-sm leading-relaxed" style={{color: "#6B7A99"}}>
                        {product.description}
                    </p>

                    {/* Dimensions */}
                    {product.dimensions && (
                        <div className="px-3 py-2 rounded-lg text-sm" style={{background: "#1A2233", border: "1px solid #2A3447"}}>
                            <span className="font-semibold tracking-wide text-xs uppercase" style={{color: "#6B7A99"}}>Dimensions: </span>
                            <span className="text-white">{product.dimensions}</span>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-3 mt-2">
                        <button
                            className="flex-1 py-3 px-3 rounded-lg text-sm font-bold tracking-wide uppercase transition-all duration-200 hover:opacity-90 active:scale-95 transition"
                            onClick={()=>navigate('/contact')}
                            style={{background: "linear-gradient(135deg, #E8C547, #F59E0B)", color: "#0B0F1A"}}>
                            Contact for Renting
                        </button>
                        <button
                            onClick={() => { addcart(product.key,product.price, 1); console.log(loadCart()); }}
                            className="flex items-center border border-[#2A3447] active:scale-95 transition justify-center gap-2 flex-1 py-3 rounded-lg text-sm font-bold tracking-wide uppercase transition-all duration-200 hover:text-[#F59E0B] hover:border-[#F59E0B]"
                            >
                            <MdOutlineShoppingCart size={16}/>
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}