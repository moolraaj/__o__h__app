'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCreateDiseaseMutation } from '@/(store)/services/disease/diseaseApi';
 
 
const AddDisease = () => {
  const [createDisease] = useCreateDiseaseMutation();
  const router = useRouter();

 
  const [diseaseMainTitle, setDiseaseMainTitle] = useState({ en: '', kn: '' });
  const [diseaseMainImage, setDiseaseMainImage] = useState<File | null>(null);
  const [diseaseSlug, setDiseaseSlug] = useState('');
  const [diseaseTitle, setDiseaseTitle] = useState({ en: '', kn: '' });
  const [diseaseDescription, setDiseaseDescription] = useState({ en: '', kn: '' });
  const [diseaseIcon, setDiseaseIcon] = useState<File | null>(null);

 
  const [whatIsDiseaseTabTitle] = useState({ en: 'What is Disease', kn: 'ರೋಗದ ವಿವರ' });
  const [whatIsDiseaseRepeats, setWhatIsDiseaseRepeats] = useState([
    { content: { en: '', kn: '' }, images: [] as File[] }
  ]);

 
  const [commonCauseTabTitle] = useState({ en: 'Common Cause', kn: 'ಸಾಮಾನ್ಯ ಕಾರಣ' });
  const [commonCauses, setCommonCauses] = useState([
    { 
      cause: { en: '', kn: '' },
      causeIcon: null as File | null,
      causeRepeats: [{ detail: { en: '', kn: '' }, repeatIcon: null as File | null }]
    }
  ]);

  // Symptoms Section (with nested repeater)
  const [symptomsTabTitle] = useState({ en: 'Symptoms', kn: 'ಲಕ್ಷಣಗಳು' });
  const [symptoms, setSymptoms] = useState([
    { 
      symptom: { en: '', kn: '' },
      symptomsIcon: null as File | null,
      symptomsRepeats: [{ detail: { en: '', kn: '' }, repeatIcon: null as File | null }]
    }
  ]);

  // Prevention Tips Section (with nested repeater)
  const [preventionTipsTabTitle] = useState({ en: 'Prevention Tips', kn: 'ನಿರೋಧಕ ಸಲಹೆಗಳು' });
  const [preventionTips, setPreventionTips] = useState([
    { 
      tip: { en: '', kn: '' },
      preventionTipsIcon: null as File | null,
      preventionTipsRepeats: [{ detail: { en: '', kn: '' }, repeatIcon: null as File | null }]
    }
  ]);

  // Treatment Options Section (with nested repeater)
  const [treatmentOptionTabTitle] = useState({ en: 'Treatment Options', kn: 'ಚಿಕಿತ್ಸಾ ಆಯ್ಕೆಗಳು' });
  const [treatmentOptions, setTreatmentOptions] = useState([
    { 
      option: { en: '', kn: '' },
      treatmentOptionIcon: null as File | null,
      treatmentOptionRepeats: [{ detail: { en: '', kn: '' }, repeatIcon: null as File | null }]
    }
  ]);

  // Handlers for What Is Disease repeater
  const addWhatIsDiseaseRepeat = () => {
    setWhatIsDiseaseRepeats(prev => [...prev, { content: { en: '', kn: '' }, images: [] }]);
  };
  const removeWhatIsDiseaseRepeat = (index: number) => {
    setWhatIsDiseaseRepeats(prev => prev.filter((_, i) => i !== index));
  };
  const handleWhatIsDiseaseChange = (index: number, lang: 'en' | 'kn', value: string) => {
    setWhatIsDiseaseRepeats(prev => {
      const newArr = [...prev];
      newArr[index].content[lang] = value;
      return newArr;
    });
  };
  const handleWhatIsDiseaseImagesChange = (index: number, files: FileList | null) => {
    if (!files) return;
    setWhatIsDiseaseRepeats(prev => {
      const newArr = [...prev];
      newArr[index].images = Array.from(files);
      return newArr;
    });
  };

  // Handlers for Common Cause repeater and its nested repeater
  const addCommonCause = () => {
    setCommonCauses(prev => [
      ...prev,
      { 
        cause: { en: '', kn: '' }, 
        causeIcon: null, 
        causeRepeats: [{ detail: { en: '', kn: '' }, repeatIcon: null }] 
      }
    ]);
  };
  const removeCommonCause = (index: number) => {
    setCommonCauses(prev => prev.filter((_, i) => i !== index));
  };
  const handleCommonCauseChange = (index: number, lang: 'en' | 'kn', value: string) => {
    setCommonCauses(prev => {
      const newArr = [...prev];
      newArr[index].cause[lang] = value;
      return newArr;
    });
  };
  const handleCommonCauseIconChange = (index: number, file: File | null) => {
    setCommonCauses(prev => {
      const newArr = [...prev];
      newArr[index].causeIcon = file;
      return newArr;
    });
  };
  // Nested repeater for common cause
  const addCommonCauseRepeat = (causeIndex: number) => {
    setCommonCauses(prev => {
      const newArr = [...prev];
      newArr[causeIndex].causeRepeats.push({ detail: { en: '', kn: '' }, repeatIcon: null });
      return newArr;
    });
  };
  const removeCommonCauseRepeat = (causeIndex: number, repeatIndex: number) => {
    setCommonCauses(prev => {
      const newArr = [...prev];
      newArr[causeIndex].causeRepeats = newArr[causeIndex].causeRepeats.filter((_, i) => i !== repeatIndex);
      return newArr;
    });
  };
  const handleCommonCauseRepeatChange = (
    causeIndex: number,
    repeatIndex: number,
    lang: 'en' | 'kn',
    value: string
  ) => {
    setCommonCauses(prev => {
      const newArr = [...prev];
      newArr[causeIndex].causeRepeats[repeatIndex].detail[lang] = value;
      return newArr;
    });
  };
  const handleCommonCauseRepeatIconChange = (
    causeIndex: number,
    repeatIndex: number,
    file: File | null
  ) => {
    setCommonCauses(prev => {
      const newArr = [...prev];
      newArr[causeIndex].causeRepeats[repeatIndex].repeatIcon = file;
      return newArr;
    });
  };

  // Handlers for Symptoms repeater and its nested repeater
  const addSymptom = () => {
    setSymptoms(prev => [
      ...prev,
      { 
        symptom: { en: '', kn: '' },
        symptomsIcon: null,
        symptomsRepeats: [{ detail: { en: '', kn: '' }, repeatIcon: null }]
      }
    ]);
  };
  const removeSymptom = (index: number) => {
    setSymptoms(prev => prev.filter((_, i) => i !== index));
  };
  const handleSymptomChange = (index: number, lang: 'en' | 'kn', value: string) => {
    setSymptoms(prev => {
      const newArr = [...prev];
      newArr[index].symptom[lang] = value;
      return newArr;
    });
  };
  const handleSymptomsIconChange = (index: number, file: File | null) => {
    setSymptoms(prev => {
      const newArr = [...prev];
      newArr[index].symptomsIcon = file;
      return newArr;
    });
  };
  // Nested repeater for symptoms
  const addSymptomRepeat = (symptomIndex: number) => {
    setSymptoms(prev => {
      const newArr = [...prev];
      newArr[symptomIndex].symptomsRepeats.push({ detail: { en: '', kn: '' }, repeatIcon: null });
      return newArr;
    });
  };
  const removeSymptomRepeat = (symptomIndex: number, repeatIndex: number) => {
    setSymptoms(prev => {
      const newArr = [...prev];
      newArr[symptomIndex].symptomsRepeats = newArr[symptomIndex].symptomsRepeats.filter((_, i) => i !== repeatIndex);
      return newArr;
    });
  };
  const handleSymptomRepeatChange = (
    symptomIndex: number,
    repeatIndex: number,
    lang: 'en' | 'kn',
    value: string
  ) => {
    setSymptoms(prev => {
      const newArr = [...prev];
      newArr[symptomIndex].symptomsRepeats[repeatIndex].detail[lang] = value;
      return newArr;
    });
  };
  const handleSymptomRepeatIconChange = (
    symptomIndex: number,
    repeatIndex: number,
    file: File | null
  ) => {
    setSymptoms(prev => {
      const newArr = [...prev];
      newArr[symptomIndex].symptomsRepeats[repeatIndex].repeatIcon = file;
      return newArr;
    });
  };

  // Handlers for Prevention Tips repeater and its nested repeater
  const addPreventionTip = () => {
    setPreventionTips(prev => [
      ...prev,
      { 
        tip: { en: '', kn: '' },
        preventionTipsIcon: null,
        preventionTipsRepeats: [{ detail: { en: '', kn: '' }, repeatIcon: null }]
      }
    ]);
  };
  const removePreventionTip = (index: number) => {
    setPreventionTips(prev => prev.filter((_, i) => i !== index));
  };
  const handlePreventionTipChange = (index: number, lang: 'en' | 'kn', value: string) => {
    setPreventionTips(prev => {
      const newArr = [...prev];
      newArr[index].tip[lang] = value;
      return newArr;
    });
  };
  const handlePreventionTipsIconChange = (index: number, file: File | null) => {
    setPreventionTips(prev => {
      const newArr = [...prev];
      newArr[index].preventionTipsIcon = file;
      return newArr;
    });
  };
  // Nested repeater for prevention tips
  const addPreventionTipRepeat = (tipIndex: number) => {
    setPreventionTips(prev => {
      const newArr = [...prev];
      newArr[tipIndex].preventionTipsRepeats.push({ detail: { en: '', kn: '' }, repeatIcon: null });
      return newArr;
    });
  };
  const removePreventionTipRepeat = (tipIndex: number, repeatIndex: number) => {
    setPreventionTips(prev => {
      const newArr = [...prev];
      newArr[tipIndex].preventionTipsRepeats = newArr[tipIndex].preventionTipsRepeats.filter((_, i) => i !== repeatIndex);
      return newArr;
    });
  };
  const handlePreventionTipRepeatChange = (
    tipIndex: number,
    repeatIndex: number,
    lang: 'en' | 'kn',
    value: string
  ) => {
    setPreventionTips(prev => {
      const newArr = [...prev];
      newArr[tipIndex].preventionTipsRepeats[repeatIndex].detail[lang] = value;
      return newArr;
    });
  };
  const handlePreventionTipRepeatIconChange = (
    tipIndex: number,
    repeatIndex: number,
    file: File | null
  ) => {
    setPreventionTips(prev => {
      const newArr = [...prev];
      newArr[tipIndex].preventionTipsRepeats[repeatIndex].repeatIcon = file;
      return newArr;
    });
  };

  // Handlers for Treatment Options repeater and its nested repeater
  const addTreatmentOption = () => {
    setTreatmentOptions(prev => [
      ...prev,
      { 
        option: { en: '', kn: '' },
        treatmentOptionIcon: null,
        treatmentOptionRepeats: [{ detail: { en: '', kn: '' }, repeatIcon: null }]
      }
    ]);
  };
  const removeTreatmentOption = (index: number) => {
    setTreatmentOptions(prev => prev.filter((_, i) => i !== index));
  };
  const handleTreatmentOptionChange = (index: number, lang: 'en' | 'kn', value: string) => {
    setTreatmentOptions(prev => {
      const newArr = [...prev];
      newArr[index].option[lang] = value;
      return newArr;
    });
  };
  const handleTreatmentOptionIconChange = (index: number, file: File | null) => {
    setTreatmentOptions(prev => {
      const newArr = [...prev];
      newArr[index].treatmentOptionIcon = file;
      return newArr;
    });
  };
  // Nested repeater for treatment options
  const addTreatmentOptionRepeat = (optionIndex: number) => {
    setTreatmentOptions(prev => {
      const newArr = [...prev];
      newArr[optionIndex].treatmentOptionRepeats.push({ detail: { en: '', kn: '' }, repeatIcon: null });
      return newArr;
    });
  };
  const removeTreatmentOptionRepeat = (optionIndex: number, repeatIndex: number) => {
    setTreatmentOptions(prev => {
      const newArr = [...prev];
      newArr[optionIndex].treatmentOptionRepeats = newArr[optionIndex].treatmentOptionRepeats.filter((_, i) => i !== repeatIndex);
      return newArr;
    });
  };
  const handleTreatmentOptionRepeatChange = (
    optionIndex: number,
    repeatIndex: number,
    lang: 'en' | 'kn',
    value: string
  ) => {
    setTreatmentOptions(prev => {
      const newArr = [...prev];
      newArr[optionIndex].treatmentOptionRepeats[repeatIndex].detail[lang] = value;
      return newArr;
    });
  };
  const handleTreatmentOptionRepeatIconChange = (
    optionIndex: number,
    repeatIndex: number,
    file: File | null
  ) => {
    setTreatmentOptions(prev => {
      const newArr = [...prev];
      newArr[optionIndex].treatmentOptionRepeats[repeatIndex].repeatIcon = file;
      return newArr;
    });
  };

  // Submit handler: build FormData matching your API route keys
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
    formData.append(
      'what_is_disease_repeat',
      JSON.stringify(
        whatIsDiseaseRepeats.map(item => ({
          content: item.content,
          what_is_disease_repeat_images: [] // Images will be appended separately
        }))
      )
    );
    whatIsDiseaseRepeats.forEach((item, index) => {
      if (item.images.length) {
        item.images.forEach(file => {
          formData.append(`what_is_disease_repeat_images${index}`, file);
        });
      }
    });

    // Common Cause Section
    formData.append('common_cause_tab_title', JSON.stringify(commonCauseTabTitle));
    formData.append(
      'common_cause',
      JSON.stringify(
        commonCauses.map(cause => ({
          cause: cause.cause,
          cause_icon: '', // To be replaced by file upload if any
          cause_repeat: cause.causeRepeats.map(rep => ({
            detail: rep.detail,
            cause_repeat_icon: ''
          }))
        }))
      )
    );
    commonCauses.forEach((cause, index) => {
      if (cause.causeIcon) formData.append(`cause_icon${index}`, cause.causeIcon);
      cause.causeRepeats.forEach((rep, repIndex) => {
        if (rep.repeatIcon) formData.append(`cause_repeat_icon${index}_${repIndex}`, rep.repeatIcon);
      });
    });

    // Symptoms Section
    formData.append('symptoms_tab_title', JSON.stringify(symptomsTabTitle));
    formData.append(
      'symptoms',
      JSON.stringify(
        symptoms.map(item => ({
          symptom: item.symptom,
          symptoms_icon: '',
          symptoms_repeat: item.symptomsRepeats.map(rep => ({
            detail: rep.detail,
            symptoms_repeat_icon: ''
          }))
        }))
      )
    );
    symptoms.forEach((item, index) => {
      if (item.symptomsIcon) formData.append(`symptoms_icon${index}`, item.symptomsIcon);
      item.symptomsRepeats.forEach((rep, repIndex) => {
        if (rep.repeatIcon) formData.append(`symptoms_repeat_icon${index}_${repIndex}`, rep.repeatIcon);
      });
    });

    // Prevention Tips Section
    formData.append('prevention_tips_tab_title', JSON.stringify(preventionTipsTabTitle));
    formData.append(
      'prevention_tips',
      JSON.stringify(
        preventionTips.map(item => ({
          tip: item.tip,
          prevention_tips_icon: '',
          prevention_tips_repeat: item.preventionTipsRepeats.map(rep => ({
            detail: rep.detail,
            prevention_tips_repeat_icon: ''
          }))
        }))
      )
    );
    preventionTips.forEach((item, index) => {
      if (item.preventionTipsIcon) formData.append(`prevention_tips_icon${index}`, item.preventionTipsIcon);
      item.preventionTipsRepeats.forEach((rep, repIndex) => {
        if (rep.repeatIcon) formData.append(`prevention_tips_repeat_icon${index}_${repIndex}`, rep.repeatIcon);
      });
    });

    // Treatment Options Section
    formData.append('treatment_option_tab_title', JSON.stringify(treatmentOptionTabTitle));
    formData.append(
      'treatment_option',
      JSON.stringify(
        treatmentOptions.map(item => ({
          option: item.option,
          treatment_option_icon: '',
          treatment_option_repeat: item.treatmentOptionRepeats.map(rep => ({
            detail: rep.detail,
            treatment_option_repeat_icon: ''
          }))
        }))
      )
    );
    treatmentOptions.forEach((item, index) => {
      if (item.treatmentOptionIcon) formData.append(`treatment_option_icon${index}`, item.treatmentOptionIcon);
      item.treatmentOptionRepeats.forEach((rep, repIndex) => {
        if (rep.repeatIcon) formData.append(`treatment_option_repeat_icon${index}_${repIndex}`, rep.repeatIcon);
      });
    });

    try {
      const result = await createDisease(formData).unwrap();
      if (result) {
        router.push('/super-admin/diseases');
      }
    } catch (error) {
      if(error instanceof Error){
        toast.error('Failed to create disease');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2 className="form-title">Add Disease</h2>

      {/* Main Fields */}
      <div>
        <label>Main Title (EN):</label>
        <input
          type="text"
          value={diseaseMainTitle.en}
          onChange={(e) =>
            setDiseaseMainTitle({ ...diseaseMainTitle, en: e.target.value })
          }
        />
        <label>Main Title (KN):</label>
        <input
          type="text"
          value={diseaseMainTitle.kn}
          onChange={(e) =>
            setDiseaseMainTitle({ ...diseaseMainTitle, kn: e.target.value })
          }
        />
      </div>
      <div>
        <label>Upload Main Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setDiseaseMainImage(e.target.files?.[0] || null)
          }
        />
      </div>
      <div>
        <label>Disease Slug:</label>
        <input
          type="text"
          value={diseaseSlug}
          onChange={(e) => setDiseaseSlug(e.target.value)}
        />
      </div>
      <div>
        <label>Disease Title (EN):</label>
        <input
          type="text"
          value={diseaseTitle.en}
          onChange={(e) =>
            setDiseaseTitle({ ...diseaseTitle, en: e.target.value })
          }
        />
        <label>Disease Title (KN):</label>
        <input
          type="text"
          value={diseaseTitle.kn}
          onChange={(e) =>
            setDiseaseTitle({ ...diseaseTitle, kn: e.target.value })
          }
        />
      </div>
      <div>
        <label>Disease Description (EN):</label>
        <textarea
          value={diseaseDescription.en}
          onChange={(e) =>
            setDiseaseDescription({ ...diseaseDescription, en: e.target.value })
          }
        />
        <label>Disease Description (KN):</label>
        <textarea
          value={diseaseDescription.kn}
          onChange={(e) =>
            setDiseaseDescription({ ...diseaseDescription, kn: e.target.value })
          }
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

      {/* What Is Disease Section */}
      <hr />
      <h3>{whatIsDiseaseTabTitle.en}</h3>
      {whatIsDiseaseRepeats.map((item, index) => (
        <div key={index} className="repeater">
          <label>Content (EN):</label>
          <input
            type="text"
            value={item.content.en}
            onChange={(e) => handleWhatIsDiseaseChange(index, 'en', e.target.value)}
          />
          <label>Content (KN):</label>
          <input
            type="text"
            value={item.content.kn}
            onChange={(e) => handleWhatIsDiseaseChange(index, 'kn', e.target.value)}
          />
          <label>Upload Images:</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleWhatIsDiseaseImagesChange(index, e.target.files)}
          />
          <button type="button" onClick={() => removeWhatIsDiseaseRepeat(index)}>
            Remove What Is Disease Item
          </button>
        </div>
      ))}
      <button type="button" onClick={addWhatIsDiseaseRepeat}>
        Add What Is Disease Item
      </button>

      {/* Common Cause Section */}
      <hr />
      <h3>{commonCauseTabTitle.en}</h3>
      {commonCauses.map((cause, index) => (
        <div key={index} className="repeater">
          <label>Cause (EN):</label>
          <input
            type="text"
            value={cause.cause.en}
            onChange={(e) => handleCommonCauseChange(index, 'en', e.target.value)}
          />
          <label>Cause (KN):</label>
          <input
            type="text"
            value={cause.cause.kn}
            onChange={(e) => handleCommonCauseChange(index, 'kn', e.target.value)}
          />
          <label>Upload Cause Icon:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleCommonCauseIconChange(index, e.target.files?.[0] || null)}
          />
          {/* Nested repeater for cause repeats */}
          {cause.causeRepeats.map((rep, repIndex) => (
            <div key={repIndex} className="nested-repeater">
              <label>Cause Repeat Detail (EN):</label>
              <input
                type="text"
                value={rep.detail.en}
                onChange={(e) =>
                  handleCommonCauseRepeatChange(index, repIndex, 'en', e.target.value)
                }
              />
              <label>Cause Repeat Detail (KN):</label>
              <input
                type="text"
                value={rep.detail.kn}
                onChange={(e) =>
                  handleCommonCauseRepeatChange(index, repIndex, 'kn', e.target.value)
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
              <button
                type="button"
                onClick={() => removeCommonCauseRepeat(index, repIndex)}
              >
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
      <button type="button" onClick={addCommonCause}>
        Add Common Cause
      </button>

      {/* Symptoms Section */}
      <hr />
      <h3>{symptomsTabTitle.en}</h3>
      {symptoms.map((item, index) => (
        <div key={index} className="repeater">
          <label>Symptom (EN):</label>
          <input
            type="text"
            value={item.symptom.en}
            onChange={(e) => handleSymptomChange(index, 'en', e.target.value)}
          />
          <label>Symptom (KN):</label>
          <input
            type="text"
            value={item.symptom.kn}
            onChange={(e) => handleSymptomChange(index, 'kn', e.target.value)}
          />
          <label>Upload Symptom Icon:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleSymptomsIconChange(index, e.target.files?.[0] || null)}
          />
          {/* Nested repeater for symptom repeats */}
          {item.symptomsRepeats.map((rep, repIndex) => (
            <div key={repIndex} className="nested-repeater">
              <label>Symptom Repeat Detail (EN):</label>
              <input
                type="text"
                value={rep.detail.en}
                onChange={(e) =>
                  handleSymptomRepeatChange(index, repIndex, 'en', e.target.value)
                }
              />
              <label>Symptom Repeat Detail (KN):</label>
              <input
                type="text"
                value={rep.detail.kn}
                onChange={(e) =>
                  handleSymptomRepeatChange(index, repIndex, 'kn', e.target.value)
                }
              />
              <label>Upload Symptom Repeat Icon:</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleSymptomRepeatIconChange(index, repIndex, e.target.files?.[0] || null)
                }
              />
              <button
                type="button"
                onClick={() => removeSymptomRepeat(index, repIndex)}
              >
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
      <button type="button" onClick={addSymptom}>
        Add Symptom
      </button>

      {/* Prevention Tips Section */}
      <hr />
      <h3>{preventionTipsTabTitle.en}</h3>
      {preventionTips.map((item, index) => (
        <div key={index} className="repeater">
          <label>Prevention Tip (EN):</label>
          <input
            type="text"
            value={item.tip.en}
            onChange={(e) => handlePreventionTipChange(index, 'en', e.target.value)}
          />
          <label>Prevention Tip (KN):</label>
          <input
            type="text"
            value={item.tip.kn}
            onChange={(e) => handlePreventionTipChange(index, 'kn', e.target.value)}
          />
          <label>Upload Prevention Tip Icon:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handlePreventionTipsIconChange(index, e.target.files?.[0] || null)}
          />
          {/* Nested repeater for prevention tip repeats */}
          {item.preventionTipsRepeats.map((rep, repIndex) => (
            <div key={repIndex} className="nested-repeater">
              <label>Prevention Tip Repeat Detail (EN):</label>
              <input
                type="text"
                value={rep.detail.en}
                onChange={(e) =>
                  handlePreventionTipRepeatChange(index, repIndex, 'en', e.target.value)
                }
              />
              <label>Prevention Tip Repeat Detail (KN):</label>
              <input
                type="text"
                value={rep.detail.kn}
                onChange={(e) =>
                  handlePreventionTipRepeatChange(index, repIndex, 'kn', e.target.value)
                }
              />
              <label>Upload Prevention Tip Repeat Icon:</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handlePreventionTipRepeatIconChange(index, repIndex, e.target.files?.[0] || null)
                }
              />
              <button
                type="button"
                onClick={() => removePreventionTipRepeat(index, repIndex)}
              >
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
      <button type="button" onClick={addPreventionTip}>
        Add Prevention Tip
      </button>

      {/* Treatment Options Section */}
      <hr />
      <h3>{treatmentOptionTabTitle.en}</h3>
      {treatmentOptions.map((item, index) => (
        <div key={index} className="repeater">
          <label>Treatment Option (EN):</label>
          <input
            type="text"
            value={item.option.en}
            onChange={(e) => handleTreatmentOptionChange(index, 'en', e.target.value)}
          />
          <label>Treatment Option (KN):</label>
          <input
            type="text"
            value={item.option.kn}
            onChange={(e) => handleTreatmentOptionChange(index, 'kn', e.target.value)}
          />
          <label>Upload Treatment Option Icon:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleTreatmentOptionIconChange(index, e.target.files?.[0] || null)}
          />
          {/* Nested repeater for treatment option repeats */}
          {item.treatmentOptionRepeats.map((rep, repIndex) => (
            <div key={repIndex} className="nested-repeater">
              <label>Treatment Option Repeat Detail (EN):</label>
              <input
                type="text"
                value={rep.detail.en}
                onChange={(e) =>
                  handleTreatmentOptionRepeatChange(index, repIndex, 'en', e.target.value)
                }
              />
              <label>Treatment Option Repeat Detail (KN):</label>
              <input
                type="text"
                value={rep.detail.kn}
                onChange={(e) =>
                  handleTreatmentOptionRepeatChange(index, repIndex, 'kn', e.target.value)
                }
              />
              <label>Upload Treatment Option Repeat Icon:</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleTreatmentOptionRepeatIconChange(index, repIndex, e.target.files?.[0] || null)
                }
              />
              <button
                type="button"
                onClick={() => removeTreatmentOptionRepeat(index, repIndex)}
              >
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
      <button type="button" onClick={addTreatmentOption}>
        Add Treatment Option
      </button>

      <hr />
      <button type="submit" className="submit-button">
        Submit Disease
      </button>
    </form>
  );
};

export default AddDisease;
