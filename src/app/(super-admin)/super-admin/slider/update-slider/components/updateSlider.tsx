'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useUpdateSliderMutation, useGetSingleSliderQuery } from '@/(store)/services/slider/sliderApi';
import { SBody } from '@/utils/Types';

interface Id {
  id: string;
}

const UpdateSlider = ({ id }: Id) => {
  const router = useRouter();


  const { data, isLoading } = useGetSingleSliderQuery({ id });
  const [updateSlider] = useUpdateSliderMutation();


  const [sliderImage, setSliderImage] = useState<File | null>(null);

  const [sliderImageUrl, setSliderImageUrl] = useState<string>('');
  const [text, setText] = useState({ en: '', kn: '' });
  const [description, setDescription] = useState({ en: '', kn: '' });

  const [bodyItems, setBodyItems] = useState<
    { text: { en: string; kn: string }; description: { en: string; kn: string }; image: File | string | null }[]
  >([]);

  useEffect(() => {
    if (data) {
      const sliderData = data;
      setText(sliderData.text);
      setDescription(sliderData.description);
      setSliderImageUrl(sliderData.sliderImage);
      setBodyItems(
        sliderData.body && Array.isArray(sliderData.body)
          ? sliderData.body.map((item: SBody) => ({
            text: item.text,
            description: item.description,
            image: item.image,
          }))
          : []
      );
    }
  }, [data]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();

    if (sliderImage) formData.append('sliderImage', sliderImage);
    formData.append('text', JSON.stringify(text));
    formData.append('description', JSON.stringify(description));
    formData.append(
      'body',
      JSON.stringify(bodyItems.map((b) => ({ text: b.text, description: b.description })))
    );


    bodyItems.forEach((item, index) => {
      if (item.image && item.image instanceof File) {
        formData.append(`bodyImage${index}`, item.image);
      }
    });

    try {
      const result = await updateSlider({ id, formData }).unwrap();
      if (result) {
        toast.success('Slider updated successfully');
        router.push('/super-admin/slider');
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error('Failed to update slider');

      }
    }
  };

  const handleBodyChange = (
    index: number,
    field: "text" | "description",
    lang: "en" | "kn",
    value: string
  ) => {
    setBodyItems((prevBodyItems) => {
      const updatedItems = [...prevBodyItems];
      const currentItem = updatedItems[index];
      updatedItems[index] = {
        ...currentItem,
        [field]: {
          ...currentItem[field],
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



  if (isLoading || !data) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5 bg-gray-100 rounded">
      <h2 className="text-xl font-bold">Update Slider</h2>


      <input
        type="file"
        accept="image/*"
        onChange={(e) => setSliderImage(e.target.files?.[0] || null)}
      />
      {sliderImage ? (
        <img
          src={URL.createObjectURL(sliderImage)}
          alt="Slider Preview"
          className="w-24 h-24 object-cover mt-2 rounded"
        />
      ) : (
        sliderImageUrl && (
          <img
            src={sliderImageUrl}
            alt="Slider Current"
            className="w-24 h-24 object-cover mt-2 rounded"
          />
        )
      )}
<div className='all-editing-inputs'>
        <input
        placeholder="Text EN"
        value={text?.en || ""}
        onChange={(e) => setText({ ...text, en: e.target.value })}
      />

      <input
        placeholder="Text KN"
        value={text?.kn || ""}
        onChange={(e) => setText({ ...text, kn: e.target.value })}
      />

      <input
        placeholder="Desc EN"
        value={description?.en || ""}
        onChange={(e) => setDescription({ ...description, en: e.target.value })}
      />

      <input
        placeholder="Desc KN"
        value={description?.kn || ""}
        onChange={(e) => setDescription({ ...description, kn: e.target.value })}
      />
      </div>


      {bodyItems.map((item, index) => (
        <div key={index} className="border p-3 bg-white rounded relative">
          <input
            placeholder="Body Text EN"
            value={item.text.en}
            onChange={(e) => handleBodyChange(index, 'text', 'en', e.target.value)}
          />
          <input
            placeholder="Body Text KN"
            value={item.text.kn}
            onChange={(e) => handleBodyChange(index, 'text', 'kn', e.target.value)}
          />
          <input
            placeholder="Body Desc EN"
            value={item.description.en}
            onChange={(e) => handleBodyChange(index, 'description', 'en', e.target.value)}
          />
          <input
            placeholder="Body Desc KN"
            value={item.description.kn}
            onChange={(e) => handleBodyChange(index, 'description', 'kn', e.target.value)}
          />


          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(index, e.target.files?.[0] || null)}
          />
          {item.image ? (
            item.image instanceof File ? (
              <img
                src={URL.createObjectURL(item.image)}
                alt="Body Preview"
                className="w-24 h-24 object-cover mt-2 rounded"
              />
            ) : (
              <img
                src={item.image as string}
                alt="Body Current"
                className="w-24 h-24 object-cover mt-2 rounded"
              />
            )
          ) : null}


        </div>
      ))}



      <button type="submit" className="bg-blue-500 text-white p-3 rounded">
        Update
      </button>
    </form>
  );
};

export default UpdateSlider;
