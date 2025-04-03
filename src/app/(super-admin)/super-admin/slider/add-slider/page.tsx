'use client';

import { useCreateSliderMutation } from '@/(store)/services/slider/sliderApi';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';

const AddSlider = () => {
    const [createSlider] = useCreateSliderMutation();
    const [sliderImage, setSliderImage] = useState<File | null>(null);
    const [text, setText] = useState({ en: '', kn: '' });
    const [description, setDescription] = useState({ en: '', kn: '' });
    const [bodyItems, setBodyItems] = useState([{ text: { en: '', kn: '' }, description: { en: '', kn: '' }, image: null as File | null }]);
  
    const router = useRouter();
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
  
      const formData = new FormData();
      if (sliderImage) formData.append('sliderImage', sliderImage);
      formData.append('text', JSON.stringify(text));
      formData.append('description', JSON.stringify(description));
      formData.append('body', JSON.stringify(bodyItems.map((b) => ({ text: b.text, description: b.description }))));
  
      bodyItems.forEach((item, index) => {
        if (item.image) formData.append(`bodyImage${index}`, item.image);
      });
  
      try {
        const result = await createSlider(formData).unwrap();
        if(result){

            router.push('/super-admin/slider');
        }
      } catch (error) {
        if(error instanceof Error){

            toast.error('Failed to create slider');
        }
      }
    };

    const handleBodyChange = (
        index: number,
        field: "text" | "description",
        lang: "en" | "kn",
        value: string
      ) => {
        setBodyItems((prevItems) => {
          const updatedItems = [...prevItems];
          updatedItems[index] = {
            ...updatedItems[index],
            [field]: {
              ...updatedItems[index][field],
              [lang]: value,
            },
          };
          return updatedItems;
        });
      };
      

    const handleImageChange = (index: number, file: File | null) => {
        const updated = [...bodyItems];
        updated[index].image = file;
        setBodyItems(updated);
    };

    const handleDeleteBody = (index: number) => {
        const updated = [...bodyItems];
        updated.splice(index, 1);
        setBodyItems(updated);
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h2 className="form-title">Add Slider</h2>

            <label>
                Upload Image:
                <input type="file" accept="image/*" onChange={(e) => setSliderImage(e.target.files?.[0] || null)} className="file-input" />
            </label>
            {sliderImage && <img src={URL.createObjectURL(sliderImage)} alt="Preview" className="preview-image" />}

            <div className="input-group">
                <input placeholder="Text EN" value={text.en} onChange={(e) => setText({ ...text, en: e.target.value })} className="input-field" />
                <input placeholder="Text KN" value={text.kn} onChange={(e) => setText({ ...text, kn: e.target.value })} className="input-field" />
            </div>

            <div className="input-group">
                <input placeholder="Desc EN" value={description.en} onChange={(e) => setDescription({ ...description, en: e.target.value })} className="input-field" />
                <input placeholder="Desc KN" value={description.kn} onChange={(e) => setDescription({ ...description, kn: e.target.value })} className="input-field" />
            </div>

            {bodyItems.map((item, index) => (
                <div key={index} className="body-item">
                    <div className="input-group">
                        <input placeholder="Body Text EN" value={item.text.en} onChange={(e) => handleBodyChange(index, 'text', 'en', e.target.value)} className="input-field" />
                        <input placeholder="Body Text KN" value={item.text.kn} onChange={(e) => handleBodyChange(index, 'text', 'kn', e.target.value)} className="input-field" />
                    </div>
                    <div className="input-group">
                        <input placeholder="Body Desc EN" value={item.description.en} onChange={(e) => handleBodyChange(index, 'description', 'en', e.target.value)} className="input-field" />
                        <input placeholder="Body Desc KN" value={item.description.kn} onChange={(e) => handleBodyChange(index, 'description', 'kn', e.target.value)} className="input-field" />
                    </div>
                    <input type="file" accept="image/*" onChange={(e) => handleImageChange(index, e.target.files?.[0] || null)} className="file-input" />
                    {item.image && <img src={URL.createObjectURL(item.image)} alt="Preview" className="preview-image" />}
                    <button type="button" onClick={() => handleDeleteBody(index)} className="remove-button">❌</button>
                </div>
            ))}

            <button type="button" onClick={() => setBodyItems([...bodyItems, { text: { en: '', kn: '' }, description: { en: '', kn: '' }, image: null }])} className="add-button">
                ➕ Add Body Item
            </button>

            <button type="submit" className="submit-button">Submit</button>
        </form>
    );
  }
export default AddSlider;
