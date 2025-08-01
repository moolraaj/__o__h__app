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
    const questionnaire = await Questionnaire.findOne({ _id: id }).populate('submitted_by');
    console.log(`questionnaire`)
    console.log(questionnaire)
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
    //@ts-expect-error ignore this 
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
                //@ts-expect-error ignore this 
                body: `A questionnaire from ${questionnaire.submitted_by.name} has been submitted for your approval.`,
              },
              token: adminUser.fcmToken,
              android: {
                priority: "high",
                notification: {
                  channelId: "default",
                  sound: "default",
                },
              },
              apns: {
                payload: {
                  aps: {
                    sound: "default",
                  },
                },
              },
            };

            try {
              //@ts-expect-error ignore this 
              await admin.messaging().send(message);
              console.log(`Push notification sent to: ${adminUser.name}`);
            } catch (pushError) {
              //@ts-expect-error ignore this 
              console.error(`Push notification failed for ${adminUser.email}:`, pushError.message);

              if (
                //@ts-expect-error ignore this 
                pushError?.errorInfo?.code === 'messaging/registration-token-not-registered' ||
                //@ts-expect-error ignore this 
                pushError?.errorInfo?.code === 'messaging/invalid-argument'
              ) {
                console.warn(`Invalid FCM token for ${adminUser.email}. Consider removing it.`);
              }
            }
          } else {
            console.log(`No FCM token for ${adminUser.name}`);
          }

          await Notifications.create({
            userId: adminUser._id,
            title: 'New Questionnaire Submitted',
            //@ts-expect-error ignore this 
            message: `A questionnaire from ${questionnaire.submitted_by.name} has been submitted for your approval.`,
            questionnaire_Id: questionnaire._id, 
            icon: 'assignment',
            read: false,
            createdAt: new Date(),
          });
        } catch (err) {
          console.error(`Failed for ${adminUser.email}:`, err);
        }
      }
    }

    return NextResponse.json({
      status: 200,
      message: 'Questionnaire submitted for approval successfully.',
    });
  } catch (error) {
    console.error('Unexpected server error:', error);
    return NextResponse.json({ error: 'Server error', status: 500 });
  }
}
