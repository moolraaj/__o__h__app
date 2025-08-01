import {  NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/database/database';
import Notifications from '@/models/Notifications';
import Questionnaire from '@/models/Questionnaire';


export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const notificationId = (await params).id;
  console.log(`notificationId`)
  console.log(notificationId)
  const action = new URL(request.url).searchParams.get('action');

  try {
    await dbConnect();


    const notification = await Notifications.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    );

    if (!notification) {
      return NextResponse.json({ error: 'Notification not found.' }, { status: 404 });
    }


    const questionnaire = await Questionnaire.findById(notification.questionnaireId);
    if (!questionnaire) {
      return NextResponse.json({ error: 'Questionnaire not found.' }, { status: 404 });
    }

  
    if (questionnaire.adminAction === true) {
      return NextResponse.json({ error: 'This questionnaire has already been taken over by an admin.', status: 400 });
    }


    if (action === 'approve') {
      questionnaire.adminAction = true;
      questionnaire.assignTo = notification.userId;  
      questionnaire.status = 'submit';
      await questionnaire.save();
    } else {
      return NextResponse.json({ error: 'Invalid action.', status: 400 });
    }



    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error('PATCH error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}