
"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCreateDiseaseMutation } from '@/(store)/services/disease/diseaseApi';
import { Cause, CauseRepeat, PreventionTip, PreventionTipRepeat, Symptom, SymptomRepeat, TreatmentOption, TreatmentOptionRepeat, WhatIsDiseaseDescriptionRepeater, WhatIsDiseaseRepeat } from '@/utils/Types';
import { FaPlus } from 'react-icons/fa';

const AddDisease = () => {
  const [createDisease] = useCreateDiseaseMutation();
  const router = useRouter();


  const [diseaseMainTitle, setDiseaseMainTitle] = useState({ en: '', kn: '' });
  const [diseaseMainImage, setDiseaseMainImage] = useState<File | null>(null);
  const [diseaseSlug, setDiseaseSlug] = useState({ en: '', kn: '' });
  const [diseaseTitle, setDiseaseTitle] = useState({ en: '', kn: '' });
  const [diseaseDescription, setDiseaseDescription] = useState({ en: '', kn: '' });
  const [diseaseIcon, setDiseaseIcon] = useState<File | null>(null);

  // ---------- What Is Disease Section ----------
  const [whatIsDiseaseTabTitle] = useState({ en: 'What is Disease', kn: 'ರೋಗದ ವಿವರ' });
  const [whatIsDiseaseRepeats, setWhatIsDiseaseRepeats] = useState<WhatIsDiseaseRepeat[]>([]);
  const addWhatIsDiseaseCalled = useRef(false);

  const addWhatIsDiseaseRepeat = () => {

    if (addWhatIsDiseaseCalled.current) return;
    addWhatIsDiseaseCalled.current = true;
    setWhatIsDiseaseRepeats(prev => [
      ...prev,
      {
        what_is_disease_heading: { en: '', kn: '' },
        what_is_disease_disease_repeat_icon: null,
        what_is_disease_disease_repeat_description: { en: '', kn: '' },
        what_is_disease_repeat_images: [],
        what_is_disease_description_repeater: []
      }
    ]);
    setTimeout(() => {
      addWhatIsDiseaseCalled.current = false;
    }, 300);
  };

  const removeWhatIsDiseaseRepeat = (index: number) => {
    setWhatIsDiseaseRepeats(prev => prev.filter((_, i) => i !== index));
  };

  const handleWhatIsDiseaseHeadingChange = (index: number, lang: 'en' | 'kn', value: string) => {
    setWhatIsDiseaseRepeats(prev => {
      const newArr = [...prev];
      newArr[index].what_is_disease_heading[lang] = value;
      return newArr;
    });
  };

  const handleWhatIsDiseaseRepeatIconChange = (index: number, file: File | null) => {
    setWhatIsDiseaseRepeats(prev => {
      const newArr = [...prev];
      newArr[index].what_is_disease_disease_repeat_icon = file;
      return newArr;
    });
  };

  const handleWhatIsDiseaseRepeatDescriptionChange = (index: number, lang: 'en' | 'kn', value: string) => {
    setWhatIsDiseaseRepeats(prev => {
      const newArr = [...prev];
      newArr[index].what_is_disease_disease_repeat_description[lang] = value;
      return newArr;
    });
  };

  const handleWhatIsDiseaseImagesChange = (index: number, files: FileList | null) => {
    if (!files) return;
    setWhatIsDiseaseRepeats(prev => {
      const newArr = [...prev];
      newArr[index].what_is_disease_repeat_images = Array.from(files);
      return newArr;
    });
  };


  const addWhatIsDiseaseDescriptionRepeat = (itemIndex: number) => {
    setWhatIsDiseaseRepeats(prev => {
      const newArr = [...prev];
      newArr[itemIndex].what_is_disease_description_repeater.push({
        what_is_disease_heading_repeat: { en: '', kn: '' },
        what_is_disease_description_repeat: { en: '', kn: '' }
      });
      return newArr;
    });
  };

  const removeWhatIsDiseaseDescriptionRepeat = (itemIndex: number, repeatIndex: number) => {
    setWhatIsDiseaseRepeats(prev => {
      const newArr = [...prev];
      newArr[itemIndex].what_is_disease_description_repeater = newArr[itemIndex].what_is_disease_description_repeater.filter((item, i: number) => i !== repeatIndex);
      return newArr;
    });
  };

  const handleWhatIsDiseaseDescriptionRepeatChange = (
    itemIndex: number,
    repeatIndex: number,
    field: 'what_is_disease_heading_repeat' | 'what_is_disease_description_repeat',
    lang: 'en' | 'kn',
    value: string
  ) => {
    setWhatIsDiseaseRepeats(prev => {
      const newArr = [...prev];
      newArr[itemIndex].what_is_disease_description_repeater[repeatIndex][field][lang] = value;
      return newArr;
    });
  };

  // ---------- Common Cause Section ----------
  const [commonCauseTabTitle] = useState({ en: 'Common Causes', kn: 'ಸಾಮಾನ್ಯ ಕಾರಣಗಳು' });
  const [commonCauses, setCommonCauses] = useState<Cause[]>([]);

  const addCommonCause = () => {
    setCommonCauses(prev => [
      ...prev,
      {
        cause_title: { en: '', kn: '' },
        cause_para: { en: '', kn: '' },
        cause_brief: { en: '', kn: '' },
        cause_icon: null,
        cause_repeat: []
      }
    ]);
  };

  const removeCommonCause = (index: number) => {
    setCommonCauses(prev => prev.filter((_, i) => i !== index));
  };

  const handleCommonCauseFieldChange = (
    index: number,
    field: 'cause_title' | 'cause_para' | 'cause_brief',
    lang: 'en' | 'kn',
    value: string
  ) => {
    setCommonCauses(prev => {
      const newArr = [...prev];
      newArr[index][field][lang] = value;
      return newArr;
    });
  };

  const handleCommonCauseIconChange = (index: number, file: File | null) => {
    setCommonCauses(prev => {
      const newArr = [...prev];
      newArr[index].cause_icon = file;
      return newArr;
    });
  };

  const addCommonCauseRepeat = (causeIndex: number) => {
    setCommonCauses(prev => {
      const newArr = [...prev];
      newArr[causeIndex].cause_repeat.push({
        cause_repeat_title: { en: '', kn: '' },
        cause_repeat_description: { en: '', kn: '' },
        cause_repeat_icon: null
      });
      return newArr;
    });
  };

  const removeCommonCauseRepeat = (causeIndex: number, repeatIndex: number) => {
    setCommonCauses(prev => {
      const newArr = [...prev];
      newArr[causeIndex].cause_repeat = newArr[causeIndex].cause_repeat.filter((item, i: number) => i !== repeatIndex);
      return newArr;
    });
  };

  const handleCommonCauseRepeatChange = (
    causeIndex: number,
    repeatIndex: number,
    field: 'cause_repeat_title' | 'cause_repeat_description',
    lang: 'en' | 'kn',
    value: string
  ) => {
    setCommonCauses(prev => {
      const newArr = [...prev];
      newArr[causeIndex].cause_repeat[repeatIndex][field][lang] = value;
      return newArr;
    });
  };

  const handleCommonCauseRepeatIconChange = (causeIndex: number, repeatIndex: number, file: File | null) => {
    setCommonCauses(prev => {
      const newArr = [...prev];
      newArr[causeIndex].cause_repeat[repeatIndex].cause_repeat_icon = file;
      return newArr;
    });
  };

  // ---------- Symptoms Section ----------
  const [symptomsTabTitle] = useState({ en: 'Symptoms', kn: 'ಲಕ್ಷಣಗಳು' });
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);

  const addSymptom = () => {
    setSymptoms(prev => [
      ...prev,
      {
        symptoms_title: { en: '', kn: '' },
        symptoms_para: { en: '', kn: '' },
        symptoms_brief: { en: '', kn: '' },
        symptoms_icon: null,
        symptoms_repeat: []
      }
    ]);
  };

  const removeSymptom = (index: number) => {
    setSymptoms(prev => prev.filter((_, i) => i !== index));
  };

  const handleSymptomFieldChange = (
    index: number,
    field: 'symptoms_title' | 'symptoms_para' | 'symptoms_brief',
    lang: 'en' | 'kn',
    value: string
  ) => {
    setSymptoms(prev => {
      const newArr = [...prev];
      newArr[index][field][lang] = value;
      return newArr;
    });
  };

  const handleSymptomsIconChange = (index: number, file: File | null) => {
    setSymptoms(prev => {
      const newArr = [...prev];
      newArr[index].symptoms_icon = file;
      return newArr;
    });
  };

  const addSymptomRepeat = (symptomIndex: number) => {
    setSymptoms(prev => {
      const newArr = [...prev];
      newArr[symptomIndex].symptoms_repeat.push({
        symptoms_repeat_title: { en: '', kn: '' },
        symptoms_repeat_description: { en: '', kn: '' },
        symptoms_repeat_icon: null
      });
      return newArr;
    });
  };

  const removeSymptomRepeat = (symptomIndex: number, repeatIndex: number) => {
    setSymptoms(prev => {
      const newArr = [...prev];
      newArr[symptomIndex].symptoms_repeat = newArr[symptomIndex].symptoms_repeat.filter((item, i: number) => i !== repeatIndex);
      return newArr;
    });
  };

  const handleSymptomRepeatChange = (
    symptomIndex: number,
    repeatIndex: number,
    field: 'symptoms_repeat_title' | 'symptoms_repeat_description',
    lang: 'en' | 'kn',
    value: string
  ) => {
    setSymptoms(prev => {
      const newArr = [...prev];
      newArr[symptomIndex].symptoms_repeat[repeatIndex][field][lang] = value;
      return newArr;
    });
  };

  const handleSymptomRepeatIconChange = (symptomIndex: number, repeatIndex: number, file: File | null) => {
    setSymptoms(prev => {
      const newArr = [...prev];
      newArr[symptomIndex].symptoms_repeat[repeatIndex].symptoms_repeat_icon = file;
      return newArr;
    });
  };

  // ---------- Prevention Tips Section ----------
  const [preventionTipsTabTitle] = useState({ en: 'Prevention Tips', kn: 'ತಡೆಗಟ್ಟುವ ಸಲಹೆಗಳು' });
  const [preventionTips, setPreventionTips] = useState<PreventionTip[]>([]);

  const addPreventionTip = () => {
    setPreventionTips(prev => [
      ...prev,
      {
        prevention_tips_title: { en: '', kn: '' },
        prevention_tips_para: { en: '', kn: '' },
        prevention_tips_brief: { en: '', kn: '' },
        prevention_tips_icon: null,
        prevention_tips_repeat: []
      }
    ]);
  };

  const removePreventionTip = (index: number) => {
    setPreventionTips(prev => prev.filter((_, i) => i !== index));
  };

  const handlePreventionTipFieldChange = (
    index: number,
    field: 'prevention_tips_title' | 'prevention_tips_para' | 'prevention_tips_brief',
    lang: 'en' | 'kn',
    value: string
  ) => {
    setPreventionTips(prev => {
      const newArr = [...prev];
      newArr[index][field][lang] = value;
      return newArr;
    });
  };

  const handlePreventionTipsIconChange = (index: number, file: File | null) => {
    setPreventionTips(prev => {
      const newArr = [...prev];
      newArr[index].prevention_tips_icon = file;
      return newArr;
    });
  };

  const addPreventionTipRepeat = (tipIndex: number) => {
    setPreventionTips(prev => {
      const newArr = [...prev];
      newArr[tipIndex].prevention_tips_repeat.push({
        prevention_tips_repeat_title: { en: '', kn: '' },
        prevention_tips_repeat_description: { en: '', kn: '' },
        prevention_tips_repeat_icon: null
      });
      return newArr;
    });
  };

  const removePreventionTipRepeat = (tipIndex: number, repeatIndex: number) => {
    setPreventionTips(prev => {
      const newArr = [...prev];
      newArr[tipIndex].prevention_tips_repeat = newArr[tipIndex].prevention_tips_repeat.filter((_, i: number) => i !== repeatIndex);
      return newArr;
    });
  };

  const handlePreventionTipRepeatChange = (
    tipIndex: number,
    repeatIndex: number,
    field: 'prevention_tips_repeat_title' | 'prevention_tips_repeat_description',
    lang: 'en' | 'kn',
    value: string
  ) => {
    setPreventionTips(prev => {
      const newArr = [...prev];
      newArr[tipIndex].prevention_tips_repeat[repeatIndex][field][lang] = value;
      return newArr;
    });
  };

  const handlePreventionTipRepeatIconChange = (tipIndex: number, repeatIndex: number, file: File | null) => {
    setPreventionTips(prev => {
      const newArr = [...prev];
      newArr[tipIndex].prevention_tips_repeat[repeatIndex].prevention_tips_repeat_icon = file;
      return newArr;
    });
  };

  // ---------- Treatment Options Section ----------
  const [treatmentOptionTabTitle] = useState({ en: 'Treatment Options', kn: 'ಚಿಕಿತ್ಸಾ ಆಯ್ಕೆಗಳು' });
  const [treatmentOptions, setTreatmentOptions] = useState<TreatmentOption[]>([]);

  const addTreatmentOption = () => {
    setTreatmentOptions(prev => [
      ...prev,
      {
        treatment_option_title: { en: '', kn: '' },
        treatment_option_para: { en: '', kn: '' },
        treatment_option_brief: { en: '', kn: '' },
        treatment_option_icon: null,
        treatment_option_repeat: []
      }
    ]);
  };

  const removeTreatmentOption = (index: number) => {
    setTreatmentOptions(prev => prev.filter((_, i) => i !== index));
  };

  const handleTreatmentOptionFieldChange = (
    index: number,
    field: 'treatment_option_title' | 'treatment_option_para' | 'treatment_option_brief',
    lang: 'en' | 'kn',
    value: string
  ) => {
    setTreatmentOptions(prev => {
      const newArr = [...prev];
      newArr[index][field][lang] = value;
      return newArr;
    });
  };

  const handleTreatmentOptionIconChange = (index: number, file: File | null) => {
    setTreatmentOptions(prev => {
      const newArr = [...prev];
      newArr[index].treatment_option_icon = file;
      return newArr;
    });
  };

  const addTreatmentOptionRepeat = (optionIndex: number) => {
    setTreatmentOptions(prev => {
      const newArr = [...prev];
      newArr[optionIndex].treatment_option_repeat.push({
        treatment_option_repeat_title: { en: '', kn: '' },
        treatment_option_repeat_description: { en: '', kn: '' },
        treatment_option_repeat_icon: null
      });
      return newArr;
    });
  };

  const removeTreatmentOptionRepeat = (optionIndex: number, repeatIndex: number) => {
    setTreatmentOptions(prev => {
      const newArr = [...prev];
      newArr[optionIndex].treatment_option_repeat = newArr[optionIndex].treatment_option_repeat.filter((_, i: number) => i !== repeatIndex);
      return newArr;
    });
  };

  const handleTreatmentOptionRepeatChange = (
    optionIndex: number,
    repeatIndex: number,
    field: 'treatment_option_repeat_title' | 'treatment_option_repeat_description',
    lang: 'en' | 'kn',
    value: string
  ) => {
    setTreatmentOptions(prev => {
      const newArr = [...prev];
      newArr[optionIndex].treatment_option_repeat[repeatIndex][field][lang] = value;
      return newArr;
    });
  };

  const handleTreatmentOptionRepeatIconChange = (optionIndex: number, repeatIndex: number, file: File | null) => {
    setTreatmentOptions(prev => {
      const newArr = [...prev];
      newArr[optionIndex].treatment_option_repeat[repeatIndex].treatment_option_repeat_icon = file;
      return newArr;
    });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    // Main Disease Fields
    formData.append('disease_main_title', JSON.stringify(diseaseMainTitle));
    if (diseaseMainImage) formData.append('disease_main_image', diseaseMainImage);
    formData.append('disease_slug', JSON.stringify(diseaseSlug));
    formData.append('disease_title', JSON.stringify(diseaseTitle));
    formData.append('disease_description', JSON.stringify(diseaseDescription));
    if (diseaseIcon) formData.append('disease_icon', diseaseIcon);

    // What Is Disease Section
    formData.append('what_is_disease_tab_title', JSON.stringify(whatIsDiseaseTabTitle));
    formData.append('what_is_disease_repeat', JSON.stringify(whatIsDiseaseRepeats));
    whatIsDiseaseRepeats.forEach((item, index) => {
      if (item.what_is_disease_repeat_images?.length) {
        item.what_is_disease_repeat_images?.forEach((file) => {
          formData.append(`what_is_disease_repeat_images${index}`, file);
        });
      }
      if (item.what_is_disease_disease_repeat_icon) {
        formData.append(`what_is_disease_disease_repeat_icon${index}`, item.what_is_disease_disease_repeat_icon);
      }
    });

    // Common Cause Section
    formData.append('common_cause_tab_title', JSON.stringify(commonCauseTabTitle));
    formData.append('common_cause', JSON.stringify(commonCauses));
    commonCauses.forEach((item, index) => {
      if (item.cause_icon) formData.append(`cause_icon${index}`, item.cause_icon);
      item.cause_repeat.forEach((rep: CauseRepeat, repIndex: number) => {
        if (rep.cause_repeat_icon) formData.append(`cause_repeat_icon${index}_${repIndex}`, rep.cause_repeat_icon);
      });
    });

    // Symptoms Section
    formData.append('symptoms_tab_title', JSON.stringify(symptomsTabTitle));
    formData.append('symptoms', JSON.stringify(symptoms));
    symptoms.forEach((item, index) => {
      if (item.symptoms_icon) formData.append(`symptoms_icon${index}`, item.symptoms_icon);
      item.symptoms_repeat.forEach((rep: SymptomRepeat, repIndex: number) => {
        if (rep.symptoms_repeat_icon) formData.append(`symptoms_repeat_icon${index}_${repIndex}`, rep.symptoms_repeat_icon);
      });
    });

    // Prevention Tips Section
    formData.append('prevention_tips_tab_title', JSON.stringify(preventionTipsTabTitle));
    formData.append('prevention_tips', JSON.stringify(preventionTips));
    preventionTips.forEach((item, index) => {
      if (item.prevention_tips_icon) formData.append(`prevention_tips_icon${index}`, item.prevention_tips_icon);
      item.prevention_tips_repeat.forEach((rep: PreventionTipRepeat, repIndex: number) => {
        if (rep.prevention_tips_repeat_icon) formData.append(`prevention_tips_repeat_icon${index}_${repIndex}`, rep.prevention_tips_repeat_icon);
      });
    });

    // Treatment Options Section
    formData.append('treatment_option_tab_title', JSON.stringify(treatmentOptionTabTitle));
    formData.append('treatment_option', JSON.stringify(treatmentOptions));
    treatmentOptions.forEach((item, index) => {
      if (item.treatment_option_icon) formData.append(`treatment_option_icon${index}`, item.treatment_option_icon);
      item.treatment_option_repeat.forEach((rep: TreatmentOptionRepeat, repIndex: number) => {
        if (rep.treatment_option_repeat_icon) formData.append(`treatment_option_repeat_icon${index}_${repIndex}`, rep.treatment_option_repeat_icon);
      });
    });

    try {
      const result = await createDisease(formData).unwrap();
      if (result) {
        router.push('/super-admin/disease');
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error('Failed to create disease');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">

      <div className="add-disease-grid">
        <div className='disease-fields-grid'>
          <label>Main Title (EN):</label>
          <input
            type="text"
            placeholder="en"
            value={diseaseMainTitle.en}
            onChange={(e) => setDiseaseMainTitle({ ...diseaseMainTitle, en: e.target.value })}
          />
        </div>
        <div className='disease-fields-grid'>
          <label>Main Title (KN):</label>
          <input
            type="text"
            placeholder="kn"
            value={diseaseMainTitle.kn}
            onChange={(e) => setDiseaseMainTitle({ ...diseaseMainTitle, kn: e.target.value })}
          />
        </div>

        <div className='disease-fields-grid'>
          <label>Disease Slug (EN):</label>
          <input
            type="text"
            placeholder="en"
            value={diseaseSlug.en}
            onChange={(e) => setDiseaseSlug({ ...diseaseSlug, en: e.target.value })}
          />
        </div>
        <div className='disease-fields-grid'>
          <label>Disease Slug (KN):</label>
          <input
            type="text"
            placeholder="kn"
            value={diseaseSlug.kn}
            onChange={(e) => setDiseaseSlug({ ...diseaseSlug, kn: e.target.value })}
          />
        </div>

        <div className='disease-fields-grid'>
          <label>Disease Title (EN):</label>
          <input
            type="text"
            placeholder="en"
            value={diseaseTitle.en}
            onChange={(e) => setDiseaseTitle({ ...diseaseTitle, en: e.target.value })}
          />
        </div>
        <div className='disease-fields-grid'>
          <label>Disease Title (KN):</label>
          <input
            type="text"
            placeholder="kn"
            value={diseaseTitle.kn}
            onChange={(e) => setDiseaseTitle({ ...diseaseTitle, kn: e.target.value })}
          />
        </div>
        <div className='disease-fields-grid'>
          <label>Disease Description (EN):</label>
          <textarea
            placeholder="en"
            value={diseaseDescription.en}
            onChange={(e) => setDiseaseDescription({ ...diseaseDescription, en: e.target.value })}
          />
        </div>
        <div className='disease-fields-grid'>
          <label>Disease Description (KN):</label>
          <textarea
            placeholder="kn"
            value={diseaseDescription.kn}
            onChange={(e) => setDiseaseDescription({ ...diseaseDescription, kn: e.target.value })}
          />
        </div>
        <div>
          <label>Upload Main Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setDiseaseMainImage(e.target.files?.[0] || null)}
          />
        </div>


        <div>
          <label>Upload Disease Icon:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setDiseaseIcon(e.target.files?.[0] || null)}
          />
        </div>
      </div>
      {/* ---------------- What Is Disease Section ---------------- */}
      <hr />
      <div className="button-container">
        <h3>{whatIsDiseaseTabTitle.en}</h3>
        <button type="button" onClick={addWhatIsDiseaseRepeat}>
          <FaPlus /> Add What Is Disease Item
        </button>
      </div>
      {whatIsDiseaseRepeats.map((item, index) => (
        <div key={index} className="repeater">
          <label>What Is Disease Heading (EN):</label>
          <input
            type="text"
            placeholder="en"
            value={item.what_is_disease_heading.en}
            onChange={(e) => handleWhatIsDiseaseHeadingChange(index, 'en', e.target.value)}
          />
          <label>What Is Disease Heading (KN):</label>
          <input
            type="text"
            placeholder="kn"
            value={item.what_is_disease_heading.kn}
            onChange={(e) => handleWhatIsDiseaseHeadingChange(index, 'kn', e.target.value)}
          />
          <label>Upload Repeat Icon:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleWhatIsDiseaseRepeatIconChange(index, e.target.files?.[0] || null)}
          />
          <label>Upload Images (Multiple):</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleWhatIsDiseaseImagesChange(index, e.target.files)}
          />
          <label>What Is Disease Repeat Description (EN):</label>
          <input
            type="text"
            placeholder="en"
            value={item.what_is_disease_disease_repeat_description?.en || ''}
            onChange={(e) => handleWhatIsDiseaseRepeatDescriptionChange(index, 'en', e.target.value)}
          />
          <label>What Is Disease Repeat Description (KN):</label>
          <input
            type="text"
            placeholder="kn"
            value={item.what_is_disease_disease_repeat_description?.kn || ''}
            onChange={(e) => handleWhatIsDiseaseRepeatDescriptionChange(index, 'kn', e.target.value)}
          />
          {item.what_is_disease_description_repeater.map((rep: WhatIsDiseaseDescriptionRepeater, repIndex: number) => (
            <div key={repIndex} className="nested-repeater">
              <label>Description Repeat Heading (EN):</label>
              <input
                type="text"
                placeholder="en"
                value={rep.what_is_disease_heading_repeat.en}
                onChange={(e) =>
                  handleWhatIsDiseaseDescriptionRepeatChange(index, repIndex, 'what_is_disease_heading_repeat', 'en', e.target.value)
                }
              />
              <label>Description Repeat Heading (KN):</label>
              <input
                type="text"
                placeholder="kn"
                value={rep.what_is_disease_heading_repeat.kn}
                onChange={(e) =>
                  handleWhatIsDiseaseDescriptionRepeatChange(index, repIndex, 'what_is_disease_heading_repeat', 'kn', e.target.value)
                }
              />
              <label>Description Repeat (EN):</label>
              <input
                type="text"
                placeholder="en"
                value={rep.what_is_disease_description_repeat.en}
                onChange={(e) =>
                  handleWhatIsDiseaseDescriptionRepeatChange(index, repIndex, 'what_is_disease_description_repeat', 'en', e.target.value)
                }
              />
              <label>Description Repeat (KN):</label>
              <input
                type="text"
                placeholder="kn"
                value={rep.what_is_disease_description_repeat.kn}
                onChange={(e) =>
                  handleWhatIsDiseaseDescriptionRepeatChange(index, repIndex, 'what_is_disease_description_repeat', 'kn', e.target.value)
                }
              />
              <button type="button" onClick={() => removeWhatIsDiseaseDescriptionRepeat(index, repIndex)}>
                Remove Description Repeat
              </button>
            </div>
          ))}
          <div className="disease-button-container">
            <button type="button" onClick={() => addWhatIsDiseaseDescriptionRepeat(index)}>
              Add Description Repeat
            </button>
            <button type="button" onClick={() => removeWhatIsDiseaseRepeat(index)}>
              Remove What Is Disease Item
            </button>
          </div>
        </div>
      ))}




      {/* ---------------- Common Cause Section ---------------- */}
      <hr />
      <div className="button-container">
        <h3>{commonCauseTabTitle.en}</h3>
        <button type="button" onClick={addCommonCause}>
          <FaPlus /> Add Common Cause
        </button>
      </div>

      {commonCauses.map((item, index) => (
        <div key={index} className="repeater">
          <label>Cause Title (EN):</label>
          <input
            type="text"
            placeholder="en"
            value={item.cause_title.en}
            onChange={(e) => handleCommonCauseFieldChange(index, 'cause_title', 'en', e.target.value)}
          />
          <label>Cause Title (KN):</label>
          <input
            type="text"
            placeholder="kn"
            value={item.cause_title.kn}
            onChange={(e) => handleCommonCauseFieldChange(index, 'cause_title', 'kn', e.target.value)}
          />
          <label>Cause Paragraph (EN):</label>
          <input
            type="text"
            placeholder="en"
            value={item.cause_para.en}
            onChange={(e) => handleCommonCauseFieldChange(index, 'cause_para', 'en', e.target.value)}
          />
          <label>Cause Paragraph (KN):</label>
          <input
            type="text"
            placeholder="kn"
            value={item.cause_para.kn}
            onChange={(e) => handleCommonCauseFieldChange(index, 'cause_para', 'kn', e.target.value)}
          />
          <label>Cause Brief (EN):</label>
          <input
            type="text"
            placeholder="en"
            value={item.cause_brief.en}
            onChange={(e) => handleCommonCauseFieldChange(index, 'cause_brief', 'en', e.target.value)}
          />
          <label>Cause Brief (KN):</label>
          <input
            type="text"
            placeholder="kn"
            value={item.cause_brief.kn}
            onChange={(e) => handleCommonCauseFieldChange(index, 'cause_brief', 'kn', e.target.value)}
          />
          <label>Upload Cause Icon:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleCommonCauseIconChange(index, e.target.files?.[0] || null)}
          />
          {item.cause_repeat.map((rep: CauseRepeat, repIndex: number) => (
            <div key={repIndex} className="nested-repeater">
              <label>Cause Repeat Title (EN):</label>
              <input
                type="text"
                placeholder="en"
                value={rep.cause_repeat_title.en}
                onChange={(e) =>
                  handleCommonCauseRepeatChange(index, repIndex, 'cause_repeat_title', 'en', e.target.value)
                }
              />
              <label>Cause Repeat Title (KN):</label>
              <input
                type="text"
                placeholder="kn"
                value={rep.cause_repeat_title.kn}
                onChange={(e) =>
                  handleCommonCauseRepeatChange(index, repIndex, 'cause_repeat_title', 'kn', e.target.value)
                }
              />
              <label>Cause Repeat Description (EN):</label>
              <input
                type="text"
                placeholder="en"
                value={rep.cause_repeat_description.en}
                onChange={(e) =>
                  handleCommonCauseRepeatChange(index, repIndex, 'cause_repeat_description', 'en', e.target.value)
                }
              />
              <label>Cause Repeat Description (KN):</label>
              <input
                type="text"
                placeholder="kn"
                value={rep.cause_repeat_description.kn}
                onChange={(e) =>
                  handleCommonCauseRepeatChange(index, repIndex, 'cause_repeat_description', 'kn', e.target.value)
                }
              />
              <label>Upload Cause Repeat Icon:</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleCommonCauseRepeatIconChange(index, repIndex, e.target.files?.[0] || null)
                }
              />
              <button type="button" onClick={() => removeCommonCauseRepeat(index, repIndex)}>
                Remove Cause Repeat
              </button>
            </div>
          ))}
          <button type="button" onClick={() => addCommonCauseRepeat(index)}>
            Add Cause Repeat
          </button>
          <button type="button" onClick={() => removeCommonCause(index)}>
            Remove Common Cause
          </button>
        </div>
      ))}


      {/* ---------------- Symptoms Section ---------------- */}
      <hr />
      <div className="button-container">
        <h3>{symptomsTabTitle.en}</h3>
        <button type="button" onClick={addSymptom}><FaPlus /> Add Symptom</button>
      </div>
      {symptoms.map((item, index) => (
        <div key={index} className="repeater">
          <label>Symptoms Title (EN):</label>
          <input
            type="text"
            placeholder="en"
            value={item.symptoms_title.en}
            onChange={(e) => handleSymptomFieldChange(index, 'symptoms_title', 'en', e.target.value)}
          />
          <label>Symptoms Title (KN):</label>
          <input
            type="text"
            placeholder="kn"
            value={item.symptoms_title.kn}
            onChange={(e) => handleSymptomFieldChange(index, 'symptoms_title', 'kn', e.target.value)}
          />
          <label>Symptoms Paragraph (EN):</label>
          <input
            type="text"
            placeholder="en"
            value={item.symptoms_para.en}
            onChange={(e) => handleSymptomFieldChange(index, 'symptoms_para', 'en', e.target.value)}
          />
          <label>Symptoms Paragraph (KN):</label>
          <input
            type="text"
            placeholder="kn"
            value={item.symptoms_para.kn}
            onChange={(e) => handleSymptomFieldChange(index, 'symptoms_para', 'kn', e.target.value)}
          />
          <label>Symptoms Brief (EN):</label>
          <input
            type="text"
            placeholder="en"
            value={item.symptoms_brief.en}
            onChange={(e) => handleSymptomFieldChange(index, 'symptoms_brief', 'en', e.target.value)}
          />
          <label>Symptoms Brief (KN):</label>
          <input
            type="text"
            placeholder="kn"
            value={item.symptoms_brief.kn}
            onChange={(e) => handleSymptomFieldChange(index, 'symptoms_brief', 'kn', e.target.value)}
          />
          <label>Upload Symptoms Icon:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleSymptomsIconChange(index, e.target.files?.[0] || null)}
          />
          {item.symptoms_repeat.map((rep: SymptomRepeat, repIndex: number) => (
            <div key={repIndex} className="nested-repeater">
              <label>Symptoms Repeat Title (EN):</label>
              <input
                type="text"
                placeholder="en"
                value={rep.symptoms_repeat_title.en}
                onChange={(e) => handleSymptomRepeatChange(index, repIndex, 'symptoms_repeat_title', 'en', e.target.value)}
              />
              <label>Symptoms Repeat Title (KN):</label>
              <input
                type="text"
                placeholder="kn"
                value={rep.symptoms_repeat_title.kn}
                onChange={(e) => handleSymptomRepeatChange(index, repIndex, 'symptoms_repeat_title', 'kn', e.target.value)}
              />
              <label>Symptoms Repeat Description (EN):</label>
              <input
                type="text"
                placeholder="en"
                value={rep.symptoms_repeat_description.en}
                onChange={(e) => handleSymptomRepeatChange(index, repIndex, 'symptoms_repeat_description', 'en', e.target.value)}
              />
              <label>Symptoms Repeat Description (KN):</label>
              <input
                type="text"
                placeholder="kn"
                value={rep.symptoms_repeat_description.kn}
                onChange={(e) => handleSymptomRepeatChange(index, repIndex, 'symptoms_repeat_description', 'kn', e.target.value)}
              />
              <label>Upload Symptoms Repeat Icon:</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleSymptomRepeatIconChange(index, repIndex, e.target.files?.[0] || null)}
              />
              <button type="button" onClick={() => removeSymptomRepeat(index, repIndex)}>
                Remove Symptom Repeat
              </button>
            </div>
          ))}
          <button type="button" onClick={() => addSymptomRepeat(index)}>
            Add Symptom Repeat
          </button>
          <button type="button" onClick={() => removeSymptom(index)}>
            Remove Symptom
          </button>
        </div>
      ))}



      {/* ---------------- Prevention Tips Section ---------------- */}
      <hr />
      <div className="button-container">
        <h3>{preventionTipsTabTitle.en}</h3>
        <button type="button" onClick={addPreventionTip}><FaPlus /> Add Prevention Tip</button>
      </div>
      {preventionTips.map((item, index) => (
        <div key={index} className="repeater">
          <label>Prevention Tips Title (EN):</label>
          <input
            type="text"
            placeholder="en"
            value={item.prevention_tips_title.en}
            onChange={(e) => handlePreventionTipFieldChange(index, 'prevention_tips_title', 'en', e.target.value)}
          />
          <label>Prevention Tips Title (KN):</label>
          <input
            type="text"
            placeholder="kn"
            value={item.prevention_tips_title.kn}
            onChange={(e) => handlePreventionTipFieldChange(index, 'prevention_tips_title', 'kn', e.target.value)}
          />
          <label>Prevention Tips Paragraph (EN):</label>
          <input
            type="text"
            placeholder="en"
            value={item.prevention_tips_para.en}
            onChange={(e) => handlePreventionTipFieldChange(index, 'prevention_tips_para', 'en', e.target.value)}
          />
          <label>Prevention Tips Paragraph (KN):</label>
          <input
            type="text"
            placeholder="kn"
            value={item.prevention_tips_para.kn}
            onChange={(e) => handlePreventionTipFieldChange(index, 'prevention_tips_para', 'kn', e.target.value)}
          />
          <label>Prevention Tips Brief (EN):</label>
          <input
            type="text"
            placeholder="en"
            value={item.prevention_tips_brief.en}
            onChange={(e) => handlePreventionTipFieldChange(index, 'prevention_tips_brief', 'en', e.target.value)}
          />
          <label>Prevention Tips Brief (KN):</label>
          <input
            type="text"
            placeholder="kn"
            value={item.prevention_tips_brief.kn}
            onChange={(e) => handlePreventionTipFieldChange(index, 'prevention_tips_brief', 'kn', e.target.value)}
          />
          <label>Upload Prevention Tips Icon:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handlePreventionTipsIconChange(index, e.target.files?.[0] || null)}
          />
          {item.prevention_tips_repeat.map((rep: PreventionTipRepeat, repIndex: number) => (
            <div key={repIndex} className="nested-repeater">
              <label>Prevention Tip Repeat Title (EN):</label>
              <input
                type="text"
                placeholder="en"
                value={rep.prevention_tips_repeat_title.en}
                onChange={(e) => handlePreventionTipRepeatChange(index, repIndex, 'prevention_tips_repeat_title', 'en', e.target.value)}
              />
              <label>Prevention Tip Repeat Title (KN):</label>
              <input
                type="text"
                placeholder="kn"
                value={rep.prevention_tips_repeat_title.kn}
                onChange={(e) => handlePreventionTipRepeatChange(index, repIndex, 'prevention_tips_repeat_title', 'kn', e.target.value)}
              />
              <label>Prevention Tip Repeat Description (EN):</label>
              <input
                type="text"
                placeholder="en"
                value={rep.prevention_tips_repeat_description.en}
                onChange={(e) => handlePreventionTipRepeatChange(index, repIndex, 'prevention_tips_repeat_description', 'en', e.target.value)}
              />
              <label>Prevention Tip Repeat Description (KN):</label>
              <input
                type="text"
                placeholder="kn"
                value={rep.prevention_tips_repeat_description.kn}
                onChange={(e) => handlePreventionTipRepeatChange(index, repIndex, 'prevention_tips_repeat_description', 'kn', e.target.value)}
              />
              <label>Upload Prevention Tip Repeat Icon:</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handlePreventionTipRepeatIconChange(index, repIndex, e.target.files?.[0] || null)}
              />
              <button type="button" onClick={() => removePreventionTipRepeat(index, repIndex)}>
                Remove Prevention Tip Repeat
              </button>
            </div>
          ))}
          <button type="button" onClick={() => addPreventionTipRepeat(index)}>
            Add Prevention Tip Repeat
          </button>
          <button type="button" onClick={() => removePreventionTip(index)}>
            Remove Prevention Tip
          </button>
        </div>
      ))}


      {/* ---------------- Treatment Options Section ---------------- */}
      <hr />
      <div className="button-container">
        <h3>{treatmentOptionTabTitle.en}</h3>
        <button type="submit" className="disease-form-submit-button"> Submit Disease</button>
      </div>
      {treatmentOptions.map((item, index) => (
        <div key={index} className="repeater">
          <label>Treatment Option Title (EN):</label>
          <input
            type="text"
            placeholder="en"
            value={item.treatment_option_title.en}
            onChange={(e) => handleTreatmentOptionFieldChange(index, 'treatment_option_title', 'en', e.target.value)}
          />
          <label>Treatment Option Title (KN):</label>
          <input
            type="text"
            placeholder="kn"
            value={item.treatment_option_title.kn}
            onChange={(e) => handleTreatmentOptionFieldChange(index, 'treatment_option_title', 'kn', e.target.value)}
          />
          <label>Treatment Option Paragraph (EN):</label>
          <input
            type="text"
            placeholder="en"
            value={item.treatment_option_para.en}
            onChange={(e) => handleTreatmentOptionFieldChange(index, 'treatment_option_para', 'en', e.target.value)}
          />
          <label>Treatment Option Paragraph (KN):</label>
          <input
            type="text"
            placeholder="kn"
            value={item.treatment_option_para.kn}
            onChange={(e) => handleTreatmentOptionFieldChange(index, 'treatment_option_para', 'kn', e.target.value)}
          />
          <label>Treatment Option Brief (EN):</label>
          <input
            type="text"
            placeholder="en"
            value={item.treatment_option_brief.en}
            onChange={(e) => handleTreatmentOptionFieldChange(index, 'treatment_option_brief', 'en', e.target.value)}
          />
          <label>Treatment Option Brief (KN):</label>
          <input
            type="text"
            placeholder="kn"
            value={item.treatment_option_brief.kn}
            onChange={(e) => handleTreatmentOptionFieldChange(index, 'treatment_option_brief', 'kn', e.target.value)}
          />
          <label>Upload Treatment Option Icon:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleTreatmentOptionIconChange(index, e.target.files?.[0] || null)}
          />
          {item.treatment_option_repeat.map((rep: TreatmentOptionRepeat, repIndex: number) => (
            <div key={repIndex} className="nested-repeater">
              <label>Treatment Option Repeat Title (EN):</label>
              <input
                type="text"
                placeholder="en"
                value={rep.treatment_option_repeat_title.en}
                onChange={(e) => handleTreatmentOptionRepeatChange(index, repIndex, 'treatment_option_repeat_title', 'en', e.target.value)}
              />
              <label>Treatment Option Repeat Title (KN):</label>
              <input
                type="text"
                placeholder="kn"
                value={rep.treatment_option_repeat_title.kn}
                onChange={(e) => handleTreatmentOptionRepeatChange(index, repIndex, 'treatment_option_repeat_title', 'kn', e.target.value)}
              />
              <label>Treatment Option Repeat Description (EN):</label>
              <input
                type="text"
                placeholder="en"
                value={rep.treatment_option_repeat_description.en}
                onChange={(e) => handleTreatmentOptionRepeatChange(index, repIndex, 'treatment_option_repeat_description', 'en', e.target.value)}
              />
              <label>Treatment Option Repeat Description (KN):</label>
              <input
                type="text"
                placeholder="kn"
                value={rep.treatment_option_repeat_description.kn}
                onChange={(e) => handleTreatmentOptionRepeatChange(index, repIndex, 'treatment_option_repeat_description', 'kn', e.target.value)}
              />
              <label>Upload Treatment Option Repeat Icon:</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleTreatmentOptionRepeatIconChange(index, repIndex, e.target.files?.[0] || null)}
              />
              <button type="button" onClick={() => removeTreatmentOptionRepeat(index, repIndex)}>
                Remove Treatment Option Repeat
              </button>
            </div>
          ))}
          <button type="button" onClick={() => addTreatmentOptionRepeat(index)}>
            Add Treatment Option Repeat
          </button>
          <button type="button" onClick={() => removeTreatmentOption(index)}>
            Remove Treatment Option
          </button>
        </div>
      ))}
      <button type="button" onClick={addTreatmentOption}><FaPlus /> Add Treatment Option</button>

      <hr />


    </form>
  );
};

export default AddDisease;
