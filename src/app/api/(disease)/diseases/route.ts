import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/database/database';
import Disease from '@/models/Disease';
import { EN, KN } from '@/utils/Constants';
import { getLanguage } from '@/utils/FilterLanguages';
import { ReusePaginationMethod } from '@/utils/Pagination';
import { Cause, CauseRepeat, PreventionTip, PreventionTipRepeat, Symptom, SymptomRepeat, TreatmentOption, TreatmentOptionRepeat, WhatIsDiseaseDescriptionRepeater, WhatIsDiseaseRepeat } from '@/utils/Types';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const lang = getLanguage(request);
    const { page, skip, limit } = ReusePaginationMethod(request);

    const allDiseases = await Disease.find().limit(limit).skip(skip).lean();
    const totalResults = await Disease.countDocuments();

    const localizedData = allDiseases.map((item) => {
      if (lang === EN || lang === KN) {
        return {
          _id: item._id,
          disease_main_title: { [lang]: item.disease_main_title?.[lang] || '' },
          disease_main_image: item.disease_main_image,
          disease_slug: { [lang]: item.disease_slug?.[lang] || '' },
          disease_title: { [lang]: item.disease_title?.[lang] || '' },
          disease_description: { [lang]: item.disease_description?.[lang] || '' },
          disease_icon: item.disease_icon,
          what_is_disease_tab_title: { [lang]: item.what_is_disease_tab_title?.[lang] || '' },
          what_is_disease_repeat: item.what_is_disease_repeat?.map((repeatItem: WhatIsDiseaseRepeat) => ({
            what_is_disease_repeat_images: repeatItem.what_is_disease_repeat_images,
            what_is_disease_heading: { [lang]: repeatItem.what_is_disease_heading?.[lang] || '' },
            what_is_disease_disease_repeat_icon: repeatItem.what_is_disease_disease_repeat_icon,
            what_is_disease_description_repeater: repeatItem.what_is_disease_description_repeater?.map((descItem: WhatIsDiseaseDescriptionRepeater) => ({
              what_is_disease_heading_repeat: { [lang]: descItem.what_is_disease_heading_repeat?.[lang] || '' },
              what_is_disease_description_repeat: { [lang]: descItem.what_is_disease_description_repeat?.[lang] || '' },
            })),
          })),
          common_cause_tab_title: { [lang]: item.common_cause_tab_title?.[lang] || '' },
          common_cause: item.common_cause?.map((causeItem: Cause) => ({
            cause_title: { [lang]: causeItem.cause_title?.[lang] || '' },
            cause_icon: causeItem.cause_icon,
            cause_para: { [lang]: causeItem.cause_para?.[lang] || '' },
            cause_brief: { [lang]: causeItem.cause_brief?.[lang] || '' },
            cause_repeat: causeItem.cause_repeat?.map((repItem: CauseRepeat) => ({
              cause_repeat_title: { [lang]: repItem.cause_repeat_title?.[lang] || '' },
              cause_repeat_description: { [lang]: repItem.cause_repeat_description?.[lang] || '' },
              cause_repeat_icon: repItem.cause_repeat_icon,
            })),
          })),
          symptoms_tab_title: { [lang]: item.symptoms_tab_title?.[lang] || '' },
          symptoms: item.symptoms?.map((sympItem: Symptom) => ({
            symptoms_title: { [lang]: sympItem.symptoms_title?.[lang] || '' },
            symptoms_icon: sympItem.symptoms_icon,
            symptoms_para: { [lang]: sympItem.symptoms_para?.[lang] || '' },
            symptoms_brief: { [lang]: sympItem.symptoms_brief?.[lang] || '' },
            symptoms_repeat: sympItem.symptoms_repeat?.map((repItem: SymptomRepeat) => ({
              symptoms_repeat_title: { [lang]: repItem.symptoms_repeat_title?.[lang] || '' },
              symptoms_repeat_description: { [lang]: repItem.symptoms_repeat_description?.[lang] || '' },
              symptoms_repeat_icon: repItem.symptoms_repeat_icon,
            })),
          })),
          prevention_tips_tab_title: { [lang]: item.prevention_tips_tab_title?.[lang] || '' },
          prevention_tips: item.prevention_tips?.map((prevItem: PreventionTip) => ({
            prevention_tips_title: { [lang]: prevItem.prevention_tips_title?.[lang] || '' },
            prevention_tips_icon: prevItem.prevention_tips_icon,
            prevention_tips_para: { [lang]: prevItem.prevention_tips_para?.[lang] || '' },
            prevention_tips_brief: { [lang]: prevItem.prevention_tips_brief?.[lang] || '' },
            prevention_tips_repeat: prevItem.prevention_tips_repeat?.map((repItem: PreventionTipRepeat) => ({
              prevention_tips_repeat_title: { [lang]: repItem.prevention_tips_repeat_title?.[lang] || '' },
              prevention_tips_repeat_description: { [lang]: repItem.prevention_tips_repeat_description?.[lang] || '' },
              prevention_tips_repeat_icon: repItem.prevention_tips_repeat_icon,
            })),
          })),
          treatment_option_tab_title: { [lang]: item.treatment_option_tab_title?.[lang] || '' },
          treatment_option: item.treatment_option?.map((treatItem: TreatmentOption) => ({
            treatment_option_title: { [lang]: treatItem.treatment_option_title?.[lang] || '' },
            treatment_option_icon: treatItem.treatment_option_icon,
            treatment_option_para: { [lang]: treatItem.treatment_option_para?.[lang] || '' },
            treatment_option_brief: { [lang]: treatItem.treatment_option_brief?.[lang] || '' },
            treatment_option_repeat: treatItem.treatment_option_repeat?.map((repItem: TreatmentOptionRepeat) => ({
              treatment_option_repeat_title: { [lang]: repItem.treatment_option_repeat_title?.[lang] || '' },
              treatment_option_repeat_description: { [lang]: repItem.treatment_option_repeat_description?.[lang] || '' },
              treatment_option_repeat_icon: repItem.treatment_option_repeat_icon,
            })),
          })),
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
    if(error instanceof Error){
        return NextResponse.json({ success: false, message: 'Failed to fetch diseases' }, { status: 500 });
    }

  }
}
