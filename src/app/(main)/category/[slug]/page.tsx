// app/blog/category/[slug]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import dbConnect from "@/utils/db";
import { Blog } from "@/utils/models/Blog";
import { Category } from "@/utils/models/categories.model";
import { Tag } from "@/utils/models/tags.model";
import "@/utils/models/user.model";
import {
  ArticleCard,
  BlogPost,
  CategoryType,
  TagType,
  Divider,
  EmptyState,
  TagChip,
} from "@/lib/blog-shared";

// ─── SSG config ───────────────────────────────────────────────────────────────

export const revalidate = 3600; // ISR: revalidate every 1 hour



// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  await dbConnect();
  const { slug } = await params;
  const cat = await Category.findOne({ slug }).lean();
  
  if (!cat) return { title: "Category not found" };
  return {
    title: `${cat.seo.metaTitle} `,
    description:
      cat.seo.metaDescription ||
      `Browse all articles in the ${cat.name} category.`,
    openGraph: {
      title: `${cat.seo.metaTitle} — Articles`,
      description: cat.seo.metaDescription || `Browse all articles in ${cat.name}.`,
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  await dbConnect();
  const { slug } = await params;

  const [category, allCategories, popularTags] = await Promise.all([
    Category.findOne({ slug: slug }).lean(),
    Category.find({}).sort({ postCount: -1 }).limit(8).lean(),
    Tag.find({}).sort({ postCount: -1 }).limit(12).lean(),
  ]);

  if (!category) notFound();

  const posts = await Blog.find({
    status: "published",
    category: category._id,
  })
    .populate("category", "name slug")
    .populate("tags", "name slug color")
    .populate("author", "name email image")
    .sort({ isPinned: -1, publishedAt: -1 })
    .lean();

  const parsedPosts = JSON.parse(JSON.stringify(posts)) as BlogPost[];
  const parsedCat = JSON.parse(JSON.stringify(category)) as CategoryType;
  const parsedAllCats = JSON.parse(JSON.stringify(allCategories)) as CategoryType[];
  const parsedTags = JSON.parse(JSON.stringify(popularTags)) as TagType[];

  const featured = parsedPosts.filter((p) => p.isFeatured).slice(0, 3);
  const rest = parsedPosts.filter((p) => !p.isFeatured);

  return (
    <main className="min-h-screen" style={{ background: "var(--bg-color)" }}>
      {/* ── Hero Banner ── */}
      <CategoryHero category={parsedCat} postCount={parsedPosts.length} />

      <Divider />

      <div className="max-w-275 mx-auto px-7 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
          {/* ── Main Content ── */}
          <div>
            {/* Featured in this category */}
            {featured.length > 0 && (
              <div className="mb-14">
                <SideLabel label="Featured in this category" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
                  {featured.map((post) => (
                    <ArticleCard key={post._id} post={post} />
                  ))}
                </div>
                {rest.length > 0 && <Divider />}
              </div>
            )}

            {/* All posts */}
            {rest.length > 0 ? (
              <div>
                <SideLabel
                  label={
                    featured.length > 0
                      ? `All ${parsedCat.name} articles`
                      : `${parsedCat.name} articles`
                  }
                  count={rest.length}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
                  {rest.map((post) => (
                    <ArticleCard key={post._id} post={post} />
                  ))}
                </div>
              </div>
            ) : parsedPosts.length === 0 ? (
              <EmptyState
                label={`No articles have been published in ${parsedCat.name} yet.`}
              />
            ) : null}
          </div>

          {/* ── Sidebar ── */}
          <aside className="space-y-8">
            {/* Other categories */}
            <SidebarCard title="All Categories">
              <div className="space-y-1">
                {parsedAllCats.map((cat) => (
                  <Link
                    key={cat._id}
                    href={`/category/${cat.slug}`}
                    className="flex items-center justify-between px-3 py-2 rounded-[9px] transition-colors group"
                    style={
                      cat.slug === slug
                        ? {
                            background: "rgba(79,209,165,0.12)",
                            color: "var(--primary-color)",
                          }
                        : {}
                    }
                  >
                    <span
                      className="text-[13px] font-medium group-hover:text-(--primary-color) transition-colors"
                      style={{
                        color:
                          cat.slug === slug
                            ? "var(--primary-color)"
                            : "var(--text-color)",
                      }}
                    >
                      {cat.name}
                    </span>
                    <span
                      className="text-[11px] px-1.75 py-0.5 rounded-full"
                      style={{
                        background:
                          cat.slug === slug
                            ? "var(--primary-color)"
                            : "rgba(79,209,165,0.08)",
                        color:
                          cat.slug === slug
                            ? "#022c29"
                            : "var(--text-muted)",
                        border: "1px solid var(--border-color)",
                      }}
                    >
                      {cat.postCount ?? 0}
                    </span>
                  </Link>
                ))}
              </div>
            </SidebarCard>

            {/* Popular tags */}
            <SidebarCard title="Popular Tags">
              <div className="flex flex-wrap gap-2">
                {parsedTags.map((tag) => (
                  <TagChip key={tag._id} name={tag.name} slug={tag.slug} />
                ))}
              </div>
            </SidebarCard>

            {/* Stats card */}
            <div
              className="rounded-[14px] p-5"
              style={{
                background: "rgba(79,209,165,0.06)",
                border: "1px solid var(--border-color)",
              }}
            >
              <div
                className="text-[11px] font-bold tracking-[1.2px] uppercase mb-4"
                style={{ color: "var(--primary-color)" }}
              >
                Category stats
              </div>
              {[
                { label: "Total articles", value: parsedPosts.length },
                {
                  label: "Featured",
                  value: parsedPosts.filter((p) => p.isFeatured).length,
                },
                {
                  label: "Avg. read time",
                  value: `${
                    parsedPosts.length
                      ? Math.round(
                          parsedPosts.reduce(
                            (a, p) =>
                              a + (p.readingStats?.readingTimeMinutes ?? 5),
                            0
                          ) / parsedPosts.length
                        )
                      : 0
                  } min`,
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex items-center justify-between py-2"
                  style={{ borderBottom: "1px solid var(--border-color)" }}
                >
                  <span className="text-[13px]" style={{ color: "var(--text-muted)" }}>
                    {s.label}
                  </span>
                  <span
                    className="text-[13px] font-bold"
                    style={{ color: "var(--text-color)" }}
                  >
                    {s.value}
                  </span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

// ─── Category Hero ────────────────────────────────────────────────────────────

function CategoryHero({
  category,
  postCount,
}: {
  category: CategoryType;
  postCount: number;
}) {
  return (
    <div className="relative overflow-hidden">
      {category.coverImage && (
        <>
          <Image
            src={category.coverImage}
            alt={category.name}
            fill
            className="object-cover opacity-10"
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, transparent 40%, var(--bg-color))",
            }}
          />
        </>
      )}

      <div className="relative max-w-275 mx-auto px-7 py-16">
        {/* Breadcrumb */}
        <div
          className="flex items-center gap-2 text-[12px] mb-6"
          style={{ color: "var(--text-muted)" }}
        >
          <Link
            href="/"
            className="hover:text-(--primary-color) transition-colors"
          >
            Home
          </Link>
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <Link
            href="/blogs"
            className="hover:text-(--primary-color) transition-colors"
          >
            Blog
          </Link>
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span style={{ color: "var(--primary-color)" }}>{category.name}</span>
        </div>

        <div className="flex items-end justify-between gap-8 flex-wrap">
          <div>
            {/* Icon */}
            <div
              className="w-14 h-14 rounded-[14px] flex items-center justify-center mb-5"
              style={{
                background: "rgba(79,209,165,0.12)",
                border: "1px solid rgba(79,209,165,0.28)",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4FD1A5" strokeWidth="1.8">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
            </div>

            <div
              className="text-[11px] font-bold tracking-[1.5px] uppercase mb-2"
              style={{ color: "var(--primary-color)" }}
            >
              Category
            </div>
            <h1
              className="text-[40px] font-extrabold tracking-[-1.5px] leading-[1.1] mb-3"
              style={{ color: "var(--text-color)" }}
            >
              {category.name}
            </h1>
            {category.description && (
              <p
                className="text-[15px] leading-[1.7] max-w-130"
                style={{ color: "var(--text-muted)" }}
              >
                {category.description}
              </p>
            )}
          </div>

          <div
            className="rounded-[14px] px-8 py-5 text-center shrink-0"
            style={{
              background: "rgba(79,209,165,0.08)",
              border: "1px solid var(--border-color)",
            }}
          >
            <div
              className="text-[36px] font-extrabold tracking-[-1px]"
              style={{ color: "var(--primary-color)" }}
            >
              {postCount}
            </div>
            <div className="text-[12px] mt-1" style={{ color: "var(--text-muted)" }}>
              {postCount === 1 ? "Article" : "Articles"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar helpers ──────────────────────────────────────────────────────────

function SidebarCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-[14px] p-5"
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border-color)",
      }}
    >
      <div
        className="text-[11px] font-bold tracking-[1.2px] uppercase mb-4"
        style={{ color: "var(--primary-color)" }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

function SideLabel({ label, count }: { label: string; count?: number }) {
  return (
    <div className="flex items-center gap-3 mb-1">
      <h2 className="text-[18px] font-extrabold" style={{ color: "var(--text-color)" }}>
        {label}
      </h2>
      {count !== undefined && (
        <span
          className="text-[12px] font-semibold px-2.5 py-0.75 rounded-full"
          style={{
            background: "rgba(79,209,165,0.1)",
            color: "var(--primary-color)",
            border: "1px solid var(--border-color)",
          }}
        >
          {count}
        </span>
      )}
    </div>
  );
}
export async function generateStaticParams() {
  await dbConnect();
  const categories = await Category.find({}).select("slug").lean();
  return categories.map((c) => ({ slug: c.slug }));
}