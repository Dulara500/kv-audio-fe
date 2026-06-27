import { Routes, Route } from "react-router-dom";
import Header from "../../components/Header";
import Home from "./home";
import Gallery from "./galery";
import Items from "./items";
import Contact from "./contact";
import Error from "./error";
import ProductView from "./productView";
import BookingPage from "./bookingPage"
import RentItems from "./rentItems";
import Messages from "./messages"
import Footer from "../../components/layouts/footer";

export default function Homepage(){
    return (
        <>
            <Header/>
        <div className="pt-16 min-h-screen" style={{backgroundColor: "#0B0F1A"}}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/gallery" element={<Gallery/>} />
                <Route path="/items" element={<Items/>} />
                <Route path="/product/:id" element={<ProductView/>} />
                <Route path="/contact" element={<Contact/>} />
                <Route path="/cart" element={<BookingPage/>}/>
                <Route path="/rent" element={<RentItems/>}/>
                <Route path="/messages" element={<Messages/>}/>
                <Route path="/*" element={<Error/>} />
            </Routes>
        </div>
        <Footer/>
        </>
    );
}