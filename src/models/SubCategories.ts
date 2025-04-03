import mongoose, { Schema, Document } from 'mongoose';

export interface ISubCategory extends Document {
  categoryImage: string;
  title: {
    en: string;
    kn: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const SubCategorySchema: Schema = new Schema(
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

const SubCategoryModel =
  mongoose.models.subcategories ||
  mongoose.model<ISubCategory>('subcategories', SubCategorySchema);

export default SubCategoryModel;
