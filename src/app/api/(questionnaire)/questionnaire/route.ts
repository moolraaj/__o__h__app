import Questionnaire from "@/models/Questionnaire";
import { ReusePaginationMethod } from "@/utils/Pagination";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { page, limit, skip } = ReusePaginationMethod(req)
        const questionnaires = await Questionnaire.find({}).skip(skip).limit(limit).exec();
        const totalResults = await Questionnaire.countDocuments()
        return NextResponse.json({status: 200, success: true, data: questionnaires, page, limit, totalResults });
    } catch (err) {
        if (err instanceof Error) {
            return NextResponse.json(
                { success: false, error: err.message || 'Server error' },
                { status: 500 }
            );
        }
    }
}