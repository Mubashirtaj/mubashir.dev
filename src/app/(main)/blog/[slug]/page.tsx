// app/blog/[slug]/page.tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import dbConnect from "@/utils/db";
import { Blog } from "@/utils/models/Blog";
import { format } from "date-fns";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  await dbConnect();
  const { slug } = await params;
    console.log('Fetching blog post with slug:', slug);
  const post = await Blog.findOne({ 
    slug: slug, 
    status: "published" 
  })
    .populate("category", "name slug")
    .populate("tags", "name slug color")
    .populate("author", "name email avatar")
    .lean();
  
  if (!post) {
    // notFound();
  }
  
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-red-50 via-rose-50 to-pink-50">
        <div className="max-w-4xl mx-auto px-6 py-16">
          {/* Category and Meta */}
          <div className="mb-6">
            <Link 
              href={`/blog/category/${post.category?.slug}`}
              className="text-red-600 font-semibold hover:text-red-700"
            >
              {post.category?.name}
            </Link>
            <div className="flex items-center gap-3 text-sm text-gray-500 mt-2">
              <span>{format(new Date(post.publishedAt || post.createdAt), 'MMMM dd, yyyy')}</span>
              <span>•</span>
              <span>{post.readingStats?.readingTimeMinutes || 5} min read</span>
            </div>
          </div>
          
          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            {post.title}
          </h1>
          
          {/* Excerpt */}
          <p className="text-xl text-gray-600 mb-8">
            {post.excerpt}
          </p>
          
          {/* Author */}
          <div className="flex items-center gap-4">
            {post.author?.image ? (
              <Image
                src={post.author.image}
                alt={post.author.name}
                width={48}
                height={48}
                className="rounded-full"
              />
            ) : (
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-lg font-semibold">
                  {post.author?.name?.charAt(0) || 'A'}
                </span>
              </div>
            )}
            <div>
              <p className="font-semibold text-gray-900">{post.author?.name}</p>
              <p className="text-sm text-gray-500">Author</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Cover Image */}
      {post.coverImage && (
        <div className="relative w-full h-96 md:h-[500px] -mt-20 mb-12">
          <Image
            src={post.coverImage}
            alt={post.coverImageAlt || post.title}
            fill
            className="object-contain"
            priority
          />
        </div>
      )}
      
      {/* Content */}
      <article className="max-w-4xl mx-auto px-6 py-12">
        <div 
          className="prose prose-lg prose-red max-w-none"
          dangerouslySetInnerHTML={{ __html: post.body }}
        />
        
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: any) => (
                <Link
                  key={tag._id}
                  href={`/blog/tag/${tag.slug}`}
                  className="px-3 py-1 rounded-full text-sm"
                  style={{
                    backgroundColor: tag.color || '#FEE2E2',
                    color: '#ffff'
                  }}
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </main>
  );
}

// Generate static paths
export async function generateStaticParams() {
  await dbConnect();
  
  const posts = await Blog.find({ status: "published" })
    .select("slug")
    .lean();
  
  return posts.map((post) => ({
    slug: post.slug,
  }));
}