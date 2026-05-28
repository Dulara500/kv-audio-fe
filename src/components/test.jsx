import { useState } from "react";
import uploadImage from "../utills/imageUpload";

export default function Test(){
    const [file,setFile] = useState();
    
    async function handleClick(){
        try{
            const url =await uploadImage(file);
            console.log(url)
        }catch(err){
            console.log(err);
        }
    }
    return(
        <div>
            <input type="file" multiple onChange={(e)=>setFile(e.target.files[0])} />
            <button onClick={handleClick}>Upload</button>
        </div>
    );
}