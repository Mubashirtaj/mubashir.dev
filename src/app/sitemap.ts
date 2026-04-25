import dbConnect from "@/utils/db";
import { Blog } from "@/utils/models/Blog";
import { Category } from "@/utils/models/categories.model";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await dbConnect();

  // Fetch published posts
  const posts = await Blog.find({ status: "published" }).select("slug updatedAt");

  // Fetch all categories
  const categories = await Category.find().select("slug updatedAt");

  return [
    { url: "https://mubashirtaj.dev", lastModified: new Date() },
    { url: "https://mubashirtaj.dev/about", lastModified: new Date() },
    { url: "https://mubashirtaj.dev/contact", lastModified: new Date() },
    { url: "https://mubashirtaj.dev/blog", lastModified: new Date() },

    // Categories
    ...categories.map((c) => ({
      url: `https://mubashirtaj.dev/category/${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),

    // Blog posts
    ...posts.map((p) => ({
      url: `https://mubashirtaj.dev/blog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
