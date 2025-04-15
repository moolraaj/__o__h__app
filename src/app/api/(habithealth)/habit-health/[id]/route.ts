import { NextRequest, NextResponse } from 'next/server';
import { EN, KN } from '@/utils/Constants';
import { getLanguage } from '@/utils/FilterLanguages';
import { dbConnect } from '@/database/database';
import HabitsHealth from '@/models/HabitsHealth';
import { IHabitHealthTypes } from '@/utils/Types';
import mongoose from 'mongoose';
import { uploadPhotoToCloudinary } from '@/utils/Cloudinary';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const lang = getLanguage(request);
        const id = (await params).id;
        const doc = (await HabitsHealth.findById(id).lean()) as IHabitHealthTypes | null;
        if (!doc) {
            return NextResponse.json({ success: false, message: 'Document not found' }, { status: 404 });
        }

        let localizedData;
        if (lang === EN || lang === KN) {
            localizedData = {
                _id: doc._id,
                habits_health_main_title: { [lang]: doc.habits_health_main_title?.[lang] || '' },
                habits_health_main_image: doc.habits_health_main_image,
                habits_health_heading: { [lang]: doc.habits_health_heading?.[lang] || '' },
                habits_health_para: { [lang]: doc.habits_health_para?.[lang] || '' },
                habits_health_icon: doc.habits_health_icon,
                habit_health_inner_title: { [lang]: doc.habit_health_inner_title?.[lang] || '' },
                habit_health_inner_repeater: doc.habit_health_inner_repeater,
                bad_habits_health_title: { [lang]: doc.bad_habits_health_title?.[lang] || '' },
                bad_habits_health_para: { [lang]: doc.bad_habits_health_para?.[lang] || '' },
                bad_habits_health_icon: doc.bad_habits_health_icon,
                bad_habits_health_repeater: doc.bad_habits_health_repeater,
                improve_health_habits_title: { [lang]: doc.improve_health_habits_title?.[lang] || '' },
                improve_health_habits_description: { [lang]: doc.improve_health_habits_description?.[lang] || '' },
                improve_health_habits_icon: doc.improve_health_habits_icon,
                improve_habits_health_repeater: doc.improve_habits_health_repeater,
                createdAt: doc.createdAt,
                updatedAt: doc.updatedAt,
            };
        } else {
            localizedData = doc;
        }
        return NextResponse.json({ status: 200, success: true, data: localizedData });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json(
                { success: false, message: 'Failed to fetch the document' },
                { status: 500 }
            );
        }

    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const id = (await params).id;
        const deletedDoc = await HabitsHealth.findByIdAndDelete(id);
        if (!deletedDoc) {
            return NextResponse.json({ status: 404, success: false, message: 'Document not found' },);
        }
        return NextResponse.json(
            { status: 200, success: true, message: 'Document deleted successfully' },

        );
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json(
                { status: 500, success: false, message: 'Failed to delete the document' },

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
                { success: false, message: 'Invalid HabitsHealth ID' },
                { status: 400 }
            );
        }
        const habitsDoc = await HabitsHealth.findById(id);
        if (!habitsDoc) {
            return NextResponse.json(
                { success: false, message: 'habithealth document not found' },
                { status: 404 }
            );
        }

        const formData = await req.formData();


        const updateBilingualField = (fieldName: string) => {
            const fieldValue = formData.get(fieldName)?.toString();
            if (fieldValue) {
                try {
                    const parsed = JSON.parse(fieldValue);
                    if (parsed.en !== undefined) {
                      
                        habitsDoc[fieldName].en = parsed.en;
                    }
                    if (parsed.kn !== undefined) {
                      
                        habitsDoc[fieldName].kn = parsed.kn;
                    }
                } catch (err) {
                    throw new Error(`Invalid ${err} - ${fieldName} JSON`);
                }
            }
        };


        const updateRepeaterField = (fieldName: string) => {
            const fieldValue = formData.get(fieldName)?.toString();
            if (fieldValue) {
                try {
                    const parsedArray = JSON.parse(fieldValue);
                    if (!Array.isArray(parsedArray)) {
                        throw new Error(`${fieldName} must be an array`);
                    }
                  
                    habitsDoc[fieldName] = parsedArray;
                } catch (err) {
                    throw new Error(`Invalid ${err} - ${fieldName} JSON`);
                }
            }
        };

        const updateImageField = async (
            fileFieldKey: string,
            textFieldKey: string,
            docFieldKey: string
        ) => {
            const fileField = formData.get(fileFieldKey);
            const textField = formData.get(textFieldKey);
            if (fileField && fileField instanceof File) {
           
                habitsDoc[docFieldKey] = await uploadPhotoToCloudinary(fileField);
            } else if (textField) {
              
                habitsDoc[docFieldKey] = textField.toString();
            }
        };

        updateBilingualField('habits_health_main_title');
        updateBilingualField('habits_health_heading');
        updateBilingualField('habits_health_para');
        updateBilingualField('habit_health_inner_title');
        updateBilingualField('bad_habits_health_title');
        updateBilingualField('bad_habits_health_para');
        updateBilingualField('improve_health_habits_title');
        updateBilingualField('improve_health_habits_description');

        updateRepeaterField('habit_health_inner_repeater');
        updateRepeaterField('bad_habits_health_repeater');
        updateRepeaterField('improve_habits_health_repeater');

        await updateImageField(
            'habits_health_main_image_file',
            'habits_health_main_image',
            'habits_health_main_image'
        );
        await updateImageField(
            'habits_health_icon_file',
            'habits_health_icon',
            'habits_health_icon'
        );
        await updateImageField(
            'bad_habits_health_icon_file',
            'bad_habits_health_icon',
            'bad_habits_health_icon'
        );
        await updateImageField(
            'improve_health_habits_icon_file',
            'improve_health_habits_icon',
            'improve_health_habits_icon'
        );

        await habitsDoc.save();

        return NextResponse.json({
            status: 200,
            success: true,
            message: 'habithealth updated successfully',
            data: habitsDoc,
        });
    } catch (err) {
        if (err instanceof Error) {
            return NextResponse.json(
                { success: false, message: err.message || 'Failed to update habithealth document' },
                { status: 500 }
            );
        }
    }
}

