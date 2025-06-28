// pages/api/sliders.ts

import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/database/database';
import { uploadPhotoToCloudinary, uploadVideoToCloudinary } from '@/utils/Cloudinary';
import Slider from '@/models/Slider';
import { SBody } from '@/app/(super-admin)/super-admin/slider/add-slider/page';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const formData = await req.formData();

    // 1) Image
    const imageFile = formData.get('sliderImage') as File | null;
    if (!imageFile) {
      return NextResponse.json({ success: false, message: 'sliderImage is required' }, { status: 400 });
    }
    const sliderImage = await uploadPhotoToCloudinary(imageFile);

    // 2) Video (optional)
    let sliderVideo: string | undefined;
    const videoFile = formData.get('sliderVideo') as File | null;
    if (videoFile) {
      sliderVideo = await uploadVideoToCloudinary(videoFile);
    }

    // 3) Localized text & description
    const parseJSON = <T>(key: string): T => {
      const raw = formData.get(key)?.toString();
      if (!raw) throw new Error(`${key} is required`);
      try { return JSON.parse(raw) as T; }
      catch { throw new Error(`${key} must be valid JSON`); }
    };
    const text = parseJSON<{ en: string; kn: string }>('text');
    const description = parseJSON<{ en: string; kn: string }>('description');

    // 4) Body array
    const bodyRaw = formData.get('body')?.toString();
    if (!bodyRaw) {
      return NextResponse.json({ success: false, message: 'body is required' }, { status: 400 });
    }
    let bodyItems: SBody[];
    try {
      bodyItems = JSON.parse(bodyRaw);
      if (!Array.isArray(bodyItems)) throw new Error();
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid body JSON' }, { status: 400 });
    }

    // 5) Upload body images if provided as files
    const body = await Promise.all(
      bodyItems.map(async (item, idx) => {
        let imageUrl = item.image;
        if (!imageUrl) {
          const f = formData.get(`bodyImage${idx}`) as File | null;
          if (!f) throw new Error(`Missing bodyImage${idx}`);
          imageUrl = await uploadPhotoToCloudinary(f);
        }
        return {
          image: imageUrl,
          text: item.text,
          description: item.description
        };
      })
    );

    // 6) Create
    const newSlider = await Slider.create({
      sliderImage,
      ...(sliderVideo && { sliderVideo }),
      text,
      description,
      body
    });

    return NextResponse.json({
      success: true,
      message: 'Slider created successfully',
      data: newSlider
    }, { status: 201 });

  } catch (err) {
    console.error('Create Slider Error:', err);
    return NextResponse.json({ success: false, message: (err as Error).message }, { status: 500 });
  }
}
