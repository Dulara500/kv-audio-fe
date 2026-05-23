
export default function Card({ ...props }) {
    return (
        <div className="bg-gray-800 w-[300px] rounded-2xl shadow-lg overflow-hidden hover:scale-105 transition duration-300 mb-4">
            
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
                    <span className="text-green-400 font-bold text-lg">
                        RS.{props.price}
                    </span>
                    <p className="inline-block border border-green-500 text-green-600 text-xs font-semibold px-1 py-1 rounded-md">
  In stock
</p>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm">
                        Buy
                    </button>
                </div>
            </div>
        </div>
    );
}