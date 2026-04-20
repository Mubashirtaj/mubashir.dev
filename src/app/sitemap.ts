
import dbConnect from "@/utils/db";
import { Blog } from "@/utils/models/Blog";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await dbConnect();
  const posts = await Blog.find({ status: "published" }).select("slug updatedAt");

  return [
    { url: "https://mubashirtaj.dev", lastModified: new Date() },
    { url: "https://mubashirtaj.dev/about", lastModified: new Date() },
    { url: "https://mubashirtaj.dev/contact", lastModified: new Date() },
    { url: "https://mubashirtaj.dev/blog", lastModified: new Date() },
    ...posts.map((p) => ({
      url: `https://mubashirtaj.dev/blog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}