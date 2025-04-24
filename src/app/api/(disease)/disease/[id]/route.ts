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




export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const id = (await params).id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid ID' },
        { status: 400 }
      );
    }

    const disease = await Disease.findById(id);
    if (!disease) {
      return NextResponse.json(
        { success: false, message: 'Disease not found' },
        { status: 404 }
      );
    }

    const formData = await req.formData();


    const parseField = (key: string) => {
      const raw = formData.get(key)?.toString();
      if (raw) return JSON.parse(raw);
      return null;
    };


    const disease_main_image_file = formData.get('disease_main_image') as File | null;
    if (disease_main_image_file && disease_main_image_file.size > 0) {
      const imageUrl = await uploadPhotoToCloudinary(disease_main_image_file);
      disease.disease_main_image = imageUrl;
    }


    const disease_main_title = parseField('disease_main_title');
    if (disease_main_title) disease.disease_main_title = disease_main_title;

    const disease_slug = parseField('disease_slug');
    if (disease_slug) disease.disease_slug = disease_slug;

    const disease_title = parseField('disease_title');
    if (disease_title) disease.disease_title = disease_title;

    const disease_description = parseField('disease_description');
    if (disease_description) disease.disease_description = disease_description;


    const disease_icon_file = formData.get('disease_icon') as File | null;
    if (disease_icon_file && disease_icon_file.size > 0) {
      const iconUrl = await uploadPhotoToCloudinary(disease_icon_file);
      disease.disease_icon = iconUrl;
    }


    const what_is_disease_tab_title = parseField('what_is_disease_tab_title');
    if (what_is_disease_tab_title) disease.what_is_disease_tab_title = what_is_disease_tab_title;

    let what_is_disease_repeat = parseField('what_is_disease_repeat');
    if (what_is_disease_repeat) {
      what_is_disease_repeat = await Promise.all(
        what_is_disease_repeat.map(async (item: WhatIsDiseaseRepeat, index: number) => {

          let imageUrls: string[] = [];

          if (Array.isArray(item.what_is_disease_repeat_images)) {
            imageUrls = item.what_is_disease_repeat_images
              .filter((img): img is string => typeof img === 'string' && img.trim() !== '')
              .map(img => img.trim());
          }
          

          if (imageUrls.length === 0) {
            const files = formData.getAll(`what_is_disease_repeat_images${index}`) as File[];
            if (files.length) {
              imageUrls = await Promise.all(
                files.map(async (file) => (file && file.name) ? await uploadPhotoToCloudinary(file) : '')
              );
              imageUrls = imageUrls.filter(url => url !== '');
            }
          }
          return {
            ...item,
            what_is_disease_repeat_images: imageUrls,
          };
        })
      );
      disease.what_is_disease_repeat = what_is_disease_repeat;
    }


    const common_cause_tab_title = parseField('common_cause_tab_title');
    if (common_cause_tab_title) disease.common_cause_tab_title = common_cause_tab_title;

    let common_cause = parseField('common_cause');
    if (common_cause) {
      common_cause = await Promise.all(
        common_cause.map(async (item: Cause, index: number) => {
          let iconUrl = item.cause_icon;
          if (!iconUrl || typeof iconUrl !== 'string' || iconUrl.trim() === '') {
            const file = formData.get(`cause_icon${index}`) as File;
            if (file && file.size > 0) {
              iconUrl = await uploadPhotoToCloudinary(file);
            } else {
              iconUrl = '';
            }
          }
          let cause_repeat = item.cause_repeat || [];
          cause_repeat = await Promise.all(
            cause_repeat.map(async (rep: CauseRepeat, repIndex: number) => {
              let repIconUrl = rep.cause_repeat_icon;
              if (!repIconUrl || typeof repIconUrl !== 'string' || repIconUrl.trim() === '') {
                const file = formData.get(`cause_repeat_icon${index}_${repIndex}`) as File;
                if (file && file.size > 0) {
                  repIconUrl = await uploadPhotoToCloudinary(file);
                } else {
                  repIconUrl = '';
                }
              }
              return { ...rep, cause_repeat_icon: repIconUrl };
            })
          );
          return { ...item, cause_icon: iconUrl, cause_repeat };
        })
      );
      disease.common_cause = common_cause;
    }


    const symptoms_tab_title = parseField('symptoms_tab_title');
    if (symptoms_tab_title) disease.symptoms_tab_title = symptoms_tab_title;

    let symptoms = parseField('symptoms');
    if (symptoms) {
      symptoms = await Promise.all(
        symptoms.map(async (item: Symptom, index: number) => {
          let iconUrl = item.symptoms_icon;
          if (!iconUrl || typeof iconUrl !== 'string' || iconUrl.trim() === '') {
            const file = formData.get(`symptoms_icon${index}`) as File;
            if (file && file.size > 0) {
              iconUrl = await uploadPhotoToCloudinary(file);
            } else {
              iconUrl = '';
            }
          }
          let symptoms_repeat = item.symptoms_repeat || [];
          symptoms_repeat = await Promise.all(
            symptoms_repeat.map(async (rep: SymptomRepeat, repIndex: number) => {
              let repIconUrl = rep.symptoms_repeat_icon;
              if (!repIconUrl || typeof repIconUrl !== 'string' || repIconUrl.trim() === '') {
                const file = formData.get(`symptoms_repeat_icon${index}_${repIndex}`) as File;
                if (file && file.size > 0) {
                  repIconUrl = await uploadPhotoToCloudinary(file);
                } else {
                  repIconUrl = '';
                }
              }
              return { ...rep, symptoms_repeat_icon: repIconUrl };
            })
          );
          return { ...item, symptoms_icon: iconUrl, symptoms_repeat };
        })
      );
      disease.symptoms = symptoms;
    }


    const prevention_tips_tab_title = parseField('prevention_tips_tab_title');
    if (prevention_tips_tab_title) disease.prevention_tips_tab_title = prevention_tips_tab_title;

    let prevention_tips = parseField('prevention_tips');
    if (prevention_tips) {
      prevention_tips = await Promise.all(
        prevention_tips.map(async (item: PreventionTip, index: number) => {
          let iconUrl = item.prevention_tips_icon;
          if (!iconUrl || typeof iconUrl !== 'string' || iconUrl.trim() === '') {
            const file = formData.get(`prevention_tips_icon${index}`) as File;
            if (file && file.size > 0) {
              iconUrl = await uploadPhotoToCloudinary(file);
            } else {
              iconUrl = '';
            }
          }
          let prevention_tips_repeat = item.prevention_tips_repeat || [];
          prevention_tips_repeat = await Promise.all(
            prevention_tips_repeat.map(async (rep: PreventionTipRepeat, repIndex: number) => {
              let repIconUrl = rep.prevention_tips_repeat_icon;
              if (!repIconUrl || typeof repIconUrl !== 'string' || repIconUrl.trim() === '') {
                const file = formData.get(`prevention_tips_repeat_icon${index}_${repIndex}`) as File;
                if (file && file.size > 0) {
                  repIconUrl = await uploadPhotoToCloudinary(file);
                } else {
                  repIconUrl = '';
                }
              }
              return { ...rep, prevention_tips_repeat_icon: repIconUrl };
            })
          );
          return { ...item, prevention_tips_icon: iconUrl, prevention_tips_repeat };
        })
      );
      disease.prevention_tips = prevention_tips;
    }


    const treatment_option_tab_title = parseField('treatment_option_tab_title');
    if (treatment_option_tab_title) disease.treatment_option_tab_title = treatment_option_tab_title;

    let treatment_option = parseField('treatment_option');
    if (treatment_option) {
      treatment_option = await Promise.all(
        treatment_option.map(async (item: TreatmentOption, index: number) => {
          let iconUrl = item.treatment_option_icon;
          if (!iconUrl || typeof iconUrl !== 'string' || iconUrl.trim() === '') {
            const file = formData.get(`treatment_option_icon${index}`) as File;
            if (file && file.size > 0) {
              iconUrl = await uploadPhotoToCloudinary(file);
            } else {
              iconUrl = '';
            }
          }
          let treatment_option_repeat = item.treatment_option_repeat || [];
          treatment_option_repeat = await Promise.all(
            treatment_option_repeat.map(async (rep: TreatmentOptionRepeat, repIndex: number) => {
              let repIconUrl = rep.treatment_option_repeat_icon;
              if (!repIconUrl || typeof repIconUrl !== 'string' || repIconUrl.trim() === '') {
                const file = formData.get(`treatment_option_repeat_icon${index}_${repIndex}`) as File;
                if (file && file.size > 0) {
                  repIconUrl = await uploadPhotoToCloudinary(file);
                } else {
                  repIconUrl = '';
                }
              }
              return { ...rep, treatment_option_repeat_icon: repIconUrl };
            })
          );
          return { ...item, treatment_option_icon: iconUrl, treatment_option_repeat };
        })
      );
      disease.treatment_option = treatment_option;
    }


    await disease.save();

    return NextResponse.json({
      status: 200,
      success: true,
      message: 'Disease updated successfully',
      data: disease,
    });
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json(
        { success: false, message: (err instanceof Error ? err.message : 'Failed to update disease') },
        { status: 500 }
      );

    }
  }
}



