import { Link } from "react-router-dom";
import { LuAudioWaveform } from "react-icons/lu";
import { MdArrowForward } from "react-icons/md";

export default function Home(){
    return (
        <div className="relative overflow-hidden min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-6 py-20 text-center" style={{backgroundColor: "#0B0F1A"}}>
            {/* Tag */}
            <div className="flex items-center gap-2 mb-6 px-4 py-2 rounded-full"
                style={{background: "rgba(232,197,71,0.1)", border: "1px solid rgba(232,197,71,0.2)"}}>
                <LuAudioWaveform className="text-sm" style={{color: "#E8C547"}}/>
                <span className="text-xs font-semibold tracking-widest uppercase" style={{color: "#E8C547"}}>
                    Premium Audio Equipment Rental
                </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white font-mono-display mb-4 leading-none">
                KV<span style={{color: "#E8C547"}}>_</span>AUDIO
            </h1>
            <p className="text-base md:text-lg max-w-xl leading-relaxed mb-10" style={{color: "#6B7A99"}}>
                Professional-grade audio and stage equipment for events, studios, and productions. 
                Curated gear, calibrated for precision.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link to="/items"
                    className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold tracking-wide uppercase transition-all duration-200 hover:opacity-90 hover:scale-105"
                    style={{background: "linear-gradient(135deg, #E8C547, #F59E0B)", color: "#0B0F1A"}}>
                    Browse Catalog
                    <MdArrowForward size={16}/>
                </Link>
                <Link to="/contact"
                    className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold tracking-wide uppercase transition-all duration-200 hover:border-[#E8C547]/40 hover:text-white"
                    style={{border: "1px solid #2A3447", color: "#6B7A99"}}>
                    Contact Us
                </Link>
            </div>

            {/* Decorative Grid */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5" aria-hidden="true">
                <div className="absolute inset-0"
                    style={{
                        backgroundImage: "linear-gradient(#2A3447 1px, transparent 1px), linear-gradient(90deg, #2A3447 1px, transparent 1px)",
                        backgroundSize: "60px 60px"
                    }}/>
            </div>
        </div>
    );
}