import { dbConnect } from '@/database/database';
import Category, { ICategory } from '@/models/Category';
import { uploadPhotoToCloudinary } from '@/utils/Cloudinary';
import { EN, KN } from '@/utils/Constants';
import { getLanguage } from '@/utils/FilterLanguages';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id=(await params).id
    await dbConnect();
    const lang = getLanguage(request);
    const category = await Category.findById({_id:id}).lean<ICategory>();

    if (!category) {
      return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });
    }

 
    let localizedCategory;

    if (lang === EN || lang === KN) {
      localizedCategory = {
        _id: category._id,
        categoryImage: category.categoryImage,
        title: { [lang]: category.title?.[lang] || '' },
        createdAt: category.createdAt,
        updatedAt: category.updatedAt
      };
    } else {
      localizedCategory = category;
    }

    return NextResponse.json({
      status: 200,
      success: true,
      data: localizedCategory,
    });
  } catch (err) {
    if(err instanceof Error){

        return NextResponse.json({ success: false, message: 'Failed to fetch category' }, { status: 500 });
    }
  }
}


export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) {
    try {
        const id=(await params).id
      await dbConnect();
  
      const deletedCategory = await Category.findByIdAndDelete({_id:id});
  
      if (!deletedCategory) {
        return NextResponse.json(
          { success: false, message: 'Category not found' },
          { status: 404 }
        );
      }
  
      return NextResponse.json({
        status: 200,
        success: true,
        message: 'Category deleted successfully',
      });
    } catch (err) {
        if(err instanceof Error){

            return NextResponse.json(
              { success: false, message: 'Failed to delete category' },
              { status: 500 }
            );
        }
       
    }
  }


  export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
      await dbConnect();
      const id = (await params).id;
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ success: false, message: 'Invalid category ID' }, { status: 400 });
      }
  
      const category = await Category.findById(id);
      if (!category) {
        return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });
      }
  
      const formData = await req.formData();
  
   
      const imageFile = formData.get('categoryImage') as File | null;
      if (imageFile && imageFile.size > 0) {
        const imageUrl = await uploadPhotoToCloudinary(imageFile);
        category.categoryImage = imageUrl;
      }
  
    
      const titleJson = formData.get('title')?.toString();
      if (titleJson) {
        try {
          const parsedTitle = JSON.parse(titleJson);
          if (parsedTitle.en) category.title.en = parsedTitle.en;
          if (parsedTitle.kn) category.title.kn = parsedTitle.kn;
        } catch (err) {
            if(err instanceof Error){

                return NextResponse.json({ success: false, message: 'Invalid title JSON' }, { status: 400 });
            }
        }
      }
  
      await category.save();
  
      return NextResponse.json({
        status: 200,
        success: true,
        message: 'Category updated successfully',
        data: category,
      });
  
    } catch (err) {
        if(err instanceof Error){

            return NextResponse.json({ success: false, message: 'Failed to update category' }, { status: 500 });
        }
    }
  }
