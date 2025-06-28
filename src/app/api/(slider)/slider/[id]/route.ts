import { dbConnect } from '@/database/database';
import Slider, { ISlider } from '@/models/Slider';
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { getLanguage } from '@/utils/FilterLanguages';
import { uploadPhotoToCloudinary, uploadVideoToCloudinary } from '@/utils/Cloudinary';
import { SBody } from '@/utils/Types';


export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const lang = getLanguage(request)
    await dbConnect();

    const id = (await params).id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: 'Invalid slider ID' }, { status: 400 });
    }

    const slide = await Slider.findById(id).lean<ISlider>().lean();
    if (!slide) {
      return NextResponse.json({ success: false, message: 'Slider not found' }, { status: 404 });
    }

    let localizedData;
    if (lang === 'en' || lang === 'kn') {

      localizedData = {
        _id: slide._id,
        sliderImage: slide.sliderImage,
        sliderVideo: slide.sliderVideo,
        text: { [lang]: slide.text?.[lang] || "" },
        description: { [lang]: slide.description?.[lang] || "" },
        body: slide.body.map((b: SBody) => ({
          image: b.image,
          text: { [lang]: b.text?.[lang] || "" },
          description: { [lang]: b.description?.[lang] || "" },
          _id: b._id
        })),
        createdAt: slide.createdAt,
        updatedAt: slide.updatedAt,
        __v: slide.__v
      };
    } else {
      localizedData = {
        _id: slide._id,
        sliderImage: slide.sliderImage,
        text: slide.text,
        description: slide.description,
        sliderVideo:slide.sliderVideo,
        body: slide.body.map((b: SBody) => ({
          image: b.image,
          text: b.text,
          description: b.description,
          _id: b._id
        })),
        createdAt: slide.createdAt,
        updatedAt: slide.updatedAt,
        __v: slide.__v
      };
    }

    return NextResponse.json({ status: 200, success: true, result: localizedData });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: 'Failed to fetch slider' }, { status: 500 });
  }
}





export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const id = (await params).id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: 'Invalid slider ID' }, { status: 400 });
    }

    const deletedSlide = await Slider.findByIdAndDelete(id);
    if (!deletedSlide) {
      return NextResponse.json({ success: false, message: 'Slider not found' }, { status: 404 });
    }

    return NextResponse.json({ status: 200, success: true, message: 'Slider deleted successfully' });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: 'Failed to delete slider' }, { status: 500 });
  }
}




export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();

    const id = (await params).id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: 'Invalid slider ID' }, { status: 400 });
    }

    const slider = await Slider.findById(id);
    if (!slider) {
      return NextResponse.json({ success: false, message: 'Slider not found' }, { status: 404 });
    }

    const formData = await req.formData();

    const sliderImageFile = formData.get('sliderImage') as File | null;
    if (sliderImageFile && sliderImageFile.size > 0) {
      const newSliderImageUrl = await uploadPhotoToCloudinary(sliderImageFile);
      slider.sliderImage = newSliderImageUrl;
    }

    const sliderVideoFile = formData.get('sliderVideo') as File | null;
    if (sliderVideoFile && sliderVideoFile.size > 0) {
      slider.sliderVideo = await uploadVideoToCloudinary(sliderVideoFile);
    }

    const textJson = formData.get('text')?.toString();
    if (textJson) {
      const text = JSON.parse(textJson);
      slider.text = text;
    }

    const descriptionJson = formData.get('description')?.toString();
    if (descriptionJson) {
      const description = JSON.parse(descriptionJson);
      slider.description = description;
    }

    const bodyJson = formData.get('body')?.toString();
    if (bodyJson) {
      let bodyItems;
      try {
        bodyItems = JSON.parse(bodyJson);
        if (!Array.isArray(bodyItems)) throw new Error('Body must be an array');
      } catch (err) {
        if (err instanceof Error) {
          return NextResponse.json({ success: false, message: 'Invalid body JSON' }, { status: 400 });
        }

      }

      const updatedBody = await Promise.all(
        bodyItems.map(async (item: SBody, index: number) => {
          let bodyImageUrl = item.image;
          const bodyImageFile = formData.get(`bodyImage${index}`) as File | null;
          if (bodyImageFile && bodyImageFile.size > 0) {
            bodyImageUrl = await uploadPhotoToCloudinary(bodyImageFile);
          } else if (!bodyImageUrl) {
            bodyImageUrl = slider.body?.[index]?.image || "";
          }
          return {
            image: bodyImageUrl,
            text: item.text,
            description: item.description,
          };
        })
      );

      slider.body = updatedBody;
    }

    await slider.save();

    return NextResponse.json({ status: 200, success: true, message: 'Slider updated', data: slider });
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ success: false, message: 'Failed to update slider' }, { status: 500 });
    }
  }
}


