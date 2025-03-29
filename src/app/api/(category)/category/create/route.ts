import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/database/database';
import { uploadPhotoToCloudinary } from '@/utils/Cloudinary';
import Category from '@/models/Category';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const formData = await req.formData();


        const imageFile = formData.get('categoryImage') as File;
        if (!imageFile) {
            return NextResponse.json({ success: false, message: 'Missing category image' }, { status: 400 });
        }
        const imageUrl = await uploadPhotoToCloudinary(imageFile);

        const titleJson = formData.get('title')?.toString();
        if (!titleJson) {
            return NextResponse.json({ success: false, message: 'Missing title field' }, { status: 400 });
        }

        let title;
        try {
            title = JSON.parse(titleJson);
            if (!title.en || !title.kn) {
                return NextResponse.json({ success: false, message: 'Both English and Kannada titles are required' }, { status: 400 });
            }
        } catch (err) {
            if (err instanceof Error) {

                return NextResponse.json({ success: false, message: 'Invalid title JSON' }, { status: 400 });
            }
        }

        const newCategory = new Category({
            categoryImage: imageUrl,
            title,
        });

        await newCategory.save();

        return NextResponse.json({
            message: 'Category created successfully',
            status: 201,
            success: true,
            data: newCategory,
        });

    } catch (err) {
        if (err instanceof Error) {
            return NextResponse.json({ success: false, message: 'Failed to create category' }, { status: 500 });

        }
    }
}
