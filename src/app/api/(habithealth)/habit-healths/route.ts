import { NextRequest, NextResponse } from 'next/server';
import { EN, KN } from '@/utils/Constants';
import { getLanguage } from '@/utils/FilterLanguages';
import { ReusePaginationMethod } from '@/utils/Pagination';
import { dbConnect } from '@/database/database';
import HabitsHealth from '@/models/HabitsHealth';

export async function GET(request: NextRequest) {
    try {
        await dbConnect();
        const lang = getLanguage(request);
        const { page, skip, limit } = ReusePaginationMethod(request);

        const allDocs = await HabitsHealth.find().limit(limit).skip(skip).lean();
        const totalResults = await HabitsHealth.countDocuments();

        const localizedData = allDocs.map((item) => {
            if (lang === EN || lang === KN) {
                return {
                    _id: item._id,
                    habits_health_main_title: { [lang]: item.habits_health_main_title?.[lang] || '' },
                    habits_health_main_image: item.habits_health_main_image,
                    habits_health_heading: { [lang]: item.habits_health_heading?.[lang] || '' },
                    habits_health_para: { [lang]: item.habits_health_para?.[lang] || '' },
                    habits_health_icon: item.habits_health_icon,
                    habit_health_inner_title: { [lang]: item.habit_health_inner_title?.[lang] || '' },
                    habit_health_inner_repeater: item.habit_health_inner_repeater,
                    bad_habits_health_title: { [lang]: item.bad_habits_health_title?.[lang] || '' },
                    bad_habits_health_para: { [lang]: item.bad_habits_health_para?.[lang] || '' },
                    bad_habits_health_icon: item.bad_habits_health_icon,
                    bad_habits_health_repeater: item.bad_habits_health_repeater,
                    improve_health_habits_title: { [lang]: item.improve_health_habits_title?.[lang] || '' },
                    improve_health_habits_description: { [lang]: item.improve_health_habits_description?.[lang] || '' },
                    improve_health_habits_icon: item.improve_health_habits_icon,
                    improve_habits_health_repeater: item.improve_habits_health_repeater,
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
                { status: 500, success: false, message: 'Failed to fetch habits health documents' },

            );
        }
    }
}
