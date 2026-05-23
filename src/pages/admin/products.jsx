import { useState,useEffect } from "react";
import axios from "axios";
import { IoAddOutline } from "react-icons/io5";
import toast from "react-hot-toast";

export default function Products() {
    const API_URL = import.meta.env.VITE_API_URL;
    const [key,setKey] = useState("");
    const [name,setName] = useState("");
    const [description,setDescription] = useState("");
    const [price,setPrice] = useState(0);
    const [category,setCategory] = useState("");
    const [dimensions,setDimensions] = useState("");
    const [addProductSection,setAddProductSection] = useState(false);
    const [updateProductSection,setUpdateProductSection] = useState(false);
    const [products,setProducts] = useState([]);
    const [deleteSection,setDeleteSection] = useState(false);
    const [deleteKey,setDeleteKey] = useState("");
    const [itemsLoded, setItemsLoaded] = useState(false);

    useEffect(()=>{
        getproducts();
    },[])

    async function getproducts(){
        try{
          const data = localStorage.getItem("user");
          const token = JSON.parse(data).token;
          console.log(token)
          
          const result =await axios.get(`${API_URL}/api/products`,{
                headers: {
                    Authorization: "Bearer " + token
                }
          })
          setItemsLoaded(true);
          setProducts(result.data);
        }catch(error){
            toast.error( error.response?.data?.message || "Products not found")
        }
    }

    function handleAddProductSection(){
        setAddProductSection(!addProductSection);
    }

    async function handleAddProducts(){
        const data = localStorage.getItem("user")
        const token = JSON.parse(data).token;

        try{
            await axios.post(`${API_URL}/api/products`,{
                key,
                name,
                dimensions,
                category,
                price,
                description
            },{
                headers: {
                    Authorization: "Bearer " + token
                }
            })
            getproducts();
            toast.success("Product added successfully")
        }catch(error){
            toast.error("Product not added: "+ error.response.data.message)
            console.log(error)
        }
    }

    async function updateAvailability(key,value){
        const data = localStorage.getItem("user")
        const token = JSON.parse(data).token;

        try{
            await axios.put(`${API_URL}/api/products/${key}`,{
                availability: value
            },{
                headers: {
                    Authorization: "Bearer " + token
                }
            })
            getproducts();
            toast.success("Availability updated successfully")
        }catch(error){
            toast.error("Availability not updated: "+ error.response.data.message)
            console.log(error)
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
        // here i need to paas the product key to get the product details
    }

    async function updateProduct(key,name,dimensions,description,category,price){
        const data = localStorage.getItem("user")
        const token = JSON.parse(data).token;

        try{
            await axios.put(`${API_URL}/api/products/${key}`,{
                name,
                dimensions,
                category,
                price,
                description
            },{
                headers: {
                    Authorization: "Bearer " + token
                }
            })
            getproducts();
            toast.success("Product updated successfully")
        }catch(error){
            toast.error("Product not updated: "+ error)
            console.log(error)
        }
    }

    async function deleteProduct(key){
      const data = localStorage.getItem("user");
      const token = JSON.parse(data).token;

      try{
        await axios.delete(`${API_URL}/api/products/delete/${key}`,{
          headers:{
            Authorization: "Bearer " + token
          }
        })
        getproducts();
        toast.success("Product deleted successfully")
      }catch(error){
        toast.error("Product not deleted: "+ error)
        console.log(error)
      }
    }

    function confirmDeletion(key){
      setDeleteKey(key);
      setDeleteSection(!deleteSection);
    }

    

    
    return (  
        <div className="relative m-5 ">
            <h1 className="text-2xl font-bold">Our Products</h1>
            {!itemsLoded && <div className="w-10 h-10 ml-[500px] border border-[4px] border-b-blue-600 border-gray-400 rounded-full animate-spin"></div>}
            
            
            {addProductSection && (
                <div className="fixed left-[150px] top-[50px] inset-0 z-20 backdrop-blur-xs flex flex-col justify-center items-center w-full">
                    <div className="w-[400px] p-5 border border-1px border-gray-400 flex flex-col justify-center items-center gap-2 rounded-2xl bg-white shadow-lg shadow-gray-500/50">
                        <h1 className="text-2xl font-semibold m-1">Add product</h1>
                        <input type="text" placeholder="Product Key" className="p-2 w-[300px] border border-1px border-black rounded-xl" onChange={(e)=> setKey(e.target.value)} value={key}/>
                        <input type="text" placeholder="Product Name" className="p-2 w-[300px] border border-1px border-black rounded-xl" onChange={(e)=> setName(e.target.value)} value={name}/>
                        <input type="text" placeholder="Product Dimensions" className="p-2 w-[300px] border border-1px border-black rounded-xl" onChange={(e)=> setDimensions(e.target.value)} value={dimensions}/>
                        <textarea type="text" placeholder="Product Description" className="p-2 w-[300px] border border-1px border-black rounded-xl" onChange={(e)=> setDescription(e.target.value)} value={description}/>
                        <select value={category} className="p-2 w-[300px] border border-1px border-black rounded-xl" onChange={(e)=> setCategory(e.target.value)}>
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
                        <input type="number" placeholder="Product Price" className="p-2 w-[300px] border border-1px border-black rounded-xl" onChange={(e)=> setPrice(e.target.value)} value={price}/>
                        
                        <button className="p-2 mt-4 w-[300px] border border-1px border-black rounded-xl bg-blue-900 hover:bg-blue-800 text-white transition-colors duration-200" onClick={()=>{handleAddProducts();handleAddProductSection();setKey(""); setName(""); setDescription(""); setPrice(0); setCategory(""); setDimensions("")}}>Add Product</button>
                        <button  className="p-2 mt-4 w-[300px] border border-1px border-black rounded-xl bg-blue-900 hover:bg-blue-800 text-white transition-colors duration-200" onClick={()=>{handleAddProductSection(); setKey(""); setName(""); setDescription(""); setPrice(0); setCategory(""); setDimensions("")}}>Cancel</button>
                    </div>
                </div>
            )}
            <IoAddOutline  className="fixed top-[500px] right-[50px] text-6xl cursor-pointer" onClick={handleAddProductSection}/>

            <div className="overflow-x-auto mt-6">
                <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">

                  <thead className="bg-gray-100 text-gray-700 uppercase text-sm tracking-wide">
                    <tr>
                      <th className="px-4 py-3 text-left">Key</th>
                      <th className="px-4 py-3 text-left">Name</th>
                      <th className="px-4 py-3 text-left">Price</th>
                      <th className="px-4 py-3 text-left">Category</th>
                      <th className="px-4 py-3 text-left">Dimensions</th>
                      <th className="px-4 py-3 text-left">Description</th>
                      <th className="px-4 py-3 text-left">Available</th>
                      <th className="px-4 py-3 text-left">Update</th>
                      <th className="px-4 py-3 text-left">Delete</th>
                    </tr>
                  </thead>

                  <tbody className="text-gray-700 text-sm">
                    {products.map((product) => (
                      <tr
                        key={product.key}
                        className="border-t hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3">{product?.key}</td>
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {product?.name}
                        </td>
                        <td className="px-4 py-3 text-green-600 font-semibold">
                          Rs {product?.price}
                        </td>
                        <td className="px-4 py-3">{product?.category}</td>
                        <td className="px-4 py-3">{product?.dimensions}</td>
                        <td className="px-4 py-3 text-gray-600">
                          {product?.description}
                        </td>
                        <td className={`px-4 py-3 text-gray-600 ${!product?.availability ? "text-red-500" : "text-green-500"} flex gap-2 items-center`}>
                          <p>{product?.availability ? "Available" : "Unavailable"}</p>
                          <button className="p-2 w-[100px] border border-1px border-black rounded-xl bg-blue-900 hover:bg-blue-800 text-white transition-colors duration-200" onClick={()=>{updateAvailability(product?.key,!product.availability)}}>{product.availability? "Mark as unavailable": "Mark as available"}</button>
                        </td>
                        <td>
                          <button className="p-2 m-3 w-[100px] border border-1px border-black rounded-xl bg-blue-900 hover:bg-blue-800 text-white transition-colors duration-200" onClick={()=>{handleUpdateProductSection(product)}} >Edit</button>
                        </td>
                        <td >
                          <button className="p-2 m-3 w-[100px] border border-1px border-black rounded-xl bg-red-900 hover:bg-red-800 text-white transition-colors duration-200"onClick={()=>{ confirmDeletion(product.key);}}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                
                </table>
                {updateProductSection && (
                <div className="fixed left-[150px] top-[50px] inset-0 z-20 backdrop-blur-xs flex flex-col justify-center items-center w-full">
                    <div className="w-[400px]  p-5 border border-1px border-gray-400 flex flex-col justify-center items-center gap-2 rounded-2xl bg-white shadow-lg shadow-gray-500/50">
                        <h1 className="text-2xl font-semibold m-1">Update Product</h1>
                        <input type="text" disabled placeholder="Product Key" className="text-gray-500 p-2 w-[300px] border border-1px border-black rounded-xl" onChange={(e)=> setKey(e.target.value)} value={key}/>
                        <input type="text" placeholder="Product Name" className="p-2 w-[300px] border border-1px border-black rounded-xl" onChange={(e)=> setName(e.target.value)} value={name}/>
                        <input type="text" placeholder="Product Dimensions" className="p-2 w-[300px] border border-1px border-black rounded-xl" onChange={(e)=> setDimensions(e.target.value)} value={dimensions}/>
                        <textarea type="text" placeholder="Product Description" className="p-2 w-[300px] border border-1px border-black rounded-xl" onChange={(e)=> setDescription(e.target.value)} value={description}/>
                        <select value={category} className="p-2 w-[300px] border border-1px border-black rounded-xl" onChange={(e)=> setCategory(e.target.value)}>
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
                        <input type="number" placeholder="Product Price" className="p-2 w-[300px] border border-1px border-black rounded-xl" onChange={(e)=> setPrice(e.target.value)} value={price}/>
                        
                        <button className="p-2 mt-4 w-[300px] border border-1px border-black rounded-xl bg-blue-900 hover:bg-blue-800 text-white transition-colors duration-200" onClick={()=>{updateProduct(key,name,dimensions,description,category,price); setUpdateProductSection(false);setKey(""); setName(""); setDescription(""); setPrice(0); setCategory(""); setDimensions("")}}>Update Product</button>
                        <button  className="p-2 mt-4 w-[300px] border border-1px border-black rounded-xl bg-blue-900 hover:bg-blue-800 text-white transition-colors duration-200" onClick={()=>{setUpdateProductSection(false)}}>Cancel</button>
                    </div>
                </div>
            )}

            {deleteSection && (
                <div className="fixed left-[150px] top-[50px] inset-0 z-20 backdrop-blur-xs flex flex-col justify-center items-center w-full">
                    <div className="p-3 w-[400px] h-[150px] border border-1px border-gray-400 flex flex-col justify-center items-center gap-2 rounded-2xl bg-white shadow-lg shadow-gray-500/50">
                        <h1 className="text-lg text-center">Are you sure you want to delete this product?</h1>
                        <div className="flex gap-4 justify-center items-center mt-4">
                            <button className="p-1 w-[150px] border border-1px border-black rounded-xl bg-red-900 hover:bg-red-800 text-white transition-colors duration-200" onClick={()=>{deleteProduct(deleteKey); setDeleteSection(false)}}>Yes</button>
                            <button  className="p-1 w-[150px] border border-1px border-black rounded-xl bg-blue-900 hover:bg-blue-800 text-white transition-colors duration-200" onClick={()=>{setDeleteSection(false)}}>No</button>
                        </div>
                    </div>
                </div>
            )}
          </div>
        </div>
    );
}