import { Routes, Route } from "react-router-dom";
import Header from "../../components/Header";
import Home from "./home";
import Gallery from "./galery";
import Items from "./items";
import Contact from "./contact";
import Error from "./error";
// import Register from "./register";
export default function Homepage(){
    return (
        <div>
            <Header/>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/gallery" element={<Gallery/>} />
                <Route path="/items" element={<Items/>} />
                <Route path="/contact" element={<Contact/>} />
                <Route path="/*" element={<Error/>} />
            </Routes>
        </div>
    );
}