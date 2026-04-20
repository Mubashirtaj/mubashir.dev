// app/api/posts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Blog } from "@/utils/models/Blog";
import { revalidatePath } from "next/cache";
import dbConnect from "@/utils/db";
import { Types } from "mongoose";
import { Category } from "@/utils/models/categories.model";
import { Tag } from "@/utils/models/tags.model";
import User from "@/utils/models/user.model";

// Helper to get current user
async function getCurrentUser() {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return null;
  }
  
  const user = await User.findOne({ email: session.user.email });
  return user;
}

// GET /api/posts - Fetch posts with pagination (for listing)

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const tag = searchParams.get("tag");

    const query: any = {};
    if (status) query.status = status;
    if (category) query.category = new Types.ObjectId(category);
    if (tag) query.tags = new Types.ObjectId(tag);

    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Blog.find(query)
        .populate("category", "name slug")
        .populate("tags", "name slug color")
        .populate("author", "name email image")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Blog.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

// POST /api/posts - Create a new post (matches your handleSubmit)
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    
    // Your frontend sends formData with these fields
    const {
      title,
      slug,
      type,
      status,
      excerpt,
      body: content, // TipTap HTML content
      coverImage,
      coverImageAlt,
      coverImageCaption,
      ogImage,
      category: categoryId, // This is an ID from your frontend
      tags: tagIds, // These are tag IDs from your frontend
      series,
      seriesOrder,
      techStack,
      difficulty,
      githubUrl,
      demoUrl,
      requiresSubscription,
      commentsEnabled,
      isFeatured,
      isPinned,
      isSponsored,
      
      seo,
    } = body;
    
    // Validate required fields
    if (!title || !slug || !excerpt || !coverImage) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Check if slug already exists
    const existingPost = await Blog.findOne({ slug });
    if (existingPost) {
      return NextResponse.json(
        { success: false, error: "Slug already exists" },
        { status: 409 }
      );
    }
    
    // Calculate reading stats from the body content
    const wordCount = countWords(content || "");
    const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));
    const codeBlockCount = (content?.match(/<pre>/g) || []).length;
    const imageCount = (content?.match(/<img/g) || []).length;
    
    // Create the post
    const post = await Blog.create({
      title,
      slug,
      type: type || "article",
      status: status || "draft",
      excerpt,
      body: content || "",
      bodyText: stripHtml(content || ""),
      coverImage,
      coverImageAlt: coverImageAlt || "",
      coverImageCaption: coverImageCaption || "",
      ogImage: ogImage || coverImage,
      category: categoryId || null, // Use the category ID directly
      tags: tagIds || [], // Use tag IDs directly
      series: series || null,
      seriesOrder: seriesOrder || 0,
      techStack: techStack || [],
      difficulty: difficulty || "beginner",
      githubUrl: githubUrl || null,
      demoUrl: demoUrl || null,
      requiresSubscription: requiresSubscription || false,
      commentsEnabled: commentsEnabled !== false,
      isFeatured: isFeatured || false,
      isPinned: isPinned || false,
      isSponsored: isSponsored || false,
      author: user._id,
      seo: {
        metaTitle: seo?.metaTitle || title.slice(0, 70),
        metaDescription: seo?.metaDescription || excerpt.slice(0, 160),
        focusKeyword: seo?.focusKeyword || "",
        keywords: seo?.keywords || [],
        canonicalUrl: seo?.canonicalUrl || "",
        ogTitle: seo?.ogTitle || "",
        ogDescription: seo?.ogDescription || "",
        noIndex: seo?.noIndex || false,
        noFollow: seo?.noFollow || false,
      },
      readingStats: {
        wordCount,
        readingTimeMinutes,
        codeBlockCount,
        imageCount,
      },
      publishedAt: status === "published" ? new Date() : undefined,
      lastEditedAt: new Date(),
    });
    
    // Update category and tags post count if they exist
    if (categoryId) {
      await Category.findByIdAndUpdate(categoryId, {
        $inc: { postCount: 1 },
      });
    }
    
    if (tagIds && tagIds.length > 0) {
      for (const tagId of tagIds) {
        await Tag.findByIdAndUpdate(tagId, {
          $inc: { postCount: 1 },
        });
      }
    }
    
    // Revalidate paths for cache
    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);
    
    // Populate references for response
    const populatedPost = await Blog.findById(post._id)
      .populate("category", "name slug")
      .populate("tags", "name slug color")
      .populate("author", "name email image");
    
    return NextResponse.json({ 
      success: true, 
      data: populatedPost 
    }, { status: 201 });
    
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create post" },
      { status: 500 }
    );
  }
}

// Helper functions
function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function countWords(html: string) {
  const text = html.replace(/<[^>]*>/g, " ");
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}