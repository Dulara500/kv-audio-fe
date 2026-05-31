import { Link } from "react-router-dom";

export default function Card({ ...props }) {
    return (
        <div className="bg-secondary w-[300px] rounded-2xl shadow-lg overflow-hidden hover:scale-105 transition duration-300 mb-4">
            {/* Image */}
            <img 
                src={props.image} 
                alt={props.name} 
                className="w-full h-[180px] object-cover"
            />

            {/* Content */}
            <div className="p-4 flex flex-col gap-2">
                
                {/* Name */}
                <h2 className="text-xl font-semibold text-white">
                    {props.name}
                </h2>

                {/* Description */}
                <p className="text-gray-300 text-sm line-clamp-2">
                    {props.description}
                </p>

                {/* Price + Button */}
                <div className="flex justify-between items-center mt-2">
                    <span className="text-primary font-bold text-lg">
                        RS.{props.price}
                    </span>
                    <p className="inline-block border border-primary text-primary text-xs font-semibold px-1 py-1 rounded-md">
  In stock
</p>
                    <Link to={`/product/${props.id}`} className="bg-primary text-secondary text-xs font-semibold border border-accent hover:bg-accent hover:text-primary transition duration-300 px-3 py-1 rounded-lg text-sm ">
                        View product
                    </Link>
                </div>
            </div>
        </div>
    );
}