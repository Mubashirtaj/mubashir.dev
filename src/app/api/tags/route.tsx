// app/api/tags/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/utils/db";
import { revalidatePath } from "next/cache";
import { Tag } from "@/utils/models/tags.model";
import User from "@/utils/models/user.model"; // static import
async function isAdmin() {
  const session = await getServerSession();
  if (!session?.user?.email) return false;
  
  const user = await User.findOne({ email: session.user.email });
  return user?.role === "admin";
}

// GET /api/tags - Fetch all tags
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "100");
    const search = searchParams.get("search") || "";
    
    const query: any = {};
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    
    const skip = (page - 1) * limit;
    
    const [tags, total] = await Promise.all([
      Tag.find(query)
        .sort({ postCount: -1, name: 1 })
        .skip(skip)
        .limit(limit),
      Tag.countDocuments(query),
    ]);
    
    return NextResponse.json({
      success: true,
      data: tags,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch tags" },
      { status: 500 }
    );
  }
}

// POST /api/tags - Create a new tag
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const isAdminUser = await isAdmin();
    if (!isAdminUser) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin access required." },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { name, color } = body;
    
    if (!name || name.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Tag name is required" },
        { status: 400 }
      );
    }
    
    // Generate slug
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
    
    // Check if tag already exists
    const existingTag = await Tag.findOne({ slug });
    if (existingTag) {
      return NextResponse.json(
        { success: false, error: "Tag with this name already exists" },
        { status: 409 }
      );
    }
    
    const tag = await Tag.create({
      name: name.trim(),
      slug,
      color: color || "#3B82F6",
      postCount: 0,
    });
    
    revalidatePath("/admin/tags");
    
    return NextResponse.json({
      success: true,
      data: tag,
      message: "Tag created successfully",
    }, { status: 201 });
    
  } catch (error) {
    console.error("Error creating tag:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create tag" },
      { status: 500 }
    );
  }
}