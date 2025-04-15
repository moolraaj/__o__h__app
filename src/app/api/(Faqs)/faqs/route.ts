
import { NextRequest, NextResponse } from 'next/server';

import { EN, KN } from '@/utils/Constants';
import { getLanguage } from '@/utils/FilterLanguages';
import { ReusePaginationMethod } from '@/utils/Pagination';
import { dbConnect } from '@/database/database';
import FaqModel from '@/models/Faqs';
import { FaqsQuestion } from '@/utils/Types';

export async function GET(request: NextRequest) {
    try {
        await dbConnect();
        const lang = getLanguage(request);
        const { page, skip, limit } = ReusePaginationMethod(request);

        const allFaqs = await FaqModel.find().limit(limit).skip(skip).lean();
        const totalResults = await FaqModel.countDocuments();

        const localizedData = allFaqs.map((item) => {

            if (lang === EN || lang === KN) {
                return {
                    _id: item._id,
                    dental_caries_title: { [lang]: item.dental_caries_title?.[lang] || '' },
                    dental_caries: item.dental_caries?.map((entry: FaqsQuestion) => ({
                        question: { [lang]: entry.question?.[lang] || '' },
                        answer: { [lang]: entry.answer?.[lang] || '' },
                    })),
                    gum_diseases_title: { [lang]: item.gum_diseases_title?.[lang] || '' },
                    gum_disease: item.gum_disease?.map((entry: FaqsQuestion) => ({
                        question: { [lang]: entry.question?.[lang] || '' },
                        answer: { [lang]: entry.answer?.[lang] || '' },
                    })),
                    edentulism_title: { [lang]: item.edentulism_title?.[lang] || '' },
                    edentulism: item.edentulism?.map((entry: FaqsQuestion) => ({
                        question: { [lang]: entry.question?.[lang] || '' },
                        answer: { [lang]: entry.answer?.[lang] || '' },
                    })),
                    oral_cancer_title: { [lang]: item.oral_cancer_title?.[lang] || '' },
                    oral_cancer: item.oral_cancer?.map((entry: FaqsQuestion) => ({
                        question: { [lang]: entry.question?.[lang] || '' },
                        answer: { [lang]: entry.answer?.[lang] || '' },
                    })),
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt,
                };
            } else {

                return item;
            }
        });

        return NextResponse.json(
            {
                status: 200,
                success: true,
                result: localizedData,
                totalResults,
                page,
                limit,
            },

        );
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json(
                { success: false, message: 'Failed to fetch FAQs' },
                { status: 500 }
            );
        }
    }
}
