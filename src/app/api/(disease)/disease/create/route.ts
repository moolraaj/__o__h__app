// app/api/disease/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/database/database';
import { uploadPhotoToCloudinary } from '@/utils/Cloudinary';
import Disease from '@/models/Disease';
import {
  WhatIsDiseaseRepeat,
  Cause,
  Symptom,
  PreventionTip,
  TreatmentOption,
  CauseRepeat,
  SymptomRepeat,
  PreventionTipRepeat,
  TreatmentOptionRepeat
} from '@/utils/Types';
import Category from '@/models/Category';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const formData = await req.formData();

    // Main Fields
    const disease_main_title = formData.get('disease_main_title')?.toString()
      ? JSON.parse(formData.get('disease_main_title')!.toString())
      : {};
    let disease_main_image_url = '';
    const disease_main_image_file = formData.get('disease_main_image') as File;
    if (disease_main_image_file && disease_main_image_file.name) {
      disease_main_image_url = await uploadPhotoToCloudinary(disease_main_image_file);
    }
    const disease_slug = formData.get('disease_slug')?.toString()
      ? JSON.parse(formData.get('disease_slug')!.toString())
      : "";
    const disease_title = formData.get('disease_title')?.toString()
      ? JSON.parse(formData.get('disease_title')!.toString())
      : {};
    const disease_description = formData.get('disease_description')?.toString()
      ? JSON.parse(formData.get('disease_description')!.toString())
      : {};
    let disease_icon_url = '';
    const disease_icon_file = formData.get('disease_icon') as File;
    if (disease_icon_file && disease_icon_file.name) {
      disease_icon_url = await uploadPhotoToCloudinary(disease_icon_file);
    }

    // What Is Disease Section
    const what_is_disease_tab_title = formData.get('what_is_disease_tab_title')?.toString()
      ? JSON.parse(formData.get('what_is_disease_tab_title')!.toString())
      : {};
    let what_is_disease_repeat: WhatIsDiseaseRepeat[] = [];
    if (formData.get('what_is_disease_repeat')) {
      try {
        what_is_disease_repeat = JSON.parse(formData.get('what_is_disease_repeat')!.toString());
      } catch (err) {
        console.error("Parsing error for what_is_disease_repeat:", err);
        return NextResponse.json({ success: false, message: 'Invalid what_is_disease_repeat JSON' }, { status: 400 });
      }
    }
    what_is_disease_repeat = await Promise.all(
      what_is_disease_repeat.map(async (item, index) => {
 
        let imageUrls: string[] = [];
        if (Array.isArray(item.what_is_disease_repeat_images)) {
          imageUrls = item.what_is_disease_repeat_images
            .map((img) => (typeof img === 'string' && img.trim() !== '') ? img : '')
            .filter(url => url !== '');
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
        
        let repeatIcon = item.what_is_disease_disease_repeat_icon;
        if (!repeatIcon || typeof repeatIcon !== 'string' || (typeof repeatIcon === 'string' && repeatIcon.trim() === '')) {
          const file = formData.get(`what_is_disease_disease_repeat_icon${index}`) as File;
          if (file && file.name) {
            repeatIcon = await uploadPhotoToCloudinary(file);
          } else {
            repeatIcon = '';
          }
        }
        return {
          ...item,
          what_is_disease_repeat_images: imageUrls,
          what_is_disease_disease_repeat_icon: repeatIcon,
        };
      })
    );

    // Common Cause Section
    const common_cause_tab_title = formData.get('common_cause_tab_title')?.toString()
      ? JSON.parse(formData.get('common_cause_tab_title')!.toString())
      : {};
    let common_cause: Cause[] = [];
    if (formData.get('common_cause')) {
      try {
        common_cause = JSON.parse(formData.get('common_cause')!.toString());
      } catch (err) {
        console.error("Parsing error for common_cause:", err);
        return NextResponse.json({ success: false, message: 'Invalid common_cause JSON' }, { status: 400 });
      }
    }
    common_cause = await Promise.all(
      common_cause.map(async (item, index) => {
        let iconUrl = item.cause_icon;
        if (!iconUrl || typeof iconUrl !== 'string' || (typeof iconUrl === 'string' && iconUrl.trim() === '')) {
          const file = formData.get(`cause_icon${index}`) as File;
          if (file && file.name) {
            iconUrl = await uploadPhotoToCloudinary(file);
          } else {
            iconUrl = '';
          }
        }
        let cause_repeat = item.cause_repeat || [];
        cause_repeat = await Promise.all(
          cause_repeat.map(async (rep: CauseRepeat, repIndex: number) => {
            let repIconUrl = rep.cause_repeat_icon;
            if (!repIconUrl || typeof repIconUrl !== 'string' || (typeof repIconUrl === 'string' && repIconUrl.trim() === '')) {
              const file = formData.get(`cause_repeat_icon${index}_${repIndex}`) as File;
              if (file && file.name) {
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

    // Symptoms Section
    const symptoms_tab_title = formData.get('symptoms_tab_title')?.toString()
      ? JSON.parse(formData.get('symptoms_tab_title')!.toString())
      : {};
    let symptoms: Symptom[] = [];
    if (formData.get('symptoms')) {
      try {
        symptoms = JSON.parse(formData.get('symptoms')!.toString());
      } catch (err) {
        console.error("Parsing error for symptoms:", err);
        return NextResponse.json({ success: false, message: 'Invalid symptoms JSON' }, { status: 400 });
      }
    }
    symptoms = await Promise.all(
      symptoms.map(async (item, index) => {
        let iconUrl = item.symptoms_icon;
        if (!iconUrl || typeof iconUrl !== 'string' || (typeof iconUrl === 'string' && iconUrl.trim() === '')) {
          const file = formData.get(`symptoms_icon${index}`) as File;
          if (file && file.name) {
            iconUrl = await uploadPhotoToCloudinary(file);
          } else {
            iconUrl = '';
          }
        }
        let symptoms_repeat = item.symptoms_repeat || [];
        symptoms_repeat = await Promise.all(
          symptoms_repeat.map(async (rep: SymptomRepeat, repIndex: number) => {
            let repIconUrl = rep.symptoms_repeat_icon;
            if (!repIconUrl || typeof repIconUrl !== 'string' || (typeof repIconUrl === 'string' && repIconUrl.trim() === '')) {
              const file = formData.get(`symptoms_repeat_icon${index}_${repIndex}`) as File;
              if (file && file.name) {
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

    // Prevention Tips Section
    const prevention_tips_tab_title = formData.get('prevention_tips_tab_title')?.toString()
      ? JSON.parse(formData.get('prevention_tips_tab_title')!.toString())
      : {};
    let prevention_tips: PreventionTip[] = [];
    if (formData.get('prevention_tips')) {
      try {
        prevention_tips = JSON.parse(formData.get('prevention_tips')!.toString());
      } catch (err) {
        console.error("Parsing error for prevention_tips:", err);
        return NextResponse.json({ success: false, message: 'Invalid prevention_tips JSON' }, { status: 400 });
      }
    }
    prevention_tips = await Promise.all(
      prevention_tips.map(async (item, index) => {
        let iconUrl = item.prevention_tips_icon;
        if (!iconUrl || typeof iconUrl !== 'string' || (typeof iconUrl === 'string' && iconUrl.trim() === '')) {
          const file = formData.get(`prevention_tips_icon${index}`) as File;
          if (file && file.name) {
            iconUrl = await uploadPhotoToCloudinary(file);
          } else {
            iconUrl = '';
          }
        }
        let prevention_tips_repeat = item.prevention_tips_repeat || [];
        prevention_tips_repeat = await Promise.all(
          prevention_tips_repeat.map(async (rep: PreventionTipRepeat, repIndex: number) => {
            let repIconUrl = rep.prevention_tips_repeat_icon;
            if (!repIconUrl || typeof repIconUrl !== 'string' || (typeof repIconUrl === 'string' && repIconUrl.trim() === '')) {
              const file = formData.get(`prevention_tips_repeat_icon${index}_${repIndex}`) as File;
              if (file && file.name) {
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

    // Treatment Options Section
    const treatment_option_tab_title = formData.get('treatment_option_tab_title')?.toString()
      ? JSON.parse(formData.get('treatment_option_tab_title')!.toString())
      : {};
    let treatment_option: TreatmentOption[] = [];
    if (formData.get('treatment_option')) {
      try {
        treatment_option = JSON.parse(formData.get('treatment_option')!.toString());
      } catch (err) {
        console.error("Parsing error for treatment_option:", err);
        return NextResponse.json({ success: false, message: 'Invalid treatment_option JSON' }, { status: 400 });
      }
    }
    treatment_option = await Promise.all(
      treatment_option.map(async (item, index) => {
        let iconUrl = item.treatment_option_icon;
        if (!iconUrl || typeof iconUrl !== 'string' || (typeof iconUrl === 'string' && iconUrl.trim() === '')) {
          const file = formData.get(`treatment_option_icon${index}`) as File;
          if (file && file.name) {
            iconUrl = await uploadPhotoToCloudinary(file);
          } else {
            iconUrl = '';
          }
        }
        let treatment_option_repeat = item.treatment_option_repeat || [];
        treatment_option_repeat = await Promise.all(
          treatment_option_repeat.map(async (rep: TreatmentOptionRepeat, repIndex: number) => {
            let repIconUrl = rep.treatment_option_repeat_icon;
            if (!repIconUrl || typeof repIconUrl !== 'string' || (typeof repIconUrl === 'string' && repIconUrl.trim() === '')) {
              const file = formData.get(`treatment_option_repeat_icon${index}_${repIndex}`) as File;
              if (file && file.name) {
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

    const categoryId = formData.get('category')?.toString();
    if (!categoryId) {
      return NextResponse.json(
        { success: false, message: 'Category ID is required' },
        { status: 400 }
      );
    }
    const categoryExists = await Category.exists({ _id: categoryId });
    if (!categoryExists) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 404 }
      );
    }

    const newDisease = new Disease({
      disease_main_title,
      disease_main_image: disease_main_image_url,
      disease_slug,
      disease_title,
      disease_description,
      disease_icon: disease_icon_url,
      what_is_disease_tab_title,
      what_is_disease_repeat,
      common_cause_tab_title,
      common_cause,
      symptoms_tab_title,
      symptoms,
      prevention_tips_tab_title,
      prevention_tips,
      treatment_option_tab_title,
      treatment_option,
      category: categoryId, 
    });

    await newDisease.save();
    await Category.findByIdAndUpdate(
      categoryId,
      { $push: { diseases: newDisease._id } }
    );
    return NextResponse.json({ message: "Disease created successfully", status: 201, success: true, data: newDisease });
  } catch (err) {

    if(err instanceof Error){
      return NextResponse.json({ success: false, message: (err instanceof Error ? err.message : 'Failed to create disease') }, { status: 500 });
    }
    
  }
}
