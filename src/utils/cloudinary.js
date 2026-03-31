import { v2 } from "cloudinary";
import fr from"fs";


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUDE_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SCREAT
});

const uploadOnCloudinary = async (localFilePath) =>{
    try {
        if(!localFilePath) return null
        //upload the file on cloudinary 
       const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto" 
        })
        //file has been upload successfully
        console.log("done sir all set ", response.url);
        return response;
        
    } catch(error) {
        fs.unlinkSync(localFilePath)
         // remove the temporary saved file as the upload operation got failed 
        return null;
    }
}



export {uploadOnCloudinary}