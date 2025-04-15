 
import mongoose from 'mongoose';
const { Schema } = mongoose;

 
const Lang = {
  en: { type: String, required: true },
  kn: { type: String, required: true },
};

 
const HabitHealthInnerRepeaterSchema = new Schema({
  habit_health_suggesion_para: { ...Lang },
  habit_health_suggesion_icon: { type: String },
}, { _id: false });
 
const BadHabitsHealthRepeaterSchema = new Schema({
  bad_habits_repeater_heading: { ...Lang },
  bad_habits_repeater_description: { ...Lang },
  bad_habits_repeater_icon: { type: String },
}, { _id: false });

 
const ImproveHabitsHealthRepeaterSchema = new Schema({
  improve_habits_repeater_heading: { ...Lang },
  improve_habits_repeater_description: { ...Lang },
  improve_habits_repeater_icon: { type: String },
}, { _id: false });

const HabitsHealthSchema = new Schema({
 
  habits_health_main_title: { ...Lang },
  habits_health_main_image: { type: String, required: true },

  
  habits_health_heading: { ...Lang },
  habits_health_para: { ...Lang },
  habits_health_icon: { type: String },

  habit_health_inner_title: { ...Lang },
  habit_health_inner_repeater: [HabitHealthInnerRepeaterSchema],

 
  bad_habits_health_title: { ...Lang },
  bad_habits_health_para: { ...Lang },
  bad_habits_health_icon: { type: String },
  bad_habits_health_repeater: [BadHabitsHealthRepeaterSchema],

 
  improve_health_habits_title: { ...Lang },
  improve_health_habits_description: { ...Lang },
  improve_health_habits_icon: { type: String },
  improve_habits_health_repeater: [ImproveHabitsHealthRepeaterSchema],
}, { timestamps: true });

 
const HabitsHealth = mongoose.models.HabitsHealth || mongoose.model('HabitsHealth', HabitsHealthSchema);
export default HabitsHealth;
