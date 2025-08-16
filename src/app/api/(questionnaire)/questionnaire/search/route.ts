import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/database/database";
import Questionnaire from "@/models/Questionnaire";
import { ReusePaginationMethod } from "@/utils/Pagination";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { page, limit, skip } = ReusePaginationMethod(req);
    const searchParams = req.nextUrl.searchParams;

 
    const name = searchParams.get("name");
    const gender = searchParams.get("gender");
    const age = searchParams.get("age");
    const phoneNumber = searchParams.get("phoneNumber");
    const caseNumber = searchParams.get("case_number");
    const assignTo = searchParams.get("assignTo");

 
    const filter: any = {};

    if (name) filter.name = new RegExp(name, "i");  
    if (gender) filter.gender = gender;
    if (age) filter.age = Number(age);
    if (phoneNumber) filter.phoneNumber = new RegExp(phoneNumber, "i");
    if (caseNumber) filter.case_number = new RegExp(caseNumber, "i");
    if (assignTo) filter.assignTo = assignTo;

    const questionnaires = await Questionnaire.find(filter)
      .select('+questionary_type +diagnosis_notes +recomanded_actions +comments_or_notes +send_email_to_dantasurakshaks')
      .populate('assignTo', 'name phoneNumber')
      .populate('submitted_by', 'name phoneNumber')
      .skip(skip)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

     
    questionnaires.forEach((q) => {
      if (q.send_email_to_dantasurakshaks !== true) {
        delete q.questionary_type;
        delete q.diagnosis_notes;
        delete q.recomanded_actions;
        delete q.comments_or_notes;
      }
    });

    const totalResults = await Questionnaire.countDocuments(filter);

    return NextResponse.json({
      status: 200,
      success: true,
      data: questionnaires,
      page,
      limit,
      totalResults,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
