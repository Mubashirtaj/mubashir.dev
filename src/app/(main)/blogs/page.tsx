// app/page.tsx
import Link from "next/link";
import Image from "next/image";
import dbConnect from "@/utils/db";
import { Blog } from "@/utils/models/Blog";
import { format } from "date-fns";
import { Category } from "@/utils/models/categories.model";
import { Tag } from "@/utils/models/tags.model";
import "@/utils/models/user.model";

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  coverImageAlt: string;
  type: string;
  difficulty: string;
  readingStats: { readingTimeMinutes: number };
  createdAt: Date;
  publishedAt: Date;
  category: { _id: string; name: string; slug: string };
  tags: Array<{ _id: string; name: string; slug: string; color: string }>;
  author: { name: string; email: string; image: string };
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

// ============ Hero Section ============
function HeroSection({ featuredPosts }: { featuredPosts: BlogPost[] }) {
  const mainFeatured = featuredPosts[0];
  const otherFeatured = featuredPosts.slice(1, 4);

  return (
    <div
      className="relative rounded-3xl overflow-hidden"
      
    >
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute top-0 left-0 w-72 h-72 rounded-full blur-3xl"
          style={{ background: "var(--secondary-color)" }}
        />
        <div
          className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl"
          style={{ background: "var(--bg-soft)" }}
        />
      </div>

      <div className="relative px-6 py-12 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2
              className="text-4xl font-bold tracking-tight sm:text-5xl"
              style={{ color: "var(--text-color)" }}
            >
              Featured{" "}
              <span style={{ color: "var(--primary-color)" }}>Stories</span>
            </h2>
            <p
              className="mt-4 text-lg leading-8"
              style={{ color: "var(--text-muted)" }}
            >
              Discover our hand-picked articles for you
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {mainFeatured && (
              <Link
                href={`/blog/${mainFeatured.slug}`}
                className="lg:col-span-2 group relative overflow-hidden rounded-2xl transition-all duration-300"
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--border-color)",
                  boxShadow: "var(--shadow-soft)",
                }}
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
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ background: "var(--gradient-primary)" }}
                    >
                      <span className="text-white text-6xl">📝</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  <div className="absolute top-4 left-4 flex gap-2">
                    {mainFeatured.isFeatured && (
                      <span
                        className="px-3 py-1 text-xs font-semibold rounded-full"
                        style={{
                          background: "var(--primary-color)",
                          color: "var(--bg-color)",
                        }}
                      >
                        Featured
                      </span>
                    )}
                    <span
                      className="px-3 py-1 text-xs font-semibold rounded-full"
                      style={{
                        background: "rgba(255,255,255,0.9)",
                        color: "var(--secondary-color)",
                      }}
                    >
                      {mainFeatured.type}
                    </span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div
                      className="flex items-center gap-2 text-sm mb-2"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <span>{mainFeatured.category?.name}</span>
                      <span>•</span>
                      <span>
                        {mainFeatured.readingStats?.readingTimeMinutes || 5} min
                        read
                      </span>
                    </div>
                    <h3
                      className="text-2xl font-bold mb-2 transition"
                      style={{ color: "var(--text-color)" }}
                    >
                      {mainFeatured.title}
                    </h3>
                    <p className="line-clamp-2" style={{ color: "var(--text-muted)" }}>
                      {mainFeatured.excerpt}
                    </p>
                  </div>
                </div>
              </Link>
            )}

            <div className="space-y-6">
              {otherFeatured.map((post) => (
                <Link
                  key={post._id}
                  href={`/blog/${post.slug}`}
                  className="group flex gap-4 rounded-xl p-4 transition-all duration-300"
                  style={{
                    background: "var(--card-bg)",
                    border: "1px solid var(--border-color)",
                    boxShadow: "var(--shadow-soft)",
                  }}
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
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ background: "var(--gradient-primary)" }}
                      >
                        <span className="text-2xl">📄</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div
                      className="flex items-center gap-2 text-xs mb-1"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <span>{post.category?.name}</span>
                      <span>•</span>
                      <span>{post.readingStats?.readingTimeMinutes || 5} min</span>
                    </div>
                    <h3
                      className="font-semibold transition line-clamp-2"
                      style={{ color: "var(--text-color)" }}
                    >
                      {post.title}
                    </h3>
                    <p
                      className="text-sm mt-1 line-clamp-1"
                      style={{ color: "var(--text-muted)" }}
                    >
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

// ============ Blog Card ============
function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article
      className="group rounded-xl overflow-hidden transition-all duration-300"
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border-color)",
        boxShadow: "var(--shadow-soft)",
      }}
    >
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
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: "var(--gradient-primary)" }}
            >
              <span className="text-4xl">📖</span>
            </div>
          )}

          {post.difficulty && (
            <div className="absolute top-3 right-3">
              <span
                className="px-2 py-1 text-xs font-semibold rounded-full"
                style={{
                  background:
                    post.difficulty === "beginner"
                      ? "#22c55e"
                      : post.difficulty === "intermediate"
                      ? "#eab308"
                      : "var(--primary-color)",
                  color:
                    post.difficulty === "advanced"
                      ? "var(--bg-color)"
                      : "white",
                }}
              >
                {post.difficulty}
              </span>
            </div>
          )}
        </div>

        <div className="p-5">
          <div
            className="flex items-center gap-2 text-xs mb-3"
            style={{ color: "var(--text-muted)" }}
          >
            <span
              className="font-medium"
              style={{ color: "var(--primary-color)" }}
            >
              {post.category?.name}
            </span>
            <span>•</span>
            <span>
              {format(
                new Date(post.publishedAt || post.createdAt),
                "MMM dd, yyyy"
              )}
            </span>
            <span>•</span>
            <span>{post.readingStats?.readingTimeMinutes || 5} min read</span>
          </div>

          <h3
            className="text-xl font-bold mb-2 transition line-clamp-2"
            style={{ color: "var(--text-color)" }}
          >
            {post.title}
          </h3>

          <p className="line-clamp-3 mb-4" style={{ color: "var(--text-muted)" }}>
            {post.excerpt}
          </p>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag._id}
                  className="px-2 py-1 text-xs rounded-full"
                  style={{
                    background: "rgba(79, 209, 165, 0.15)",
                    color: "var(--primary-color)",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  {tag.name}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span
                  className="px-2 py-1 text-xs rounded-full"
                  style={{
                    background: "var(--secondary-color)",
                    color: "var(--text-muted)",
                  }}
                >
                  +{post.tags.length - 3}
                </span>
              )}
            </div>
          )}

          <div
            className="flex items-center gap-3 pt-4"
            style={{ borderTop: "1px solid var(--border-color)" }}
          >
            {post.author?.image ? (
              <Image
                src={post.author.image}
                alt={post.author.name}
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(79, 209, 165, 0.15)",
                  border: "1px solid var(--border-color)",
                }}
              >
                <span
                  className="text-sm font-semibold"
                  style={{ color: "var(--primary-color)" }}
                >
                  {post.author?.name?.charAt(0) || "A"}
                </span>
              </div>
            )}
            <div>
              <p
                className="text-sm font-medium"
                style={{ color: "var(--text-color)" }}
              >
                {post.author?.name}
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Author
              </p>
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
    <div
      className="py-16 rounded-3xl"
      style={{ background: "var(--gradient-bg)" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2
            className="text-3xl font-bold mb-3"
            style={{ color: "var(--text-color)" }}
          >
            Explore by{" "}
            <span style={{ color: "var(--primary-color)" }}>Categories</span>
          </h2>
          <p style={{ color: "var(--text-muted)" }}>
            Find articles that match your interests
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedCategories.map((category) => (
            <Link
              key={category._id}
              href={`/blog/category/${category.slug}`}
              className="group rounded-xl p-6 text-center transition-all duration-300 hover:-translate-y-1"
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--border-color)",
                boxShadow: "var(--shadow-soft)",
              }}
            >
              <div
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition"
                style={{ background: "rgba(79, 209, 165, 0.15)" }}
              >
                <span className="text-2xl">📁</span>
              </div>
              <h3
                className="text-lg font-semibold mb-2"
                style={{ color: "var(--text-color)" }}
              >
                {category.name}
              </h3>
              {category.description && (
                <p
                  className="text-sm mb-3 line-clamp-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  {category.description}
                </p>
              )}
              <span
                className="text-sm font-medium"
                style={{ color: "var(--primary-color)" }}
              >
                {category.postCount || 0} articles
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============ Tags Cloud ============
function TagsCloud({ tags }: { tags: TagType[] }) {
  const popularTags = tags.slice(0, 12);

  return (
    <div className="p-16 " style={{ background: "var(--bg-color)" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2
            className="text-3xl font-bold mb-3"
            style={{ color: "var(--text-color)" }}
          >
            Popular <span style={{ color: "var(--primary-color)" }}>Tags</span>
          </h2>
          <p style={{ color: "var(--text-muted)" }}>Discover content by topic</p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {popularTags.map((tag) => (
            <Link
              key={tag._id}
              href={`/blog/tag/${tag.slug}`}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105"
              style={{
                background: "rgba(79, 209, 165, 0.15)",
                color: "var(--primary-color)",
                border: "1px solid var(--border-color)",
              }}
            >
              #{tag.name}
              <span className="ml-1 text-xs opacity-75">
                ({tag.postCount || 0})
              </span>
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
    <div
      className="py-16 rounded-3xl"
      style={{ background: "var(--gradient-primary)" }}
    >
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2
          className="text-3xl font-bold mb-3"
          style={{ color: "var(--bg-color)" }}
        >
          Stay in the Loop
        </h2>
        <p className="mb-6" style={{ color: "var(--bg-soft)" }}>
          Get the latest posts delivered right to your inbox
        </p>

        <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
            style={{
              background: "var(--bg-color)",
              color: "var(--text-color)",
              border: "1px solid var(--border-color)",
            }}
            required
          />
          <button
            type="submit"
            className="px-6 py-3 font-semibold rounded-lg transition"
            style={{
              background: "var(--bg-color)",
              color: "var(--primary-color)",
            }}
          >
            Subscribe
          </button>
        </form>

        <p className="text-sm mt-4" style={{ color: "var(--bg-soft)" }}>
          No spam, unsubscribe anytime.
        </p>
      </div>
    </div>
  );
}

// ============ Main Page ============
export default async function HomePage() {
  await dbConnect();

  const featuredPosts = await Blog.find({ status: "published", isFeatured: true })
    .populate("category", "name slug")
    .populate("tags", "name slug color")
    .populate("author", "name email avatar")
    .sort({ pinned: -1, publishedAt: -1 })
    .limit(4)
    .lean();

  const recentPosts = await Blog.find({ status: "published" })
    .populate("category", "name slug")
    .populate("tags", "name slug color")
    .populate("author", "name email avatar")
    .sort({ publishedAt: -1 })
    .limit(9)
    .lean();

  const categories = await Category.find({}).sort({ postCount: -1 }).limit(6).lean();
  const tags = await Tag.find({}).sort({ postCount: -1 }).limit(12).lean();

  const parsedFeaturedPosts = JSON.parse(JSON.stringify(featuredPosts));
  const parsedRecentPosts = JSON.parse(JSON.stringify(recentPosts));
  const parsedCategories = JSON.parse(JSON.stringify(categories));
  const parsedTags = JSON.parse(JSON.stringify(tags));

  return (
    <main className="min-h-screen" >
      {parsedFeaturedPosts.length > 0 && (
        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <HeroSection featuredPosts={parsedFeaturedPosts} />
          </div>
        </section>
      )}

      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2
                className="text-3xl font-bold"
                style={{ color: "var(--text-color)" }}
              >
                Latest{" "}
                <span style={{ color: "var(--primary-color)" }}>Articles</span>
              </h2>
              <p className="mt-2" style={{ color: "var(--text-muted)" }}>
                Fresh content just for you
              </p>
            </div>
            <Link
              href="/blog"
              className="font-semibold transition flex items-center gap-1"
              style={{ color: "var(--primary-color)" }}
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

      {parsedCategories.length > 0 && (
        <section className="px-6">
          <CategoriesSection categories={parsedCategories} />
        </section>
      )}

      {parsedTags.length > 0 && (
        <section className="px-6">
          <TagsCloud tags={parsedTags} />
        </section>
      )}

      <section className="px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          <NewsletterSection />
        </div>
      </section>
    </main>
  );
}

export async function generateStaticParams() {
  await dbConnect();
  const posts = await Blog.find({ status: "published" }).select("slug").lean();
  return posts.map((post) => ({ slug: post.slug }));
}