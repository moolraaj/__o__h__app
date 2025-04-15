
import { NextRequest, NextResponse } from 'next/server';
import { EN, KN } from '@/utils/Constants';
import { getLanguage } from '@/utils/FilterLanguages';
import { dbConnect } from '@/database/database';
import DentalEmergency from '@/models/DentalEmergency';
import { DentalEmergencyTypes, Language } from '@/utils/Types';
import mongoose from 'mongoose';
import { uploadPhotoToCloudinary } from '@/utils/Cloudinary';

interface RouteContext {
    params: Promise<{
        id: string;
    }>;
}


export async function GET(request: NextRequest, { params }: RouteContext) {
    try {
        await dbConnect();
        const id = (await params).id;
        const lang = getLanguage(request);

        const doc = (await DentalEmergency.findById(id).lean()) as DentalEmergencyTypes | null;
        if (!doc) {
            return NextResponse.json(
                { status: 404, success: false, message: 'Dental Emergency not found' },

            );
        }
        let localizedDoc;
        if (lang === EN || lang === KN) {
            localizedDoc = {
                _id: doc._id,
                dental_emergency_title: { [lang]: doc.dental_emergency_title?.[lang] || '' },
                dental_emergency_image: doc.dental_emergency_image,
                dental_emergency_heading: { [lang]: doc.dental_emergency_heading?.[lang] || '' },
                dental_emergency_para: { [lang]: doc.dental_emergency_para?.[lang] || '' },
                dental_emergency_icon: doc.dental_emergency_icon,
                dental_emergency_inner_title: { [lang]: doc.dental_emergency_inner_title?.[lang] || '' },
                dental_emergency_inner_para: { [lang]: doc.dental_emergency_inner_para?.[lang] || '' },
                dental_emergency_inner_icon: doc.dental_emergency_inner_icon,
                dental_emer_title: { [lang]: doc.dental_emer_title?.[lang] || '' },
                dental_emer_sub_title: { [lang]: doc.dental_emer_sub_title?.[lang] || '' },
                dental_emer_repeater: doc.dental_emer_repeater,
                createdAt: doc.createdAt,
                updatedAt: doc.updatedAt,
            };
        } else {
            localizedDoc = doc;
        }
        return NextResponse.json(
            { status: 200, success: true, result: localizedDoc },

        );
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json(
                { status: 500, success: false, message: error.message },

            );
        }

    }
}


export async function DELETE(request: NextRequest, { params }: RouteContext) {
    try {
        await dbConnect();
        const id = (await params).id;
        const deletedDoc = await DentalEmergency.findByIdAndDelete(id).lean();
        if (!deletedDoc) {
            return NextResponse.json(
                { status: 404, success: false, message: 'Dental Emergency not found' },

            );
        }
        return NextResponse.json(
            { status: 200, success: true, message: 'Dental Emergency deleted successfully' }

        );
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json(
                { status: 500, success: false, message: error.message }
            );
        }

    }
}




export async function PUT(req: NextRequest, { params }: RouteContext) {
    try {
        await dbConnect();
        const id = (await params).id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, message: 'Invalid DentalEmergency ID' },
                { status: 400 }
            );
        }
        const formData = await req.formData();

        const updateData: Partial<DentalEmergencyTypes> = {};

        const updateBilingualField = (fieldName: keyof DentalEmergencyTypes) => {
            const fieldValue = formData.get(fieldName as string)?.toString();
            if (fieldValue) {
                try {
                    const parsed = JSON.parse(fieldValue);
                    const newValue: Language = {
                        en: parsed.en ?? "",
                        kn: parsed.kn ?? ""
                    };
                    (updateData[fieldName] as Language) = newValue;
                } catch (error) {
                    throw new Error(`Invalid JSON for ${fieldName}: ${error}`);
                }
            }
        };


        updateBilingualField('dental_emergency_title');
        updateBilingualField('dental_emergency_heading');
        updateBilingualField('dental_emergency_para');
        updateBilingualField('dental_emergency_inner_title');
        updateBilingualField('dental_emergency_inner_para');
        updateBilingualField('dental_emer_title');
        updateBilingualField('dental_emer_sub_title');

        const updateImageField = async <K extends keyof DentalEmergencyTypes>(
            fileFieldKey: string,
            docFieldKey: K
        ) => {
            const fileField = formData.get(fileFieldKey);
            if (fileField && fileField instanceof File && fileField.size > 0) {
                updateData[docFieldKey] = (await uploadPhotoToCloudinary(fileField)) as unknown as DentalEmergencyTypes[K];
            }
        };

        await updateImageField('dental_emergency_image', 'dental_emergency_image');
        await updateImageField('dental_emergency_icon', 'dental_emergency_icon');
        await updateImageField('dental_emergency_inner_icon', 'dental_emergency_inner_icon');

        const updatedDoc = await DentalEmergency.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );
        if (!updatedDoc) {
            return NextResponse.json(
                { success: false, message: 'DentalEmergency not found' },
                { status: 404 }
            );
        }
        return NextResponse.json({
            status: 200,
            success: true,
            message: 'DentalEmergency updated successfully',
            data: updatedDoc,
        });
    } catch (err) {
        if (err instanceof Error) {
            return NextResponse.json({
                status: 500,
                success: false,
                message: err.message || 'Failed to update DentalEmergency',
            });
        }
    }
}







