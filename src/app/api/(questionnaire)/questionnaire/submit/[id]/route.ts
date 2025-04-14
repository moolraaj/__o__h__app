import { NextResponse } from 'next/server';
import { dbConnect } from '@/database/database';
import Questionnaire from '@/models/Questionnaire';
import User from '@/models/User';
import { createVerificationToken } from '@/utils/Constants';
import { sendApprovalEmail } from '@/utils/Email';

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
    const token = await createVerificationToken(String(questionnaire._id));
    const questionnaireData = questionnaire.toObject();
    questionnaireData._id = questionnaireData._id;
    const adminIds = questionnaire.send_to;
    const adminUsers = await User.find({ _id: { $in: adminIds } });

     const verifiedAdminEmails = adminUsers
      

      .filter(admin => {
        
        console.log(`Admin ${admin.email} | Role: ${admin.role} | isVerified: ${admin.isVerified}`);
        return (admin.role === "admin" || admin.role === "dantasurakshaks") && admin.isVerified === true;
      })
      .map(admin => admin.email);
      
  
     if (verifiedAdminEmails.length > 0) {
      await sendApprovalEmail(questionnaireData, "questionnaire", token, verifiedAdminEmails);
      console.log("Approval email sent to:", verifiedAdminEmails);
    } else {
      console.log("No verified admin found. Approval email not sent.");
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
