import { dbConnect } from '@/database/database';
import Category from '@/models/Category';
import { EN, KN } from '@/utils/Constants';
import { getLanguage } from '@/utils/FilterLanguages';
import { ReusePaginationMethod } from '@/utils/Pagination';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const lang = getLanguage(request);
    const { page, skip, limit } = ReusePaginationMethod(request);

    const categories = await Category.find().limit(limit).skip(skip).lean();
    const totalResults = await Category.countDocuments();

    const localizedData = categories.map((category) => {
      if (lang === EN || lang === KN) {
        return {
          _id: category._id,
          categoryImage: category.categoryImage,
          title: { [lang]: category.title?.[lang] || '' },
          createdAt: category.createdAt,
          updatedAt: category.updatedAt,
          __v: category.__v,
        };
      } else {
        return category;
      }
    });

    return NextResponse.json({
      status: 200,
      success: true,
      result: localizedData,
      totalResults,
      page,
      limit,
    });
  } catch (err) {
    if(err instanceof Error){

        return NextResponse.json(
          { success: false, message: 'Failed to fetch categories' },
          { status: 500 }
        );
    }

    
  }
}
