// app/api/tags/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/utils/db";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import User from "@/utils/models/user.model";
import { Tag } from "@/utils/models/tags.model";

async function isAdmin() {
  const session = await getServerSession();
  if (!session?.user?.email) return false;
  
  const user = await User.findOne({ email: session.user.email });
  return user?.role === "admin";
}

// DELETE /api/tags/[id] - Delete a tag
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  try {
    await dbConnect();
    
    const isAdminUser = await isAdmin();
    if (!isAdminUser) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin access required." },
        { status: 401 }
      );
    }
    
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { success: false, error: "Invalid tag ID" },
        { status: 400 }
      );
    }
    
    const tag = await Tag.findById(params.id);
    if (!tag) {
      return NextResponse.json(
        { success: false, error: "Tag not found" },
        { status: 404 }
      );
    }
    
    // Check if tag has posts
    const { Blog } = await import("@/utils/models/Blog");
    const postsCount = await Blog.countDocuments({ tags: params.id });
    
    if (postsCount > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Cannot delete tag with ${postsCount} posts. Please remove the tag from posts first.` 
        },
        { status: 400 }
      );
    }
    
    await Tag.findByIdAndDelete(params.id);
    revalidatePath("/admin/tags");
    
    return NextResponse.json({
      success: true,
      message: "Tag deleted successfully",
    });
    
  } catch (error) {
    console.error("Error deleting tag:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete tag" },
      { status: 500 }
    );
  }
}