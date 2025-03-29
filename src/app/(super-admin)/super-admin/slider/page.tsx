'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useDeleteSliderMutation, useGetSlidersQuery } from '@/(store)/services/slider/sliderApi';
import ReusableModal from '@/(common)/Model';
import { Slide } from '@/utils/Types';

const SliderList = () => {
  const { data: sliders, isLoading, refetch } = useGetSlidersQuery({ page: 1, limit: 100 });
  const [deleteSlider] = useDeleteSliderMutation();
  const [showModal, setShowModal] = useState(false);
  const [selectedSliderId, setSelectedSliderId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      await deleteSlider(id).unwrap();
      refetch();
    } catch (err) {
      if(err instanceof Error){
        alert('Failed to delete');

      }
    }
  };

  const confirmDelete = () => {
    if (selectedSliderId) {
      handleDelete(selectedSliderId);
      setShowModal(false);
      setSelectedSliderId(null);
    }
  };

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold">All Sliders (Redux Query)</h2>
        <Link href="/super-admin/slider/add-slider" className="bg-green-500 text-white p-2 rounded">➕ Add New Slider</Link>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : sliders?.result?.length === 0 ? (
        <p>No sliders found.</p>
      ) : (
        <div className="grid gap-4">
          {sliders?.result?.map((slider: Slide) => (
            <div key={slider._id} className="border p-4 rounded bg-white shadow">
              <img src={slider.sliderImage} alt="Slider" className="w-64 h-40 object-cover rounded mb-2" />
              <p><b>Text (EN):</b> {slider.text?.en}</p>
              <p><b>Text (KN):</b> {slider.text?.kn}</p>
              <p><b>Description (EN):</b> {slider.description?.en}</p>
              <p><b>Description (KN):</b> {slider.description?.kn}</p>

              <div className="flex gap-3 mt-3">
                <Link href={`/super-admin/slider/update-slider/${slider._id}`} className="bg-yellow-500 text-white p-2 rounded">✏️ Edit</Link>
                <button
                  onClick={() => {
                    setSelectedSliderId(slider._id);
                    setShowModal(true);
                  }}
                  className="bg-red-500 text-white p-2 rounded"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      
      <ReusableModal
        isOpen={showModal}
        message="Are you sure you want to delete this slider?"
        id={selectedSliderId || undefined}
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowModal(false);
          setSelectedSliderId(null);
        }}
      />
    </div>
  );
};

export default SliderList;
