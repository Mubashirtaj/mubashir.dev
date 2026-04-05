// components/BlogSection.jsx
import Image from 'next/image';
import Link from 'next/link';

const BlogSection = () => {
    const posts = [
        {
            id: 'article-1',
            title: 'UX review presentations',
            summary: 'How do you create compelling presentations that wow your colleagues and impress your managers?',
            href: '#',
            thumbnailUrl: 'https://www.untitledui.com/marketing/spirals.webp',
            publishedAt: '20 Jan 2027',
            author: { name: 'Olivia Rhye', href: '#' },
            tags: [
                { name: 'Design', href: '#' },
                { name: 'Research', href: '#' },
                { name: 'Presentation', href: '#' },
            ],
        },
        {
            id: 'article-2',
            title: 'Migrating to Linear 101',
            summary: "Linear helps streamline software projects, sprints, tasks, and bug tracking. Here's how to get started.",
            href: '#',
            thumbnailUrl: 'https://www.untitledui.com/marketing/conversation.webp',
            publishedAt: '19 Jan 2027',
            author: { name: 'Phoenix Baker', href: '#' },
            tags: [
                { name: 'Product', href: '#' },
                { name: 'Tools', href: '#' },
                { name: 'SaaS', href: '#' },
            ],
        },
        {
            id: 'article-3',
            title: 'Building your API stack',
            summary: 'The rise of RESTful APIs has been met by a rise in tools for creating, testing, and managing them.',
            href: '#',
            thumbnailUrl: 'https://www.untitledui.com/blog/two-mobile-shapes-pattern.webp',
            publishedAt: '18 Jan 2027',
            author: { name: 'Lana Steiner', href: '#' },
            tags: [
                { name: 'Engineering', href: '#' },
                { name: 'Tools', href: '#' },
            ],
        },
    ];

    return (
        <section className="py-16 bg-[var(--bg-color)]">
            <div className="mx-auto max-w-5xl px-4 md:px-8">

                {/* Header — tighter sizing */}
                <div className="mx-auto max-w-xl text-center">
                    <p className="text-xs font-semibold uppercase tracking-widest text-[var(--primary-color)]">
                        Latest posts
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-[var(--text-color)] md:text-3xl">
                        Untitled blog
                    </h2>
                    <p className="mt-2 text-sm text-[var(--text-color)]/60">
                        Interviews, tips, guides, industry best practices, and news.
                    </p>
                </div>

                {/* Posts Grid — compact cards */}
                <ul className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2 md:mt-12 lg:grid-cols-3">
                    {posts.map((post) => (
                        <li key={post.id}>
                            <article className="flex flex-col gap-3">

                                {/* Thumbnail — shorter aspect ratio */}
                                <Link
                                    href={post.href}
                                    className="relative overflow-hidden rounded-xl ring-1 ring-inset ring-black/10 block"
                                >
                                    <Image
                                        src={post.thumbnailUrl}
                                        alt={post.title}
                                        width={480}
                                        height={280}
                                        className="aspect-video w-full object-cover transition duration-150 hover:scale-105"
                                    />
                                </Link>

                                {/* Body */}
                                <div className="flex flex-col gap-3">
                                    <p className="text-xs font-semibold text-[var(--primary-color)]">
                                        {post.author.name} · <time>{post.publishedAt}</time>
                                    </p>

                                    <div className="flex flex-col gap-1">
                                        <Link
                                            href={post.href}
                                            className="flex items-start justify-between gap-3 text-sm font-semibold text-[var(--text-color)] hover:text-[var(--primary-color)] transition-colors duration-100"
                                        >
                                            <span>{post.title}</span>
                                            <svg
                                                viewBox="0 0 24 24"
                                                width="16"
                                                height="16"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                fill="none"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                aria-hidden="true"
                                                className="mt-0.5 shrink-0 opacity-40"
                                            >
                                                <path d="M7 17 17 7m0 0H7m10 0v10" />
                                            </svg>
                                        </Link>
                                        <p className="line-clamp-2 text-xs text-[var(--text-color)]/60 leading-relaxed">
                                            {post.summary}
                                        </p>
                                    </div>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-1.5">
                                        {post.tags.map((tag, i) => (
                                            <Link key={i} href={tag.href}>
                                                <span className="inline-flex items-center rounded-full border border-[var(--primary-color)]/30 px-2 py-0.5 text-xs font-medium text-[var(--primary-color)] hover:bg-[var(--primary-color)] hover:text-white hover:border-transparent transition-all duration-100">
                                                    {tag.name}
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </article>
                        </li>
                    ))}
                </ul>

                {/* View All */}
                <div className="mt-10 flex justify-center md:mt-12">
                    <Link
                        href="#"
                        className="inline-flex items-center gap-2 rounded-lg border border-[var(--primary-color)] px-5 py-2.5 text-sm font-semibold text-[var(--primary-color)] hover:bg-[var(--primary-color)] hover:text-white transition-all duration-150"
                    >
                        View all posts
                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>

            </div>
        </section>
    );
};

export default BlogSection;