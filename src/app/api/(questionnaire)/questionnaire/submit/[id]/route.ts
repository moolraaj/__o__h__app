import { NextResponse } from 'next/server';
import { dbConnect } from '@/database/database';
import Questionnaire from '@/models/Questionnaire';
import User from '@/models/User';

import { sendApprovalEmail } from '@/utils/Email';
import { createQuestionnaireVerificationToken } from '@/utils/Constants';
import admin from '@/firebasepusher/firebaseAdmin';
import Notifications from '@/models/Notifications';


export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const id = (await params).id;

    const questionnaire = await Questionnaire.findOne({ _id: id });
    if (!questionnaire) {
      return NextResponse.json({ error: 'Questionnaire not found', status: 404 });
    }

    if (questionnaire.status === 'submit') {
      return NextResponse.json({
        status: 200,
        message: "The questionnaire has already been submitted and cannot be sent again."
      });
    }

    questionnaire.status = 'submit';
    await questionnaire.save();

    const questionnaireData = questionnaire.toObject();
    // @ts-expect-error findOne may return null but we check below
    questionnaireData._id = questionnaireData._id.toString();

    const adminUsers = await User.find({ _id: { $in: questionnaire.send_to } });

    for (const adminUser of adminUsers) {
      if (
        (adminUser.role === "admin" || adminUser.role === "dantasurakshaks") &&
        adminUser.isVerified
      ) {
        const token = await createQuestionnaireVerificationToken(
          String(questionnaire._id),
          String(adminUser._id)
        );
        try {

          await sendApprovalEmail(
            questionnaireData,
            "questionnaire",
            token,
            [adminUser.email]
          );
          console.log(`Approval email sent to: ${adminUser.email}`);


          if (adminUser.fcmToken) {
            const message = {
              notification: {
                title: "New Questionnaire Submitted",
                body: `A questionnaire has been submitted for approval.`,
              },
              token: adminUser.fcmToken,
            };

            await admin.messaging().send(message);
            console.log(`Push notification sent to: ${adminUser.name}`);
          } else {
            console.log(`No FCM token for ${adminUser.name}`);
          }


          await Notifications.create({
            userId: adminUser._id,
            title: 'New Questionnaire Submitted',
            message: `A questionnaire has been submitted for your review.`,
            icon: 'assignment',
            read: false,
            createdAt: new Date()
          });


        } catch (err) {
          console.error(`Failed for ${adminUser.email}:`, err);
        }
      }
    }

    return NextResponse.json({
      status: 200,
      message: 'Questionnaire submitted for approval successfully.'
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message, status: 500 });
    }
    return NextResponse.json({ error: 'Unknown error occurred', status: 500 });
  }
}
