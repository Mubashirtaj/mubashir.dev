// lib/blog-shared.tsx  ← put this file at your preferred shared location
// Contains types + reusable UI components used across category, tag, and listing pages.

import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  coverImageAlt: string;
  type: string;
  difficulty: "beginner" | "intermediate" | "advanced" | string;
  readingStats: { readingTimeMinutes: number };
  createdAt: string;
  publishedAt: string;
  category: { _id: string; name: string; slug: string };
  tags: Array<{ _id: string; name: string; slug: string; color: string }>;
  author: { name: string; email: string; image: string };
  isFeatured: boolean;
  isPinned: boolean;
}

export interface CategoryType {
  _id: string;
  name: string;
  slug: string;
  description: string;
  coverImage: string;
  postCount: number;
}

export interface TagType {
  _id: string;
  name: string;
  slug: string;
  color: string;
  postCount: number;
}

// ─── Difficulty Badge ─────────────────────────────────────────────────────────

export function DifficultyBadge({ level }: { level: string }) {
  const map: Record<string, string> = {
    beginner:
      "bg-[rgba(34,197,94,0.12)] text-[#4ade80] border border-[rgba(34,197,94,0.2)]",
    intermediate:
      "bg-[rgba(234,179,8,0.12)] text-[#fbbf24] border border-[rgba(234,179,8,0.2)]",
    advanced:
      "bg-[rgba(79,209,165,0.12)] text-[var(--primary-color)] border border-[var(--border-color)]",
  };
  return (
    <span className={`text-[10px] font-bold px-[9px] py-[3px] rounded-full ${map[level] ?? map.advanced}`}>
      {level}
    </span>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

export function Avatar({ name, image }: { name?: string; image?: string }) {
  if (image) {
    return (
      <Image
        src={image}
        alt={name ?? "Author"}
        width={28}
        height={28}
        className="rounded-full object-cover flex-shrink-0"
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

// ─── Tag Chip ─────────────────────────────────────────────────────────────────

export function TagChip({ name, slug }: { name: string; slug?: string }) {
  const inner = (
    <span
      className="text-[11px] px-[9px] py-[3px] rounded-full transition-colors"
      style={{
        background: "rgba(79,209,165,0.08)",
        color: "var(--primary-color)",
        border: "1px solid var(--border-color)",
      }}
    >
      {name}
    </span>
  );
  return slug ? <Link href={`/blog/tag/${slug}`}>{inner}</Link> : inner;
}

// ─── Card Meta ────────────────────────────────────────────────────────────────

export function CardMeta({ post, compact = false }: { post: BlogPost; compact?: boolean }) {
  const date = post.publishedAt || post.createdAt;
  return (
    <div
      className={`flex items-center flex-wrap gap-[5px] mb-[7px] ${compact ? "text-[11px]" : "text-[12px]"}`}
      style={{ color: "var(--text-muted)" }}
    >
      {post.category?.slug ? (
        <Link
          href={`/blog/category/${post.category.slug}`}
          className="font-medium hover:underline"
          style={{ color: "var(--primary-color)" }}
        >
          {post.category.name}
        </Link>
      ) : (
        <span className="font-medium" style={{ color: "var(--primary-color)" }}>
          {post.category?.name}
        </span>
      )}
      <span className="text-[9px] opacity-50">•</span>
      <span>{format(new Date(date), "MMM d, yyyy")}</span>
      <span className="text-[9px] opacity-50">•</span>
      <span>{post.readingStats?.readingTimeMinutes ?? 5} min read</span>
    </div>
  );
}

// ─── Card Footer ──────────────────────────────────────────────────────────────

export function CardFooter({ post }: { post: BlogPost }) {
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
        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </span>
    </div>
  );
}

// ─── Article Card ─────────────────────────────────────────────────────────────

export function ArticleCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group rounded-[16px] overflow-hidden transition-all duration-300 hover:-translate-y-[3px] flex flex-col"
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border-color)",
      }}
    >
      <div
        className="relative h-[172px] flex-shrink-0 flex items-center justify-center"
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
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#4FD1A5" strokeWidth="1.4" opacity={0.38}>
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        )}
        {post.difficulty && (
          <div className="absolute top-2.5 right-2.5">
            <DifficultyBadge level={post.difficulty} />
          </div>
        )}
        {post.isFeatured && (
          <div className="absolute top-2.5 left-2.5">
            <span
              className="text-[10px] font-bold px-[9px] py-[3px] rounded-full"
              style={{ background: "var(--primary-color)", color: "#022c29" }}
            >
              Featured
            </span>
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
          className="text-[13px] leading-[1.6] line-clamp-2 flex-1"
          style={{ color: "var(--text-muted)" }}
        >
          {post.excerpt}
        </p>
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {post.tags.slice(0, 2).map((t) => (
              <TagChip key={t._id} name={t.name} slug={t.slug} />
            ))}
            {post.tags.length > 2 && (
              <span
                className="text-[11px] px-[9px] py-[3px] rounded-full"
                style={{
                  background: "rgba(79,209,165,0.05)",
                  color: "var(--text-muted)",
                  border: "1px solid var(--border-color)",
                }}
              >
                +{post.tags.length - 2}
              </span>
            )}
          </div>
        )}
        <CardFooter post={post} />
      </div>
    </Link>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────

export function SectionHeader({
  title,
  accent,
  sub,
  href,
}: {
  title: string;
  accent?: string;
  sub?: string;
  href?: string;
}) {
  return (
    <div className="flex items-end justify-between mb-8">
      <div>
        <h2
          className="text-[22px] font-extrabold tracking-[-0.5px]"
          style={{ color: "var(--text-color)" }}
        >
          {title}{" "}
          {accent && <span style={{ color: "var(--primary-color)" }}>{accent}</span>}
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
          className="text-[13px] flex items-center gap-1 hover:gap-[7px] transition-all"
          style={{ color: "var(--primary-color)" }}
        >
          View all
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}
    </div>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────

export function Divider() {
  return (
    <hr className="border-none" style={{ borderTop: "1px solid var(--border-color)" }} />
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

export function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div
        className="w-16 h-16 rounded-[16px] flex items-center justify-center"
        style={{ background: "rgba(79,209,165,0.08)", border: "1px solid var(--border-color)" }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4FD1A5" strokeWidth="1.5" opacity={0.5}>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      </div>
      <p className="text-[15px] font-semibold" style={{ color: "var(--text-color)" }}>
        No articles yet
      </p>
      <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>
        {label}
      </p>
      <Link
        href="/blog"
        className="mt-2 text-[13px] font-semibold px-5 py-2.5 rounded-[9px] transition-colors"
        style={{ background: "var(--primary-color)", color: "#022c29" }}
      >
        Browse all articles
      </Link>
    </div>
  );
}