import { useState, useEffect} from "react"
import { loadCart } from "../../utills/cart"
import BookingItem from "../../components/bookingItem";
import { formatDate } from "../../utills/cart";
import { MdOutlineShoppingCartCheckout } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function BookingPage(){
    const navigate = useNavigate();
    const today = new Date();
    const maxStart = new Date();
    maxStart.setFullYear(today.getFullYear() + 1);

    const maxEnd = new Date();
    maxEnd.setMonth(today.getMonth() + 3);

    // Helper: add N days to a date string or Date and return formatted string
    function addDays(date, n) {
        const d = new Date(date);
        d.setDate(d.getDate() + n);
        return formatDate(d);
    }

    const [days, setDays] = useState(1);
    const [Etotal,setEtotal] = useState(0);
    const [cart, setCart] = useState(loadCart());
    const [Sdate,setSdate] = useState(formatDate(today));
    const [Edate,setEdate] = useState(addDays(today, 1));

    useEffect(() => {
        if (Sdate && Edate) {
            const start = new Date(Sdate);
            const end = new Date(Edate);

            const diffTime = end - start;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
            setDays(diffDays > 0 ? diffDays : 0);
        }
    }, [Sdate, Edate]);

    useEffect(() => {
        setEtotal(estimatedToral());
    }, [cart,days]);

    function reloadCart(){
        setCart(loadCart());
    }

    function estimatedToral(){
        let cart = loadCart();
        let total = 0;
        cart.orderedItems.forEach((item) => {
            total += item.price * item.quantity;
        });
        return total*days;
    }

    async function placeOder(orderItems,days,startingDate,endingDate){
        const API_URL = import.meta.env.VITE_API_URL;
        const data = localStorage.getItem("user")
        if(!data){
            toast.error("Please login to continue")
            navigate("/login")
            return
        }
        const token = JSON.parse(data).token
        try{
            const res = await axios.post(`${API_URL}/api/order/`,
                {
                    orderItems,
                    days,
                    startingDate,
                    endingDate
                },
                {
                    headers:{Authorization:`Bearer ${token}`}
            })
            console.log("CART",cart.orderedItems);
            toast.success("Order placed successfully")
            
        }catch(error){
            console.log(error);
            toast.error(error?.response?.data?.message || "Something went wrong")
        }
    }

    return(
        <div className="min-h-screen px-6 py-10" style={{backgroundColor: "#0B0F1A"}}>
            {cart.orderedItems.length === 0 ? (
                <div className="flex items-center justify-center min-h-[70vh]">
                    <div className="flex flex-col items-center gap-6 text-center">
                        <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
                            style={{background: "#111827", border: "1px solid #2A3447"}}>
                            <MdOutlineShoppingCartCheckout className="text-4xl" style={{color: "#2A3447"}}/>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-wider uppercase text-white font-mono-display">Cart is empty</h1>
                            <p className="text-sm mt-2" style={{color: "#6B7A99"}}>Browse our catalog and add items to your cart</p>
                        </div>
                        <Link
                            to="/items"
                            className="px-6 py-3 text-sm font-semibold rounded-lg tracking-wide uppercase transition-all duration-200 hover:opacity-90"
                            style={{background: "linear-gradient(135deg, #E8C547, #F59E0B)", color: "#0B0F1A"}}>
                            Browse Catalog
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="max-w-3xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <p className="text-xs font-semibold tracking-[0.3em] uppercase mb-2" style={{color: "#6B7A99"}}>Review Your Selection</p>
                        <h1 className="text-3xl font-bold tracking-wider uppercase font-mono-display text-white">
                            Your<span style={{color: "#E8C547"}}>.Cart</span>
                        </h1>
                        <div className="w-16 h-0.5 mt-3" style={{background: "linear-gradient(to right, #E8C547, transparent)"}}/>
                    </div>

                    {/* Items */}
                    <div className="flex flex-col gap-3">
                        {cart.orderedItems.map((item) => (
                            <BookingItem key={item.key} keys={item.key} item={item} qty={item.quantity} refresh={reloadCart} />
                        ))}
                    </div>

                    <Link to="/items" className="text-xs font-semibold tracking-[0.3em] uppercase" style={{color: "#E8C547"}}>Add more items</Link>

                    {/* Order Summary */}
                    <div className="mt-8 p-4 md:p-6 rounded-xl" style={{background: "#111827", border: "1px solid #2A3447"}}>
                        <h2 className="text-sm font-semibold tracking-widest uppercase mb-4" style={{color: "#6B7A99"}}>Order Summary</h2>
                        <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-6 pt-3" style={{borderTop: "1px solid #2A3447"}}>
                            {/* Date Fields Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold tracking-wide uppercase" style={{ color: "#6B7A99" }}>Starting Date</label>
                                    <input
                                      type="date"
                                      value={Sdate}
                                      min={formatDate(today)}
                                      max={formatDate(maxStart)}
                                      className="p-2.5 rounded-lg text-sm text-white w-full bg-[#1A2233] border border-[#2A3447] focus:outline-none focus:border-[#E8C547]"
                                      onChange={(e) => {
                                        const newStart = e.target.value;
                                        setSdate(newStart);
                                        // If current end date is not after the new start, push it forward
                                        if (Edate <= newStart) {
                                            setEdate(addDays(newStart, 1));
                                        }
                                      }}
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold tracking-wide uppercase" style={{ color: "#6B7A99" }}>Ending Date</label>
                                    <input
                                      type="date"
                                      value={Edate || addDays(Sdate, 1)}
                                      min={addDays(Sdate, 1)}
                                      max={formatDate(maxEnd)}
                                      className="p-2.5 rounded-lg text-sm text-white w-full bg-[#1A2233] border border-[#2A3447] focus:outline-none focus:border-[#E8C547]"
                                      onChange={(e) => setEdate(e.target.value)}
                                    />
                                </div>
                            </div>
                            
                            {/* Totals Section */}
                            <div className="flex flex-col gap-1.5 border-t border-[#2A3447] lg:border-t-0 pt-4 lg:pt-0 justify-center">
                                <div className="flex justify-between lg:justify-end items-center gap-2">
                                    <span className="text-xs" style={{ color: "#6B7A99" }}>Total Days:</span>
                                    <span className="text-sm font-semibold text-white">{days} day{days !== 1 ? "s" : ""}</span>
                                </div>
                                <div className="flex justify-between lg:justify-end lg:flex-col items-center lg:items-end gap-1">
                                    <span className="text-xs" style={{ color: "#6B7A99" }}>Estimated Total:</span>
                                    <span className="text-2xl font-bold font-mono-display text-[#E8C547] mt-0.5">
                                        Rs. {Etotal.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button
                            className="w-full mt-4 py-3 rounded-lg text-sm font-bold tracking-wide uppercase transition-all duration-200 hover:opacity-90"
                            style={{background: "linear-gradient(135deg, #E8C547, #F59E0B)", color: "#0B0F1A"}} 
                            onClick={() => {
                                const data = localStorage.getItem("user");
                                if (!data) {
                                    toast.error("Please login to continue");
                                    navigate("/login");
                                    return;
                                }
                                const currentCart = loadCart();
                                currentCart.startingDate = Sdate;
                                currentCart.endingDate = Edate;
                                currentCart.days = days;
                                localStorage.setItem("cart", JSON.stringify(currentCart));
                                navigate("/rent");
                            }}>
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}