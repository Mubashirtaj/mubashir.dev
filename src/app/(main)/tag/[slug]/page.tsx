// app/blog/tag/[slug]/page.tsx
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
  const tag = await Tag.findOne({ slug }).lean();
  
  if (!tag) return { title: "Tag not found" };
  return {
    title: `${tag.name} — Articles tagged with ${tag.name}`,
    description:`Browse all articles tagged with ${tag.name}.`,
    openGraph: {
      title: `${tag.name} — Articles`,
      description:  `Browse all articles tagged with ${tag.name}.`,
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function TagPage({ params }: { params: Promise<{ slug: string }> }) {
  await dbConnect();
  const { slug } = await params;

  const [tag, allTags, popularCategories] = await Promise.all([
    Tag.findOne({ slug: slug }).lean(),
    Tag.find({}).sort({ postCount: -1 }).limit(20).lean(),
    Category.find({}).sort({ postCount: -1 }).limit(8).lean(),
  ]);

  if (!tag) notFound();

  const posts = await Blog.find({
    status: "published",
    tags: tag._id,
  })
    .populate("category", "name slug")
    .populate("tags", "name slug color")
    .populate("author", "name email image")
    .sort({ isPinned: -1, publishedAt: -1 })
    .lean();

  const parsedPosts = JSON.parse(JSON.stringify(posts)) as BlogPost[];
  const parsedTag = JSON.parse(JSON.stringify(tag)) as TagType;
  const parsedAllTags = JSON.parse(JSON.stringify(allTags)) as TagType[];
  const parsedCategories = JSON.parse(JSON.stringify(popularCategories)) as CategoryType[];

  const featured = parsedPosts.filter((p) => p.isFeatured).slice(0, 3);
  const rest = parsedPosts.filter((p) => !p.isFeatured);

  return (
    <main className="min-h-screen" style={{ background: "var(--bg-color)" }}>
      {/* ── Hero Banner ── */}
      <TagHero tag={parsedTag} postCount={parsedPosts.length} />

      <Divider />

      <div className="max-w-275 mx-auto px-7 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
          {/* ── Main Content ── */}
          <div>
            {/* Featured with this tag */}
            {featured.length > 0 && (
              <div className="mb-14">
                <SideLabel label="Featured with this tag" />
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
                      ? `All articles tagged "${parsedTag.name}"`
                      : `Articles tagged "${parsedTag.name}"`
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
                label={`No articles have been tagged with "${parsedTag.name}" yet.`}
              />
            ) : null}
          </div>

          {/* ── Sidebar ── */}
          <aside className="space-y-8">
            {/* Related categories */}
            <SidebarCard title="Browse by Category">
              <div className="space-y-1">
                {parsedCategories.map((cat) => (
                  <Link
                    key={cat._id}
                    href={`/category/${cat.slug}`}
                    className="flex items-center justify-between px-3 py-2 rounded-[9px] transition-colors group hover:bg-[rgba(79,209,165,0.08)]"
                  >
                    <span
                      className="text-[13px] font-medium group-hover:text-(--primary-color) transition-colors"
                      style={{ color: "var(--text-color)" }}
                    >
                      {cat.name}
                    </span>
                    <span
                      className="text-[11px] px-1.75 py-0.5 rounded-full"
                      style={{
                        background: "rgba(79,209,165,0.08)",
                        color: "var(--text-muted)",
                        border: "1px solid var(--border-color)",
                      }}
                    >
                      {cat.postCount ?? 0}
                    </span>
                  </Link>
                ))}
              </div>
            </SidebarCard>

            {/* All tags */}
            <SidebarCard title="All Tags">
              <div className="flex flex-wrap gap-2">
                {parsedAllTags.map((t) => (
                  <TagChip 
                    key={t._id} 
                    name={t.name} 
                    slug={t.slug}
                  />
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
                Tag stats
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

// ─── Tag Hero ─────────────────────────────────────────────────────────────────

function TagHero({
  tag,
  postCount,
}: {
  tag: TagType;
  postCount: number;
}) {
  return (
    <div className="relative overflow-hidden">
    

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
          <span style={{ color: "var(--primary-color)" }}>{tag.name}</span>
        </div>

        <div className="flex items-end justify-between gap-8 flex-wrap">
          <div>
            {/* Icon */}
            <div
              className="w-14 h-14 rounded-[14px] flex items-center justify-center mb-5"
              style={{
                background: tag.color ? `${tag.color}15` : "rgba(79,209,165,0.12)",
                border: `1px solid ${tag.color ? `${tag.color}40` : "rgba(79,209,165,0.28)"}`,
              }}
            >
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke={tag.color || "#4FD1A5"} 
                strokeWidth="1.8"
              >
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                <line x1="7" y1="7" x2="7.01" y2="7" />
              </svg>
            </div>

            <div
              className="text-[11px] font-bold tracking-[1.5px] uppercase mb-2"
              style={{ color: tag.color || "var(--primary-color)" }}
            >
              Tag
            </div>
            <h1
              className="text-[40px] font-extrabold tracking-[-1.5px] leading-[1.1] mb-3"
              style={{ color: "var(--text-color)" }}
            >
              #{tag.name}
            </h1>
            
          </div>

          <div
            className="rounded-[14px] px-8 py-5 text-center shrink-0"
            style={{
              background: tag.color ? `${tag.color}10` : "rgba(79,209,165,0.08)",
              border: "1px solid var(--border-color)",
            }}
          >
            <div
              className="text-[36px] font-extrabold tracking-[-1px]"
              style={{ color: tag.color || "var(--primary-color)" }}
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

// ─── Static Params ────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  await dbConnect();
  const tags = await Tag.find({}).select("slug").lean();
  return tags.map((t) => ({ slug: t.slug }));
}