
import dbConnect from "@/utils/db";
import { Blog } from "@/utils/models/Blog";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await dbConnect();
  const posts = await Blog.find({ status: "published" }).select("slug updatedAt");

  return [
    { url: "https://yourdomain.com", lastModified: new Date() },
    { url: "https://yourdomain.com/blog", lastModified: new Date() },
    ...posts.map((p) => ({
      url: `https://yourdomain.com/blog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}