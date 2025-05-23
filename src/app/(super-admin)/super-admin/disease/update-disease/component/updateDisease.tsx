"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useGetDiseasesQuery, useUpdateDiseasesMutation } from '@/(store)/services/disease/diseaseApi';
import {
  Cause,
  CauseRepeat,
  PreventionTip,
  PreventionTipRepeat,
  Symptom,
  SymptomRepeat,
  TreatmentOption,
  TreatmentOptionRepeat,
  WhatIsDiseaseDescriptionRepeater,
  WhatIsDiseaseRepeat
} from '@/utils/Types';
import Loader from '@/(common)/Loader';

interface UpdateDiseaseProps {
  id: string;
}

const UpdateDisease = ({ id }: UpdateDiseaseProps) => {
  const router = useRouter();
  const { data, isLoading, error } = useGetDiseasesQuery({ id });
  const [updateDisease] = useUpdateDiseasesMutation();

  // Main Fields
  const [diseaseMainTitle, setDiseaseMainTitle] = useState({ en: '', kn: '' });
  const [diseaseMainImage, setDiseaseMainImage] = useState<File | null>(null);
  const [diseaseMainImageUrl, setDiseaseMainImageUrl] = useState('');
  const [diseaseSlug, setDiseaseSlug] = useState({ en: '', kn: '' });
  const [diseaseTitle, setDiseaseTitle] = useState({ en: '', kn: '' });
  const [diseaseDescription, setDiseaseDescription] = useState({ en: '', kn: '' });
  const [diseaseIcon, setDiseaseIcon] = useState<File | null>(null);
  const [diseaseIconUrl, setDiseaseIconUrl] = useState('');

  // Repeaters
  const [whatIsDiseaseRepeats, setWhatIsDiseaseRepeats] = useState<{
    what_is_disease_heading: { en: string; kn: string };
    what_is_disease_disease_repeat_icon: File | null;
    what_is_disease_disease_repeat_icon_url: string;
    what_is_disease_repeat_images: File[];
    what_is_disease_repeat_images_urls: string[];
    what_is_disease_disease_repeat_description: { en: string; kn: string };
    what_is_disease_description_repeater: WhatIsDiseaseDescriptionRepeater[];
  }[]>([]);

  const [commonCauses, setCommonCauses] = useState<{
    cause_title: { en: string; kn: string };
    cause_para: { en: string; kn: string };
    cause_brief: { en: string; kn: string };
    cause_icon: File | null;
    cause_icon_url: string;
    cause_repeat: CauseRepeat[] & { cause_repeat_icon_url?: string }[];
  }[]>([]);

  const [symptoms, setSymptoms] = useState<{
    symptoms_title: { en: string; kn: string };
    symptoms_para: { en: string; kn: string };
    symptoms_brief: { en: string; kn: string };
    symptoms_icon: File | null;
    symptoms_icon_url: string;
    symptoms_repeat: SymptomRepeat[] & { symptoms_repeat_icon_url?: string }[];
  }[]>([]);

  const [preventionTips, setPreventionTips] = useState<{
    prevention_tips_title: { en: string; kn: string };
    prevention_tips_para: { en: string; kn: string };
    prevention_tips_brief: { en: string; kn: string };
    prevention_tips_icon: File | null;
    prevention_tips_icon_url: string;
    prevention_tips_repeat: PreventionTipRepeat[] & { prevention_tips_repeat_icon_url?: string }[];
  }[]>([]);

  const [treatmentOptions, setTreatmentOptions] = useState<{
    treatment_option_title: { en: string; kn: string };
    treatment_option_para: { en: string; kn: string };
    treatment_option_brief: { en: string; kn: string };
    treatment_option_icon: File | null;
    treatment_option_icon_url: string;
    treatment_option_repeat: TreatmentOptionRepeat[] & { treatment_option_repeat_icon_url?: string }[];
  }[]>([]);

  // Prefill data
  useEffect(() => {
    const d = data?.result?.[0];
    if (!d) return;
    // Main
    setDiseaseMainTitle(d.disease_main_title);
    setDiseaseSlug(d.disease_slug);
    setDiseaseTitle(d.disease_title);
    setDiseaseDescription(d.disease_description);
    setDiseaseMainImageUrl(d.disease_main_image);
    setDiseaseIconUrl(d.disease_icon);
    // What is disease
    setWhatIsDiseaseRepeats(
      d.what_is_disease_repeat.map((item: WhatIsDiseaseRepeat) => ({
        what_is_disease_heading: item.what_is_disease_heading,
        what_is_disease_disease_repeat_icon: null,
        what_is_disease_disease_repeat_icon_url: item.what_is_disease_disease_repeat_icon || '',
        what_is_disease_repeat_images: [],
        what_is_disease_repeat_images_urls: item.what_is_disease_repeat_images || [],
        what_is_disease_disease_repeat_description: item.what_is_disease_disease_repeat_description,
        what_is_disease_description_repeater: item.what_is_disease_description_repeater || []
      }))
    );
    // Common causes
    setCommonCauses(
      d.common_cause.map((item: Cause) => ({
        cause_title: item.cause_title,
        cause_para: item.cause_para,
        cause_brief: item.cause_brief,
        cause_icon: null,
        cause_icon_url: item.cause_icon || '',
        cause_repeat: item.cause_repeat?.map((rep: CauseRepeat) => ({
          ...rep,
          cause_repeat_icon_url: rep.cause_repeat_icon || ''
        })) || []
      }))
    );
    // Symptoms
    setSymptoms(
      d.symptoms.map((item: Symptom) => ({
        symptoms_title: item.symptoms_title,
        symptoms_para: item.symptoms_para,
        symptoms_brief: item.symptoms_brief,
        symptoms_icon: null,
        symptoms_icon_url: item.symptoms_icon || '',
        symptoms_repeat: item.symptoms_repeat?.map((rep: SymptomRepeat) => ({
          ...rep,
          symptoms_repeat_icon_url: rep.symptoms_repeat_icon || ''
        })) || []
      }))
    );
    // Prevention tips
    setPreventionTips(
      d.prevention_tips.map((item: PreventionTip) => ({
        prevention_tips_title: item.prevention_tips_title,
        prevention_tips_para: item.prevention_tips_para,
        prevention_tips_brief: item.prevention_tips_brief,
        prevention_tips_icon: null,
        prevention_tips_icon_url: item.prevention_tips_icon || '',
        prevention_tips_repeat: item.prevention_tips_repeat?.map((rep: PreventionTipRepeat) => ({
          ...rep,
          prevention_tips_repeat_icon_url: rep.prevention_tips_repeat_icon || ''
        })) || []
      }))
    );
    // Treatment options
    setTreatmentOptions(
      d.treatment_option.map((item: TreatmentOption) => ({
        treatment_option_title: item.treatment_option_title,
        treatment_option_para: item.treatment_option_para,
        treatment_option_brief: item.treatment_option_brief,
        treatment_option_icon: null,
        treatment_option_icon_url: item.treatment_option_icon || '',
        treatment_option_repeat: item.treatment_option_repeat?.map((rep: TreatmentOptionRepeat) => ({
          ...rep,
          treatment_option_repeat_icon_url: rep.treatment_option_repeat_icon || ''
        })) || []
      }))
    );
  }, [data]);

  // Handlers
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: (f: File | null) => void,
    setUrl: (u: string) => void
  ) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setUrl(f ? URL.createObjectURL(f) : '');
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    // Main
    formData.append('disease_main_title', JSON.stringify(diseaseMainTitle));
    if (diseaseMainImage) formData.append('disease_main_image', diseaseMainImage);
    formData.append('disease_slug', JSON.stringify(diseaseSlug));
    formData.append('disease_title', JSON.stringify(diseaseTitle));
    formData.append('disease_description', JSON.stringify(diseaseDescription));
    if (diseaseIcon) formData.append('disease_icon', diseaseIcon);
    // What is disease
    formData.append('what_is_disease_repeat', JSON.stringify(
      whatIsDiseaseRepeats.map(item => ({
        what_is_disease_heading: item.what_is_disease_heading,
        what_is_disease_disease_repeat_description: item.what_is_disease_disease_repeat_description,
        what_is_disease_description_repeater: item.what_is_disease_description_repeater
      }))
    ));
    whatIsDiseaseRepeats.forEach((item, idx) => {
      if (item.what_is_disease_disease_repeat_icon)
        formData.append(`what_is_disease_disease_repeat_icon${idx}`, item.what_is_disease_disease_repeat_icon!);
      item.what_is_disease_repeat_images.forEach((f) =>
        formData.append(`what_is_disease_repeat_images${idx}`, f)
      );
    });
    // Common causes
    formData.append('common_cause', JSON.stringify(
      commonCauses.map(c => ({
        cause_title: c.cause_title,
        cause_para: c.cause_para,
        cause_brief: c.cause_brief,
        cause_repeat: c.cause_repeat.map(rep => ({
          cause_repeat_title: rep.cause_repeat_title,
          cause_repeat_description: rep.cause_repeat_description
        }))
      }))
    ));
    commonCauses.forEach((c, idx) => {
      if (c.cause_icon) formData.append(`cause_icon${idx}`, c.cause_icon);
      c.cause_repeat.forEach((rep, j) => {
        if (rep.cause_repeat_icon){
          formData.append(`cause_repeat_icon${idx}_${j}`, rep.cause_repeat_icon!)
        } ;
      });
    });
    // Symptoms
    formData.append('symptoms', JSON.stringify(
      symptoms.map(s => ({
        symptoms_title: s.symptoms_title,
        symptoms_para: s.symptoms_para,
        symptoms_brief: s.symptoms_brief,
        symptoms_repeat: s.symptoms_repeat.map(rep => ({
          symptoms_repeat_title: rep.symptoms_repeat_title,
          symptoms_repeat_description: rep.symptoms_repeat_description
        }))
      }))
    ));
    symptoms.forEach((s, idx) => {
      if (s.symptoms_icon) formData.append(`symptoms_icon${idx}`, s.symptoms_icon);
      s.symptoms_repeat.forEach((rep, j) => {
        if (rep.symptoms_repeat_icon)
          {formData.append(`symptoms_repeat_icon${idx}_${j}`,rep.symptoms_repeat_icon!)};
      });
    });
    // Prevention tips
    formData.append('prevention_tips', JSON.stringify(
      preventionTips.map(t => ({
        prevention_tips_title: t.prevention_tips_title,
        prevention_tips_para: t.prevention_tips_para,
        prevention_tips_brief: t.prevention_tips_brief,
        prevention_tips_repeat: t.prevention_tips_repeat.map(rep => ({
          prevention_tips_repeat_title: rep.prevention_tips_repeat_title,
          prevention_tips_repeat_description: rep.prevention_tips_repeat_description
        }))
      }))
    ));
    preventionTips.forEach((t, idx) => {
      if (t.prevention_tips_icon) formData.append(`prevention_tips_icon${idx}`, t.prevention_tips_icon);
      t.prevention_tips_repeat.forEach((rep, j) => {
        if (rep.prevention_tips_repeat_icon){
          formData.append(`prevention_tips_repeat_icon${idx}_${j}`,rep.prevention_tips_repeat_icon!)
        } ;
      });
    });
    // Treatment options
    formData.append('treatment_option', JSON.stringify(
      treatmentOptions.map(o => ({
        treatment_option_title: o.treatment_option_title,
        treatment_option_para: o.treatment_option_para,
        treatment_option_brief: o.treatment_option_brief,
        treatment_option_repeat: o.treatment_option_repeat.map(rep => ({
          treatment_option_repeat_title: rep.treatment_option_repeat_title,
          treatment_option_repeat_description: rep.treatment_option_repeat_description
        }))
      }))
    ));
    treatmentOptions.forEach((o, idx) => {
      if (o.treatment_option_icon) formData.append(`treatment_option_icon${idx}`, o.treatment_option_icon);
      o.treatment_option_repeat.forEach((rep, j) => {
        if (rep.treatment_option_repeat_icon){
          formData.append(`treatment_option_repeat_icon${idx}_${j}`, rep.treatment_option_repeat_icon!);
        } 
      });
    });

    try {
      await updateDisease({ id, formData }).unwrap();
      router.push('/super-admin/disease');
    } catch {
      toast.error('Failed to update disease');
    }
  };

  if (isLoading) return <Loader/>;
  if (error) return <p>Error loading disease data.</p>;

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2 className="form-title">Update Disease</h2>

      {/* Main Fields */}
      <div className='set_groups'>
        <div className='en_g'>
        <label>Main Title (EN):</label>
        <input type="text" value={diseaseMainTitle.en} onChange={e => setDiseaseMainTitle({ ...diseaseMainTitle, en: e.target.value })} />
        </div>
        <div className='kn_g'>
        <label>Main Title (KN):</label>
        <input type="text" value={diseaseMainTitle.kn} onChange={e => setDiseaseMainTitle({ ...diseaseMainTitle, kn: e.target.value })} />
        </div>
      </div>
      <div className='image_cust'>
        <label>Upload Main Image:</label>
        <input type="file" accept="image/*" onChange={e => handleFileChange(e, setDiseaseMainImage, setDiseaseMainImageUrl)} />
        {diseaseMainImageUrl && <img src={diseaseMainImageUrl} alt="Main" style={{ width: 100 }} />}
      </div>
      
      <div className='set_groups'>
          <div className='en_g'>
        <label>Disease Slug (EN):</label>
        <input type="text" value={diseaseSlug.en} onChange={e => setDiseaseSlug({ ...diseaseSlug, en: e.target.value })} />
        </div>
        <div className='kn_g'>
        <label>Disease Slug (KN):</label>
        <input type="text" value={diseaseSlug.kn} onChange={e => setDiseaseSlug({ ...diseaseSlug, kn: e.target.value })} />
        </div>
      </div>

      <div className='set_groups'>
           <div className='en_g'>
        <label>Disease Title (EN):</label>
        <input type="text" value={diseaseTitle.en} onChange={e => setDiseaseTitle({ ...diseaseTitle, en: e.target.value })} />
        </div>
         <div className='kn_g'>
        <label>Disease Title (KN):</label>
        <input type="text" value={diseaseTitle.kn} onChange={e => setDiseaseTitle({ ...diseaseTitle, kn: e.target.value })} />
      </div>
      </div>
     <div className="set_groups">

  <div className="en_g">
    <label>Disease Description (EN):</label>
    <textarea value={diseaseDescription.en}
      onChange={e =>
        setDiseaseDescription({
          ...diseaseDescription,
          en: e.target.value
        })
      }
    />
  </div>
  <div className="kn_g">
    <label>Disease Description (KN):</label>
    <textarea value={diseaseDescription.kn}
      onChange={e =>
        setDiseaseDescription({
          ...diseaseDescription,
          kn: e.target.value
        })
      }
    />
  </div>
</div>

      <div className='upload_diseases'>
        <label>Upload Disease Icon:</label>
        <input type="file" accept="image/*" onChange={e => handleFileChange(e, setDiseaseIcon, setDiseaseIconUrl)} />
        {diseaseIconUrl && <img src={diseaseIconUrl} alt="Icon" style={{ width: 100 }} />}
      </div>

      {/* What Is Disease Section */}
      <hr />
      <h3>What Is Disease</h3>
      {whatIsDiseaseRepeats.map((item, i) => (
        <div key={i} className="repeater">
            <div className='en_g'>
          <label>Heading (EN):</label>
          <input type="text" value={item.what_is_disease_heading.en} onChange={e => {
            const a = [...whatIsDiseaseRepeats]; a[i].what_is_disease_heading.en = e.target.value; setWhatIsDiseaseRepeats(a);
            
          }} /></div>
             <div className='kn_g'>
          <label>Heading (KN):</label>
          <input type="text" value={item.what_is_disease_heading.kn} onChange={e => {
            const a = [...whatIsDiseaseRepeats]; a[i].what_is_disease_heading.kn = e.target.value; setWhatIsDiseaseRepeats(a);
          }} /></div>
          <div className='upload_custom'>
          <label>Upload Icon:</label>
          <input type="file" accept="image/*" onChange={e => handleFileChange(e, f => {
            const a = [...whatIsDiseaseRepeats]; a[i].what_is_disease_disease_repeat_icon = f; setWhatIsDiseaseRepeats(a);
          }, url => {
            const a = [...whatIsDiseaseRepeats]; a[i].what_is_disease_disease_repeat_icon_url = url; setWhatIsDiseaseRepeats(a);
          })} />
          {item.what_is_disease_disease_repeat_icon_url && <img src={item.what_is_disease_disease_repeat_icon_url} alt="Icon" style={{ width: 100 }} />}
          <label>Upload Images:</label>
          <input type="file" multiple accept="image/*" onChange={e => {
            const files = e.target.files ? Array.from(e.target.files) : [];
            const urls = files.map(f => URL.createObjectURL(f));
            const a = [...whatIsDiseaseRepeats]; a[i].what_is_disease_repeat_images = files;
            a[i].what_is_disease_repeat_images_urls = urls; setWhatIsDiseaseRepeats(a);
          }} />
          <div className='image_bundle'>
          {item.what_is_disease_repeat_images_urls.map((u, j) => <img key={j} src={u} alt="Repeat" style={{ width: 100 }} />)}
          </div>
          </div>

           <div className='en_g'>
          <label>Description (EN):</label>
          <input type="text" value={item.what_is_disease_disease_repeat_description.en} onChange={e => {
            const a = [...whatIsDiseaseRepeats]; a[i].what_is_disease_disease_repeat_description.en = e.target.value; setWhatIsDiseaseRepeats(a);
          }} />
          </div>
           <div className='en_g'>
          <label>Description (KN):</label>
          <input type="text" value={item.what_is_disease_disease_repeat_description.kn} onChange={e => {
            const a = [...whatIsDiseaseRepeats]; a[i].what_is_disease_disease_repeat_description.kn = e.target.value; setWhatIsDiseaseRepeats(a);
          }} />
          </div>
          {item.what_is_disease_description_repeater.map((rep, k) => (
            <div key={k} className="nested-repeater">
               <div className='en_g'>
              <label>Sub-heading (EN):</label>
              <input type="text" value={rep.what_is_disease_heading_repeat.en} onChange={e => {
                const a = [...whatIsDiseaseRepeats]; a[i].what_is_disease_description_repeater[k].what_is_disease_heading_repeat.en = e.target.value; setWhatIsDiseaseRepeats(a);
              }} />
              </div>
              <div className='kn_g'>
              <label>Sub-heading (KN):</label>
              <input type="text" value={rep.what_is_disease_heading_repeat.kn} onChange={e => {
                const a = [...whatIsDiseaseRepeats]; a[i].what_is_disease_description_repeater[k].what_is_disease_heading_repeat.kn = e.target.value; setWhatIsDiseaseRepeats(a);
              }} />
              </div>
              <div className='en_g'>
              <label>Sub-desc (EN):</label>
              <input type="text" value={rep.what_is_disease_description_repeat.en} onChange={e => {
                const a = [...whatIsDiseaseRepeats]; a[i].what_is_disease_description_repeater[k].what_is_disease_description_repeat.en = e.target.value; setWhatIsDiseaseRepeats(a);
              }} />
              </div>
              <div className='en_g'>
              <label>Sub-desc (KN):</label>
              <input type="text" value={rep.what_is_disease_description_repeat.kn} onChange={e => {
                const a = [...whatIsDiseaseRepeats]; a[i].what_is_disease_description_repeater[k].what_is_disease_description_repeat.kn = e.target.value; setWhatIsDiseaseRepeats(a);
              }} />
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Common Causes */}
      <hr />
      <h3>Common Causes</h3>
      {commonCauses.map((c, i) => (
        <div key={i} className="repeater">
          <div className='en_g'>
          <label>Title (EN):</label>
          <input type="text" value={c.cause_title.en} onChange={e => {
            const a = [...commonCauses]; a[i].cause_title.en = e.target.value; setCommonCauses(a);
          }} />
          </div>
            <div className='kn_g'>
          <label>Title (KN):</label>
          <input type="text" value={c.cause_title.kn} onChange={e => {
            const a = [...commonCauses]; a[i].cause_title.kn = e.target.value; setCommonCauses(a);
          }} />
          </div>
           <div className='en_g'>
          <label>Paragraph (EN):</label>
          <input type="text" value={c.cause_para.en} onChange={e => {
            const a = [...commonCauses]; a[i].cause_para.en = e.target.value; setCommonCauses(a);
          }} />
          </div>
             <div className='kn_g'>
          <label>Paragraph (KN):</label>
          <input type="text" value={c.cause_para.kn} onChange={e => {
            const a = [...commonCauses]; a[i].cause_para.kn = e.target.value; setCommonCauses(a);
          }} />
          </div>

              <div className='en_g'>
          <label>Brief (EN):</label>
          <input type="text" value={c.cause_brief.en} onChange={e => {
            const a = [...commonCauses]; a[i].cause_brief.en = e.target.value; setCommonCauses(a);
          }} />
          </div>
             <div className='kn_g'>
          <label>Brief (KN):</label>
          <input type="text" value={c.cause_brief.kn} onChange={e => {
            const a = [...commonCauses]; a[i].cause_brief.kn = e.target.value; setCommonCauses(a);
          }} />
          </div>
          <div className='upload_custom'>
          <label>Upload Icon:</label>
          <input type="file" accept="image/*" onChange={e => handleFileChange(e, f => {
            const a = [...commonCauses]; a[i].cause_icon = f; setCommonCauses(a);
          }, url => {
            const a = [...commonCauses]; a[i].cause_icon_url = url; setCommonCauses(a);
          })} />
          
          {c.cause_icon_url && <img src={c.cause_icon_url} alt="Cause" style={{ width: 100 }} />}
          </div>
          {c.cause_repeat.map((rep, j) => (
            <div key={j} className="nested-repeater">
               <div className='en_g'>
              <label>Repeat Title (EN):</label>
              <input type="text" value={rep.cause_repeat_title.en} onChange={e => {
                const a = [...commonCauses]; a[i].cause_repeat[j].cause_repeat_title.en = e.target.value; setCommonCauses(a);
              }} />
              </div>
               <div className='kn_g'>
              <label>Repeat Title (KN):</label>
              <input type="text" value={rep.cause_repeat_title.kn} onChange={e => {
                const a = [...commonCauses]; a[i].cause_repeat[j].cause_repeat_title.kn = e.target.value; setCommonCauses(a);
              }} />
              </div>
               <div className='kn_g'>
              <label>Repeat Desc (EN):</label>
              <input type="text" value={rep.cause_repeat_description.en} onChange={e => {
                const a = [...commonCauses]; a[i].cause_repeat[j].cause_repeat_description.en = e.target.value; setCommonCauses(a);
              }} />
              </div>
               <div className='kn_g'>
              <label>Repeat Desc (KN):</label>
              <input type="text" value={rep.cause_repeat_description.kn} onChange={e => {
                const a = [...commonCauses]; a[i].cause_repeat[j].cause_repeat_description.kn = e.target.value; setCommonCauses(a);
              }} />
              </div>
              <label>Upload Repeat Icon:</label>
              <input type="file" accept="image/*" onChange={e => handleFileChange(e, f => {
                const a = [...commonCauses]; a[i].cause_repeat[j].cause_repeat_icon = f; setCommonCauses(a);
              }, url => {
                const a = [...commonCauses]; a[i].cause_repeat[j].cause_repeat_icon_url = url; setCommonCauses(a);
              })} />
              {/* { rep.cause_repeat_icon_url && <img src={rep.cause_repeat_icon_url} alt="Repeat" style={{ width: 100 }} />}  */}
            </div>
          ))}
        </div>
      ))}

      {/* Symptoms */}
      <hr />
      <h3>Symptoms</h3>
      {symptoms.map((s, i) => (
        <div key={i} className="repeater">
           <div className='en_g'>
          <label>Title (EN):</label>
          <input type="text" value={s.symptoms_title.en} onChange={e => {
            const a = [...symptoms]; a[i].symptoms_title.en = e.target.value; setSymptoms(a);
          }} />
          </div>
          <div className='kn_g'>
          <label>Title (KN):</label>
          <input type="text" value={s.symptoms_title.kn} onChange={e => {
            const a = [...symptoms]; a[i].symptoms_title.kn = e.target.value; setSymptoms(a);
          }} />
          </div>
          <div className='en_g'>
          <label>Paragraph (EN):</label>
          <input type="text" value={s.symptoms_para.en} onChange={e => {
            const a = [...symptoms]; a[i].symptoms_para.en = e.target.value; setSymptoms(a);
          }} />
          </div>
          <div className='kn_g'>
          <label>Paragraph (KN):</label>
          <input type="text" value={s.symptoms_para.kn} onChange={e => {
            const a = [...symptoms]; a[i].symptoms_para.kn = e.target.value; setSymptoms(a);
          }} />
          </div>
          <div className='en_g'>
          <label>Brief (EN):</label>
          <input type="text" value={s.symptoms_brief.en} onChange={e => {
            const a = [...symptoms]; a[i].symptoms_brief.en = e.target.value; setSymptoms(a);
          }} />
          </div>
          <div className='en_g'>
          <label>Brief (KN):</label>
          <input type="text" value={s.symptoms_brief.kn} onChange={e => {
            const a = [...symptoms]; a[i].symptoms_brief.kn = e.target.value; setSymptoms(a);
          }} />
          </div>
          <div className='upload_custom'>
          <label>Upload Icon:</label>
          <input type="file" accept="image/*" onChange={e => handleFileChange(e, f => {
            const a = [...symptoms]; a[i].symptoms_icon = f; setSymptoms(a);
          }, url => {
            const a = [...symptoms]; a[i].symptoms_icon_url = url; setSymptoms(a);
          })} />
          {s.symptoms_icon_url && <img src={s.symptoms_icon_url} alt="Symptom" style={{ width: 100 }} />}
          </div>
          {s.symptoms_repeat.map((rep, j) => (
            <div key={j} className="nested-repeater">
              <div className='en_g'>
              <label>Repeat Title (EN):</label>               
              <input type="text" value={rep.symptoms_repeat_title.en} onChange={e => {
                const a = [...symptoms]; a[i].symptoms_repeat[j].symptoms_repeat_title.en = e.target.value; setSymptoms(a);
              }} />
              </div>
               <div className='kn_g'>
              <label>Repeat Title (KN):</label>
              <input type="text" value={rep.symptoms_repeat_title.kn} onChange={e => {
                const a = [...symptoms]; a[i].symptoms_repeat[j].symptoms_repeat_title.kn = e.target.value; setSymptoms(a);
              }} />
              </div>
               <div className='en_g'>
              <label>Repeat Desc (EN):</label>
              <input type="text" value={rep.symptoms_repeat_description.en} onChange={e => {
                const a = [...symptoms]; a[i].symptoms_repeat[j].symptoms_repeat_description.en = e.target.value; setSymptoms(a);
              }} />
              </div>
               <div className='kn_g'>
              <label>Repeat Desc (KN):</label>
              <input type="text" value={rep.symptoms_repeat_description.kn} onChange={e => {
                const a = [...symptoms]; a[i].symptoms_repeat[j].symptoms_repeat_description.kn = e.target.value; setSymptoms(a);
              }} />
              </div>

              <label>Upload Repeat Icon:</label>
              <input type="file" accept="image/*" onChange={e => handleFileChange(e, f => {
                const a = [...symptoms]; (a[i].symptoms_repeat[j]).symptoms_repeat_icon = f; setSymptoms(a);
              }, url => {
                const a = [...symptoms]; (a[i].symptoms_repeat[j] ).symptoms_repeat_icon_url = url; setSymptoms(a);
              })} />
              {/* { (rep as any).symptoms_repeat_icon_url && <img src={(rep as any).symptoms_repeat_icon_url} alt="Repeat" style={{ width: 100 }} />}  */}
            </div>
          ))}
        </div>
      ))}

      {/* Prevention Tips */}
      <hr />
      <h3>Prevention Tips</h3>
      {preventionTips.map((t, i) => (
        <div key={i} className="repeater">
           <div className='en_g'>
          <label>Title (EN):</label>
          <input type="text" value={t.prevention_tips_title.en} onChange={e => {
            const a = [...preventionTips]; a[i].prevention_tips_title.en = e.target.value; setPreventionTips(a);
          }} />
          </div>
           <div className='kn_g'>
          <label>Title (KN):</label>
          <input type="text" value={t.prevention_tips_title.kn} onChange={e => {
            const a = [...preventionTips]; a[i].prevention_tips_title.kn = e.target.value; setPreventionTips(a);
          }} />
          </div>
           <div className='en_g'>
          <label>Paragraph (EN):</label>
          <input type="text" value={t.prevention_tips_para.en} onChange={e => {
            const a = [...preventionTips]; a[i].prevention_tips_para.en = e.target.value; setPreventionTips(a);
          }} />
          </div>
           <div className='kn_g'>
          <label>Paragraph (KN):</label>
          <input type="text" value={t.prevention_tips_para.kn} onChange={e => {
            const a = [...preventionTips]; a[i].prevention_tips_para.kn = e.target.value; setPreventionTips(a);
          }} />
          </div>
           <div className='en_g'>
          <label>Brief (EN):</label>
          <input type="text" value={t.prevention_tips_brief.en} onChange={e => {
            const a = [...preventionTips]; a[i].prevention_tips_brief.en = e.target.value; setPreventionTips(a);
          }} />
          </div>
           <div className='kn_g'>
          <label>Brief (KN):</label>
          <input type="text" value={t.prevention_tips_brief.kn} onChange={e => {
            const a = [...preventionTips]; a[i].prevention_tips_brief.kn = e.target.value; setPreventionTips(a);
          }} />
          </div>
          <div className='upload_custom'>
          <label>Upload Icon:</label>
          <input type="file" accept="image/*" onChange={e => handleFileChange(e, f => {
            const a = [...preventionTips]; a[i].prevention_tips_icon = f; setPreventionTips(a);
          }, url => {
            const a = [...preventionTips]; a[i].prevention_tips_icon_url = url; setPreventionTips(a);
          })} />
          {t.prevention_tips_icon_url && <img src={t.prevention_tips_icon_url} alt="Tip" style={{ width: 100 }} />}
          </div>
          {t.prevention_tips_repeat.map((rep, j) => (
            <div key={j} className="nested-repeater">
               <div className='en_g'>
              <label>Repeat Title (EN):</label>
              <input type="text" value={rep.prevention_tips_repeat_title.en} onChange={e => {
                const a = [...preventionTips]; a[i].prevention_tips_repeat[j].prevention_tips_repeat_title.en = e.target.value; setPreventionTips(a);
              }} />
              </div>
               <div className='kn_g'>
              <label>Repeat Title (KN):</label>
              <input type="text" value={rep.prevention_tips_repeat_title.kn} onChange={e => {
                const a = [...preventionTips]; a[i].prevention_tips_repeat[j].prevention_tips_repeat_title.kn = e.target.value; setPreventionTips(a);
              }} />
              </div>
               <div className='en_g'>
              <label>Repeat Desc (EN):</label>
              <input type="text" value={rep.prevention_tips_repeat_description.en} onChange={e => {
                const a = [...preventionTips]; a[i].prevention_tips_repeat[j].prevention_tips_repeat_description.en = e.target.value; setPreventionTips(a);
              }} />
              </div>
               <div className='kn_g'>
              <label>Repeat Desc (KN):</label>
              <input type="text" value={rep.prevention_tips_repeat_description.kn} onChange={e => {
                const a = [...preventionTips]; a[i].prevention_tips_repeat[j].prevention_tips_repeat_description.kn = e.target.value; setPreventionTips(a);
              }} />
              </div>
             
              <label>Upload Repeat Icon:</label>
              <input type="file" accept="image/*" onChange={e => handleFileChange(e, f => {
                const a = [...preventionTips]; (a[i].prevention_tips_repeat[j]).prevention_tips_repeat_icon = f; setPreventionTips(a);
              }, url => {
                const a = [...preventionTips]; (a[i].prevention_tips_repeat[j]).prevention_tips_repeat_icon_url = url; setPreventionTips(a);
              })} />
              {/* { (rep as any).prevention_tips_repeat_icon_url && <img src={(rep as any).prevention_tips_repeat_icon_url} alt="Repeat" style={{ width: 100 }} />}  */}
            </div>
          ))}
        </div>
      ))}

      {/* Treatment Options */}
      <hr />
      <h3>Treatment Options</h3>
      {treatmentOptions.map((o, i) => (
        <div key={i} className="repeater">
           <div className='en_g'>
          <label>Title (EN):</label>
          <input type="text" value={o.treatment_option_title.en} onChange={e => {
            const a = [...treatmentOptions]; a[i].treatment_option_title.en = e.target.value; setTreatmentOptions(a);
          }} />
          </div>
           <div className='kn_g'>
          <label>Title (KN):</label>
          <input type="text" value={o.treatment_option_title.kn} onChange={e => {
            const a = [...treatmentOptions]; a[i].treatment_option_title.kn = e.target.value; setTreatmentOptions(a);
          }} />
          </div>
           <div className='en_g'>
          <label>Paragraph (EN):</label>
          <input type="text" value={o.treatment_option_para.en} onChange={e => {
            const a = [...treatmentOptions]; a[i].treatment_option_para.en = e.target.value; setTreatmentOptions(a);
          }} />
          </div>
           <div className='kn_g'>
          <label>Paragraph (KN):</label>
          <input type="text" value={o.treatment_option_para.kn} onChange={e => {
            const a = [...treatmentOptions]; a[i].treatment_option_para.kn = e.target.value; setTreatmentOptions(a);
          }} />
          </div>
           <div className='en_g'>
          <label>Brief (EN):</label>
          <input type="text" value={o.treatment_option_brief.en} onChange={e => {
            const a = [...treatmentOptions]; a[i].treatment_option_brief.en = e.target.value; setTreatmentOptions(a);
          }} />
          </div>
           <div className='kn_g'>
          <label>Brief (KN):</label>
          <input type="text" value={o.treatment_option_brief.kn} onChange={e => {
            const a = [...treatmentOptions]; a[i].treatment_option_brief.kn = e.target.value; setTreatmentOptions(a);
          }} />
          </div>
          <div className='upload_custom'>
          <label>Upload Icon:</label>
          <input type="file" accept="image/*" onChange={e => handleFileChange(e, f => {
            const a = [...treatmentOptions]; a[i].treatment_option_icon = f; setTreatmentOptions(a);
          }, url => {
            const a = [...treatmentOptions]; a[i].treatment_option_icon_url = url; setTreatmentOptions(a);
          })} />
          {o.treatment_option_icon_url && <img src={o.treatment_option_icon_url} alt="Option" style={{ width: 100 }} />}
          </div>
          {o.treatment_option_repeat.map((rep, j) => (
            <div key={j} className="nested-repeater">
                  <div className='kn_g'>
              <label>Repeat Title (EN):</label>
              <input type="text" value={rep.treatment_option_repeat_title.en} onChange={e => {
                const a = [...treatmentOptions]; a[i].treatment_option_repeat[j].treatment_option_repeat_title.en = e.target.value; setTreatmentOptions(a);
              }} />
              </div>
               <div className='kn_g'>
              <label>Repeat Title (KN):</label>
              <input type="text" value={rep.treatment_option_repeat_title.kn} onChange={e => {
                const a = [...treatmentOptions]; a[i].treatment_option_repeat[j].treatment_option_repeat_title.kn = e.target.value; setTreatmentOptions(a);
              }} />
              </div>
              <div className='en_g'>
              <label>Repeat Desc (EN):</label>
              <input type="text" value={rep.treatment_option_repeat_description.en} onChange={e => {
                const a = [...treatmentOptions]; a[i].treatment_option_repeat[j].treatment_option_repeat_description.en = e.target.value; setTreatmentOptions(a);
              }} />
              </div>
               <div className='kn_g'>
              <label>Repeat Desc (KN):</label>
              <input type="text" value={rep.treatment_option_repeat_description.kn} onChange={e => {
                const a = [...treatmentOptions]; a[i].treatment_option_repeat[j].treatment_option_repeat_description.kn = e.target.value; setTreatmentOptions(a);
              }} />
              </div>
              <label>Upload Repeat Icon:</label>
              <input type="file" accept="image/*" onChange={e => handleFileChange(e, f => {
                const a = [...treatmentOptions]; (a[i].treatment_option_repeat[j]  ).treatment_option_repeat_icon = f; setTreatmentOptions(a);
              }, url => {
                const a = [...treatmentOptions]; (a[i].treatment_option_repeat[j] ).treatment_option_repeat_icon_url = url; setTreatmentOptions(a);
              })} />
              {/* { (rep as any).treatment_option_repeat_icon_url && <img src={(rep as any).treatment_option_repeat_icon_url} alt="Repeat" style={{ width: 100 }} />}  */}
            </div>
          ))}
      
    
        </div>

      ))}


      <hr />
      <button type="submit" className="submit-button">Update Disease</button>
    </form>
  );
};

export default UpdateDisease;
