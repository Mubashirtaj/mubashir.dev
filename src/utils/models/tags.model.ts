import mongoose, { Model, Schema,Types} from "mongoose";


export interface ITag extends Document {
  name: string;
  slug: string;
  description?: string;
  color?: string;
  postCount: number;
  seo: {
    metaTitle?: string;
    metaDescription?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const TagSchema = new Schema<ITag>(
  {
    name: { type: String, required: true, unique: true, maxlength: 50 },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, maxlength: 300 },
    color: { type: String, default: "#3b82f6" },
    postCount: { type: Number, default: 0 },
    seo: {
      metaTitle: { type: String, maxlength: 70 },
      metaDescription: { type: String, maxlength: 160 },
    },
  },
  { timestamps: true }
);



TagSchema.index({ postCount: -1 });
export const Tag: Model<ITag> =
  mongoose.models.Tag ?? mongoose.model<ITag>("Tag", TagSchema);

