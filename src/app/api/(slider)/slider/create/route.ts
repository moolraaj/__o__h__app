import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/database/database';
import { uploadPhotoToCloudinary } from '@/utils/Cloudinary';
import Slider from '@/models/Slider';
import { SBody } from '@/utils/Types';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const formData = await req.formData();

   
    const sliderImageFile = formData.get('sliderImage') as File;
    const sliderImageUrl = await uploadPhotoToCloudinary(sliderImageFile);

 
    const textJson = formData.get('text')?.toString();
    const text = JSON.parse(textJson || '{}');
 
    const descriptionJson = formData.get('description')?.toString();
    const description = JSON.parse(descriptionJson || '{}');

 
    const bodyJson = formData.get('body') as string;
    let bodyItems = [];
    try {
      bodyItems = JSON.parse(bodyJson);
      if (!Array.isArray(bodyItems)) throw new Error('Body must be an array');
    } catch (err) {
      if(err instanceof Error){
        return NextResponse.json({ success: false, message: 'Invalid body JSON' }, { status: 400 });
      }
      
    }
    
    const bodyWithImages = await Promise.all(
      bodyItems.map(async (item:SBody, index: number) => {
        let bodyImageUrl = item.image;
        if (!bodyImageUrl) {
          const bodyImageFile = formData.get(`bodyImage${index}`) as File;
          if (!bodyImageFile) throw new Error(`Missing bodyImage${index}`);
          bodyImageUrl = await uploadPhotoToCloudinary(bodyImageFile);
        }
    
        return {
          image: bodyImageUrl,
          text: item.text,   
          description: item.description,   
        };
      })
    );
    

  
    const newSlider = new Slider({
      sliderImage: sliderImageUrl,
      text,
      description,
      body: bodyWithImages,
    });

    await newSlider.save();

    return NextResponse.json({ message:"slide created successfully",status:201,success: true, data: newSlider });

  } catch (err) {
    if(err instanceof Error){
      return NextResponse.json({ success: false, message: 'Failed to create slider' }, { status: 500 });
    }
  }
}
