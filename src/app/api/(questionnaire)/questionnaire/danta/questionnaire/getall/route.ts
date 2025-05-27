import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/database/database';
import Questionnaire   from '@/models/Questionnaire';
import { ReusePaginationMethod } from '@/utils/Pagination';
import { Types, FilterQuery } from 'mongoose';
import { QuestionnaireTypes } from '@/utils/Types';

interface AssignToUser {
  _id: Types.ObjectId;
  name: string;
  phoneNumber: string;
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { userId, userRole } = await req.json();
    if (!userId || !userRole) {
      return NextResponse.json(
        { success: false, error: 'User ID and role are required' },
        { status: 400 }
      );
    }
    const { page, limit, skip } = ReusePaginationMethod(req);
    let query: FilterQuery<QuestionnaireTypes> = {};
    if (userRole === 'dantasurakshaks') {
      query = {
        send_email_to_dantasurakshaks: true,
      };
    }
    const [data, totalResults] = await Promise.all([
      Questionnaire.find(query)
        .select(
          '+questionary_type +diagnosis_notes +recomanded_actions +comments_or_notes +send_email_to_dantasurakshaks'
        )
        .populate<{ assignTo: AssignToUser }>([
          { path: 'assignTo', select: 'name phoneNumber' },
          { path: 'submitted_by', select: 'name' },
        ])
        .skip(skip)
        .limit(limit)
        .lean(),
      Questionnaire.countDocuments(query),
    ]);
    return NextResponse.json({
      status: 200,
      success: true,
      data,
      page,
      limit,
      totalResults,
    });
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json(
        { success: false, error: err.message || 'Server error' },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Unknown server error' },
      { status: 500 }
    );
  }
}
