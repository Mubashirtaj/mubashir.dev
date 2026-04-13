// app/api/categories/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/utils/db";
import { Category } from "@/utils/models/Blog";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";

// Helper to check admin access
async function isAdmin() {
  const session = await getServerSession();
  if (!session?.user?.email) return false;
  
  const { User } = await import("@/utils/models/user.model");
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

// GET /api/categories/[id] - Fetch single category
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { success: false, error: "Invalid category ID" },
        { status: 400 }
      );
    }
    
    const category = await Category.findById(params.id)
      .populate("parentCategory", "name slug");
    
    if (!category) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }
    
    // Get subcategories count
    const subcategoriesCount = await Category.countDocuments({ 
      parentCategory: params.id 
    });
    
    const categoryData = category.toObject();
    
    return NextResponse.json({
      success: true,
      data: categoryData,
    });
    
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}

// PUT /api/categories/[id] - Update category
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { success: false, error: "Invalid category ID" },
        { status: 400 }
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
    
    const existingCategory = await Category.findById(params.id);
    if (!existingCategory) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }
    
    // Validate name length
    if (name && name.length > 80) {
      return NextResponse.json(
        { success: false, error: "Category name must be less than 80 characters" },
        { status: 400 }
      );
    }
    
    // Check if name already exists (excluding current category)
    if (name && name !== existingCategory.name) {
      const nameExists = await Category.findOne({ 
        name: { $regex: new RegExp(`^${name}$`, "i") },
        _id: { $ne: params.id }
      });
      
      if (nameExists) {
        return NextResponse.json(
          { success: false, error: "Category with this name already exists" },
          { status: 409 }
        );
      }
    }
    
    // Generate new slug if name changed
    let slug = existingCategory.slug;
    if (name && name !== existingCategory.name) {
      slug = generateSlug(name);
      
      // Check if slug already exists (excluding current category)
      let slugExists = await Category.findOne({ 
        slug, 
        _id: { $ne: params.id } 
      });
      
      let counter = 1;
      while (slugExists) {
        slug = `${generateSlug(name)}-${counter}`;
        slugExists = await Category.findOne({ 
          slug, 
          _id: { $ne: params.id } 
        });
        counter++;
      }
    }
    
    // Validate parent category (can't be self or child)
    if (parentCategory) {
      if (parentCategory === params.id) {
        return NextResponse.json(
          { success: false, error: "Category cannot be its own parent" },
          { status: 400 }
        );
      }
      
      // Check if parent is a child of this category (circular reference)
      const checkCircular = async (categoryId: string, targetId: string): Promise<boolean> => {
        if (categoryId === targetId) return true;
        const category = await Category.findById(categoryId);
        if (!category || !category.parentCategory) return false;
        return checkCircular(category.parentCategory.toString(), targetId);
      };
      
      const isCircular = await checkCircular(parentCategory, params.id);
      if (isCircular) {
        return NextResponse.json(
          { success: false, error: "Cannot create circular category reference" },
          { status: 400 }
        );
      }
      
      const parentExists = await Category.findById(parentCategory);
      if (!parentExists) {
        return NextResponse.json(
          { success: false, error: "Parent category not found" },
          { status: 400 }
        );
      }
    }
    
    // Validate SEO meta fields
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
    
    // Update category
    const updatedCategory = await Category.findByIdAndUpdate(
      params.id,
      {
        name: name || existingCategory.name,
        slug,
        description: description !== undefined ? description : existingCategory.description,
        icon: icon !== undefined ? icon : existingCategory.icon,
        coverImage: coverImage !== undefined ? coverImage : existingCategory.coverImage,
        parentCategory: parentCategory !== undefined ? parentCategory : existingCategory.parentCategory,
        order: order !== undefined ? order : existingCategory.order,
        seo: {
          metaTitle: seo?.metaTitle || existingCategory.seo?.metaTitle || "",
          metaDescription: seo?.metaDescription || existingCategory.seo?.metaDescription || "",
          ogImage: seo?.ogImage || existingCategory.seo?.ogImage || "",
        },
      },
      { new: true, runValidators: true }
    ).populate("parentCategory", "name slug");
    
    // Revalidate paths
    revalidatePath("/admin/categories");
    revalidatePath("/blog");
    revalidatePath(`/blog/category/${updatedCategory?.slug}`);
    
    return NextResponse.json({
      success: true,
      data: updatedCategory,
      message: "Category updated successfully",
    });
    
  } catch (error: any) {
    console.error("Error updating category:", error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: "Category name or slug already exists" },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: "Failed to update category" },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/[id] - Delete category
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { success: false, error: "Invalid category ID" },
        { status: 400 }
      );
    }
    
    const category = await Category.findById(params.id);
    if (!category) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }
    
    // Check if category has subcategories
    const subcategoriesCount = await Category.countDocuments({ 
      parentCategory: params.id 
    });
    
    if (subcategoriesCount > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Cannot delete category with ${subcategoriesCount} subcategories. Please reassign or delete subcategories first.` 
        },
        { status: 400 }
      );
    }
    
    // Check if category has posts
    const { Blog } = await import("@/utils/models/Blog");
    const postsCount = await Blog.countDocuments({ category: params.id });
    
    if (postsCount > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Cannot delete category with ${postsCount} posts. Please reassign or delete posts first.` 
        },
        { status: 400 }
      );
    }
    
    // Delete the category
    await Category.findByIdAndDelete(params.id);
    
    // Revalidate paths
    revalidatePath("/admin/categories");
    revalidatePath("/blog");
    
    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    });
    
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete category" },
      { status: 500 }
    );
  }
}