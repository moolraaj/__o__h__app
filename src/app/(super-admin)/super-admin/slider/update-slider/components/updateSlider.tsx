'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useGetSingleSliderQuery, useUpdateSliderMutation } from '@/(store)/services/slider/sliderApi'
import { SBody } from '@/utils/Types'
import Loader from '@/(common)/Loader'
import { BeatLoader } from 'react-spinners'
interface UpdateSliderProps {
  id: string
}
interface BodyItem {
  image: File | null
  existingImage?: string
  text: { en: string; kn: string }
  description: { en: string; kn: string }
}
const UpdateSlider: React.FC<UpdateSliderProps> = ({ id }) => {
  const { data, isLoading } = useGetSingleSliderQuery({ id })
  const [updateSlider,{isLoading:loading}] = useUpdateSliderMutation()
  const router = useRouter()
  const [sliderImage, setSliderImage] = useState<File | null>(null)
  const [existingSliderImage, setExistingSliderImage] = useState<string | null>(null)
  const [text, setText] = useState({ en: '', kn: '' })
  const [description, setDescription] = useState({ en: '', kn: '' })
  const [bodyItems, setBodyItems] = useState<BodyItem[]>([])
  const [sliderVideo, setSliderVideo] = useState<File | null>(null)
  const [existingSliderVideo, setExistingSliderVideo] = useState<string | null>(null)
  //@ts-expect-error ignore this message
  const response = data?.result ?? data
  useEffect(() => {
    if (!response) return
    setText(response.text || { en: '', kn: '' })
    setDescription(response.description || { en: '', kn: '' })
    setExistingSliderImage(response.sliderImage || null)
    setExistingSliderVideo(response.sliderVideo || null)
    const arr = Array.isArray(response.body) ? response.body : []
    setBodyItems(
      arr.map((item: SBody) => ({
        image: null,
        existingImage: item.image,
        text: { ...(item.text ?? { en: '', kn: '' }) },
        description: { ...(item.description ?? { en: '', kn: '' }) },
      }))
    )
  }, [response])
  const handleBodyChange = (
    index: number,
    field: 'text' | 'description',
    lang: 'en' | 'kn',
    value: string
  ) => {
    setBodyItems(prev =>
      prev.map((it, i) =>
        i === index
          ? { ...it, [field]: { ...it[field], [lang]: value } }
          : it
      )
    )
  }
  const handleBodyImageChange = (index: number, file: File | null) => {
    setBodyItems(prev =>
      prev.map((it, i) => (i === index ? { ...it, image: file } : it))
    )
  }
  const deleteBodyImage = (index: number) => {
    setBodyItems(prev =>
      prev.map((it, i) =>
        i === index ? { ...it, existingImage: undefined } : it
      )
    )
  }
  const deleteSliderImage = () => {
    setExistingSliderImage(null)
  }
  const deleteSliderVideo = () => {
    setExistingSliderVideo(null)
  }
  const addBodyItem = () => {
    setBodyItems(prev => [
      ...prev,
      { image: null, text: { en: '', kn: '' }, description: { en: '', kn: '' } },
    ])
  }
  const removeBodyItem = (index: number) => {
    setBodyItems(prev => prev.filter((_, i) => i !== index))
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    if (sliderImage) formData.append('sliderImage', sliderImage)
    if (sliderVideo) formData.append('sliderVideo', sliderVideo)
    formData.append('text', JSON.stringify(text))
    formData.append('description', JSON.stringify(description))
    formData.append(
      'body',
      JSON.stringify(
        bodyItems.map(item => ({
          image: item.existingImage || '',
          text: item.text,
          description: item.description,
        }))
      )
    )
    bodyItems.forEach((item, idx) => {
      if (item.image) formData.append(`bodyImage${idx}`, item.image)
    })
    try {
      await updateSlider({ id, formData }).unwrap()
      toast.success('Slider updated successfully')
      router.push('/super-admin/slider')
    } catch {
      toast.error('Failed to update slider')
    }
  }
  if (isLoading) return <Loader/>
  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2 className="form-title">Update Slider</h2>

 
      <div>
        {existingSliderImage && !sliderImage && (
          <div className="preview">
            <img
              src={existingSliderImage}
              alt="Current Slider"
              className="preview-image"
            />
            <button type="button" onClick={deleteSliderImage}>
              Delete Current Image
            </button>
          </div>
        )}
        <label>Upload New Slider Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={e => setSliderImage(e.target.files?.[0] || null)}
        />
      </div>

     
      <div>
        {existingSliderVideo && !sliderVideo && (
          <div className="preview">
            <video
              src={existingSliderVideo}
              controls
              className="preview-video"
            />
            <button type="button" onClick={deleteSliderVideo}>
              Delete Current Video
            </button>
          </div>
        )}
        <label>Upload New Slider Video (mp4):</label>
        <input
          type="file"
          accept="video/mp4"
          onChange={e => setSliderVideo(e.target.files?.[0] || null)}
        />
      </div>

      {/* Text & Description */}
      <div>
        <label>Text (EN):</label>
        <input
          type="text"
          value={text.en}
          onChange={e => setText(prev => ({ ...prev, en: e.target.value }))}
        />
        <label>Text (KN):</label>
        <input
          type="text"
          value={text.kn}
          onChange={e => setText(prev => ({ ...prev, kn: e.target.value }))}
        />
      </div>

      <div>
        <label>Description (EN):</label>
        <textarea
          value={description.en}
          onChange={e =>
            setDescription(prev => ({ ...prev, en: e.target.value }))
          }
        />
        <label>Description (KN):</label>
        <textarea
          value={description.kn}
          onChange={e =>
            setDescription(prev => ({ ...prev, kn: e.target.value }))
          }
        />
      </div>

      <hr />
      <h3>Slider Body Items</h3>
      {bodyItems.map((item, index) => (
        <div key={index} className="repeater">
          <label>Body Text (EN):</label>
          <input
            type="text"
            value={item.text.en}
            onChange={e =>
              handleBodyChange(index, 'text', 'en', e.target.value)
            }
          />
          <label>Body Text (KN):</label>
          <input
            type="text"
            value={item.text.kn}
            onChange={e =>
              handleBodyChange(index, 'text', 'kn', e.target.value)
            }
          />

          <label>Body Description (EN):</label>
          <input
            type="text"
            value={item.description.en}
            onChange={e =>
              handleBodyChange(index, 'description', 'en', e.target.value)
            }
          />
          <label>Body Description (KN):</label>
          <input
            type="text"
            value={item.description.kn}
            onChange={e =>
              handleBodyChange(index, 'description', 'kn', e.target.value)
            }
          />

          {item.existingImage && !item.image && (
            <div className="preview">
              <img
                src={item.existingImage}
                alt="Body"
                className="preview-image"
              />
              <button
                type="button"
                onClick={() => deleteBodyImage(index)}
              >
                Delete Existing Image
              </button>
            </div>
          )}

          <label>Upload New Body Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={e =>
              handleBodyImageChange(index, e.target.files?.[0] || null)
            }
          />

          <button type="button" onClick={() => removeBodyItem(index)}>
            Remove Body Item
          </button>
        </div>
      ))}

      <button type="button" onClick={addBodyItem}>
        Add Body Item
      </button>

      <hr />
      
            <button type="submit" disabled={loading} className="submit-button">
              {loading ? (<>
                upadting... <BeatLoader color='#fff' size={8} />
              </>) : ('Update')}
            </button>
    </form>
  )
}

export default UpdateSlider
