import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  categoryImage: string;
  title: {
    en: string;
    kn: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const CategorySchema: Schema = new Schema(
  {
    categoryImage: {
      type: String,
      required: true,
    },
    title: {
      en: {
        type: String,
        required: true,
      },
      kn: {
        type: String,
        required: true,
      },
    },
  },
  {
    timestamps: true,  
  }
);

const CategoryModel =
  mongoose.models.categories || mongoose.model<ICategory>('categories', CategorySchema);

export default CategoryModel;
