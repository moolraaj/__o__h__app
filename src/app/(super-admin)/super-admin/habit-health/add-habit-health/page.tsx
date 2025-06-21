"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { FaPlus } from 'react-icons/fa';
import { BeatLoader } from 'react-spinners';
import { useCreateHabitHealthMutation } from '@/(store)/services/habit-health/habitHealthApi';

type BilingualField = {
  en: string;
  kn: string;
};

type HabitHealthRepeaterItem = {
  habit_health_suggestion_heading: BilingualField;
  habit_health_suggestion_para: BilingualField;
  habit_health_suggestion_icon: File | null;
};

type BadHabitsRepeaterItem = {
  bad_habits_repeater_heading: BilingualField;
  bad_habits_repeater_description: BilingualField;
  bad_habits_repeater_icon: File | null;
};

type ImproveHabitsRepeaterItem = {
  improve_habits_repeater_heading: BilingualField;
  improve_habits_repeater_description: BilingualField;
  improve_habits_repeater_icon: File | null;
};

const AddHabitsHealth: React.FC = () => {
  const [createHabitsHealth, { isLoading }] = useCreateHabitHealthMutation();
  const router = useRouter();

  // Main Fields
  const [habitsHealthMainTitle, setHabitsHealthMainTitle] = useState<BilingualField>({ en: '', kn: '' });
  const [habitsHealthMainImage, setHabitsHealthMainImage] = useState<File | null>(null);
  const [habitsHealthHeading, setHabitsHealthHeading] = useState<BilingualField>({ en: '', kn: '' });
  const [habitsHealthPara, setHabitsHealthPara] = useState<BilingualField>({ en: '', kn: '' });
  const [habitsHealthIcon, setHabitsHealthIcon] = useState<File | null>(null);

  // Inner Section
  const [habitHealthInnerTitle, setHabitHealthInnerTitle] = useState<BilingualField>({ en: '', kn: '' });
  const [habitHealthInnerRepeater, setHabitHealthInnerRepeater] = useState<HabitHealthRepeaterItem[]>([]);

  // Bad Habits Section
  const [badHabitsHealthTitle, setBadHabitsHealthTitle] = useState<BilingualField>({ en: '', kn: '' });
  const [badHabitsHealthPara, setBadHabitsHealthPara] = useState<BilingualField>({ en: '', kn: '' });
  const [badHabitsHealthIcon, setBadHabitsHealthIcon] = useState<File | null>(null);
  const [badHabitsHealthRepeater, setBadHabitsHealthRepeater] = useState<BadHabitsRepeaterItem[]>([]);

  // Improve Section
  const [improveHealthHabitsTitle, setImproveHealthHabitsTitle] = useState<BilingualField>({ en: '', kn: '' });
  const [improveHealthHabitsDescription, setImproveHealthHabitsDescription] = useState<BilingualField>({ en: '', kn: '' });
  const [improveHealthHabitsIcon, setImproveHealthHabitsIcon] = useState<File | null>(null);
  const [improveHabitsHealthRepeater, setImproveHabitsHealthRepeater] = useState<ImproveHabitsRepeaterItem[]>([]);

  const handleBilingualFieldChange = (
    setter: React.Dispatch<React.SetStateAction<BilingualField>>,
    lang: 'en' | 'kn',
    value: string
  ) => setter(prev => ({ ...prev, [lang]: value }));

  // --------- Inner Repeater ---------
  const addHabitHealthInnerRepeat = () => {
    setHabitHealthInnerRepeater(prev => [
      ...prev,
      { habit_health_suggestion_heading: { en: '', kn: '' }, habit_health_suggestion_para: { en: '', kn: '' }, habit_health_suggestion_icon: null }
    ]);
  };

  const removeHabitHealthInnerRepeat = (idx: number) => setHabitHealthInnerRepeater(prev => prev.filter((_, i) => i !== idx));

  const handleHabitHealthInnerFieldChange = (
    idx: number,
    field: 'habit_health_suggestion_heading' | 'habit_health_suggestion_para',
    lang: 'en' | 'kn',
    val: string
  ) => setHabitHealthInnerRepeater(prev => {
    const arr = [...prev]; 
    arr[idx][field][lang] = val; 
    return arr;
  });

  const handleHabitHealthInnerIconChange = (idx: number, file: File | null) => setHabitHealthInnerRepeater(prev => {
    const arr = [...prev]; 
    arr[idx].habit_health_suggestion_icon = file; 
    return arr;
  });

  // --------- Bad Habits Repeater ---------
  const addBadHabitsHealthRepeat = () => {
    setBadHabitsHealthRepeater(prev => [
      ...prev,
      { bad_habits_repeater_heading: { en: '', kn: '' }, bad_habits_repeater_description: { en: '', kn: '' }, bad_habits_repeater_icon: null }
    ]);
  };

  const removeBadHabitsHealthRepeat = (idx: number) => setBadHabitsHealthRepeater(prev => prev.filter((_, i) => i !== idx));

  const handleBadHabitsHealthFieldChange = (
    idx: number,
    field: 'bad_habits_repeater_heading' | 'bad_habits_repeater_description',
    lang: 'en' | 'kn',
    val: string
  ) => setBadHabitsHealthRepeater(prev => {
    const arr = [...prev]; 
    arr[idx][field][lang] = val; 
    return arr;
  });

  const handleBadHabitsHealthIconChange = (idx: number, file: File | null) => setBadHabitsHealthRepeater(prev => {
    const arr = [...prev]; 
    arr[idx].bad_habits_repeater_icon = file; 
    return arr;
  });

  // --------- Improve Habits Repeater ---------
  const addImproveHabitsHealthRepeat = () => {
    setImproveHabitsHealthRepeater(prev => [
      ...prev,
      { improve_habits_repeater_heading: { en: '', kn: '' }, improve_habits_repeater_description: { en: '', kn: '' }, improve_habits_repeater_icon: null }
    ]);
  };

  const removeImproveHabitsHealthRepeat = (idx: number) => setImproveHabitsHealthRepeater(prev => prev.filter((_, i) => i !== idx));

  const handleImproveHabitsHealthFieldChange = (
    idx: number,
    field: 'improve_habits_repeater_heading' | 'improve_habits_repeater_description',
    lang: 'en' | 'kn',
    val: string
  ) => setImproveHabitsHealthRepeater(prev => {
    const arr = [...prev]; 
    arr[idx][field][lang] = val; 
    return arr;
  });

  const handleImproveHabitsHealthIconChange = (idx: number, file: File | null) => setImproveHabitsHealthRepeater(prev => {
    const arr = [...prev]; 
    arr[idx].improve_habits_repeater_icon = file; 
    return arr;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!habitsHealthMainTitle.en || !habitsHealthMainTitle.kn) {
      toast.error('Main title in both languages is required');
      return;
    }
    
    if (!habitsHealthMainImage) {
      toast.error('Main image is required');
      return;
    }

    // Validate repeater items
    for (const item of habitHealthInnerRepeater) {
      if (!item.habit_health_suggestion_heading.en || !item.habit_health_suggestion_heading.kn) {
        toast.error('All suggestion headings in repeaters must be filled');
        return;
      }
    }

    const fd = new FormData();
    
    // Append main fields
    fd.append('habits_health_main_title', JSON.stringify(habitsHealthMainTitle));
    fd.append('habits_health_main_image_file', habitsHealthMainImage);
    fd.append('habits_health_heading', JSON.stringify(habitsHealthHeading));
    fd.append('habits_health_para', JSON.stringify(habitsHealthPara));
    if (habitsHealthIcon) fd.append('habits_health_icon_file', habitsHealthIcon);

    // Append inner section
    fd.append('habit_health_inner_title', JSON.stringify(habitHealthInnerTitle));
    fd.append('habit_health_inner_repeater', JSON.stringify(habitHealthInnerRepeater));
    habitHealthInnerRepeater.forEach((item, index) => {
      if (item.habit_health_suggestion_icon) {
        fd.append(`habit_health_suggestion_icon_${index}`, item.habit_health_suggestion_icon);
      }
    });

    // Append bad habits section
    fd.append('bad_habits_health_title', JSON.stringify(badHabitsHealthTitle));
    fd.append('bad_habits_health_para', JSON.stringify(badHabitsHealthPara));
    if (badHabitsHealthIcon) fd.append('bad_habits_health_icon_file', badHabitsHealthIcon);
    fd.append('bad_habits_health_repeater', JSON.stringify(badHabitsHealthRepeater));
    badHabitsHealthRepeater.forEach((item, index) => {
      if (item.bad_habits_repeater_icon) {
        fd.append(`bad_habits_repeater_icon_${index}`, item.bad_habits_repeater_icon);
      }
    });

    // Append improve section
    fd.append('improve_health_habits_title', JSON.stringify(improveHealthHabitsTitle));
    fd.append('improve_health_habits_description', JSON.stringify(improveHealthHabitsDescription));
    if (improveHealthHabitsIcon) fd.append('improve_health_habits_icon_file', improveHealthHabitsIcon);
    fd.append('improve_habits_health_repeater', JSON.stringify(improveHabitsHealthRepeater));
    improveHabitsHealthRepeater.forEach((item, index) => {
      if (item.improve_habits_repeater_icon) {
        fd.append(`improve_habits_repeater_icon_${index}`, item.improve_habits_repeater_icon);
      }
    });

    try {
      // Log FormData for debugging
      for (const [key, value] of fd.entries()) {
        console.log(key, value);
      }

      const res = await createHabitsHealth(fd).unwrap();
      if(res){
          toast.success('Habits Health created successfully');
          router.push('/super-admin/habits-health');
      }
    } catch (err) {
      if(err instanceof Error){
        toast.error(err.message || 'Failed to create habits health');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="add-habits-health-grid">
        {/* Main Title */}
        <div className='habits-health-fields-grid'>
          <label>Main Title (EN):*</label>
          <input
            type="text"
            placeholder="en"
            value={habitsHealthMainTitle.en}
            onChange={(e) => handleBilingualFieldChange(setHabitsHealthMainTitle, 'en', e.target.value)}
            required
          />
        </div>
        <div className='habits-health-fields-grid'>
          <label>Main Title (KN):*</label>
          <input
            type="text"
            placeholder="kn"
            value={habitsHealthMainTitle.kn}
            onChange={(e) => handleBilingualFieldChange(setHabitsHealthMainTitle, 'kn', e.target.value)}
            required
          />
        </div>

        {/* Main Image */}
        <div>
          <label>Upload Main Image:*</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setHabitsHealthMainImage(e.target.files?.[0] || null)}
            required
          />
        </div>

        {/* Heading */}
        <div className='habits-health-fields-grid'>
          <label>Heading (EN):</label>
          <input
            type="text"
            placeholder="en"
            value={habitsHealthHeading.en}
            onChange={(e) => handleBilingualFieldChange(setHabitsHealthHeading, 'en', e.target.value)}
          />
        </div>
        <div className='habits-health-fields-grid'>
          <label>Heading (KN):</label>
          <input
            type="text"
            placeholder="kn"
            value={habitsHealthHeading.kn}
            onChange={(e) => handleBilingualFieldChange(setHabitsHealthHeading, 'kn', e.target.value)}
          />
        </div>

        {/* Paragraph */}
        <div className='habits-health-fields-grid'>
          <label>Paragraph (EN):</label>
          <textarea
            placeholder="en"
            value={habitsHealthPara.en}
            onChange={(e) => handleBilingualFieldChange(setHabitsHealthPara, 'en', e.target.value)}
          />
        </div>
        <div className='habits-health-fields-grid'>
          <label>Paragraph (KN):</label>
          <textarea
            placeholder="kn"
            value={habitsHealthPara.kn}
            onChange={(e) => handleBilingualFieldChange(setHabitsHealthPara, 'kn', e.target.value)}
          />
        </div>

        {/* Icon */}
        <div>
          <label>Upload Habits Health Icon:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setHabitsHealthIcon(e.target.files?.[0] || null)}
          />
        </div>
      </div>

      {/* ---------------- Habit Health Inner Section ---------------- */}
      <hr />
      <div className="button-container">
        <h3>Habit Health Inner Section</h3>
        <button type="button" onClick={addHabitHealthInnerRepeat}>
          <FaPlus /> Add Habit Health Inner Item
        </button>
      </div>

      {/* Inner Title */}
      <div className='habits-health-fields-grid'>
        <label>Inner Title (EN):</label>
        <input
          type="text"
          placeholder="en"
          value={habitHealthInnerTitle.en}
          onChange={(e) => handleBilingualFieldChange(setHabitHealthInnerTitle, 'en', e.target.value)}
        />
      </div>
      <div className='habits-health-fields-grid'>
        <label>Inner Title (KN):</label>
        <input
          type="text"
          placeholder="kn"
          value={habitHealthInnerTitle.kn}
          onChange={(e) => handleBilingualFieldChange(setHabitHealthInnerTitle, 'kn', e.target.value)}
        />
      </div>

      {habitHealthInnerRepeater.map((item, index) => (
        <div key={index} className="repeater">
          <label>Suggestion Heading (EN):*</label>
          <input
            type="text"
            placeholder="en"
            value={item.habit_health_suggestion_heading.en}
            onChange={(e) => handleHabitHealthInnerFieldChange(index, 'habit_health_suggestion_heading', 'en', e.target.value)}
            required
          />
          <label>Suggestion Heading (KN):*</label>
          <input
            type="text"
            placeholder="kn"
            value={item.habit_health_suggestion_heading.kn}
            onChange={(e) => handleHabitHealthInnerFieldChange(index, 'habit_health_suggestion_heading', 'kn', e.target.value)}
            required
          />
          <label>Suggestion Paragraph (EN):*</label>
          <textarea
            placeholder="en"
            value={item.habit_health_suggestion_para.en}
            onChange={(e) => handleHabitHealthInnerFieldChange(index, 'habit_health_suggestion_para', 'en', e.target.value)}
            required
          />
          <label>Suggestion Paragraph (KN):*</label>
          <textarea
            placeholder="kn"
            value={item.habit_health_suggestion_para.kn}
            onChange={(e) => handleHabitHealthInnerFieldChange(index, 'habit_health_suggestion_para', 'kn', e.target.value)}
            required
          />
          <label>Upload Suggestion Icon:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleHabitHealthInnerIconChange(index, e.target.files?.[0] || null)}
          />
          <button type="button" onClick={() => removeHabitHealthInnerRepeat(index)}>
            Remove Habit Health Inner Item
          </button>
        </div>
      ))}

      {/* ---------------- Bad Habits Health Section ---------------- */}
      <hr />
      <div className="button-container">
        <h3>Bad Habits Health Section</h3>
        <button type="button" onClick={addBadHabitsHealthRepeat}>
          <FaPlus /> Add Bad Habits Health Item
        </button>
      </div>

      {/* Bad Habits Title */}
      <div className='habits-health-fields-grid'>
        <label>Bad Habits Title (EN):</label>
        <input
          type="text"
          placeholder="en"
          value={badHabitsHealthTitle.en}
          onChange={(e) => handleBilingualFieldChange(setBadHabitsHealthTitle, 'en', e.target.value)}
        />
      </div>
      <div className='habits-health-fields-grid'>
        <label>Bad Habits Title (KN):</label>
        <input
          type="text"
          placeholder="kn"
          value={badHabitsHealthTitle.kn}
          onChange={(e) => handleBilingualFieldChange(setBadHabitsHealthTitle, 'kn', e.target.value)}
        />
      </div>

      {/* Bad Habits Paragraph */}
      <div className='habits-health-fields-grid'>
        <label>Bad Habits Paragraph (EN):</label>
        <textarea
          placeholder="en"
          value={badHabitsHealthPara.en}
          onChange={(e) => handleBilingualFieldChange(setBadHabitsHealthPara, 'en', e.target.value)}
        />
      </div>
      <div className='habits-health-fields-grid'>
        <label>Bad Habits Paragraph (KN):</label>
        <textarea
          placeholder="kn"
          value={badHabitsHealthPara.kn}
          onChange={(e) => handleBilingualFieldChange(setBadHabitsHealthPara, 'kn', e.target.value)}
        />
      </div>

      {/* Bad Habits Icon */}
      <div>
        <label>Upload Bad Habits Icon:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setBadHabitsHealthIcon(e.target.files?.[0] || null)}
        />
      </div>

      {badHabitsHealthRepeater.map((item, index) => (
        <div key={index} className="repeater">
          <label>Bad Habits Repeater Heading (EN):*</label>
          <input
            type="text"
            placeholder="en"
            value={item.bad_habits_repeater_heading.en}
            onChange={(e) => handleBadHabitsHealthFieldChange(index, 'bad_habits_repeater_heading', 'en', e.target.value)}
            required
          />
          <label>Bad Habits Repeater Heading (KN):*</label>
          <input
            type="text"
            placeholder="kn"
            value={item.bad_habits_repeater_heading.kn}
            onChange={(e) => handleBadHabitsHealthFieldChange(index, 'bad_habits_repeater_heading', 'kn', e.target.value)}
            required
          />
          <label>Bad Habits Repeater Description (EN):</label>
          <textarea
            placeholder="en"
            value={item.bad_habits_repeater_description.en}
            onChange={(e) => handleBadHabitsHealthFieldChange(index, 'bad_habits_repeater_description', 'en', e.target.value)}
          />
          <label>Bad Habits Repeater Description (KN):</label>
          <textarea
            placeholder="kn"
            value={item.bad_habits_repeater_description.kn}
            onChange={(e) => handleBadHabitsHealthFieldChange(index, 'bad_habits_repeater_description', 'kn', e.target.value)}
          />
          <label>Upload Bad Habits Repeater Icon:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleBadHabitsHealthIconChange(index, e.target.files?.[0] || null)}
          />
          <button type="button" onClick={() => removeBadHabitsHealthRepeat(index)}>
            Remove Bad Habits Health Item
          </button>
        </div>
      ))}

      {/* ---------------- Improve Health Habits Section ---------------- */}
      <hr />
      <div className="button-container">
        <h3>Improve Health Habits Section</h3>
        <button type="button" onClick={addImproveHabitsHealthRepeat}>
          <FaPlus /> Add Improve Health Habits Item
        </button>
      </div>

      {/* Improve Health Habits Title */}
      <div className='habits-health-fields-grid'>
        <label>Improve Health Habits Title (EN):</label>
        <input
          type="text"
          placeholder="en"
          value={improveHealthHabitsTitle.en}
          onChange={(e) => handleBilingualFieldChange(setImproveHealthHabitsTitle, 'en', e.target.value)}
        />
      </div>
      <div className='habits-health-fields-grid'>
        <label>Improve Health Habits Title (KN):</label>
        <input
          type="text"
          placeholder="kn"
          value={improveHealthHabitsTitle.kn}
          onChange={(e) => handleBilingualFieldChange(setImproveHealthHabitsTitle, 'kn', e.target.value)}
        />
      </div>

      {/* Improve Health Habits Description */}
      <div className='habits-health-fields-grid'>
        <label>Improve Health Habits Description (EN):</label>
        <textarea
          placeholder="en"
          value={improveHealthHabitsDescription.en}
          onChange={(e) => handleBilingualFieldChange(setImproveHealthHabitsDescription, 'en', e.target.value)}
        />
      </div>
      <div className='habits-health-fields-grid'>
        <label>Improve Health Habits Description (KN):</label>
        <textarea
          placeholder="kn"
          value={improveHealthHabitsDescription.kn}
          onChange={(e) => handleBilingualFieldChange(setImproveHealthHabitsDescription, 'kn', e.target.value)}
        />
      </div>

      {/* Improve Health Habits Icon */}
      <div>
        <label>Upload Improve Health Habits Icon:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImproveHealthHabitsIcon(e.target.files?.[0] || null)}
        />
      </div>

      {improveHabitsHealthRepeater.map((item, index) => (
        <div key={index} className="repeater">
          <label>Improve Habits Repeater Heading (EN):*</label>
          <input
            type="text"
            placeholder="en"
            value={item.improve_habits_repeater_heading.en}
            onChange={(e) => handleImproveHabitsHealthFieldChange(index, 'improve_habits_repeater_heading', 'en', e.target.value)}
            required
          />
          <label>Improve Habits Repeater Heading (KN):*</label>
          <input
            type="text"
            placeholder="kn"
            value={item.improve_habits_repeater_heading.kn}
            onChange={(e) => handleImproveHabitsHealthFieldChange(index, 'improve_habits_repeater_heading', 'kn', e.target.value)}
            required
          />
          <label>Improve Habits Repeater Description (EN):</label>
          <textarea
            placeholder="en"
            value={item.improve_habits_repeater_description.en}
            onChange={(e) => handleImproveHabitsHealthFieldChange(index, 'improve_habits_repeater_description', 'en', e.target.value)}
          />
          <label>Improve Habits Repeater Description (KN):</label>
          <textarea
            placeholder="kn"
            value={item.improve_habits_repeater_description.kn}
            onChange={(e) => handleImproveHabitsHealthFieldChange(index, 'improve_habits_repeater_description', 'kn', e.target.value)}
          />
          <label>Upload Improve Habits Repeater Icon:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImproveHabitsHealthIconChange(index, e.target.files?.[0] || null)}
          />
          <button type="button" onClick={() => removeImproveHabitsHealthRepeat(index)}>
            Remove Improve Health Habits Item
          </button>
        </div>
      ))}

      <hr />
      <div className="button-container">
        <button 
          type="submit" 
          className="habits-health-form-submit-button"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
            Submit Habits Health
            <BeatLoader color="#ffffff" size={10} />
        
            </>
          ) : (
            'Submit Habits Health'
          )}
        </button>
      </div>
    </form>
  );
};

export default AddHabitsHealth;