"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import BlogEditor from '@/app/(panel)/components/blog-editor';

// ============ Types ============
type PostStatus = "draft" | "published" | "archived" | "scheduled";
type PostType = "article" | "tutorial" | "snippet" | "project" | "note";
type Difficulty = "beginner" | "intermediate" | "advanced";

interface BlogFormData {
  title: string;
  slug: string;
  type: PostType;
  status: PostStatus;
  excerpt: string;
  body: string;
  coverImage: string;
  coverImageAlt: string;
  coverImageCaption: string;
  ogImage: string;
  category: string;
  tags: string[];
  series: string;
  seriesOrder: number;
  techStack: string[];
  difficulty: Difficulty;
  githubUrl: string;
  demoUrl: string;
  requiresSubscription: boolean;
  commentsEnabled: boolean;
  isFeatured: boolean;
  isPinned: boolean;
  isSponsored: boolean;
  scheduledAt: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
    focusKeyword: string;
    keywords: string[];
    canonicalUrl: string;
    ogTitle: string;
    ogDescription: string;
    noIndex: boolean;
    noFollow: boolean;
  };
}

// ============ Loading Component ============
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
}

// ============ Main Page Component ============
export default function AddEditBlogPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(isEditMode);
  const [activeTab, setActiveTab] = useState("editor");
  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    slug: "",
    type: "article",
    status: "draft",
    excerpt: "",
    body: "",
    coverImage: "",
    coverImageAlt: "",
    coverImageCaption: "",
    ogImage: "",
    category: "",
    tags: [],
    series: "",
    seriesOrder: 0,
    techStack: [],
    difficulty: "beginner",
    githubUrl: "",
    demoUrl: "",
    requiresSubscription: false,
    commentsEnabled: true,
    isFeatured: false,
    isPinned: false,
    isSponsored: false,
    scheduledAt: "",
    seo: {
      metaTitle: "",
      metaDescription: "",
      focusKeyword: "",
      keywords: [],
      canonicalUrl: "",
      ogTitle: "",
      ogDescription: "",
      noIndex: false,
      noFollow: false,
    },
  });

  // Fetch blog data if in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      fetchBlogData();
    }
  }, [id]);

  const fetchBlogData = async () => {
    try {
      setFetchingData(true);
      const response = await fetch(`/api/blogs/${id}`);
      const data = await response.json();
      
      if (data.success) {
        const blog = data.data;
        setFormData({
          title: blog.title || "",
          slug: blog.slug || "",
          type: blog.type || "article",
          status: blog.status || "draft",
          excerpt: blog.excerpt || "",
          body: blog.body || "",
          coverImage: blog.coverImage || "",
          coverImageAlt: blog.coverImageAlt || "",
          coverImageCaption: blog.coverImageCaption || "",
          ogImage: blog.ogImage || "",
          category: blog.category?._id || blog.category || "",
          tags: blog.tags?.map((t: any) => typeof t === "string" ? t : t._id) || [],
          series: blog.series || "",
          seriesOrder: blog.seriesOrder || 0,
          techStack: blog.techStack || [],
          difficulty: blog.difficulty || "beginner",
          githubUrl: blog.githubUrl || "",
          demoUrl: blog.demoUrl || "",
          requiresSubscription: blog.requiresSubscription || false,
          commentsEnabled: blog.commentsEnabled !== false,
          isFeatured: blog.isFeatured || false,
          isPinned: blog.isPinned || false,
          isSponsored: blog.isSponsored || false,
          scheduledAt: blog.scheduledAt ? new Date(blog.scheduledAt).toISOString().slice(0, 16) : "",
          seo: {
            metaTitle: blog.seo?.metaTitle || "",
            metaDescription: blog.seo?.metaDescription || "",
            focusKeyword: blog.seo?.focusKeyword || "",
            keywords: blog.seo?.keywords || [],
            canonicalUrl: blog.seo?.canonicalUrl || "",
            ogTitle: blog.seo?.ogTitle || "",
            ogDescription: blog.seo?.ogDescription || "",
            noIndex: blog.seo?.noIndex || false,
            noFollow: blog.seo?.noFollow || false,
          },
        });
      }
    } catch (error) {
      console.error("Error fetching blog:", error);
    } finally {
      setFetchingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEditMode ? `/api/blogs/${id}` : "/api/blogs";
      const method = isEditMode ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        router.push(`/panel/blogs/${data.data._id}`);
      }
    } catch (error) {
      console.error("Error saving blog:", error);
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit}>
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {isEditMode ? "Edit Blog Post" : "Create New Blog Post"}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  {isEditMode ? "Update your existing content" : "Write and publish new content"}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {loading ? "Saving..." : isEditMode ? "Update" : "Publish"}
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-6 mt-4 border-b">
              {["editor", "settings", "seo"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 px-1 capitalize transition ${
                    activeTab === tab
                      ? "text-blue-600 border-b-2 border-blue-600 font-medium"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab === "editor" ? "Content Editor" : tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Editor */}
            <div className="lg:col-span-2">
              {activeTab === "editor" && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  {/* Title Input */}
                  <div className="mb-6">
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => {
                        const title = e.target.value;
                        setFormData({
                          ...formData,
                          title,
                          slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                        });
                      }}
                      placeholder="Blog Title..."
                      className="w-full text-3xl font-bold border-0 focus:ring-0 p-0 placeholder-gray-300"
                    />
                  </div>

                  {/* Blog Editor */}
                  <BlogEditor
                    model={formData.body}
                    setModel={(value: string) => setFormData({ ...formData, body: value })}
                  />

                  {/* Excerpt */}
                  <div className="mt-6 pt-6 border-t">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Excerpt / Summary
                    </label>
                    <textarea
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Brief summary of your blog post..."
                    />
                    <p className="text-xs text-gray-500 mt-1">{formData.excerpt.length}/300</p>
                  </div>
                </div>
              )}

              {activeTab === "settings" && (
                <div className="space-y-6">
                  {/* Basic Settings */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold mb-4">Basic Settings</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Post Type</label>
                          <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value as PostType })}
                            className="w-full px-3 py-2 border rounded-md"
                          >
                            <option value="article">Article</option>
                            <option value="tutorial">Tutorial</option>
                            <option value="snippet">Snippet</option>
                            <option value="project">Project</option>
                            <option value="note">Note</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Status</label>
                          <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as PostStatus })}
                            className="w-full px-3 py-2 border rounded-md"
                          >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="scheduled">Scheduled</option>
                          </select>
                        </div>
                      </div>

                      {formData.status === "scheduled" && (
                        <div>
                          <label className="block text-sm font-medium mb-1">Schedule Date</label>
                          <input
                            type="datetime-local"
                            value={formData.scheduledAt}
                            onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                            className="w-full px-3 py-2 border rounded-md"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium mb-1">Slug</label>
                        <input
                          type="text"
                          value={formData.slug}
                          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                          className="w-full px-3 py-2 border rounded-md bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Media */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold mb-4">Media</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Cover Image URL</label>
                        <input
                          type="url"
                          value={formData.coverImage}
                          onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                          className="w-full px-3 py-2 border rounded-md"
                          placeholder="https://..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Cover Image Alt Text</label>
                        <input
                          type="text"
                          value={formData.coverImageAlt}
                          onChange={(e) => setFormData({ ...formData, coverImageAlt: e.target.value })}
                          className="w-full px-3 py-2 border rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">OG Image (Social Share)</label>
                        <input
                          type="url"
                          value={formData.ogImage}
                          onChange={(e) => setFormData({ ...formData, ogImage: e.target.value })}
                          className="w-full px-3 py-2 border rounded-md"
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Category & Tags */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold mb-4">Category & Tags</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Category ID</label>
                        <input
                          type="text"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full px-3 py-2 border rounded-md"
                          placeholder="Category ObjectId"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                        <input
                          type="text"
                          value={formData.tags.join(", ")}
                          onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(",").map(t => t.trim()) })}
                          className="w-full px-3 py-2 border rounded-md"
                          placeholder="react, nextjs, typescript"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tech & Links */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold mb-4">Technology & Links</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Tech Stack (comma separated)</label>
                        <input
                          type="text"
                          value={formData.techStack.join(", ")}
                          onChange={(e) => setFormData({ ...formData, techStack: e.target.value.split(",").map(t => t.trim()) })}
                          className="w-full px-3 py-2 border rounded-md"
                          placeholder="React, Node.js, MongoDB"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Difficulty</label>
                          <select
                            value={formData.difficulty}
                            onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as Difficulty })}
                            className="w-full px-3 py-2 border rounded-md"
                          >
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Series</label>
                          <input
                            type="text"
                            value={formData.series}
                            onChange={(e) => setFormData({ ...formData, series: e.target.value })}
                            className="w-full px-3 py-2 border rounded-md"
                            placeholder="Series name"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">GitHub URL</label>
                        <input
                          type="url"
                          value={formData.githubUrl}
                          onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                          className="w-full px-3 py-2 border rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Demo URL</label>
                        <input
                          type="url"
                          value={formData.demoUrl}
                          onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                          className="w-full px-3 py-2 border rounded-md"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold mb-4">Options</h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.isFeatured}
                          onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                          className="rounded"
                        />
                        <span>Feature this post</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.isPinned}
                          onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                          className="rounded"
                        />
                        <span>Pin this post</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.commentsEnabled}
                          onChange={(e) => setFormData({ ...formData, commentsEnabled: e.target.checked })}
                          className="rounded"
                        />
                        <span>Enable comments</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.requiresSubscription}
                          onChange={(e) => setFormData({ ...formData, requiresSubscription: e.target.checked })}
                          className="rounded"
                        />
                        <span>Requires subscription</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "seo" && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold mb-4">SEO Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Meta Title</label>
                      <input
                        type="text"
                        value={formData.seo.metaTitle}
                        onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, metaTitle: e.target.value } })}
                        className="w-full px-3 py-2 border rounded-md"
                        maxLength={70}
                      />
                      <p className="text-xs text-gray-500">{formData.seo.metaTitle.length}/70</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Meta Description</label>
                      <textarea
                        value={formData.seo.metaDescription}
                        onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, metaDescription: e.target.value } })}
                        rows={3}
                        className="w-full px-3 py-2 border rounded-md"
                        maxLength={160}
                      />
                      <p className="text-xs text-gray-500">{formData.seo.metaDescription.length}/160</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Focus Keyword</label>
                      <input
                        type="text"
                        value={formData.seo.focusKeyword}
                        onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, focusKeyword: e.target.value } })}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Canonical URL</label>
                      <input
                        type="url"
                        value={formData.seo.canonicalUrl}
                        onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, canonicalUrl: e.target.value } })}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.seo.noIndex}
                          onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, noIndex: e.target.checked } })}
                        />
                        <span>No Index</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.seo.noFollow}
                          onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, noFollow: e.target.checked } })}
                        />
                        <span>No Follow</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Preview & Info */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Preview Card */}
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <h3 className="font-semibold mb-3">Preview</h3>
                  {formData.coverImage && (
                    <img
                      src={formData.coverImage}
                      alt={formData.coverImageAlt}
                      className="w-full h-32 object-cover rounded-md mb-3"
                    />
                  )}
                  <h4 className="font-bold text-lg line-clamp-2">{formData.title || "Untitled"}</h4>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-3">{formData.excerpt || "No excerpt"}</p>
                  <div className="flex flex-wrap gap-1 mt-3">
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded">{formData.type}</span>
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded">{formData.status}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <h3 className="font-semibold mb-3">Quick Stats</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Word Count:</span>
                      <span className="font-medium">{formData.body.split(/\s+/).filter(Boolean).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reading Time:</span>
                      <span className="font-medium">{Math.ceil(formData.body.split(/\s+/).filter(Boolean).length / 200)} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tags:</span>
                      <span className="font-medium">{formData.tags.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}