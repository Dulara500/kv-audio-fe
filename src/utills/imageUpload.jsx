import { createClient } from "@supabase/supabase-js";


const url = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
const anon = import.meta.env.VITE_ANON;

const supabase = createClient(url,anon);

export default async function uploadImage(file){
    if(!file){
        throw new Error ("no file selcected")
    }
    const fileName = `${Date.now()}-${file.name}`
    const {error}=await supabase.storage.from("images").upload(fileName,file,{
        cacheControl:3600,
        upsert:true
    })
    
    if(error){
        throw error
    }

    const {data} = supabase.storage.from("images").getPublicUrl(fileName);
    return data.publicUrl;

}