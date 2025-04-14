import Questionnaire from "@/models/Questionnaire";
import { ReusePaginationMethod } from "@/utils/Pagination";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { page, limit, skip } = ReusePaginationMethod(req);

        const questionnaires = await Questionnaire.find()
            .select('+questionary_type +diagnosis_notes +recomanded_actions +comments_or_notes +send_email_to_dantasurakshaks')
            .skip(skip)
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

        const totalResults = await Questionnaire.countDocuments();

        return NextResponse.json({
            status: 200,
            success: true,
            data: questionnaires,
            page,
            limit,
            totalResults
        });
    } catch (err) {
        if (err instanceof Error) {
            return NextResponse.json(
                { success: false, error: err.message || 'Server error' },
                { status: 500 }
            );
        }
    }
}
