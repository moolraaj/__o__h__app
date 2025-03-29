import { v2 as cloudinary } from 'cloudinary';
import { API_KEY, API_SECRET, CLOUD_APP_NAME, CLOUD_NAME } from './Constants';

cloudinary.config({
    cloud_name:  CLOUD_NAME,   
    api_key:  API_KEY,        
    api_secret:  API_SECRET,   
  });
  

 
export const uploadPhotoToCloudinary = async (photo: Blob) => {
  return new Promise<string>((resolve, reject) => {
 
    photo.arrayBuffer()
      .then((buffer) => {
        const bufferObj = Buffer.from(buffer);  

        
        cloudinary.uploader.upload_stream(
          { folder: CLOUD_APP_NAME }, 
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload error:', error);   
              reject(new Error('Failed to upload photo to Cloudinary'));
            } else {
             //@ts-expect-error: result might be undefined 
              resolve(result.secure_url);  
            }
          }
        ).end(bufferObj);  
      })
      .catch((error) => {
        console.error('Error converting photo to buffer:', error);  
        reject(new Error('Error converting photo to buffer'));
      });
  });
};

  
  
   