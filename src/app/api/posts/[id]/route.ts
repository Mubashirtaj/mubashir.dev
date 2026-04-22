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


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID is required" },
        { status: 400 }
      );
    }

    // Frontend ki requirement ke mutabik populate lazmi hai
    const blog = await Blog.findById(id)
      .populate("category")
      .populate("tags")
      .lean();

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: blog,
    });
  } catch (error: any) {
    console.error("API Fetch Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST /api/posts - Create a new post (matches your handleSubmit)

// Saare zaroori imports (Blog, Category, Tag, dbConnect, etc.) rakhein

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await request.json();
    const { id, ...data } = body; // 'id' check karne ke liye nikal li

    // Required fields check
    if (!data.title || !data.slug || !data.excerpt) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // Reading stats calculate karein (Wahi purana logic)
    const wordCount = countWords(data.body || "");
    const readingStats = {
      wordCount,
      readingTimeMinutes: Math.max(1, Math.ceil(wordCount / 200)),
      codeBlockCount: (data.body?.match(/<pre>/g) || []).length,
      imageCount: (data.body?.match(/<img/g) || []).length,
    };

    let post;

    if (id) {
      // --- UPDATE LOGIC ---
      console.log("Updating existing post:", id);
      
      // Check karein ki slug kisi aur post ka toh nahi hai
      const slugConflict = await Blog.findOne({ slug: data.slug, _id: { $ne: id } });
      if (slugConflict) {
        return NextResponse.json({ success: false, error: "Slug already in use by another post" }, { status: 409 });
      }

      post = await Blog.findByIdAndUpdate(
        id,
        {
          ...data,
          bodyText: stripHtml(data.body || ""),
          readingStats,
          lastEditedAt: new Date(),
          // Agar status abhi 'published' kiya hai toh date update karein
          ...(data.status === "published" ? { publishedAt: new Date() } : {}),
        },
        { new: true, runValidators: true }
      );

      if (!post) {
        return NextResponse.json({ success: false, error: "Post not found to update" }, { status: 404 });
      }

    } else {
      // --- CREATE LOGIC ---
      console.log("Creating new post");
      
      const existingPost = await Blog.findOne({ slug: data.slug });
      if (existingPost) {
        return NextResponse.json({ success: false, error: "Slug already exists" }, { status: 409 });
      }

      post = await Blog.create({
        ...data,
        author: user._id,
        bodyText: stripHtml(data.body || ""),
        readingStats,
        publishedAt: data.status === "published" ? new Date() : undefined,
        lastEditedAt: new Date(),
      });

      // Nayi post par Category/Tags count barhayein
      if (data.category) {
        await Category.findByIdAndUpdate(data.category, { $inc: { postCount: 1 } });
      }
      if (data.tags?.length > 0) {
        await Tag.updateMany({ _id: { $in: data.tags } }, { $inc: { postCount: 1 } });
      }
    }

    // Revalidate paths
    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);

    // Populated data return karein
    const populatedPost = await Blog.findById(post._id)
      .populate("category", "name slug")
      .populate("tags", "name slug color")
      .populate("author", "name email avatar");

    return NextResponse.json({ 
      success: true, 
      message: id ? "Post updated successfully" : "Post created successfully",
      data: populatedPost 
    }, { status: id ? 200 : 201 });

  } catch (error: any) {
    console.error("Error in Post/Update API:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }>}
) {
  try {
    await dbConnect();
    const { id } = await context.params;

    // 1. Auth Check
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // 2. Check if post exists and user is owner (optional check)
    const existingPost = await Blog.findById(id);
    if (!existingPost) {
      return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 });
    }

    // 3. Slug Conflict Check
    if (body.slug && body.slug !== existingPost.slug) {
      console.log(body.slug);
      
      const slugConflict = await Blog.findOne({ slug: body.slug, _id: { $ne: id } });
      if (slugConflict) {
        return NextResponse.json({ success: false, error: "Slug already in use" }, { status: 409 });
      }
    }

    // 4. Update Document
    // Note: Hum direct body pass kar rahe hain, Mongoose schema validation handle karega
    const updatedPost = await Blog.findByIdAndUpdate(
      id,
      {
        ...body,
        lastEditedAt: new Date(),
        // Agar status "published" ho raha hai aur pehle nahi tha
        ...(body.status === "published" && existingPost.status !== "published" 
            ? { publishedAt: new Date() } 
            : {}),
      },
      { new: true, runValidators: true }
    ).populate("category tags author");

    if (!updatedPost) {
      return NextResponse.json({ success: false, error: "Post not found to update" }, { status: 404 });
    }
    // 5. Revalidate Cache
    revalidatePath("/blog");
    revalidatePath(`/panel/blogs/add-blog/${updatedPost.slug}`);

    return NextResponse.json({
      success: true,
      message: "Post updated successfully",
      data: updatedPost
    });

  } catch (error: any) {
    console.error("PUT API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
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