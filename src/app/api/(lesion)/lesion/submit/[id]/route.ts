import { dbConnect } from "@/database/database";
import { LesionModel } from "@/models/Lesion";
import User from "@/models/User";
import { createVerificationToken } from "@/utils/Constants";
import { sendApprovalEmail } from "@/utils/Email";
import { LesionEmailData } from "@/utils/Types";
 
import { NextResponse } from "next/server";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const id  = (await params).id;
    const lesion = await LesionModel.findOne({ _id: id });
    if (!lesion) {
      return NextResponse.json({ error: 'Lesion record not found' , status: 404 });
    }
    if (lesion.status === 'submit') {
      return NextResponse.json(
        { status: 200, "message": "The lesion has already been submitted and cannot be sent again." },
      
      );
    }
    lesion.status = 'submit';
    await lesion.save();
    const token = await createVerificationToken(String(lesion._id));
    const lesionData = lesion.toObject();
    lesionData._id = String(lesionData._id);
    const adminIds = lesion.send_to;
    const adminUsers = await User.find({ _id: { $in: adminIds } });
    const adminEmails = adminUsers.map(admin => admin.email);
    await sendApprovalEmail(lesionData as unknown as LesionEmailData, "lesion", token, adminEmails);
    return NextResponse.json(
      { status: 200, message: 'Lesion submitted for approval successfully.' },
     
    );
  } catch (error) {
    if(error instanceof Error){
      return NextResponse.json({ error: error.message , status: 500 });
    }
    
  }
}