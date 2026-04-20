// app/api/categories/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/utils/db";// Adjust import path as needed
import { revalidatePath } from "next/cache";
import User from "@/utils/models/user.model"; // static import
import { Category } from "@/utils/models/categories.model";
// Helper to check admin access
async function isAdmin() {
  const session = await getServerSession();
  if (!session?.user?.email) return false;
  
  const user = await User.findOne({ email: session.user.email });
  return user?.role === "admin";
}

// Helper function to generate slug
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// GET /api/categories - Fetch all categories
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const search = searchParams.get("search") || "";
    const parentCategory = searchParams.get("parentCategory");
    const sortBy = searchParams.get("sortBy") || "order"; // order, postCount, name, createdAt
    
    const query: any = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    
    if (parentCategory !== null && parentCategory !== undefined) {
      query.parentCategory = parentCategory === "null" ? null : parentCategory;
    }
    
    // Determine sort order
    let sortOption: any = {};
    switch (sortBy) {
      case "postCount":
        sortOption = { postCount: -1, order: 1 };
        break;
      case "name":
        sortOption = { name: 1 };
        break;
      case "createdAt":
        sortOption = { createdAt: -1 };
        break;
      default:
        sortOption = { order: 1, postCount: -1 };
    }
    
    const skip = (page - 1) * limit;
    
    const [categories, total] = await Promise.all([
      Category.find(query)
        .populate("parentCategory", "name slug")
        .sort(sortOption)
        .skip(skip)
        .limit(limit),
      Category.countDocuments(query),
    ]);
    
    // Build hierarchical categories if requested
    const hierarchical = searchParams.get("hierarchical") === "true";
    let responseData = categories;
    
    if (hierarchical) {
      // Get all categories for hierarchy
      const allCategories = await Category.find().populate("parentCategory", "name slug");
      responseData = buildCategoryTree(allCategories);
    }
    
    return NextResponse.json({
      success: true,
      data: responseData,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST /api/categories - Create a new category
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    // Check admin authentication
    const isAdminUser = await isAdmin();
    if (!isAdminUser) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin access required." },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { 
      name, 
      description, 
      icon, 
      coverImage, 
      parentCategory, 
      order, 
      seo 
    } = body;
    
    // Validate required fields
    if (!name || name.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Category name is required" },
        { status: 400 }
      );
    }
    
    if (name.length > 80) {
      return NextResponse.json(
        { success: false, error: "Category name must be less than 80 characters" },
        { status: 400 }
      );
    }
    
    // Check if category with same name already exists
    const existingCategory = await Category.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, "i") } 
    });
    
    if (existingCategory) {
      return NextResponse.json(
        { success: false, error: "Category with this name already exists" },
        { status: 409 }
      );
    }
    
    // Generate slug
    let slug = generateSlug(name);
    
    // Check if slug already exists and make it unique if needed
    let slugExists = await Category.findOne({ slug });
    let counter = 1;
    while (slugExists) {
      slug = `${generateSlug(name)}-${counter}`;
      slugExists = await Category.findOne({ slug });
      counter++;
    }
    
    // Validate parent category if provided
    if (parentCategory) {
      const parentExists = await Category.findById(parentCategory);
      if (!parentExists) {
        return NextResponse.json(
          { success: false, error: "Parent category not found" },
          { status: 400 }
        );
      }
    }
    
    // Validate SEO meta fields length
    if (seo) {
      if (seo.metaTitle && seo.metaTitle.length > 70) {
        return NextResponse.json(
          { success: false, error: "Meta title must be less than 70 characters" },
          { status: 400 }
        );
      }
      if (seo.metaDescription && seo.metaDescription.length > 160) {
        return NextResponse.json(
          { success: false, error: "Meta description must be less than 160 characters" },
          { status: 400 }
        );
      }
    }
    
    // Create category
    const category = await Category.create({
      name: name.trim(),
      slug,
      description: description || "",
      icon: icon || "",
      coverImage: coverImage || "",
      parentCategory: parentCategory || null,
      order: order || 0,
      seo: {
        metaTitle: seo?.metaTitle || "",
        metaDescription: seo?.metaDescription || "",
        ogImage: seo?.ogImage || "",
      },
      postCount: 0,
    });
    
    // Revalidate paths
    revalidatePath("/admin/categories");
    revalidatePath("/blog");
    
    // Populate parent category if exists
    const populatedCategory = await Category.findById(category._id)
      .populate("parentCategory", "name slug");
    
    return NextResponse.json({
      success: true,
      data: populatedCategory,
      message: "Category created successfully",
    }, { status: 201 });
    
  } catch (error: any) {
    console.error("Error creating category:", error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: "Category name or slug already exists" },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: "Failed to create category" },
      { status: 500 }
    );
  }
}

// Helper function to build category tree
function buildCategoryTree(categories: any[], parentId: string | null = null): any[] {
  const tree: any[] = [];
  
  categories.forEach(category => {
    const categoryObj = category.toObject ? category.toObject() : category;
    const categoryParentId = categoryObj.parentCategory?._id?.toString() || 
                            categoryObj.parentCategory?.toString() || 
                            null;
    
    if (categoryParentId === parentId) {
      const children = buildCategoryTree(categories, categoryObj._id.toString());
      if (children.length > 0) {
        categoryObj.children = children;
      }
      tree.push(categoryObj);
    }
  });
  
  return tree;
}