
import { NextRequest, NextResponse } from 'next/server';

import { EN, KN } from '@/utils/Constants';
import { getLanguage } from '@/utils/FilterLanguages';
import { dbConnect } from '@/database/database';
import FaqModel from '@/models/Faqs';
import { FaqsQuestion, FaqTypes } from '@/utils/Types';
import mongoose from 'mongoose';


export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const lang = getLanguage(request);
        const id = (await params).id;
        const faq = (await FaqModel.findById(id).lean()) as FaqTypes | null;
        if (!faq) {
            return NextResponse.json(
                { status: 200, success: false, message: 'FAQ not found' },

            );
        }
        let localizedFaq;
        if (lang === EN || lang === KN) {
            localizedFaq = {
                _id: faq._id,
                dental_caries_title: { [lang]: faq.dental_caries_title?.[lang] || '' },
                dental_caries: faq.dental_caries?.map((entry: FaqsQuestion) => ({
                    question: { [lang]: entry.question?.[lang] || '' },
                    answer: { [lang]: entry.answer?.[lang] || '' },
                })),
                gum_diseases_title: { [lang]: faq.gum_diseases_title?.[lang] || '' },
                gum_disease: faq.gum_disease?.map((entry: FaqsQuestion) => ({
                    question: { [lang]: entry.question?.[lang] || '' },
                    answer: { [lang]: entry.answer?.[lang] || '' },
                })),
                edentulism_title: { [lang]: faq.edentulism_title?.[lang] || '' },
                edentulism: faq.edentulism?.map((entry: FaqsQuestion) => ({
                    question: { [lang]: entry.question?.[lang] || '' },
                    answer: { [lang]: entry.answer?.[lang] || '' },
                })),
                oral_cancer_title: { [lang]: faq.oral_cancer_title?.[lang] || '' },
                oral_cancer: faq.oral_cancer?.map((entry: FaqsQuestion) => ({
                    question: { [lang]: entry.question?.[lang] || '' },
                    answer: { [lang]: entry.answer?.[lang] || '' },
                })),
                createdAt: faq.createdAt,
                updatedAt: faq.updatedAt,
            };
        } else {
            localizedFaq = faq;
        }
        return NextResponse.json({ status: 200, success: true, result: localizedFaq });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json(
                { success: false, message: 'Failed to fetch FAQ' },
                { status: 500 }
            );
        }
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const id = (await params).id;
        const deletedFaq = await FaqModel.findByIdAndDelete(id);
        if (!deletedFaq) {
            return NextResponse.json(
                { success: false, message: 'FAQ not found' },
                { status: 404 }
            );
        }
        return NextResponse.json({
            status: 200,
            success: true,
            message: 'FAQ deleted successfully',
        });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json(
                { success: false, message: 'Failed to delete FAQ' },
                { status: 500 }
            );
        }
    }
}


export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const id = (await params).id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, message: 'Invalid FAQ ID' },
                { status: 400 }
            );
        }
        const faq = await FaqModel.findById(id);
        if (!faq) {
            return NextResponse.json(
                { success: false, message: 'FAQ not found' },
                { status: 404 }
            );
        }
        const formData = await req.formData();
        const updateBilingualField = (fieldName: string) => {
            const fieldJson = formData.get(fieldName)?.toString();
            if (fieldJson) {
                try {
                    const parsed = JSON.parse(fieldJson);

                    if (parsed.en !== undefined) {
                     
                        faq[fieldName].en = parsed.en;
                    }
                    if (parsed.kn !== undefined) {
                      
                        faq[fieldName].kn = parsed.kn;
                    }
                } catch (err) {
                    throw new Error(`Invalid ${err} - ${fieldName} JSON`);
                }
            }
        };
        const updateRepeaterField = (fieldName: string) => {
            const fieldJson = formData.get(fieldName)?.toString();
            if (fieldJson) {
                try {
                    const parsedArray = JSON.parse(fieldJson);
                    if (!Array.isArray(parsedArray)) {
                        throw new Error(`${fieldName} must be an array`);
                    }
               
                    faq[fieldName] = parsedArray;
                } catch (err) {
                    throw new Error(`Invalid ${err} - ${fieldName} JSON`);
                }
            }
        };
        updateBilingualField('dental_caries_title');
        updateBilingualField('gum_diseases_title');
        updateBilingualField('edentulism_title');
        updateBilingualField('oral_cancer_title');
        updateRepeaterField('dental_caries');
        updateRepeaterField('gum_disease');
        updateRepeaterField('edentulism');
        updateRepeaterField('oral_cancer');

        await faq.save();

        return NextResponse.json({
            status: 200,
            success: true,
            message: 'FAQ updated successfully',
            data: faq,
        });
    } catch (err) {
        if (err instanceof Error) {
            return NextResponse.json(
                { success: false, message: err.message || 'Failed to update FAQ' },
                { status: 500 }
            );
        }

    }
}
