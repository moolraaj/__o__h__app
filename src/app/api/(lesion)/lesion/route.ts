// app/api/lesion/route.ts  (or wherever your GET-all lives)
import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/database/database';
import { ReusePaginationMethod } from '@/utils/Pagination';
import { LesionModel } from '@/models/Lesion';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { page, skip, limit } = ReusePaginationMethod(req);

    const lesions = await LesionModel.find()
     
      .select('+lesion_type +diagnosis_notes +recomanded_actions +comments_or_notes +send_email_to_dantasurakshaks')
   
      .populate('assignTo', 'name phoneNumber')
      .skip(skip)
      .limit(limit)
      .lean();

    const totalLesions = await LesionModel.countDocuments();

    const filteredLesions = lesions.map(lesion => {
      if (lesion.send_email_to_dantasurakshaks !== true) {
        delete lesion.lesion_type;
        delete lesion.diagnosis_notes;
        delete lesion.recomanded_actions;
        delete lesion.comments_or_notes;
      }
      return lesion;
    });

    return NextResponse.json({
      message: 'Lesions retrieved successfully!',
      status: 200,
      lesions: filteredLesions,
      totalLesions,
      page,
      limit
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: 'Error retrieving lesions', error: error.message },
        { status: 500 }
      );
    }
  }
}
