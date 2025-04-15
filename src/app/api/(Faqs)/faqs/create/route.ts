import { dbConnect } from "@/database/database";
import FaqModel from "@/models/Faqs";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
    await dbConnect();
    try {
        const formData = await request.formData();
        const getField = (key: string): string => {
            const value = formData.get(key);
            if (value === null) {
                throw new Error(`Missing field: ${key}`);
            }
            return value.toString();
        };
        const dental_caries_title = JSON.parse(getField('dental_caries_title'));
        const dental_caries = JSON.parse(getField('dental_caries'));
        const gum_diseases_title = JSON.parse(getField('gum_diseases_title'));
        const gum_disease = JSON.parse(getField('gum_disease'));
        const edentulism_title = JSON.parse(getField('edentulism_title'));
        const edentulism = JSON.parse(getField('edentulism'));
        const oral_cancer_title = JSON.parse(getField('oral_cancer_title'));
        const oral_cancer = JSON.parse(getField('oral_cancer'));
        const newFaq = new FaqModel({
            dental_caries_title,
            dental_caries,
            gum_diseases_title,
            gum_disease,
            edentulism_title,
            edentulism,
            oral_cancer_title,
            oral_cancer,
        });

        await newFaq.save();

        return NextResponse.json({ status: 201,success: true, data: newFaq });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json(
                { success: false, error: error.message || 'An error occurred' },
                { status: 400 }
            );
        }
    }
}
