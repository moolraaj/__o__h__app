import { dbConnect } from '@/database/database';
import MythFact from '@/models/MythFact';
import { EN, KN } from '@/utils/Constants';
import { getLanguage } from '@/utils/FilterLanguages';
import { ReusePaginationMethod } from '@/utils/Pagination';
import { FaqsRightFacts,   FaqsWrongFacts } from '@/utils/Types';
 
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const lang = getLanguage(request);
    const { page, skip, limit } = ReusePaginationMethod(request);

    const allFacts = await MythFact.find().limit(limit).skip(skip).lean();
    const totalResults = await MythFact.countDocuments();

    const localizedData = allFacts.map((item) => {
      if (lang === EN || lang === KN) {
        return {
          _id: item._id,
          myth_fact_image: item.myth_fact_image,
          myth_fact_title: { [lang]: item.myth_fact_title?.[lang] || '' },
          myth_fact_body: { [lang]: item.myth_fact_body?.[lang] || '' },
          myth_fact_heading: { [lang]: item.myth_fact_heading?.[lang] || '' },
          myth_fact_description: { [lang]: item.myth_fact_description?.[lang] || '' },
          myths_facts_wrong_fact: item.myths_facts_wrong_fact?.map((fact: FaqsWrongFacts) => ({
            [lang]: fact?.[lang] || '',
          })) || [],
          myths_facts_right_fact: item.myths_facts_right_fact?.map((fact: FaqsRightFacts) => ({
            [lang]: fact?.[lang] || '',
          })) || [],
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          __v: item.__v,
        };
      } else {
 
        return item;
      }
    });

    return NextResponse.json({
      status: 200,
      success: true,
      result: localizedData,
      totalResults,
      page,
      limit,
    });

  } catch (error) {
    console.error('Get MythFacts Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch myths & facts' }, { status: 500 });
  }
}
