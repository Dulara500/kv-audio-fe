
import axios from "axios";
import {useParams} from "react-router-dom";
import {useEffect,useState} from "react";
import toast from "react-hot-toast";
import ImageSlider from "../../components/imageSlider";
export default function ProductView(){
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
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-accent"></div>
            </div>
        );
    }

    if(loaded === "error"){
        return(
            <div className="flex items-center justify-center h-screen">
                <div className="flex flex-col items-center gap-4">
                    <h1 className="text-4xl font-bold text-primary">Product not found</h1>
                    <button 
                        onClick={() => window.location.href="/"}
                        className="bg-primary text-secondary px-6 py-3 rounded-lg text-lg font-semibold hover:bg-accent hover:text-primary transition duration-300"
                    >
                        Back to home
                    </button>
                </div>
            </div>
        );
    }

    return(
        <div className="flex items-center justify-center h-screen pt-20">
            <div className="flex flex-col md:flex-row gap-6 max-w-4xl mx-auto p-6 rounded-lg shadow-lg bg-secondary">
                
                {/* Left Side: Image */}
                

                <ImageSlider images={product.image} name={product.name} />
                
                
                {/* Right Side: Content */}
                <div className="md:w-1/2 flex flex-col ">
                    
                    {/* Name */}
                    <h1 className="text-4xl font-bold text-white mb-2">
                        {product.name}
                    </h1>
                    
                    {/* Price */}
                    <p className="text-3xl font-bold text-primary mb-4">
                        RS.{product.price}
                    </p>
                    
                    {/* Availability */}
                    <p className="text-green-500 font-semibold mb-4">
                        {product.availability}
                    </p>
                    
                    {/* Description */}
                    <p className="text-gray-300 text-base leading-relaxed mb-4">
                        {product.description}
                    </p>

                    {/* Dimensions */}
                    <p className="text-gray-400 text-sm mb-6">
                        Dimensions: {product.dimensions}
                    </p>

                    {/* Contact Button */}
                    <button 
                        
                        className="bg-primary text-secondary px-6 py-3 rounded-lg text-lg font-semibold hover:bg-accent hover:text-primary transition duration-300"
                    >
                        Contact for purchase
                    </button>
                </div>
            </div>
        </div>
    );
}