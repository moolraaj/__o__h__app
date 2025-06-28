'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useCreateSliderMutation } from '@/(store)/services/slider/sliderApi'
import { BeatLoader } from 'react-spinners'

export type SBody = {
  image: string
  text: { en: string; kn: string }
  description: { en: string; kn: string }
}

const AddSlider: React.FC = () => {
  const [createSlider, { isLoading: loading }] = useCreateSliderMutation()
  const router = useRouter()

  const [sliderImage, setSliderImage] = useState<File | null>(null)
  const [sliderVideo, setSliderVideo] = useState<File | null>(null)
  const [text, setText] = useState({ en: '', kn: '' })
  const [description, setDescription] = useState({ en: '', kn: '' })
  const [bodyItems, setBodyItems] = useState<
    { image: File | null; text: { en: string; kn: string }; description: { en: string; kn: string } }[]
  >([{ image: null, text: { en: '', kn: '' }, description: { en: '', kn: '' } }])

  const handleBodyChange = (
    idx: number,
    field: 'text' | 'description',
    lang: 'en' | 'kn',
    val: string
  ) => {
    setBodyItems(prev => {
      const u = [...prev]
        ; (u[idx])[field][lang] = val
      return u
    })
  }

  const handleBodyImageChange = (idx: number, file: File | null) => {
    setBodyItems(prev => {
      const u = [...prev]
      u[idx].image = file
      return u
    })
  }

  const addBodyItem = () => {
    setBodyItems(prev => [...prev, { image: null, text: { en: '', kn: '' }, description: { en: '', kn: '' } }])
  }

  const removeBodyItem = (idx: number) => {
    setBodyItems(prev => prev.filter((_, i) => i !== idx))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const fd = new FormData()
    if (!sliderImage) {
      toast.error('Slider image required')
      return
    }
    fd.append('sliderImage', sliderImage)
    if (sliderVideo) fd.append('sliderVideo', sliderVideo)
    fd.append('text', JSON.stringify(text))
    fd.append('description', JSON.stringify(description))


    fd.append(
      'body',
      JSON.stringify(
        bodyItems.map(item => ({
          image: '',
          text: item.text,
          description: item.description
        }))
      )
    )

    bodyItems.forEach((item, i) => {
      if (item.image) fd.append(`bodyImage${i}`, item.image)
    })

    try {
      await createSlider(fd).unwrap()
      toast.success('Slider created')
      router.push('/super-admin/slider')
    } catch {
      toast.error('Create failed')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="home_slider">
      <h2>Add Slider</h2>

      <div className="add_input_fields">


        <div className="input_data">
          <label>Slider Image:</label>
          <input type="file" accept="image/*" onChange={e => setSliderImage(e.target.files?.[0] || null)} />

        </div>

        <div className="input_data"><label>Slider Video (mp4):</label>
          <input type="file" accept="video/mp4" onChange={e => setSliderVideo(e.target.files?.[0] || null)} /></div>

        <div className="input_data"><label>Text EN:</label>
          <input value={text.en} onChange={e => setText({ ...text, en: e.target.value })} /></div>
        <div className="input_data"><label>Text KN:</label>
          <input value={text.kn} onChange={e => setText({ ...text, kn: e.target.value })} /></div>

        <div className="input_data"><label>Description EN:</label>
          <textarea value={description.en} onChange={e => setDescription({ ...description, en: e.target.value })} /></div>
        <div className="input_data"><label>Description KN:</label>
          <textarea value={description.kn} onChange={e => setDescription({ ...description, kn: e.target.value })} /></div>

      </div>



<div className="repeater_items">
      {bodyItems.map((item, idx) => (
        <div key={idx} className="slider_repeater">
          <div className="input_data"><label>Body Text EN:</label>
            <input
              value={item.text.en}
              onChange={e => handleBodyChange(idx, 'text', 'en', e.target.value)}
            /></div>
          <div className="input_data"><label>Body Text KN:</label>
            <input
              value={item.text.kn}
              onChange={e => handleBodyChange(idx, 'text', 'kn', e.target.value)}
            /></div>

          <div className="input_data"><label>Body Desc EN:</label>
            <input
              value={item.description.en}
              onChange={e => handleBodyChange(idx, 'description', 'en', e.target.value)}
            /></div>
          <div className="input_data"><label>Body Desc KN:</label>
            <input
              value={item.description.kn}
              onChange={e => handleBodyChange(idx, 'description', 'kn', e.target.value)}
            /></div>

          <div className="input_data">
            <label>Body Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={e => handleBodyImageChange(idx, e.target.files?.[0] || null)}
            />
          </div>

          <button type="button" onClick={() => removeBodyItem(idx)}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={addBodyItem}>
        + Body Item
      </button>

</div>

    
      <button type="submit" disabled={loading}>
        {loading ? (<>
          createing... <BeatLoader color='#fff' size={8} />
        </>) : ('create')}
      </button>
    </form>
  )
}

export default AddSlider
