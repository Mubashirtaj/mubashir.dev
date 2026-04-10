// lib/models/Blog.ts
import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IBlog extends Document {
  title: string;
  slug: string;
  type: PostType;
  status: PostStatus;
  excerpt: string;
  body: string;
  bodyText: string;
  codeBlocks: ICodeBlock[];
  tableOfContents: ITableOfContentsItem[];
  coverImage: string;
  coverImageAlt: string;
  coverImageCaption?: string;
  ogImage?: string;
  images: string[];
  category: Types.ObjectId;
  tags: Types.ObjectId[];
  series?: string;
  seriesOrder?: number;
  author: Types.ObjectId;
  seo: ISEO;
  views: number;
  uniqueViews: number;
  likes: number;
  bookmarks: number;
  socialShares: ISocialShare;
  comments: IComment[];
  commentsEnabled: boolean;
  commentsCount: number;
  readingStats: IReadingStats;
  publishedAt?: Date;
  scheduledAt?: Date;
  featuredAt?: Date;
  lastEditedAt?: Date;
  isFeatured: boolean;
  isPinned: boolean;
  isSponsored: boolean;
  requiresSubscription: boolean;
  techStack: string[];
  difficulty?: Difficulty;
  githubUrl?: string;
  demoUrl?: string;
  revisions: IRevision[];
  createdAt: Date;
  updatedAt: Date;
  url: string;
  isPublished: boolean;
}

interface ISEO {
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: "summary" | "summary_large_image";
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  jsonLd?: any;
  focusKeyword?: string;
  keywords?: string[];
  noIndex?: boolean;
  noFollow?: boolean;
}

interface ITableOfContentsItem {
  id: string;
  text: string;
  level: 1 | 2 | 3 | 4;
}

interface ICodeBlock {
  language: string;
  filename?: string;
  code: string;
  highlighted: boolean;
}

interface IReadingStats {
  wordCount: number;
  readingTimeMinutes: number;
  codeBlockCount: number;
  imageCount: number;
}

interface ISocialShare {
  twitter: number;
  linkedin: number;
  reddit: number;
  hackernews: number;
  total: number;
}

interface IComment {
  name: string;
  email: string;
  website?: string;
  body: string;
  isApproved: boolean;
  parentComment?: Types.ObjectId;
  likes: number;
  ipAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IRevision {
  body: string;
  editedAt: Date;
  editNote?: string;
}

const SEOSchema = new Schema(
  {
    metaTitle: { type: String, maxlength: 70 },
    metaDescription: { type: String, maxlength: 160 },
    canonicalUrl: { type: String },
    ogTitle: { type: String, maxlength: 70 },
    ogDescription: { type: String, maxlength: 200 },
    ogImage: { type: String },
    twitterCard: {
      type: String,
      enum: ["summary", "summary_large_image"],
      default: "summary_large_image",
    },
    twitterTitle: { type: String },
    twitterDescription: { type: String },
    twitterImage: { type: String },
    jsonLd: { type: Schema.Types.Mixed },
    focusKeyword: { type: String },
    keywords: [{ type: String }],
    noIndex: { type: Boolean, default: false },
    noFollow: { type: Boolean, default: false },
  },
  { _id: false }
);

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

const TableOfContentsItemSchema = new Schema<ITableOfContentsItem>(
  {
    id: { type: String, required: true },
    text: { type: String, required: true },
    level: { type: Number, enum: [1, 2, 3, 4], required: true },
  },
  { _id: false }
);

const CodeBlockSchema = new Schema<ICodeBlock>(
  {
    language: { type: String, default: "text" },
    filename: { type: String },
    code: { type: String, required: true },
    highlighted: { type: Boolean, default: true },
  },
  { _id: false }
);

const ReadingStatsSchema = new Schema<IReadingStats>(
  {
    wordCount: { type: Number, default: 0 },
    readingTimeMinutes: { type: Number, default: 1 },
    codeBlockCount: { type: Number, default: 0 },
    imageCount: { type: Number, default: 0 },
  },
  { _id: false }
);

const SocialShareSchema = new Schema<ISocialShare>(
  {
    twitter: { type: Number, default: 0 },
    linkedin: { type: Number, default: 0 },
    reddit: { type: Number, default: 0 },
    hackernews: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
  },
  { _id: false }
);

const CommentSchema = new Schema<IComment>(
  {
    name: { type: String, required: true, maxlength: 100 },
    email: { type: String, required: true },
    website: { type: String },
    body: { type: String, required: true, maxlength: 2000 },
    isApproved: { type: Boolean, default: false },
    parentComment: { type: Schema.Types.ObjectId, ref: "Comment" },
    likes: { type: Number, default: 0 },
    ipAddress: { type: String },
  },
  { timestamps: true }
);

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

TagSchema.index({ slug: 1 });
TagSchema.index({ postCount: -1 });

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

export type PostStatus = "draft" | "published" | "archived" | "scheduled";
export type PostType = "article" | "tutorial" | "snippet" | "project" | "note";
export type Difficulty = "beginner" | "intermediate" | "advanced";

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, lowercase: true },
    type: {
      type: String,
      enum: ["article", "tutorial", "snippet", "project", "note"],
      default: "article",
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived", "scheduled"],
      default: "draft",
    },
    excerpt: { type: String, required: true, maxlength: 300 },
    body: { type: String, required: true },
    bodyText: { type: String, default: "" },
    codeBlocks: [CodeBlockSchema],
    tableOfContents: [TableOfContentsItemSchema],
    coverImage: { type: String, required: true },
    coverImageAlt: { type: String, maxlength: 125 },
    coverImageCaption: { type: String },
    ogImage: { type: String },
    images: [{ type: String }],
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    series: { type: String, maxlength: 100 },
    seriesOrder: { type: Number },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    seo: { type: SEOSchema, default: () => ({}) },
    views: { type: Number, default: 0 },
    uniqueViews: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    bookmarks: { type: Number, default: 0 },
    socialShares: { type: SocialShareSchema, default: () => ({}) },
    comments: [CommentSchema],
    commentsEnabled: { type: Boolean, default: true },
    commentsCount: { type: Number, default: 0 },
    readingStats: { type: ReadingStatsSchema, default: () => ({}) },
    publishedAt: { type: Date },
    scheduledAt: { type: Date },
    featuredAt: { type: Date },
    lastEditedAt: { type: Date },
    isFeatured: { type: Boolean, default: false },
    isPinned: { type: Boolean, default: false },
    isSponsored: { type: Boolean, default: false },
    requiresSubscription: { type: Boolean, default: false },
    techStack: [{ type: String, maxlength: 50 }],
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
    },
    githubUrl: { type: String },
    demoUrl: { type: String },
    revisions: [
      {
        body: { type: String },
        editedAt: { type: Date, default: Date.now },
        editNote: { type: String },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

BlogSchema.virtual("url").get(function(this: IBlog) {
  return `/blog/${this.slug}`;
});

BlogSchema.virtual("isPublished").get(function(this: IBlog) {
  return this.status === "published" && !!this.publishedAt;
});

BlogSchema.index({ slug: 1 });
BlogSchema.index({ status: 1, publishedAt: -1 });
BlogSchema.index({ category: 1, status: 1, publishedAt: -1 });
BlogSchema.index({ tags: 1, status: 1, publishedAt: -1 });
BlogSchema.index({ author: 1, status: 1, publishedAt: -1 });
BlogSchema.index({ isFeatured: 1, publishedAt: -1 });
BlogSchema.index({ isPinned: 1, publishedAt: -1 });
BlogSchema.index({ views: -1, publishedAt: -1 });
BlogSchema.index({ likes: -1 });
BlogSchema.index({ commentsCount: -1 });
BlogSchema.index({ status: 1, scheduledAt: 1 });
BlogSchema.index({ series: 1, seriesOrder: 1 });
BlogSchema.index({ type: 1, status: 1, publishedAt: -1 });
BlogSchema.index({ techStack: 1, publishedAt: -1 });
BlogSchema.index(
  {
    title: "text",
    bodyText: "text",
    excerpt: "text",
    "seo.focusKeyword": "text",
    "seo.keywords": "text",
    techStack: "text",
  },
  {
    weights: {
      title: 10,
      "seo.focusKeyword": 8,
      excerpt: 5,
      techStack: 4,
      bodyText: 2,
      "seo.keywords": 3,
    },
    name: "blog_fulltext",
  }
);

BlogSchema.pre<IBlog>("save", async function () {
  if (this.isModified("status") && this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }

  if (this.seo && !this.seo.metaTitle) {
    this.seo.metaTitle = this.title.slice(0, 70);
  }
  
  if (this.seo && !this.seo.metaDescription) {
    this.seo.metaDescription = this.excerpt.slice(0, 160);
  }

  if (this.isModified("body")) {
    this.bodyText = this.body.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    this.lastEditedAt = new Date();
  }

  if (this.isModified("comments")) {
    this.commentsCount = this.comments.filter((c) => c.isApproved).length;
  }
});

interface BlogModel extends Model<IBlog> {
  findPublished(query?: any): any;
  findRelated(post: IBlog, limit?: number): any;
}

BlogSchema.statics.findPublished = function(query = {}) {
  return this.find({ status: "published", ...query }).sort({ publishedAt: -1 });
};

BlogSchema.statics.findRelated = function(post: IBlog, limit = 4) {
  return this.find({
    _id: { $ne: post._id },
    status: "published",
    $or: [
      { category: post.category },
      { tags: { $in: post.tags } },
      { techStack: { $in: post.techStack } },
    ],
  })
    .sort({ views: -1, publishedAt: -1 })
    .limit(limit);
};

export const Blog = (mongoose.models.Blog as BlogModel) || 
  mongoose.model<IBlog, BlogModel>("Blog", BlogSchema);

export const Tag: Model<ITag> =
  mongoose.models.Tag ?? mongoose.model<ITag>("Tag", TagSchema);

export const Category: Model<ICategory> =
  mongoose.models.Category ?? mongoose.model<ICategory>("Category", CategorySchema);