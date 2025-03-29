import { dbConnect } from '@/database/database';
import { uploadPhotoToCloudinary } from '@/utils/Cloudinary';
import MythFact from '@/models/MythFact';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const formData = await req.formData();

    
    const imageFile = formData.get('myth_fact_image') as File;
    if (!imageFile) {
      return NextResponse.json({ success: false, message: 'Image is required' }, { status: 400 });
    }

    const uploadedImage = await uploadPhotoToCloudinary(imageFile);

 
    const parseField = (field: string) => {
      const value = formData.get(field)?.toString();
      if (!value) throw new Error(`${field} is required`);
      return JSON.parse(value);
    };

    const myth_fact_title = parseField('myth_fact_title');
    const myth_fact_body = parseField('myth_fact_body');
    const myth_fact_heading = parseField('myth_fact_heading');
    const myth_fact_description = parseField('myth_fact_description');

    const myths_facts_wrong_fact = JSON.parse(formData.get('myths_facts_wrong_fact') as string || '[]');
    const myths_facts_right_fact = JSON.parse(formData.get('myths_facts_right_fact') as string || '[]');

    if (!Array.isArray(myths_facts_wrong_fact) || !Array.isArray(myths_facts_right_fact)) {
      return NextResponse.json({ success: false, message: 'Wrong/right facts must be arrays' }, { status: 400 });
    }

    const newEntry = new MythFact({
      myth_fact_image: uploadedImage,
      myth_fact_title,
      myth_fact_body,
      myth_fact_heading,
      myth_fact_description,
      myths_facts_wrong_fact,
      myths_facts_right_fact,
    });

    await newEntry.save();

    return NextResponse.json({ status: 201, success: true, message: 'Myth & Fact created', data: newEntry });

  } catch (err) {
    if (err instanceof Error) {
        return NextResponse.json(
          { success: false, message: err.message || 'Server Error' },
          { status: 500 }
        );
      }
  }
}
