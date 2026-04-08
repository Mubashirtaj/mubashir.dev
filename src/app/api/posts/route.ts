// app/api/posts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Blog, Tag, Category } from "@/utils/models/Blog";
import { revalidatePath } from "next/cache";
import dbConnect from "@/utils/db";
import { Types } from "mongoose";
import { User } from "@/utils/models/user.model";

// Helper to get current user
async function getCurrentUser() {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return null;
  }
  
  // Get user from database (assuming you have a User model)
  const { User } = await import("@/utils/models/user.model");
  const user = await User.findOne({ email: session.user.email });
  return user;
}

// GET /api/posts - Fetch posts with pagination
interface UserType  {
_id:Types.ObjectId,
role:string
}
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
    if (category) query.category = category;
    if (tag) query.tags = tag;
    
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
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

// POST /api/posts - Create a new post
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    // Check authentication
    const user =await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const {
      title,
      slug,
      type,
      status,
      excerpt,
      coverImage,
      coverImageAlt,
      category: categoryName,
      tags: tagNames,
      series,
      techStack,
      difficulty,
      githubUrl,
      demoUrl,
      isFeatured,
      isPinned,
      commentsEnabled,
      scheduledAt,
      seo,
      content, // TipTap HTML content
    } = body;
    
    // Validate required fields
    if (!title || !slug || !excerpt || !coverImage || !categoryName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Check if slug already exists
    const existingPost = await Blog.findOne({ slug });
    if (existingPost) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 409 }
      );
    }
    
    // Handle Category
    let categoryDoc = await Category.findOne({ slug: slugify(categoryName) });
    if (!categoryDoc) {
      // Create new category if doesn't exist
      categoryDoc = await Category.create({
        name: categoryName,
        slug: slugify(categoryName),
        description: `Posts about ${categoryName}`,
        postCount: 0,
      });
    }
    
    // Handle Tags
    const tagDocs = [];
    for (const tagName of tagNames || []) {
      let tagDoc = await Tag.findOne({ slug: slugify(tagName) });
      if (!tagDoc) {
        tagDoc = await Tag.create({
          name: tagName,
          slug: slugify(tagName),
          postCount: 0,
        });
      }
      tagDocs.push(tagDoc._id);
    }
    
    // Calculate reading stats
    const wordCount = countWords(content);
    const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));
    const codeBlockCount = (content.match(/<pre>/g) || []).length;
    const imageCount = (content.match(/<img/g) || []).length;
    
    // Create the post
    const post = await Blog.create({
      title,
      slug,
      type: type || "article",
      status: status || "draft",
      excerpt,
      body: content,
      bodyText: stripHtml(content),
      coverImage,
      coverImageAlt,
      category: categoryDoc._id,
      tags: tagDocs,
      series: series || undefined,
      techStack: techStack || [],
      difficulty: difficulty || undefined,
      githubUrl: githubUrl || undefined,
      demoUrl: demoUrl || undefined,
      isFeatured: isFeatured || false,
      isPinned: isPinned || false,
      commentsEnabled: commentsEnabled !== false,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
      author: user._id,
      seo: {
        metaTitle: seo?.metaTitle || title.slice(0, 70),
        metaDescription: seo?.metaDescription || excerpt.slice(0, 160),
        focusKeyword: seo?.focusKeyword || "",
        keywords: seo?.keywords?.split(",").map((k: string) => k.trim()) || [],
        ogImage: seo?.ogImage || coverImage,
        noIndex: seo?.noIndex || false,
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
    
    // Update category and tags post count
    await Category.findByIdAndUpdate(categoryDoc._id, {
      $inc: { postCount: 1 },
    });
    
    for (const tagId of tagDocs) {
      await Tag.findByIdAndUpdate(tagId, {
        $inc: { postCount: 1 },
      });
    }
    
    // Revalidate paths for cache
    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);
    revalidatePath("/admin/posts");
    
    // Populate references for response
    const populatedPost = await Blog.findById(post._id)
      .populate("category", "name slug")
      .populate("tags", "name slug color")
      .populate("author", "name email image");
    
    return NextResponse.json(populatedPost, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}

// PUT /api/posts/:id - Update existing post
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const searchParams = request.nextUrl.searchParams;
    const postId = searchParams.get("id");
    
    if (!postId) {
      return NextResponse.json(
        { error: "Post ID required" },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    const existingPost = await Blog.findById(postId);
    
    if (!existingPost) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }
    
    // Check ownership or admin role
    if (existingPost.author.toString() !== user._id.toString() && user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
    const {
      title,
      slug,
      type,
      status,
      excerpt,
      coverImage,
      coverImageAlt,
      category: categoryName,
      tags: tagNames,
      content,
      seo,
      ...rest
    } = body;
    
    // Update logic similar to create but with updates
    let categoryDoc = null;
    if (categoryName && categoryName !== existingPost.category.toString()) {
      categoryDoc = await Category.findOne({ slug: slugify(categoryName) });
      if (!categoryDoc) {
        categoryDoc = await Category.create({
          name: categoryName,
          slug: slugify(categoryName),
        });
      }
    }
    
    // Prepare update data
    const updateData: any = {
      ...rest,
      lastEditedAt: new Date(),
    };
    
    if (title) updateData.title = title;
    if (slug) updateData.slug = slug;
    if (type) updateData.type = type;
    if (status) updateData.status = status;
    if (excerpt) updateData.excerpt = excerpt;
    if (coverImage) updateData.coverImage = coverImage;
    if (coverImageAlt) updateData.coverImageAlt = coverImageAlt;
    if (categoryDoc) updateData.category = categoryDoc._id;
    if (content) {
      updateData.body = content;
      updateData.bodyText = stripHtml(content);
      updateData.readingStats = {
        wordCount: countWords(content),
        readingTimeMinutes: Math.max(1, Math.ceil(countWords(content) / 200)),
        codeBlockCount: (content.match(/<pre>/g) || []).length,
        imageCount: (content.match(/<img/g) || []).length,
      };
    }
    if (seo) {
      updateData.seo = {
        metaTitle: seo.metaTitle,
        metaDescription: seo.metaDescription,
        focusKeyword: seo.focusKeyword,
        keywords: seo.keywords?.split(",").map((k: string) => k.trim()) || [],
        ogImage: seo.ogImage,
        noIndex: seo.noIndex,
      };
    }
    
    const updatedPost = await Blog.findByIdAndUpdate(postId, updateData, {
      new: true,
    })
      .populate("category", "name slug")
      .populate("tags", "name slug color")
      .populate("author", "name email image");
     if (!updatedPost) {
      return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
    }
    revalidatePath(`/blog/${updatedPost.slug}`);
    
    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

// DELETE /api/posts/:id - Delete a post
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    
    const user = {_id:12341518,role:"admin"};
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const searchParams = request.nextUrl.searchParams;
    const postId = searchParams.get("id");
    
    if (!postId) {
      return NextResponse.json(
        { error: "Post ID required" },
        { status: 400 }
      );
    }
    
    const deletedPost = await Blog.findByIdAndDelete(postId);
    
    if (!deletedPost) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }
    
    // Decrement category and tags post count
    await Category.findByIdAndUpdate(deletedPost.category, {
      $inc: { postCount: -1 },
    });
    
    for (const tagId of deletedPost.tags) {
      await Tag.findByIdAndUpdate(tagId, {
        $inc: { postCount: -1 },
      });
    }
    
    revalidatePath("/blog");
    revalidatePath("/admin/posts");
    
    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
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