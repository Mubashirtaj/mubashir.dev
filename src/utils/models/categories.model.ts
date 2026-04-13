import mongoose, { Model, Schema,Types} from "mongoose";
export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  coverImage?: string;
  parentCategory?: Types.ObjectId;
  postCount: number;
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
  };
  order: number;
  createdAt: Date;
  updatedAt: Date;
}



const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true, maxlength: 80 },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, maxlength: 500 },
    icon: { type: String },
    coverImage: { type: String },
    parentCategory: { type: Schema.Types.ObjectId, ref: "Category" },
    postCount: { type: Number, default: 0 },
    seo: {
      metaTitle: { type: String, maxlength: 70 },
      metaDescription: { type: String, maxlength: 160 },
      ogImage: { type: String },
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

CategorySchema.index({ slug: 1 });
CategorySchema.index({ parentCategory: 1 });
CategorySchema.index({ order: 1, postCount: -1 });


export const Category: Model<ICategory> =
  mongoose.models.Category ?? mongoose.model<ICategory>("Category", CategorySchema);