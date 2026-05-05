// app/page.tsx
import Link from "next/link";
import Image from "next/image";
import dbConnect from "@/utils/db";
import { Blog } from "@/utils/models/Blog";
import { format } from "date-fns";
import { Category } from "@/utils/models/categories.model";
import { Tag } from "@/utils/models/tags.model";
import "@/utils/models/user.model";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  coverImageAlt: string;
  type: string;
  difficulty: "beginner" | "intermediate" | "advanced" | string;
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
  icon?:string;
}

interface TagType {
  _id: string;
  name: string;
  slug: string;
  color: string;
  postCount: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function DifficultyBadge({ level }: { level: string }) {
  const styles: Record<string, string> = {
    beginner:
      "bg-[rgba(34,197,94,0.12)] text-[#4ade80] border border-[rgba(34,197,94,0.2)]",
    intermediate:
      "bg-[rgba(234,179,8,0.12)] text-[#fbbf24] border border-[rgba(234,179,8,0.2)]",
    advanced:
      "bg-[rgba(79,209,165,0.12)] text-[var(--primary-color)] border border-[var(--border-color)]",
  };
  return (
    <span
      className={`text-[10px] font-bold px-[9px] py-[3px] rounded-full ${
        styles[level] ?? styles.advanced
      }`}
    >
      {level}
    </span>
  );
}

function Avatar({ name, image }: { name?: string; image?: string }) {
  if (image) {
    return (
      <Image
        src={image}
        alt={name ?? "Author"}
        width={28}
        height={28}
        className="rounded-full object-cover"
      />
    );
  }
  return (
    <div
      className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
      style={{
        background: "rgba(79,209,165,0.13)",
        border: "1px solid var(--border-color)",
        color: "var(--primary-color)",
      }}
    >
      {name?.charAt(0)?.toUpperCase() ?? "A"}
    </div>
  );
}

function PlaceholderImage() {
  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ background: "linear-gradient(135deg, #044a3a, #022c29)" }}
    >
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#4FD1A5"
        strokeWidth="1.4"
        opacity={0.4}
      >
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    </div>
  );
}

function TagChip({ name }: { name: string }) {
  return (
    <span
      className="text-[11px] px-[9px] py-[3px] rounded-full"
      style={{
        background: "rgba(79,209,165,0.08)",
        color: "var(--primary-color)",
        border: "1px solid var(--border-color)",
      }}
    >
      {name}
    </span>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection({ featuredPost }: { featuredPost: BlogPost | null }) {
  return (
    <section className="py-[60px]">
      <div className="max-w-[1100px] mx-auto px-7">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-16 items-center">
          {/* Left */}
          <div>
            <div
              className="inline-flex items-center gap-2 text-[12px] font-semibold tracking-[1.4px] uppercase mb-5"
              style={{ color: "var(--primary-color)" }}
            >
              <span
                className="w-[6px] h-[6px] rounded-full"
                style={{ background: "var(--primary-color)" }}
              />
              Knowledge Hub
            </div>

            <h1
              className="text-[42px] lg:text-[48px] font-extrabold leading-[1.12] tracking-[-1.5px] mb-4"
              style={{ color: "var(--text-color)" }}
            >
              Ideas worth reading,{" "}
              <em
                className="not-italic"
                style={{ color: "var(--primary-color)" }}
              >
                stories worth sharing
              </em>
            </h1>

            <p
              className="text-base leading-[1.7] max-w-[420px] mb-8"
              style={{ color: "var(--text-muted)" }}
            >
              Deep dives into engineering, design, and culture — written for
              curious, thoughtful minds.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/blog"
                className="inline-block font-bold text-sm px-6 py-3 rounded-[10px] transition-colors"
                style={{
                  background: "var(--primary-color)",
                  color: "#022c29",
                }}
              >
                Explore Articles
              </Link>
              <Link
                href="/blog/category"
                className="inline-block text-sm px-6 py-3 rounded-[10px] transition-colors"
                style={{
                  border: "1px solid rgba(79,209,165,0.28)",
                  color: "var(--text-muted)",
                }}
              >
                Browse Topics
              </Link>
            </div>

            <div
              className="flex gap-9 mt-11 pt-9"
              style={{ borderTop: "1px solid var(--border-color)" }}
            >
              {[
                { num: "240+", label: "Articles published" },
                { num: "18K", label: "Monthly readers" },
                { num: "34", label: "Topics covered" },
              ].map((s) => (
                <div key={s.label}>
                  <div
                    className="text-[26px] font-extrabold tracking-[-0.5px]"
                    style={{ color: "var(--primary-color)" }}
                  >
                    {s.num}
                  </div>
                  <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — stacked card preview */}
          {featuredPost && (
            <div className="hidden lg:block relative h-[340px]">
              {/* back cards */}
              {[
                "absolute w-[88%] right-0 top-5 bottom-0 opacity-50 rotate-[2deg]",
                "absolute w-[93%] right-[6px] top-[10px] bottom-[6px] opacity-75 rotate-[1deg]",
              ].map((cls, i) => (
                <div
                  key={i}
                  className={`${cls} rounded-[18px]`}
                  style={{
                    background: "var(--card-bg)",
                    border: "1px solid var(--border-color)",
                  }}
                />
              ))}
              {/* front card */}
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="absolute inset-x-0 top-0 bottom-5 rounded-[18px] overflow-hidden p-5 flex flex-col"
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--border-color)",
                }}
              >
                <div className="relative h-[150px] rounded-xl overflow-hidden mb-4 flex-shrink-0">
                  {featuredPost.coverImage ? (
                    <Image
                      src={featuredPost.coverImage}
                      alt={featuredPost.coverImageAlt || featuredPost.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <PlaceholderImage />
                  )}
                </div>
                <div
                  className="text-[11px] font-bold uppercase tracking-[1px] mb-1.5"
                  style={{ color: "var(--primary-color)" }}
                >
                  {featuredPost.category?.name}
                </div>
                <h3
                  className="text-[15px] font-bold leading-[1.3] mb-2 line-clamp-2"
                  style={{ color: "var(--text-color)" }}
                >
                  {featuredPost.title}
                </h3>
                <div
                  className="flex items-center gap-2 text-xs mt-auto"
                  style={{ color: "var(--text-muted)" }}
                >
                  <span>{featuredPost.author?.name}</span>
                  <span
                    className="w-[3px] h-[3px] rounded-full"
                    style={{ background: "var(--text-muted)" }}
                  />
                  <span>
                    {featuredPost.readingStats?.readingTimeMinutes ?? 5} min
                    read
                  </span>
                  {featuredPost.isFeatured && (
                    <>
                      <span
                        className="w-[3px] h-[3px] rounded-full"
                        style={{ background: "var(--text-muted)" }}
                      />
                      <span
                        className="text-[11px] font-semibold px-[10px] py-[3px] rounded-full"
                        style={{
                          background: "var(--primary-color)",
                          color: "#022c29",
                        }}
                      >
                        Featured
                      </span>
                    </>
                  )}
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Featured Stories ─────────────────────────────────────────────────────────

function FeaturedSection({ posts }: { posts: BlogPost[] }) {
  const main = posts[0];
  const side = posts.slice(1, 4);

  if (!main) return null;

  return (
    <section className="py-14">
      <div className="max-w-[1100px] mx-auto px-7">
        <SectionHeader
          title="Featured"
          accent="Stories"
          sub="Hand-picked articles from our editors"
          href="/blog?featured=true"
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-5">
          {/* Main card */}
          <Link
            href={`/blog/${main.slug}`}
            className="group rounded-[18px] overflow-hidden transition-all duration-300 hover:-translate-y-[3px]"
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--border-color)",
            }}
          >
            <div className="relative h-[260px] overflow-hidden">
              {main.coverImage ? (
                <Image
                  src={main.coverImage}
                  alt={main.coverImageAlt || main.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <PlaceholderImage />
              )}
              <div className="absolute top-3.5 left-3.5 flex gap-1.5">
                {main.isFeatured && (
                  <span
                    className="text-[11px] font-semibold px-[10px] py-[3px] rounded-full"
                    style={{
                      background: "var(--primary-color)",
                      color: "#022c29",
                    }}
                  >
                    Featured
                  </span>
                )}
                {main.type && (
                  <span
                    className="text-[11px] font-semibold px-[10px] py-[3px] rounded-full"
                    style={{
                      background: "rgba(79,209,165,0.12)",
                      color: "var(--primary-color)",
                      border: "1px solid var(--border-color)",
                    }}
                  >
                    {main.type}
                  </span>
                )}
              </div>
            </div>
            <div className="p-[22px]">
              <CardMeta post={main} />
              <h3
                className="text-[17px] font-bold leading-[1.3] mb-2"
                style={{ color: "var(--text-color)" }}
              >
                {main.title}
              </h3>
              <p
                className="text-[13px] leading-[1.6] line-clamp-3"
                style={{ color: "var(--text-muted)" }}
              >
                {main.excerpt}
              </p>
              {main.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {main.tags.slice(0, 3).map((t) => (
                    <TagChip key={t._id} name={t.name} />
                  ))}
                </div>
              )}
              <CardFooter post={main} />
            </div>
          </Link>

          {/* Side cards */}
          <div className="flex flex-col gap-4">
            {side.map((post) => (
              <Link
                key={post._id}
                href={`/blog/${post.slug}`}
                className="group flex rounded-[14px] overflow-hidden transition-all duration-300 hover:-translate-y-[2px]"
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--border-color)",
                }}
              >
                <div className="w-[100px] flex-shrink-0 relative flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg,#044a3a,#022c29)" }}
                >
                  {post.coverImage ? (
                    <Image
                      src={post.coverImage}
                      alt={post.coverImageAlt || post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <svg
                      width="26"
                      height="26"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#4FD1A5"
                      strokeWidth="1.4"
                      opacity={0.4}
                    >
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    </svg>
                  )}
                </div>
                <div className="p-4 flex flex-col justify-between flex-1 min-w-0">
                  <div>
                    <CardMeta post={post} compact />
                    <p
                      className="text-[14px] font-bold leading-[1.35] line-clamp-2"
                      style={{ color: "var(--text-color)" }}
                    >
                      {post.title}
                    </p>
                    <p
                      className="text-[12px] leading-[1.55] line-clamp-2 mt-1"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {post.excerpt}
                    </p>
                  </div>
                  {post.difficulty && (
                    <div className="mt-2.5">
                      <DifficultyBadge level={post.difficulty} />
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Latest Articles ──────────────────────────────────────────────────────────

function LatestArticles({ posts }: { posts: BlogPost[] }) {
  return (
    <section className="py-14">
      <div className="max-w-[1100px] mx-auto px-7">
        <SectionHeader
          title="Latest"
          accent="Articles"
          sub="Fresh content, published regularly"
          href="/blog"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post) => (
            <ArticleCard key={post._id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ArticleCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group rounded-[16px] overflow-hidden transition-all duration-300 hover:-translate-y-[3px] flex flex-col"
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border-color)",
      }}
    >
      <div className="relative h-[164px] flex-shrink-0 flex items-center justify-center"
        style={{ background: "linear-gradient(135deg,#044a3a,#022c29)" }}
      >
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.coverImageAlt || post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <svg
            width="34"
            height="34"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#4FD1A5"
            strokeWidth="1.4"
            opacity={0.38}
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        )}
        {post.difficulty && (
          <div className="absolute top-2.5 right-2.5">
            <DifficultyBadge level={post.difficulty} />
          </div>
        )}
      </div>

      <div className="p-[18px] flex flex-col flex-1">
        <CardMeta post={post} />
        <h3
          className="text-[15px] font-bold leading-[1.3] mb-2 line-clamp-2"
          style={{ color: "var(--text-color)" }}
        >
          {post.title}
        </h3>
        <p
          className="text-[13px] leading-[1.6] line-clamp-2"
          style={{ color: "var(--text-muted)" }}
        >
          {post.excerpt}
        </p>
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {post.tags.slice(0, 2).map((t) => (
              <TagChip key={t._id} name={t.name} />
            ))}
          </div>
        )}
        <CardFooter post={post} />
      </div>
    </Link>
  );
}

// ─── Categories ───────────────────────────────────────────────────────────────

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  default: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4FD1A5" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
    </svg>
  ),
};

function CategoriesSection({ categories }: { categories: CategoryType[] }) {
  return (
    <section className="py-14">
      <div className="max-w-[1100px] mx-auto px-7">
        <SectionHeader
          title="Browse"
          accent="Categories"
          sub="Find articles that match your interests"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.slice(0, 6).map((cat) => (
            <Link
              key={cat._id}
              href={`/category/${cat.slug}`}
              className="flex gap-4 p-[22px] rounded-[14px] transition-all duration-300 hover:-translate-y-[2px]"
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--border-color)",
              }}
            >
              <div
                className="w-[46px] h-[46px] rounded-[12px] flex items-center justify-center flex-shrink-0"
                style={{
                  background: "rgba(79,209,165,0.1)",
                  border: "1px solid var(--border-color)",
                }}
              >
                {cat.icon ?? CATEGORY_ICONS.default}
                {/* {CATEGORY_ICONS[cat.slug] ?? CATEGORY_ICONS.default} */}
              </div>
              <div>
                <div
                  className="text-[15px] font-bold mb-1"
                  style={{ color: "var(--text-color)" }}
                >
                  {cat.name}
                </div>
                {cat.description && (
                  <div
                    className="text-[12px] leading-[1.55] line-clamp-2"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {cat.description}
                  </div>
                )}
                <div
                  className="text-[12px] font-semibold mt-1.5"
                  style={{ color: "var(--primary-color)" }}
                >
                  {cat.postCount ?? 0} articles
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Tags Cloud ───────────────────────────────────────────────────────────────

function TagsCloud({ tags }: { tags: TagType[] }) {
  return (
    <section className="py-14">
      <div className="max-w-[1100px] mx-auto px-7">
        <SectionHeader title="Popular" accent="Tags" sub="Discover content by topic" />
        <div className="flex flex-wrap gap-2.5">
          {tags.slice(0, 12).map((tag) => (
            <Link
              key={tag._id}
              href={`/tag/${tag.slug}`}
              className="text-[13px] font-medium px-4 py-[7px] rounded-full transition-all duration-200"
              style={{
                background: "rgba(79,209,165,0.07)",
                color: "var(--text-muted)",
                border: "1px solid var(--border-color)",
              }}
            >
              #{tag.name}
              <span className="text-[11px] opacity-60 ml-[3px]">
                ({tag.postCount ?? 0})
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Newsletter ───────────────────────────────────────────────────────────────

function NewsletterSection() {
  return (
    <section className="py-14">
      <div className="max-w-[1100px] mx-auto px-7">
        <div
          className="rounded-[20px] p-[52px_48px] grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 items-center"
          style={{
            background: "var(--bg-soft)",
            border: "1px solid rgba(79,209,165,0.28)",
          }}
        >
          <div>
            <div
              className="text-[11px] font-bold tracking-[1.5px] uppercase mb-2.5"
              style={{ color: "var(--primary-color)" }}
            >
              Newsletter
            </div>
            <h2
              className="text-[28px] font-extrabold tracking-[-0.5px] mb-2"
              style={{ color: "var(--text-color)" }}
            >
              Stay ahead of the curve
            </h2>
            <p className="text-sm leading-[1.65]" style={{ color: "var(--text-muted)" }}>
              Get curated articles, tutorials, and insights delivered every week.
              No noise, just signal.
            </p>
            <form className="flex gap-2.5 mt-6 max-w-[440px]">
              <input
                type="email"
                placeholder="you@example.com"
                required
                className="flex-1 px-4 py-3 rounded-[10px] text-sm outline-none transition-colors"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(79,209,165,0.28)",
                  color: "var(--text-color)",
                }}
              />
              <button
                type="submit"
                className="font-bold text-sm px-5 py-3 rounded-[10px] whitespace-nowrap transition-colors"
                style={{
                  background: "var(--primary-color)",
                  color: "#022c29",
                }}
              >
                Subscribe
              </button>
            </form>
            <p className="text-[12px] mt-2.5" style={{ color: "var(--text-muted)", opacity: 0.65 }}>
              No spam. Unsubscribe anytime.
            </p>
          </div>

          <div
            className="rounded-[16px] px-9 py-7 text-center"
            style={{
              background: "rgba(79,209,165,0.08)",
              border: "1px solid var(--border-color)",
            }}
          >
            <div
              className="text-[38px] font-extrabold tracking-[-1px]"
              style={{ color: "var(--primary-color)" }}
            >
              4,200+
            </div>
            <div className="text-[13px] mt-1" style={{ color: "var(--text-muted)" }}>
              Active subscribers
            </div>
            <div
              className="w-10 h-px mx-auto my-4"
              style={{ background: "var(--border-color)" }}
            />
            <div
              className="text-[26px] font-extrabold tracking-[-0.5px]"
              style={{ color: "var(--primary-color)" }}
            >
              Weekly
            </div>
            <div className="text-[13px] mt-1" style={{ color: "var(--text-muted)" }}>
              Delivery cadence
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function SectionHeader({
  title,
  accent,
  sub,
  href,
}: {
  title: string;
  accent: string;
  sub?: string;
  href?: string;
}) {
  return (
    <div className="flex items-end justify-between mb-8">
      <div>
        <h2
          className="text-[26px] font-extrabold tracking-[-0.5px]"
          style={{ color: "var(--text-color)" }}
        >
          {title}{" "}
          <span style={{ color: "var(--primary-color)" }}>{accent}</span>
        </h2>
        {sub && (
          <p className="text-[13px] mt-1" style={{ color: "var(--text-muted)" }}>
            {sub}
          </p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="text-[13px] flex items-center gap-1 transition-all hover:gap-[7px]"
          style={{ color: "var(--primary-color)" }}
        >
          View all
          <svg
            width="13"
            height="13"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}
    </div>
  );
}

function CardMeta({
  post,
  compact = false,
}: {
  post: BlogPost;
  compact?: boolean;
}) {
  return (
    <div
      className={`flex items-center flex-wrap gap-[5px] ${compact ? "text-[11px]" : "text-[12px]"} mb-[7px]`}
      style={{ color: "var(--text-muted)" }}
    >
      <span className="font-medium" style={{ color: "var(--primary-color)" }}>
        {post.category?.name}
      </span>
      <span className="text-[9px] opacity-50">•</span>
      <span>
        {format(new Date(post.publishedAt || post.createdAt), "MMM d, yyyy")}
      </span>
      <span className="text-[9px] opacity-50">•</span>
      <span>{post.readingStats?.readingTimeMinutes ?? 5} min read</span>
    </div>
  );
}

function CardFooter({ post }: { post: BlogPost }) {
  return (
    <div
      className="flex items-center justify-between mt-4 pt-3.5"
      style={{ borderTop: "1px solid var(--border-color)" }}
    >
      <div className="flex items-center gap-2">
        <Avatar name={post.author?.name} image={post.author?.image} />
        <div>
          <div className="text-[12px] font-medium" style={{ color: "var(--text-color)" }}>
            {post.author?.name}
          </div>
          <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
            Author
          </div>
        </div>
      </div>
      <span
        className="text-[12px] flex items-center gap-[3px]"
        style={{ color: "var(--primary-color)" }}
      >
        Read more
        <svg
          width="12"
          height="12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </span>
    </div>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────

function Divider() {
  return (
    <hr
      className="border-none"
      style={{ borderTop: "1px solid var(--border-color)" }}
    />
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default async function HomePage() {
  await dbConnect();

  const [featuredPosts, recentPosts, categories, tags] = await Promise.all([
    Blog.find({ status: "published", isFeatured: true })
      .populate("category", "name slug")
      .populate("tags", "name slug color")
      .populate("author", "name email image")
      .sort({ isPinned: -1, publishedAt: -1 })
      .limit(4)
      .lean(),
    Blog.find({ status: "published" })
      .populate("category", "name slug")
      .populate("tags", "name slug color")
      .populate("author", "name email image")
      .sort({ publishedAt: -1 })
      .limit(6)
      .lean(),
    Category.find({}).sort({ postCount: -1 }).limit(6).lean(),
    Tag.find({}).sort({ postCount: -1 }).limit(12).lean(),
  ]);

  const parsedFeatured = JSON.parse(JSON.stringify(featuredPosts)) as BlogPost[];
  const parsedRecent = JSON.parse(JSON.stringify(recentPosts)) as BlogPost[];
  const parsedCategories = JSON.parse(JSON.stringify(categories)) as CategoryType[];
  const parsedTags = JSON.parse(JSON.stringify(tags)) as TagType[];

  return (
    <main className="min-h-screen" style={{ background: "var(--bg-color)" }}>
      <HeroSection featuredPost={parsedFeatured[0] ?? null} />

      <Divider />

      {parsedFeatured.length > 0 && (
        <>
          <FeaturedSection posts={parsedFeatured} />
          <Divider />
        </>
      )}

      {parsedRecent.length > 0 && (
        <>
          <LatestArticles posts={parsedRecent} />
          <Divider />
        </>
      )}

      {parsedCategories.length > 0 && (
        <>
          <CategoriesSection categories={parsedCategories} />
          <Divider />
        </>
      )}

      {parsedTags.length > 0 && (
        <>
          <TagsCloud tags={parsedTags} />
          <Divider />
        </>
      )}

      <NewsletterSection />
    </main>
  );
}

export async function generateStaticParams() {
  await dbConnect();
  const posts = await Blog.find({ status: "published" }).select("slug").lean();
  return posts.map((post) => ({ slug: post.slug }));
}