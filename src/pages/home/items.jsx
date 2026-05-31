import { useEffect,useState } from "react";
import Card from "../../components/card/Card";
import axios from "axios";


export default function Items(){
    const API_URL = import.meta.env.VITE_API_URL;
    const [items,setItems] = useState([]);
    const [loading,setLoading] = useState("loading");
    useEffect(() => {
        const response =  axios.get(`${API_URL}/api/products`).then((response) => {
            setItems(response.data);
            setLoading("success");
            console.log(response.data)
        }).catch((error) => {            
            console.log(error)
            setLoading("error");
        });
    }, []);

    return(
        <div className="w-full h-screen flex flex-wrap justify-center items-center gap-4 pt-[100px]">
            {loading === "loading" && <div className="w-[50px] h-[50px] border-[3px] border-gray-300 border-b-blue-500  rounded-full animate-spin"></div>}
            {loading === "success" && items.map((item) => (
                <Card key={item.key} id={item.key} name={item.name} description={item.description} price={item.price} image={item.image[0]} />
                
            ))}
            {loading === "error" && <p className="text-xl">Error loading items</p>}
        </div>
    );
}