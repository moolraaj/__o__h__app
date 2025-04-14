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
    <div className="slider-main-outer">
  <div className="section-one-btn-heading">
    <h2 className="section-onr-heading">All Sliders (Redux Query)</h2>
    <Link href="/super-admin/slider/add-slider" className="add-slider-btn">
      ➕ <span>
      Add New Slider
      </span>
    </Link>
  </div>

  {isLoading ? (
    <p>Loading...</p>
  ) : sliders?.result?.length === 0 ? (
    <p>No sliders found.</p>
  ) : (
    <div className="all-slider-container">
      {sliders?.result?.map((slider: Slide) => (
        <div key={slider._id} className="slider-card">
          <div className="slider-images">
            <img src={slider.sliderImage} alt="Slider" />
          </div>

          <div className="en-kn-container">
            <div className="en-inner">
              <p><b>Text (EN):</b> {slider.text?.en}</p>
              <p><b>Description (EN):</b> {slider.description?.en}</p>
            </div>
            <div className="kn-inner">
              <p><b>Text (KN):</b> {slider.text?.kn}</p>
              <p><b>Description (KN):</b> {slider.description?.kn}</p>
            </div>
          </div>

          <div className="edit-delete-b-container">
            <Link href={`/super-admin/slider/update-slider/${slider._id}`} className="edit-button">
              ✏️ Edit
            </Link>
            <button
              onClick={() => {
                setSelectedSliderId(slider._id);
                setShowModal(true);
              }}
              className="delete-button"
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
