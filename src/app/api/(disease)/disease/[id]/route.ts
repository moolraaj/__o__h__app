import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/database/database';
import Disease from '@/models/Disease';
import { EN, KN } from '@/utils/Constants';
import { getLanguage } from '@/utils/FilterLanguages';
import mongoose from 'mongoose';
import { uploadPhotoToCloudinary } from '@/utils/Cloudinary';
import { Cause, CauseRepeat, DiseaseTypes, PreventionTip, PreventionTipRepeat, Symptom, SymptomRepeat, TreatmentOption, TreatmentOptionRepeat, WhatIsDiseaseDescriptionRepeater, WhatIsDiseaseRepeat } from '@/utils/Types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const id = (await params).id;
    const lang = getLanguage(request);

    const disease = await Disease.findById(id).lean<DiseaseTypes>();
    if (!disease) {
      return NextResponse.json(
        { success: false, message: 'Disease not found' },
        { status: 404 }
      );
    }
    let localizedDisease;
    if (lang === EN || lang === KN) {
      localizedDisease = {
        _id: disease._id,
        disease_main_title: { [lang]: disease.disease_main_title?.[lang] || '' },
        disease_main_image: disease.disease_main_image,
        disease_slug: { [lang]: disease.disease_slug?.[lang] || '' },
        disease_title: { [lang]: disease.disease_title?.[lang] || '' },
        disease_description: { [lang]: disease.disease_description?.[lang] || '' },
        disease_icon: disease.disease_icon,
        what_is_disease_tab_title: {
          [lang]: disease.what_is_disease_tab_title?.[lang] || '',
        },
        what_is_disease_repeat: disease.what_is_disease_repeat?.map(
          (repeatItem: WhatIsDiseaseRepeat) => ({
            what_is_disease_repeat_images: repeatItem.what_is_disease_repeat_images,
            what_is_disease_heading: {
              [lang]: repeatItem.what_is_disease_heading?.[lang] || '',
            },
            what_is_disease_disease_repeat_icon:
              repeatItem.what_is_disease_disease_repeat_icon,
            what_is_disease_disease_repeat_description: {
              [lang]: repeatItem.what_is_disease_disease_repeat_description?.[lang] || ''
            },
            what_is_disease_description_repeater:
              repeatItem.what_is_disease_description_repeater?.map(
                (descItem: WhatIsDiseaseDescriptionRepeater) => ({
                  what_is_disease_heading_repeat: {
                    [lang]:
                      descItem.what_is_disease_heading_repeat?.[lang] || '',
                  },
                  what_is_disease_description_repeat: {
                    [lang]:
                      descItem.what_is_disease_description_repeat?.[lang] || '',
                  },
                })
              ),
          })
        ),
        common_cause_tab_title: {
          [lang]: disease.common_cause_tab_title?.[lang] || '',
        },
        common_cause: disease.common_cause?.map((causeItem: Cause) => ({
          cause_title: { [lang]: causeItem.cause_title?.[lang] || '' },
          cause_icon: causeItem.cause_icon,
          cause_para: { [lang]: causeItem.cause_para?.[lang] || '' },
          cause_brief: { [lang]: causeItem.cause_brief?.[lang] || '' },
          cause_repeat: causeItem.cause_repeat?.map((repItem: CauseRepeat) => ({
            cause_repeat_title: { [lang]: repItem.cause_repeat_title?.[lang] || '' },
            cause_repeat_description: {
              [lang]: repItem.cause_repeat_description?.[lang] || '',
            },
            cause_repeat_icon: repItem.cause_repeat_icon,
          })),
        })),
        symptoms_tab_title: { [lang]: disease.symptoms_tab_title?.[lang] || '' },
        symptoms: disease.symptoms?.map((sympItem: Symptom) => ({
          symptoms_title: { [lang]: sympItem.symptoms_title?.[lang] || '' },
          symptoms_icon: sympItem.symptoms_icon,
          symptoms_para: { [lang]: sympItem.symptoms_para?.[lang] || '' },
          symptoms_brief: { [lang]: sympItem.symptoms_brief?.[lang] || '' },
          symptoms_repeat: sympItem.symptoms_repeat?.map((repItem: SymptomRepeat) => ({
            symptoms_repeat_title: {
              [lang]: repItem.symptoms_repeat_title?.[lang] || '',
            },
            symptoms_repeat_description: {
              [lang]: repItem.symptoms_repeat_description?.[lang] || '',
            },
            symptoms_repeat_icon: repItem.symptoms_repeat_icon,
          })),
        })),
        prevention_tips_tab_title: {
          [lang]: disease.prevention_tips_tab_title?.[lang] || '',
        },
        prevention_tips: disease.prevention_tips?.map((prevItem: PreventionTip) => ({
          prevention_tips_title: {
            [lang]: prevItem.prevention_tips_title?.[lang] || '',
          },
          prevention_tips_icon: prevItem.prevention_tips_icon,
          prevention_tips_para: { [lang]: prevItem.prevention_tips_para?.[lang] || '' },
          prevention_tips_brief: {
            [lang]: prevItem.prevention_tips_brief?.[lang] || '',
          },
          prevention_tips_repeat: prevItem.prevention_tips_repeat?.map(
            (repItem: PreventionTipRepeat) => ({
              prevention_tips_repeat_title: {
                [lang]: repItem.prevention_tips_repeat_title?.[lang] || '',
              },
              prevention_tips_repeat_description: {
                [lang]:
                  repItem.prevention_tips_repeat_description?.[lang] || '',
              },
              prevention_tips_repeat_icon: repItem.prevention_tips_repeat_icon,
            })
          ),
        })),
        treatment_option_tab_title: {
          [lang]: disease.treatment_option_tab_title?.[lang] || '',
        },
        treatment_option: disease.treatment_option?.map((treatItem: TreatmentOption) => ({
          treatment_option_title: {
            [lang]: treatItem.treatment_option_title?.[lang] || '',
          },
          treatment_option_icon: treatItem.treatment_option_icon,
          treatment_option_para: {
            [lang]: treatItem.treatment_option_para?.[lang] || '',
          },
          treatment_option_brief: {
            [lang]: treatItem.treatment_option_brief?.[lang] || '',
          },
          treatment_option_repeat: treatItem.treatment_option_repeat?.map(
            (repItem: TreatmentOptionRepeat) => ({
              treatment_option_repeat_title: {
                [lang]:
                  repItem.treatment_option_repeat_title?.[lang] || '',
              },
              treatment_option_repeat_description: {
                [lang]:
                  repItem.treatment_option_repeat_description?.[lang] || '',
              },
              treatment_option_repeat_icon: repItem.treatment_option_repeat_icon,
            })
          ),
        })),
        category: disease.category,
        createdAt: disease.createdAt,
        updatedAt: disease.updatedAt,
        __v: disease.__v,
      };
    } else {
      localizedDisease = disease;
    }

    return NextResponse.json({ success: true, data: localizedDisease }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, message: 'Failed to fetch disease' },
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
    const deletedDisease = await Disease.findByIdAndDelete(id);
    if (!deletedDisease) {
      return NextResponse.json(
        { success: false, message: 'Disease not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: true, message: 'Disease deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, message: 'Failed to delete disease' },
        { status: 500 }
      );
    }


  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const  id  = (await params).id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: 'Invalid ID' }, { status: 400 });
    }
    const disease = await Disease.findById(id);
    if (!disease) {
      return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    }

    const formData = await req.formData();
    const parseML = (key: string) => {
      const raw = formData.get(key)?.toString();
      return raw ? JSON.parse(raw) : undefined;
    };
    const parseArray = (key: string) => {
      const raw = formData.get(key)?.toString();
      if (!raw) return null;
      try { return JSON.parse(raw); } catch { throw new Error(`Invalid JSON for ${key}`); }
    };


    const fields = ['disease_main_title', 'disease_slug', 'disease_title', 'disease_description',
      'common_cause_tab_title', 'symptoms_tab_title', 'prevention_tips_tab_title', 'treatment_option_tab_title'];
    for (const key of fields) {
      const val = parseML(key);
      if (val !== undefined) (disease)[key] = val;
    }

    const mainImg = formData.get('disease_main_image') as File;
    if (mainImg?.size) disease.disease_main_image = await uploadPhotoToCloudinary(mainImg);
    const iconFile = formData.get('disease_icon') as File;
    if (iconFile?.size) disease.disease_icon = await uploadPhotoToCloudinary(iconFile);


    const repeaterKeys = ['common_cause', 'symptoms', 'prevention_tips', 'treatment_option'];
    for (const key of repeaterKeys) {
      const arr = parseArray(key);
      if (Array.isArray(arr)) (disease)[key] = arr;
    }

    await disease.save();
    return NextResponse.json({ success: true, status: 200, message: 'Disease updated', data: disease });
  } catch (err) {
    return NextResponse.json({ success: false, message: err instanceof Error ? err.message : 'Update failed' }, { status: 500 });
  }
}





