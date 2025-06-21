'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCreateSliderMutation } from '@/(store)/services/slider/sliderApi';
 

const AddSlider = () => {
  const [createSlider] = useCreateSliderMutation();
  const router = useRouter();

  const [sliderImage, setSliderImage] = useState<File | null>(null);
  const [text, setText] = useState({ en: '', kn: '' });
  const [description, setDescription] = useState({ en: '', kn: '' });
  const [bodyItems, setBodyItems] = useState([
    { image: null as File | null, text: { en: '', kn: '' }, description: { en: '', kn: '' } }
  ]);

  const handleBodyChange = (index: number, field: 'text' | 'description', lang: 'en' | 'kn', value: string) => {
    setBodyItems(prev => {
      const updated = [...prev];
      updated[index][field][lang] = value;
      return updated;
    });
  };

  const handleBodyImageChange = (index: number, file: File | null) => {
    setBodyItems(prev => {
      const updated = [...prev];
      updated[index].image = file;
      return updated;
    });
  };

  const addBodyItem = () => {
    setBodyItems(prev => [...prev, { image: null, text: { en: '', kn: '' }, description: { en: '', kn: '' } }]);
  };

  const removeBodyItem = (index: number) => {
    setBodyItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    if (sliderImage) formData.append('sliderImage', sliderImage);
    formData.append('text', JSON.stringify(text));
    formData.append('description', JSON.stringify(description));
    formData.append('body', JSON.stringify(bodyItems.map(item => ({
      image: '',
      text: item.text,
      description: item.description
    }))));
    bodyItems.forEach((item, index) => {
      if (item.image) formData.append(`bodyImage${index}`, item.image);
    });

    try {
      const res = await createSlider(formData).unwrap();
      if(res){
        toast.success('Slider created successfully');
        router.push('/super-admin/slider');
      }
    } catch (err) {
      if(err instanceof Error){
        toast.error('Failed to create slider');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2 className="form-title">Add Slider</h2>

      <div>
        <label>Upload Slider Image:</label>
        <input type="file" accept="image/*" onChange={(e) => setSliderImage(e.target.files?.[0] || null)} />
      </div>

      <div>
        <label>Text (EN):</label>
        <input type="text" value={text.en} onChange={(e) => setText({ ...text, en: e.target.value })} />
        <label>Text (KN):</label>
        <input type="text" value={text.kn} onChange={(e) => setText({ ...text, kn: e.target.value })} />
      </div>

      <div>
        <label>Description (EN):</label>
        <textarea value={description.en} onChange={(e) => setDescription({ ...description, en: e.target.value })} />
        <label>Description (KN):</label>
        <textarea value={description.kn} onChange={(e) => setDescription({ ...description, kn: e.target.value })} />
      </div>

      <hr />
      <h3>Slider Body Items</h3>
      {bodyItems.map((item, index) => (
        <div key={index} className="repeater">
          <label>Body Text (EN):</label>
          <input type="text" value={item.text.en} onChange={(e) => handleBodyChange(index, 'text', 'en', e.target.value)} />
          <label>Body Text (KN):</label>
          <input type="text" value={item.text.kn} onChange={(e) => handleBodyChange(index, 'text', 'kn', e.target.value)} />

          <label>Body Description (EN):</label>
          <input type="text" value={item.description.en} onChange={(e) => handleBodyChange(index, 'description', 'en', e.target.value)} />
          <label>Body Description (KN):</label>
          <input type="text" value={item.description.kn} onChange={(e) => handleBodyChange(index, 'description', 'kn', e.target.value)} />

          <label>Upload Body Image:</label>
          <input type="file" accept="image/*" onChange={(e) => handleBodyImageChange(index, e.target.files?.[0] || null)} />

          <button type="button" onClick={() => removeBodyItem(index)}>
            Remove Body Item
          </button>
        </div>
      ))}
      <button type="button" onClick={addBodyItem}>Add Body Item</button>

      <hr />
      <button type="submit" className="submit-button">Submit Slider</button>
    </form>
  );
};

export default AddSlider;
