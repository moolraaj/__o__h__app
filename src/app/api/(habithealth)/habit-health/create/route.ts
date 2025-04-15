import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/database/database';
import HabitsHealth from '@/models/HabitsHealth';
import { uploadPhotoToCloudinary } from '@/utils/Cloudinary';
import { BadHabitsRepeaterItem, HabitHealthRepeaterItem, ImproveHabitsRepeaterItem } from '@/utils/Types';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const formData = await request.formData();

    // Helper function to retrieve text fields with an optional "required" flag.
    const getField = (key: string, required: boolean = true): string => {
      const value = formData.get(key);
      if (required) {
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          throw new Error(`Missing field: ${key}`);
        }
      } else {
        if (!value) {
          return '';
        }
      }
      if (value instanceof File) {
        throw new Error(`${key} should be a text field, not a file.`);
      }
      return value.toString().trim();
    };

    // Helper function to parse bilingual JSON fields.
    const parseBilingualField = (key: string): { en: string; kn: string } => {
      const jsonString = getField(key);
      try {
        return JSON.parse(jsonString);
      } catch (error) {
        throw new Error(`Invalid JSON in field: ${error} - ${key}`);
      }
    };

    // Process habits_health_main_title and main image.
    const habits_health_main_title = parseBilingualField('habits_health_main_title');
    let habits_health_main_image: string = '';
    const mainImageFile = formData.get('habits_health_main_image_file') || formData.get('habits_health_main_image');
    if (mainImageFile && mainImageFile instanceof File) {
      habits_health_main_image = await uploadPhotoToCloudinary(mainImageFile);
    } else if (mainImageFile) {
      habits_health_main_image = mainImageFile.toString();
    } else {
      throw new Error('Missing main image.');
    }

    // Process heading and paragraph for habits health.
    const habits_health_heading = parseBilingualField('habits_health_heading');
    const habits_health_para = parseBilingualField('habits_health_para');

    // Process habits health icon.
    let habits_health_icon: string = '';
    const habitsHealthIconField = formData.get('habits_health_icon_file') || formData.get('habits_health_icon');
    if (habitsHealthIconField instanceof File) {
      habits_health_icon = await uploadPhotoToCloudinary(habitsHealthIconField);
    } else if (habitsHealthIconField) {
      habits_health_icon = habitsHealthIconField.toString();
    } else {
      throw new Error('Missing habits health icon.');
    }

    // Process inner title and repeater data.
    const habit_health_inner_title = parseBilingualField('habit_health_inner_title');
    let habit_health_inner_repeater = [];
    const innerRepeaterJson = formData.get('habit_health_inner_repeater')?.toString();
    if (innerRepeaterJson) {
      habit_health_inner_repeater = JSON.parse(innerRepeaterJson);
      habit_health_inner_repeater = await Promise.all(
        habit_health_inner_repeater.map(async (entry: HabitHealthRepeaterItem, index: number) => {
          const suggestionIconFile = formData.get(`habit_health_suggesion_icon_${index}`);
          if (suggestionIconFile && suggestionIconFile instanceof File) {
            entry.habit_health_suggesion_icon = await uploadPhotoToCloudinary(suggestionIconFile);
          }
          return entry;
        })
      );
    }

    // Process bad habits health title, paragraph and icon.
    const bad_habits_health_title = parseBilingualField('bad_habits_health_title');
    const bad_habits_health_para = parseBilingualField('bad_habits_health_para');
    let bad_habits_health_icon: string = '';
    const badIconField = formData.get('bad_habits_health_icon_file') || formData.get('bad_habits_health_icon');
    if (badIconField instanceof File) {
      bad_habits_health_icon = await uploadPhotoToCloudinary(badIconField);
    } else if (badIconField) {
      bad_habits_health_icon = badIconField.toString();
    } else {
      throw new Error('Missing bad habits health icon.');
    }
    let bad_habits_health_repeater = [];
    const badRepeaterJson = formData.get('bad_habits_health_repeater')?.toString();
    if (badRepeaterJson) {
      bad_habits_health_repeater = JSON.parse(badRepeaterJson);
      bad_habits_health_repeater = await Promise.all(
        bad_habits_health_repeater.map(async (entry: BadHabitsRepeaterItem, index: number) => {
          const repeaterIconFile = formData.get(`bad_habits_repeater_icon_${index}`);
          if (repeaterIconFile && repeaterIconFile instanceof File) {
            entry.bad_habits_repeater_icon = await uploadPhotoToCloudinary(repeaterIconFile);
          }
          return entry;
        })
      );
    }

    // Process improve health habits title, description and icon.
    const improve_health_habits_title = parseBilingualField('improve_health_habits_title');
    const improve_health_habits_description = parseBilingualField('improve_health_habits_description');
    let improve_health_habits_icon: string = '';
    const improveIconField = formData.get('improve_health_habits_icon_file') || formData.get('improve_health_habits_icon');
    if (improveIconField instanceof File) {
      improve_health_habits_icon = await uploadPhotoToCloudinary(improveIconField);
    } else if (improveIconField) {
      improve_health_habits_icon = improveIconField.toString();
    } else {
      throw new Error('Missing improve health habits icon.');
    }
    let improve_habits_health_repeater= [];
    const improveRepeaterJson = formData.get('improve_habits_health_repeater')?.toString();
    if (improveRepeaterJson) {
      improve_habits_health_repeater = JSON.parse(improveRepeaterJson);
      improve_habits_health_repeater = await Promise.all(
        improve_habits_health_repeater.map(async (entry: ImproveHabitsRepeaterItem, index: number) => {
          const improveRepeaterIconFile = formData.get(`improve_habits_repeater_icon_${index}`);
          if (improveRepeaterIconFile && improveRepeaterIconFile instanceof File) {
            entry.improve_habits_repeater_icon = await uploadPhotoToCloudinary(improveRepeaterIconFile);
          }
          return entry;
        })
      );
    }

    // Create new HabitsHealth document.
    const newHabitsHealth = new HabitsHealth({
      habits_health_main_title,
      habits_health_main_image,
      habits_health_heading,
      habits_health_para,
      habits_health_icon,
      habit_health_inner_title,
      habit_health_inner_repeater,
      bad_habits_health_title,
      bad_habits_health_para,
      bad_habits_health_icon,
      bad_habits_health_repeater,
      improve_health_habits_title,
      improve_health_habits_description,
      improve_health_habits_icon,
      improve_habits_health_repeater,
    });

    await newHabitsHealth.save();

    return NextResponse.json(
      { status: 201, message: 'Health tips created successfully', success: true, data: newHabitsHealth },
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, message: error.message || 'Failed to create habits health document' },
        { status: 500 }
      );
    }
  }
}
