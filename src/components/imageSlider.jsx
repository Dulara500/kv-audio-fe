import { useState } from "react";


export default function ImageSlider(props){
    const [selectedImage,setSelectedImage] = useState(props.images[0])
    return (
        <div className="flex flex-col">
            <div className="w-auto h-auto object-cover rounded-lg">
                <img 
                    src={selectedImage}
                    alt={props.name}
                    className="w-[400px] h-[300px] object-cover rounded-lg"
                />
            </div>
            <div className="flex m-2 ">
                {props.images.map((image) => (
                    <button
                        key={image}
                        type="button"
                        onClick={() => setSelectedImage(image)}
                        className="focus:outline-none"
                    >
                        <img 
                            src={image} 
                            alt={`${props.name} thumbnail`} 
                            className={`w-20 h-20 mx-2 object-cover rounded-lg ${selectedImage === image ? 'border-4 border-blue-200' : ''}`} 
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}