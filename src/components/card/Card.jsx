import { Link } from "react-router-dom";


export default function Card({ ...props }) {
    return (
        
        <div className="group relative w-full max-w-[340px] mx-auto rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            style={{
                background: "#111827",
                border: "1px solid #2A3447",
                boxShadow: "0 4px 20px rgba(0,0,0,0.4)"
            }}>
            
            <div>
                
            </div>
            {/* Status Badge */}
            <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide uppercase"
                style={{background: "rgba(11,15,26,0.85)", backdropFilter: "blur(6px)", border: "1px solid #2A3447"}}>
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"/>
                <span className="text-green-400">In Stock</span>
            </div>

            {/* Image */}
            <div className="relative overflow-hidden h-[180px]">
                <Link to={`/product/${props.id}`} className="absolute inset-0 z-10">
                <img
                    src={props.image}
                    alt={props.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                </Link>
                <div className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                    style={{background: "linear-gradient(to top, rgba(11,15,26,0.6) 0%, transparent 60%)"}}/>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col gap-3">
                {/* Category */}
                <p className="text-xs font-semibold tracking-widest uppercase" style={{color: "#6B7A99"}}>
                    {props.category || "Audio Gear"}
                </p>

                {/* Name */}
                <Link to={`/product/${props.id}`}>
                <h2 className="text-base font-bold text-white leading-tight tracking-wide uppercase font-mono-display line-clamp-2">
                    {props.name}
                </h2>
                </Link>

                {/* Description */}
                <p className="text-xs line-clamp-2" style={{color: "#6B7A99"}}>
                    {props.description}
                </p>

                {/* Price + Button */}
                <div className="flex items-center justify-between mt-1 pt-3" style={{borderTop: "1px solid #2A3447"}}>
                    <div>
                        <span className="text-xl font-bold font-mono-display" style={{color: "#E8C547"}}>
                            Rs.{props.price}
                        </span>
                        <span className="text-xs ml-1" style={{color: "#6B7A99"}}>/day</span>
                    </div>
                    <Link
                        to={`/product/${props.id}`}
                        className="px-3 py-1.5 text-xs font-semibold tracking-wide uppercase rounded-md transition-all duration-200 hover:opacity-90"
                        style={{background: "linear-gradient(135deg, #E8C547, #F59E0B)", color: "#0B0F1A"}}>
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
}