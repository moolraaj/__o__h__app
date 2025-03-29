import { dbConnect } from '@/database/database';
import MythFact, { IMythFact } from '@/models/MythFact';
import mongoose from 'mongoose';
import { EN, KN } from '@/utils/Constants';
import { getLanguage } from '@/utils/FilterLanguages';
import { NextRequest, NextResponse } from 'next/server';
import { uploadPhotoToCloudinary } from '@/utils/Cloudinary';
import { FaqsRightFacts, FaqsWrongFacts } from '@/utils/Types';

 
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();

    const id = (await params).id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: 'Invalid ID' }, { status: 400 });
    }

    const lang = getLanguage(request);
    const item = await MythFact.findById(id).lean<IMythFact>();

    if (!item) {
      return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    }

    if (lang === EN || lang === KN) {
      return NextResponse.json({
        status: 200,
        success: true,
        data: {
          _id: item._id,
          myth_fact_image: item.myth_fact_image,
          myth_fact_title: { [lang]: item.myth_fact_title?.[lang] || '' },
          myth_fact_body: { [lang]: item.myth_fact_body?.[lang] || '' },
          myth_fact_heading: { [lang]: item.myth_fact_heading?.[lang] || '' },
          myth_fact_description: { [lang]: item.myth_fact_description?.[lang] || '' },
          myths_facts_wrong_fact: item.myths_facts_wrong_fact?.map((fact: FaqsWrongFacts) => ({
            [lang]: fact?.[lang] || '',
          })) || [],
          myths_facts_right_fact: item.myths_facts_right_fact?.map((fact: FaqsRightFacts) => ({
            [lang]: fact?.[lang] || '',
          })) || [],
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        },
      });
    } else {
      return NextResponse.json({ status: 200, success: true, data: item });
    }

  } catch (error) {
    console.error('Get Single MythFact Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch item' }, { status: 500 });
  }
}

 
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();

    const id = (await params).id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: 'Invalid ID' }, { status: 400 });
    }

    const deleted = await MythFact.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({
      status: 200,
      success: true,
      message: 'Myth & Fact deleted successfully',
    });

  } catch (error) {
    console.error('Delete MythFact Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete item' }, { status: 500 });
  }
}


export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
      await dbConnect();
      const id = (await params).id;
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ success: false, message: 'Invalid ID' }, { status: 400 });
      }
  
      const item = await MythFact.findById({_id:id});
      if (!item) {
        return NextResponse.json({ success: false, message: 'Myth & Fact not found' }, { status: 404 });
      }
  
      const formData = await req.formData();
  
  
      const imageFile = formData.get('myth_fact_image') as File | null;
      if (imageFile && imageFile.size > 0) {
        const imageUrl = await uploadPhotoToCloudinary(imageFile);
        item.myth_fact_image = imageUrl;
      }
  
      
      const parseField = (key: string) => {
        const raw = formData.get(key)?.toString();
        if (raw) return JSON.parse(raw);
        return null;
      };
  
      const title = parseField('myth_fact_title');
      if (title) item.myth_fact_title = title;
  
      const body = parseField('myth_fact_body');
      if (body) item.myth_fact_body = body;
  
      const heading = parseField('myth_fact_heading');
      if (heading) item.myth_fact_heading = heading;
  
      const description = parseField('myth_fact_description');
      if (description) item.myth_fact_description = description;
  
      const wrongFacts = parseField('myths_facts_wrong_fact');
      if (Array.isArray(wrongFacts)) item.myths_facts_wrong_fact = wrongFacts;
  
      const rightFacts = parseField('myths_facts_right_fact');
      if (Array.isArray(rightFacts)) item.myths_facts_right_fact = rightFacts;
  
      await item.save();
  
      return NextResponse.json({
        status: 200,
        success: true,
        message: 'Myth & Fact updated successfully',
        data: item,
      });
  
    } catch (error) {
      console.error('Myth & Fact Update Error:', error);
      return NextResponse.json({ success: false, message: 'Failed to update item' }, { status: 500 });
    }
  }