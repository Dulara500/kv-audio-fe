import { useState } from "react";

export default function ImageSlider(props){
    const [selectedImage, setSelectedImage] = useState(props.images[0]);
    return (
        <div className="flex flex-col gap-3">
            {/* Main Image */}
            <div className="relative overflow-hidden rounded-xl" style={{border: "1px solid #2A3447"}}>
                <img
                    src={selectedImage}
                    alt={props.name}
                    className="w-full h-[280px] object-cover"
                />
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 flex-wrap">
                {props.images.map((image) => (
                    <button
                        key={image}
                        type="button"
                        onClick={() => setSelectedImage(image)}
                        className="relative overflow-hidden rounded-lg transition-all duration-200 focus:outline-none"
                        style={{
                            border: selectedImage === image ? "2px solid #E8C547" : "2px solid #2A3447",
                            boxShadow: selectedImage === image ? "0 0 12px rgba(232,197,71,0.3)" : "none"
                        }}>
                        <img
                            src={image}
                            alt={`${props.name} thumbnail`}
                            className="w-16 h-16 object-cover"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}