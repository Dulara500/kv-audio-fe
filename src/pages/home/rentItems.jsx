import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loadCart } from "../../utills/cart";
import { MdLocationOn, MdPayment, MdCheckCircle, MdAdd } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa";
import { FiCheck } from "react-icons/fi";
import axios from "axios";
import toast from "react-hot-toast";

export default function RentItems() {
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;
    
    // Load auth
    const authData = localStorage.getItem("user");
    const user = authData ? JSON.parse(authData).user : null;
    const token = authData ? JSON.parse(authData).token : null;

    // Redirect if not logged in
    useEffect(() => {
        if (!user) {
            toast.error("Please login to continue");
            navigate("/login");
        }
    }, [user, navigate]);

    // Load cart
    const [cart, setCart] = useState(null);
    useEffect(() => {
        const loaded = loadCart();
        if (loaded && loaded.orderedItems.length > 0) {
            setCart(loaded);
        } else {
            toast.error("Your cart is empty");
            navigate("/cart");
        }
    }, [navigate]);

    // Address State
    const [addresses, setAddresses] = useState(user?.address ? [user.address] : []);
    const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
    const [showAddAddressForm, setShowAddAddressForm] = useState(false);
    const [newAddress, setNewAddress] = useState("");

    // Payment State
    const [paymentMethod, setPaymentMethod] = useState("cod"); // 'cod', 'card', 'transfer'
    const [cardDetails, setCardDetails] = useState({
        number: "",
        expiry: "",
        cvc: "",
        name: ""
    });

    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [status, setStatus] = useState("pending");

    if (!user || !cart) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white" style={{backgroundColor: "#0B0F1A"}}>
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#E8C547]"></div>
            </div>
        );
    }

    // Calculations
    let itemTotal = 0;
    cart.orderedItems.forEach((item) => {
        itemTotal += item.price * item.quantity;
    });
    const subtotal = itemTotal * cart.days;
    const shippingFee = 1500; // Flat fee Rs. 1500.00
    const orderTotal = subtotal + shippingFee;

    const handleAddAddress = (e) => {
        e.preventDefault();
        if (!newAddress.trim()) {
            toast.error("Please enter a valid address");
            return;
        }
        const updated = [...addresses, newAddress.trim()];
        setAddresses(updated);
        setSelectedAddressIndex(updated.length - 1);
        setNewAddress("");
        setShowAddAddressForm(false);
        toast.success("New address added and selected");
    };

    const handleCardChange = (e) => {
        setCardDetails({
            ...cardDetails,
            [e.target.name]: e.target.value
        });
    };

    const handlePlaceOrder = async () => {
        if (addresses.length === 0 || selectedAddressIndex === null) {
            toast.error("Please select a shipping address");
            return;
        }

        if (paymentMethod === "card") {
            const { number, expiry, cvc, name } = cardDetails;
            if (!number || !expiry || !cvc || !name) {
                toast.error("Please complete your card details");
                return;
            }
        }

        setIsPlacingOrder(true);

        try {
            const response = await axios.post(`${API_URL}/api/order/`,
                {
                    orderItems: cart.orderedItems,
                    days: cart.days,
                    startingDate: cart.startingDate,
                    endingDate: cart.endingDate,
                    shippingAddress: addresses[selectedAddressIndex],
                    paymentMethod: paymentMethod === "cod" ? "Cash/Rent on Delivery" : paymentMethod === "card" ? "Credit Card" : "Bank Transfer",
                    status:status
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            toast.success("Rental order placed successfully! Go to profile to see order details");
            // Clear cart
            localStorage.removeItem("cart");
            window.dispatchEvent(new Event("cart-updated"));
            
            // Redirect to messages
            navigate("/messages");
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Failed to place order");
        } finally {
            setIsPlacingOrder(false);
        }
    };

    return (
        <div className="min-h-screen text-white px-6 py-10" style={{backgroundColor: "#0B0F1A"}}>
            <div className="max-w-6xl mx-auto flex flex-col gap-6">
                
                {/* Back button */}
                <Link to="/cart" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] hover:text-[#E8C547] transition animate-fade-in" style={{color: "#6B7A99"}}>
                    <FaArrowLeft size={10} />
                    Back to Cart
                </Link>

                <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* Left Column: Address and Payment */}
                    <div className="flex-1 flex flex-col gap-6">
                        
                        {/* Step 1: Address Selection */}
                        <div className="p-6 rounded-2xl" style={{background: "#111827", border: "1px solid #2A3447", boxShadow: "0 8px 30px rgba(0,0,0,0.4)"}}>
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{background: "linear-gradient(135deg, #E8C547, #F59E0B)", color: "#0B0F1A"}}>1</span>
                                    <h2 className="text-md font-bold uppercase tracking-wider font-mono-display">Shipping Address</h2>
                                </div>
                                <button
                                    onClick={() => setShowAddAddressForm(!showAddAddressForm)}
                                    className="flex items-center gap-1 text-xs font-semibold tracking-wider text-[#E8C547] hover:underline transition"
                                >
                                    <MdAdd size={14} />
                                    {showAddAddressForm ? "Cancel" : "Add Address"}
                                </button>
                            </div>

                            {showAddAddressForm && (
                                <form onSubmit={handleAddAddress} className="mb-4 p-4 rounded-xl flex flex-col gap-3" style={{background: "#0B0F1A", border: "1px solid #2A3447"}}>
                                    <h3 className="text-xs font-semibold text-[#6B7A99] uppercase tracking-wider">New Shipping Address</h3>
                                    <textarea
                                        value={newAddress}
                                        onChange={(e) => setNewAddress(e.target.value)}
                                        rows={3}
                                        placeholder="Enter full shipping/delivery address..."
                                        className="w-full p-3 rounded-lg text-sm bg-[#111827] text-white border border-[#2A3447] focus:outline-none focus:border-[#E8C547] transition"
                                    />
                                    <button
                                        type="submit"
                                        className="py-2.5 px-4 rounded-lg text-xs font-bold uppercase self-end transition active:scale-95"
                                        style={{background: "linear-gradient(135deg, #E8C547, #F59E0B)", color: "#0B0F1A"}}
                                    >
                                        Save & Use Address
                                    </button>
                                </form>
                            )}

                            {addresses.length === 0 ? (
                                <div className="p-4 rounded-xl text-center text-sm" style={{background: "#0B0F1A", border: "1px solid #2A3447", color: "#6B7A99"}}>
                                    No address saved. Please add a shipping address.
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    {addresses.map((addr, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => setSelectedAddressIndex(idx)}
                                            className={`p-4 rounded-xl cursor-pointer flex items-start gap-3 border transition-all duration-200 ${
                                                selectedAddressIndex === idx
                                                    ? "border-[#E8C547] bg-[#E8C547]/5"
                                                    : "border-[#2A3447] hover:border-[#E8C547]/30 bg-[#0B0F1A]"
                                            }`}
                                        >
                                            <div className="mt-0.5">
                                                {selectedAddressIndex === idx ? (
                                                    <div className="w-4 h-4 rounded-full flex items-center justify-center bg-[#E8C547]">
                                                        <FiCheck size={10} className="text-[#0B0F1A] font-bold" />
                                                    </div>
                                                ) : (
                                                    <div className="w-4 h-4 rounded-full border border-[#2A3447]" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs font-bold uppercase tracking-wider" style={{color: selectedAddressIndex === idx ? "#E8C547" : "#6B7A99"}}>
                                                        Address {idx + 1} {idx === 0 && "(Default)"}
                                                    </span>
                                                </div>
                                                <p className="text-sm mt-1 leading-relaxed text-white">
                                                    {addr}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Step 2: Payment Method */}
                        <div className="p-6 rounded-2xl" style={{background: "#111827", border: "1px solid #2A3447", boxShadow: "0 8px 30px rgba(0,0,0,0.4)"}}>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{background: "linear-gradient(135deg, #E8C547, #F59E0B)", color: "#0B0F1A"}}>2</span>
                                <h2 className="text-md font-bold uppercase tracking-wider font-mono-display">Payment Method</h2>
                            </div>

                            <div className="grid grid-cols-3 gap-3 mb-6">
                                <div
                                    onClick={() => {setPaymentMethod("cod");setStatus("pending")}}
                                    className={`p-4 rounded-xl cursor-pointer flex flex-col items-center justify-center gap-2 border text-center transition-all ${
                                        paymentMethod === "cod"
                                            ? "border-[#E8C547] bg-[#E8C547]/5 text-white"
                                            : "border-[#2A3447] bg-[#0B0F1A] text-[#6B7A99] hover:border-[#E8C547]/30"
                                    }`}
                                >
                                    <MdLocationOn size={20} style={{color: paymentMethod === "cod" ? "#E8C547" : "#6B7A99"}} />
                                    <span className="text-xs font-semibold uppercase tracking-wider">Rent on Delivery</span>
                                </div>
                                <div
                                    onClick={() => {setPaymentMethod("card");setStatus("payed");}}
                                    className={`p-4 rounded-xl cursor-pointer flex flex-col items-center justify-center gap-2 border text-center transition-all ${
                                        paymentMethod === "card"
                                            ? "border-[#E8C547] bg-[#E8C547]/5 text-white"
                                            : "border-[#2A3447] bg-[#0B0F1A] text-[#6B7A99] hover:border-[#E8C547]/30"
                                    }`}
                                >
                                    <MdPayment size={20} style={{color: paymentMethod === "card" ? "#E8C547" : "#6B7A99"}} />
                                    <span className="text-xs font-semibold uppercase tracking-wider">Credit Card</span>
                                </div>
                                <div
                                    onClick={() => {setPaymentMethod("transfer");setStatus("pending")}}
                                    className={`p-4 rounded-xl cursor-pointer flex flex-col items-center justify-center gap-2 border text-center transition-all ${
                                        paymentMethod === "transfer"
                                            ? "border-[#E8C547] bg-[#E8C547]/5 text-white"
                                            : "border-[#2A3447] bg-[#0B0F1A] text-[#6B7A99] hover:border-[#E8C547]/30"
                                    }`}
                                >
                                    <MdCheckCircle size={20} style={{color: paymentMethod === "transfer" ? "#E8C547" : "#6B7A99"}} />
                                    <span className="text-xs font-semibold uppercase tracking-wider">Bank Transfer</span>
                                </div>
                            </div>

                            {paymentMethod === "cod" && (
                                <div className="p-4 rounded-xl text-sm leading-relaxed" style={{background: "#0B0F1A", border: "1px solid #2A3447", color: "#6B7A99"}}>
                                    <p className="font-semibold text-white mb-1">Cash / Rent on Delivery Instructions:</p>
                                    You will pay the rental fee and secure deposit in cash when the items are delivered to your location. Please ensure you have the exact amount ready upon delivery.
                                </div>
                            )}

                            {paymentMethod === "transfer" && (
                                <div className="p-4 rounded-xl text-sm leading-relaxed flex flex-col gap-2" style={{background: "#0B0F1A", border: "1px solid #2A3447", color: "#6B7A99"}}>
                                    <p className="font-semibold text-white mb-1">Bank Account Transfer Details:</p>
                                    <p>Please transfer the order total to our Bank Account:</p>
                                    <div className="font-mono text-xs p-2 rounded bg-[#111827] text-white flex flex-col gap-1 border border-[#2A3447]">
                                        <span>Bank: Commercial Bank of Ceylon</span>
                                        <span>Account Name: RENTEC Private Limited</span>
                                        <span>Account Number: 8011293847</span>
                                        <span>Branch: Sound City Central</span>
                                    </div>
                                    <p className="text-xs">Once transferred, please message the transaction slip to our Admin support channel to approve your rental.</p>
                                </div>
                            )}

                            {paymentMethod === "card" && (
                                <div className="flex flex-col gap-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1.5 col-span-2">
                                            <label className="text-xs font-semibold uppercase" style={{color: "#6B7A99"}}>Name on Card</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={cardDetails.name}
                                                onChange={handleCardChange}
                                                placeholder="John Doe"
                                                className="px-4 py-3 rounded-lg text-sm bg-[#0B0F1A] border border-[#2A3447] focus:outline-none focus:border-[#E8C547] text-white animate-fade-in"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1.5 col-span-2">
                                            <label className="text-xs font-semibold uppercase" style={{color: "#6B7A99"}}>Card Number</label>
                                            <input
                                                type="text"
                                                name="number"
                                                value={cardDetails.number}
                                                onChange={handleCardChange}
                                                placeholder="4000 1234 5678 9010"
                                                className="px-4 py-3 rounded-lg text-sm bg-[#0B0F1A] border border-[#2A3447] focus:outline-none focus:border-[#E8C547] text-white animate-fade-in"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-semibold uppercase" style={{color: "#6B7A99"}}>Expiration Date</label>
                                            <input
                                                type="text"
                                                name="expiry"
                                                value={cardDetails.expiry}
                                                onChange={handleCardChange}
                                                placeholder="MM/YY"
                                                className="px-4 py-3 rounded-lg text-sm bg-[#0B0F1A] border border-[#2A3447] focus:outline-none focus:border-[#E8C547] text-white animate-fade-in"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-semibold uppercase" style={{color: "#6B7A99"}}>CVC / CVV</label>
                                            <input
                                                type="password"
                                                name="cvc"
                                                value={cardDetails.cvc}
                                                onChange={handleCardChange}
                                                placeholder="•••"
                                                maxLength={4}
                                                className="px-4 py-3 rounded-lg text-sm bg-[#0B0F1A] border border-[#2A3447] focus:outline-none focus:border-[#E8C547] text-white animate-fade-in"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Order Summary & Placement */}
                    <div className="w-full lg:w-[380px] flex flex-col gap-6">
                        
                        {/* Summary Card */}
                        <div className="p-6 rounded-2xl flex flex-col" style={{background: "#111827", border: "1px solid #2A3447", boxShadow: "0 8px 30px rgba(0,0,0,0.4)"}}>
                            <h2 className="text-md font-bold uppercase tracking-wider font-mono-display mb-4 border-b border-[#2A3447] pb-3">Rental Summary</h2>
                            
                            {/* Duration Details */}
                            <div className="flex justify-between items-center text-sm py-2" style={{color: "#6B7A99"}}>
                                <span>Period:</span>
                                <span className="text-white font-semibold">{cart.days} {cart.days === 1 ? "day" : "days"}</span>
                            </div>
                            <div className="text-xs py-1 flex flex-col gap-0.5 border-b border-[#2A3447] pb-3" style={{color: "#6B7A99"}}>
                                <div className="flex justify-between">
                                    <span>From:</span>
                                    <span className="text-white">{cart.startingDate}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>To:</span>
                                    <span className="text-white">{cart.endingDate}</span>
                                </div>
                            </div>

                            {/* Item list brief */}
                            <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto my-3 border-b border-[#2A3447] pb-3">
                                {cart.orderedItems.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-xs">
                                        <span className="truncate w-3/4 text-white uppercase font-semibold">
                                            {item.key} <span className="text-[#6B7A99] font-normal lowercase">x{item.quantity}</span>
                                        </span>
                                        <span className="text-[#E8C547] font-semibold">
                                            Rs. {(item.price * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Financial review */}
                            <div className="flex flex-col gap-2 pt-2">
                                <div className="flex justify-between text-sm" style={{color: "#6B7A99"}}>
                                    <span>Items subtotal:</span>
                                    <span className="text-white">Rs. {subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm border-b border-[#2A3447] pb-3" style={{color: "#6B7A99"}}>
                                    <span>Shipping & Setup:</span>
                                    <span className="text-white">Rs. {shippingFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-baseline pt-2">
                                    <span className="text-sm font-bold uppercase tracking-wider text-white">Order Total:</span>
                                    <span className="text-2xl font-black font-mono-display text-[#E8C547]">
                                        Rs. {orderTotal.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            {/* Submit button */}
                            <button
                                onClick={handlePlaceOrder}
                                disabled={isPlacingOrder}
                                className="w-full mt-6 py-3.5 rounded-xl text-sm font-bold tracking-widest uppercase transition-all duration-200 hover:opacity-95 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                                style={{background: "linear-gradient(135deg, #E8C547, #F59E0B)", color: "#0B0F1A"}}
                            >
                                {isPlacingOrder ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-[#0B0F1A]"></div>
                                        Placing order...
                                    </>
                                ) : (
                                    "Confirm & Place Order"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
