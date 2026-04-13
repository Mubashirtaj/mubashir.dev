// app/page.tsx
import Link from "next/link";
import Image from "next/image";
import dbConnect from "@/utils/db";
import { Blog } from "@/utils/models/Blog";
import { format } from "date-fns";
import { Category } from "@/utils/models/categories.model";
import { Tag } from "@/utils/models/tags.model";
import "@/utils/models/user.model";
// ============ Types ============
interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  coverImageAlt: string;
  type: string;
  difficulty: string;
  readingStats: {
    readingTimeMinutes: number;
  };
  createdAt: Date;
  publishedAt: Date;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  tags: Array<{
    _id: string;
    name: string;
    slug: string;
    color: string;
  }>;
  author: {
    name: string;
    email: string;
    image: string;
  };
  isFeatured: boolean;
  isPinned: boolean;
}

interface CategoryType {
  _id: string;
  name: string;
  slug: string;
  description: string;
  coverImage: string;
  postCount: number;
}

interface TagType {
  _id: string;
  name: string;
  slug: string;
  color: string;
  postCount: number;
}

// ============ Hero Section Component ============
function HeroSection({ featuredPosts }: { featuredPosts: BlogPost[] }) {
  const mainFeatured = featuredPosts[0];
  const otherFeatured = featuredPosts.slice(1, 4);

  return (
    <div className="relative bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 rounded-3xl overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-72 h-72 bg-red-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose-200 rounded-full blur-3xl"></div>
      </div>

      <div className="relative px-6 py-12 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Featured <span className="text-red-600">Stories</span>
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              Discover our hand-picked articles for you
            </p>
          </div>

          {/* Featured Posts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Featured Post */}
            {mainFeatured && (
              <Link
                href={`/blog/${mainFeatured.slug}`}
                className="lg:col-span-2 group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-80 lg:h-96 overflow-hidden">
                  {mainFeatured.coverImage ? (
                    <Image
                      src={mainFeatured.coverImage}
                      alt={mainFeatured.coverImageAlt || mainFeatured.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-red-400 to-rose-500 flex items-center justify-center">
                      <span className="text-white text-6xl">📝</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    {mainFeatured.isFeatured && (
                      <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                        Featured
                      </span>
                    )}
                    <span className="px-3 py-1 bg-white/90 text-gray-700 text-xs font-semibold rounded-full">
                      {mainFeatured.type}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-center gap-2 text-sm mb-2">
                      <span>{mainFeatured.category?.name}</span>
                      <span>•</span>
                      <span>{mainFeatured.readingStats?.readingTimeMinutes || 5} min read</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-red-200 transition">
                      {mainFeatured.title}
                    </h3>
                    <p className="text-white/90 line-clamp-2">
                      {mainFeatured.excerpt}
                    </p>
                  </div>
                </div>
              </Link>
            )}

            {/* Other Featured Posts */}
            <div className="space-y-6">
              {otherFeatured.map((post) => (
                <Link
                  key={post._id}
                  href={`/blog/${post.slug}`}
                  className="group flex gap-4 bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                    {post.coverImage ? (
                      <Image
                        src={post.coverImage}
                        alt={post.coverImageAlt || post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-red-300 to-rose-400 flex items-center justify-center">
                        <span className="text-2xl">📄</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                      <span>{post.category?.name}</span>
                      <span>•</span>
                      <span>{post.readingStats?.readingTimeMinutes || 5} min</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-red-600 transition line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                      {post.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ Blog Card Component ============
function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
      <Link href={`/blog/${post.slug}`}>
        <div className="relative h-48 overflow-hidden">
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.coverImageAlt || post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-red-200 to-rose-300 flex items-center justify-center">
              <span className="text-4xl">📖</span>
            </div>
          )}
          
          {/* Difficulty Badge */}
          {post.difficulty && (
            <div className="absolute top-3 right-3">
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                post.difficulty === 'beginner' ? 'bg-green-500 text-white' :
                post.difficulty === 'intermediate' ? 'bg-yellow-500 text-white' :
                'bg-red-500 text-white'
              }`}>
                {post.difficulty}
              </span>
            </div>
          )}
        </div>

        <div className="p-5">
          {/* Meta info */}
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
            <span className="text-red-600 font-medium">{post.category?.name}</span>
            <span>•</span>
            <span>{format(new Date(post.publishedAt || post.createdAt), 'MMM dd, yyyy')}</span>
            <span>•</span>
            <span>{post.readingStats?.readingTimeMinutes || 5} min read</span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition line-clamp-2">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-gray-600 line-clamp-3 mb-4">
            {post.excerpt}
          </p>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag._id}
                  className="px-2 py-1 text-xs rounded-full"
                  style={{
                    backgroundColor: tag.color || '#FEE2E2',
                    color: '#991B1B'
                  }}
                >
                  {tag.name}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                  +{post.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Author */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
            {post.author?.image ? (
              <Image
                src={post.author.image}
                alt={post.author.name}
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-sm font-semibold">
                  {post.author?.name?.charAt(0) || 'A'}
                </span>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-gray-900">{post.author?.name}</p>
              <p className="text-xs text-gray-500">Author</p>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

// ============ Categories Section ============
function CategoriesSection({ categories }: { categories: CategoryType[] }) {
  const displayedCategories = categories.slice(0, 6);
  
  return (
    <div className="py-16 bg-gradient-to-r from-red-50 to-rose-50 rounded-3xl">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Explore by <span className="text-red-600">Categories</span>
          </h2>
          <p className="text-gray-600">Find articles that match your interests</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedCategories.map((category) => (
            <Link
              key={category._id}
              href={`/blog/category/${category.slug}`}
              className="group bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 text-center hover:-translate-y-1"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-red-200 transition">
                <span className="text-2xl">📁</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-red-600">
                {category.name}
              </h3>
              {category.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {category.description}
                </p>
              )}
              <span className="text-sm text-red-600 font-medium">
                {category.postCount || 0} articles
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============ Tags Cloud Component ============
function TagsCloud({ tags }: { tags: TagType[] }) {
  const popularTags = tags.slice(0, 12);
  
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Popular <span className="text-red-600">Tags</span>
          </h2>
          <p className="text-gray-600">Discover content by topic</p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {popularTags.map((tag) => (
            <Link
              key={tag._id}
              href={`/blog/tag/${tag.slug}`}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: tag.color || '#FEE2E2',
                color: '#991B1B'
              }}
            >
              #{tag.name}
              <span className="ml-1 text-xs opacity-75">({tag.postCount || 0})</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============ Newsletter Section ============
function NewsletterSection() {
  return (
    <div className="py-16 bg-gradient-to-r from-red-600 to-rose-600 rounded-3xl">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-white mb-3">
          Stay in the Loop
        </h2>
        <p className="text-red-100 mb-6">
          Get the latest posts delivered right to your inbox
        </p>
        
        <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
            required
          />
          <button
            type="submit"
            className="px-6 py-3 bg-white text-red-600 font-semibold rounded-lg hover:bg-red-50 transition"
          >
            Subscribe
          </button>
        </form>
        
        <p className="text-red-200 text-sm mt-4">
          No spam, unsubscribe anytime.
        </p>
      </div>
    </div>
  );
}

// ============ Main Page Component (SSG) ============
export default async function HomePage() {
  // Fetch data on the server
  await dbConnect();
  
  // Fetch featured posts
  const featuredPosts = await Blog.find({ 
    status: "published",
    isFeatured: true 
  })
    .populate("category", "name slug")
    .populate("tags", "name slug color")
    .populate("author", "name email avatar")
    .sort({ pinned: -1, publishedAt: -1 })
    .limit(4)
    .lean();
  
  // Fetch recent posts
  const recentPosts = await Blog.find({ status: "published" })
    .populate("category", "name slug")
    .populate("tags", "name slug color")
    .populate("author", "name email avatar")
    .sort({ publishedAt: -1 })
    .limit(9)
    .lean();
  
  // Fetch categories
  const categories = await Category.find({})
    .sort({ postCount: -1 })
    .limit(6)
    .lean();
  
  // Fetch tags
  const tags = await Tag.find({})
    .sort({ postCount: -1 })
    .limit(12)
    .lean();
  
  // Convert MongoDB documents to plain objects
  const parsedFeaturedPosts = JSON.parse(JSON.stringify(featuredPosts));
  const parsedRecentPosts = JSON.parse(JSON.stringify(recentPosts));
  const parsedCategories = JSON.parse(JSON.stringify(categories));
  const parsedTags = JSON.parse(JSON.stringify(tags));
  
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section with Featured Posts */}
      {parsedFeaturedPosts.length > 0 && (
        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <HeroSection featuredPosts={parsedFeaturedPosts} />
          </div>
        </section>
      )}
      
      {/* Recent Posts Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Latest <span className="text-red-600">Articles</span>
              </h2>
              <p className="text-gray-600 mt-2">
                Fresh content just for you
              </p>
            </div>
            <Link
              href="/blog"
              className="text-red-600 font-semibold hover:text-red-700 transition flex items-center gap-1"
            >
              View all
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {parsedRecentPosts.map((post: BlogPost) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      {parsedCategories.length > 0 && (
        <section className="px-6">
          <CategoriesSection categories={parsedCategories} />
        </section>
      )}
      
      {/* Tags Cloud Section */}
      {parsedTags.length > 0 && (
        <section className="px-6">
          <TagsCloud tags={parsedTags} />
        </section>
      )}
      
      {/* Newsletter Section */}
      <section className="px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          <NewsletterSection />
        </div>
      </section>
    </main>
  );
}

// Generate static paths for dynamic routes if needed
export async function generateStaticParams() {
  await dbConnect();
  
  const posts = await Blog.find({ status: "published" })
    .select("slug")
    .lean();
  
  return posts.map((post) => ({
    slug: post.slug,
  }));
}