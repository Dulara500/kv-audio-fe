import { useState, useEffect } from "react";
import axios from "axios";
import { IoAddOutline } from "react-icons/io5";
import toast from "react-hot-toast";

const inputClass = "w-full px-4 py-2.5 rounded-lg text-sm text-white transition-all duration-200 focus:outline-none";
const inputStyle = { background: "#0B0F1A", border: "1px solid #2A3447" };
const handleFocus = (e) => { e.target.style.borderColor = "#E8C547"; };
const handleBlur = (e) => { e.target.style.borderColor = "#2A3447"; };

const btnPrimary = "px-4 py-2.5 rounded-lg text-sm font-bold tracking-wide uppercase transition-all duration-200 hover:opacity-90";
const btnDanger = "px-4 py-2.5 rounded-lg text-sm font-bold tracking-wide uppercase transition-all duration-200 hover:opacity-90";

export default function Products() {
    const API_URL = import.meta.env.VITE_API_URL;
    const [key, setKey] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [category, setCategory] = useState("");
    const [dimensions, setDimensions] = useState("");
    const [addProductSection, setAddProductSection] = useState(false);
    const [updateProductSection, setUpdateProductSection] = useState(false);
    const [products, setProducts] = useState([]);
    const [deleteSection, setDeleteSection] = useState(false);
    const [deleteKey, setDeleteKey] = useState("");
    const [itemsLoded, setItemsLoaded] = useState(false);

    useEffect(() => { getproducts(); }, []);

    async function getproducts(){
        try{
            const data = localStorage.getItem("user");
            const token = JSON.parse(data).token;
            const result = await axios.get(`${API_URL}/api/products`, {
                headers: { Authorization: "Bearer " + token }
            });
            setItemsLoaded(true);
            setProducts(result.data);
        }catch(error){
            toast.error(error.response?.data?.message || "Products not found");
        }
    }

    async function handleAddProducts(){
        const data = localStorage.getItem("user");
        const token = JSON.parse(data).token;
        try{
            await axios.post(`${API_URL}/api/products`, { key, name, dimensions, category, price, description }, {
                headers: { Authorization: "Bearer " + token }
            });
            getproducts();
            toast.success("Product added successfully");
        }catch(error){
            toast.error("Product not added: " + error.response.data.message);
        }
    }

    async function updateAvailability(key, value){
        const data = localStorage.getItem("user");
        const token = JSON.parse(data).token;
        try{
            await axios.put(`${API_URL}/api/products/${key}`, { availability: value }, {
                headers: { Authorization: "Bearer " + token }
            });
            getproducts();
            toast.success("Availability updated successfully");
        }catch(error){
            toast.error("Availability not updated: " + error.response.data.message);
        }
    }

    function handleUpdateProductSection(product){
        setKey(product.key);
        setName(product.name);
        setDimensions(product.dimensions);
        setCategory(product.category);
        setPrice(product.price);
        setDescription(product.description);
        setUpdateProductSection(!updateProductSection);
    }

    async function updateProduct(key, name, dimensions, description, category, price){
        const data = localStorage.getItem("user");
        const token = JSON.parse(data).token;
        try{
            await axios.put(`${API_URL}/api/products/${key}`, { name, dimensions, category, price, description }, {
                headers: { Authorization: "Bearer " + token }
            });
            getproducts();
            toast.success("Product updated successfully");
        }catch(error){
            toast.error("Product not updated: " + error);
        }
    }

    async function deleteProduct(key){
        const data = localStorage.getItem("user");
        const token = JSON.parse(data).token;
        try{
            await axios.delete(`${API_URL}/api/products/delete/${key}`, {
                headers: { Authorization: "Bearer " + token }
            });
            getproducts();
            toast.success("Product deleted successfully");
        }catch(error){
            toast.error("Product not deleted: " + error);
        }
    }

    function confirmDeletion(key){
        setDeleteKey(key);
        setDeleteSection(!deleteSection);
    }

    const resetForm = () => { setKey(""); setName(""); setDescription(""); setPrice(0); setCategory(""); setDimensions(""); };

    const FormModal = ({ title, onSubmit, onCancel, submitLabel }) => (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{background: "rgba(11,15,26,0.85)", backdropFilter: "blur(8px)"}}>
            <div className="w-[440px] p-6 rounded-2xl flex flex-col gap-3"
                style={{background: "#111827", border: "1px solid #2A3447", boxShadow: "0 20px 60px rgba(0,0,0,0.6)"}}>
                <h2 className="text-lg font-bold tracking-wider uppercase text-white font-mono-display mb-2">{title}</h2>

                <input disabled={title.includes("Update")} type="text" placeholder="Product Key" className={inputClass} style={inputStyle}
                    onFocus={handleFocus} onBlur={handleBlur}
                    onChange={(e) => setKey(e.target.value)} value={key}/>
                <input type="text" placeholder="Product Name" className={inputClass} style={inputStyle}
                    onFocus={handleFocus} onBlur={handleBlur}
                    onChange={(e) => setName(e.target.value)} value={name}/>
                <input type="text" placeholder="Dimensions" className={inputClass} style={inputStyle}
                    onFocus={handleFocus} onBlur={handleBlur}
                    onChange={(e) => setDimensions(e.target.value)} value={dimensions}/>
                <textarea placeholder="Description" rows={3} className={inputClass} style={inputStyle}
                    onFocus={handleFocus} onBlur={handleBlur}
                    onChange={(e) => setDescription(e.target.value)} value={description}/>
                <select value={category} className={inputClass} style={{...inputStyle, color: category ? "white" : "#6B7A99"}}
                    onFocus={handleFocus} onBlur={handleBlur}
                    onChange={(e) => setCategory(e.target.value)}>
                    <option value="">-- Select Category --</option>
                    <option value="audio">Audio</option>
                    <option value="headphone">HeadPhone</option>
                    <option value="speaker">Speakers</option>
                    <option value="video equipment">Video Equipment</option>
                    <option value="keyboard">Keyboard</option>
                    <option value="bass">Bass</option>
                    <option value="lighting">Lighting</option>
                    <option value="stage equipment">Stage Equipment</option>
                    <option value="accessories">Accessories</option>
                </select>
                <input type="number" placeholder="Price" className={inputClass} style={inputStyle}
                    onFocus={handleFocus} onBlur={handleBlur}
                    onChange={(e) => setPrice(e.target.value)} value={price}/>

                <div className="flex gap-3 mt-2">
                    <button className={`flex-1 ${btnPrimary}`}
                        style={{background: "linear-gradient(135deg, #E8C547, #F59E0B)", color: "#0B0F1A"}}
                        onClick={() => { onSubmit(); onCancel(); resetForm(); }}>
                        {submitLabel}
                    </button>
                    <button className={`flex-1 ${btnPrimary}`}
                        style={{border: "1px solid #2A3447", color: "#6B7A99"}}
                        onClick={() => { onCancel(); resetForm(); }}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="relative">
            {/* Header */}
            <div className="mb-6">
                <p className="text-xs font-semibold tracking-[0.3em] uppercase mb-1" style={{color: "#6B7A99"}}>Manage</p>
                <h1 className="text-2xl font-bold tracking-wider uppercase text-white font-mono-display">
                    Products<span style={{color: "#E8C547"}}>.Inventory</span>
                </h1>
                <div className="w-16 h-0.5 mt-2" style={{background: "linear-gradient(to right, #E8C547, transparent)"}}/>
            </div>

            {/* Loading */}
            {!itemsLoded && (
                <div className="flex items-center gap-3 py-8">
                    <div className="w-8 h-8 rounded-full border-2 animate-spin"
                        style={{borderColor: "#2A3447", borderTopColor: "#E8C547"}}/>
                    <span className="text-sm tracking-widest uppercase" style={{color: "#6B7A99"}}>Loading products...</span>
                </div>
            )}

            {/* Add product modal */}
            {addProductSection && (
                <FormModal
                    title="Add Product"
                    submitLabel="Add Product"
                    onSubmit={handleAddProducts}
                    onCancel={() => setAddProductSection(false)}
                />
            )}

            {/* Update product modal */}
            {updateProductSection && (
                <FormModal
                    title="Update Product"
                    submitLabel="Update Product"
                    onSubmit={() => updateProduct(key, name, dimensions, description, category, price)}
                    onCancel={() => setUpdateProductSection(false)}
                />
            )}

            {/* Delete confirmation modal */}
            {deleteSection && (
                <div className="fixed inset-0 z-50 flex items-center justify-center" style={{background: "rgba(11,15,26,0.85)", backdropFilter: "blur(8px)"}}>
                    <div className="w-[380px] p-6 rounded-2xl text-center"
                        style={{background: "#111827", border: "1px solid #7F1D1D", boxShadow: "0 20px 60px rgba(0,0,0,0.6)"}}>
                        <p className="text-3xl mb-3">⚠</p>
                        <h2 className="text-lg font-bold text-white mb-1">Confirm Deletion</h2>
                        <p className="text-sm mb-5" style={{color: "#6B7A99"}}>Are you sure you want to delete this product? This action cannot be undone.</p>
                        <div className="flex gap-3">
                            <button className={`flex-1 ${btnDanger}`}
                                style={{background: "#7F1D1D", color: "white"}}
                                onClick={() => { deleteProduct(deleteKey); setDeleteSection(false); }}>
                                Yes, Delete
                            </button>
                            <button className={`flex-1 ${btnPrimary}`}
                                style={{border: "1px solid #2A3447", color: "#6B7A99"}}
                                onClick={() => setDeleteSection(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Table */}
            {itemsLoded && (
                <div className="overflow-x-auto rounded-xl" style={{border: "1px solid #2A3447"}}>
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr style={{background: "#111827", borderBottom: "1px solid #2A3447"}}>
                                {["Key","Name","Price","Category","Dimensions","Description","Status","",""].map((h, i) => (
                                    <th key={i} className="px-4 py-3 text-left text-xs font-semibold tracking-widest uppercase" style={{color: "#6B7A99"}}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.key} className="transition-colors duration-150 hover:bg-white/[0.02]"
                                    style={{borderBottom: "1px solid #2A3447"}}>
                                    <td className="px-4 py-3 font-mono text-xs" style={{color: "#6B7A99"}}>{product?.key}</td>
                                    <td className="px-4 py-3 font-semibold text-white">{product?.name}</td>
                                    <td className="px-4 py-3 font-bold font-mono-display" style={{color: "#E8C547"}}>Rs {product?.price}</td>
                                    <td className="px-4 py-3 text-xs uppercase tracking-wider" style={{color: "#6B7A99"}}>{product?.category}</td>
                                    <td className="px-4 py-3 text-xs" style={{color: "#6B7A99"}}>{product?.dimensions}</td>
                                    <td className="px-4 py-3 text-xs max-w-[160px] truncate" style={{color: "#6B7A99"}}>{product?.description}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-1.5 h-1.5 rounded-full ${product?.availability ? "bg-green-400" : "bg-red-400"}`}/>
                                            <span className={`text-xs font-semibold ${product?.availability ? "text-green-400" : "text-red-400"}`}>
                                                {product?.availability ? "Available" : "Unavailable"}
                                            </span>
                                            <button
                                                className="ml-1 px-2 py-1 rounded text-xs font-semibold transition-all duration-200 hover:opacity-80"
                                                style={{background: "#1A2233", border: "1px solid #2A3447", color: "#6B7A99"}}
                                                onClick={() => updateAvailability(product?.key, !product.availability)}>
                                                {product.availability ? "Mark Unavailable" : "Mark Available"}
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 hover:opacity-80"
                                            style={{background: "rgba(232,197,71,0.15)", color: "#E8C547", border: "1px solid rgba(232,197,71,0.3)"}}
                                            onClick={() => handleUpdateProductSection(product)}>
                                            Edit
                                        </button>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 hover:opacity-80"
                                            style={{background: "rgba(239,68,68,0.15)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.3)"}}
                                            onClick={() => confirmDeletion(product.key)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* FAB Add Button */}
            <button
                onClick={() => setAddProductSection(true)}
                className="fixed bottom-8 right-8 w-14 h-14 rounded-full flex items-center justify-center text-[#0B0F1A] transition-all duration-200 hover:scale-110 hover:shadow-2xl z-30"
                style={{background: "linear-gradient(135deg, #E8C547, #F59E0B)", boxShadow: "0 4px 20px rgba(232,197,71,0.4)"}}>
                <IoAddOutline className="text-3xl font-bold"/>
            </button>
        </div>
    );
}