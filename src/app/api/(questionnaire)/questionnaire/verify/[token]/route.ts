 

import { NextResponse } from 'next/server';
import { dbConnect } from '@/database/database';
import Questionnaire from '@/models/Questionnaire';
import VerificationToken from '@/models/VerificationToken';

export async function GET(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const token  = (await params).token;
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  try {
    await dbConnect();
    const verifyToken = await VerificationToken.findOne({ token });
    if (!verifyToken) {
      return NextResponse.json({ error: 'Invalid or expired token.' , status: 400 });
    }
    const questionnaire = await Questionnaire.findById(verifyToken.userId);
    if (!questionnaire) {
      return NextResponse.json({ error: 'Questionnaire not found.' , status: 404 });
    }
    if (action === 'approve') {
      questionnaire.adminAction = true;
    } else {
      return NextResponse.json({ error: 'Invalid action.', status: 400 });
    }
    await questionnaire.save();
    await VerificationToken.deleteOne({ token });
    return NextResponse.json({status: 200, message: `Questionnaire ${action}d successfully!` });
  } catch (error) {
    if(error instanceof Error){
      return NextResponse.json({ error: error.message , status: 500 });

    }
  }
}
