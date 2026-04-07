"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import  {BubbleMenu} from '@tiptap/react/menus'
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import Youtube from '@tiptap/extension-youtube'
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import Underline from "@tiptap/extension-underline";
import {Table} from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import CharacterCount from "@tiptap/extension-character-count";
import { createLowlight } from "lowlight";
import { 
  Bold, Italic, Underline as UnderlineIcon, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Link as LinkIcon, Image as ImageIcon,
  Video as VideoIcon, Code, Quote, Undo, Redo,
  Heading1, Heading2, Heading3, Table as TableIcon,
  Highlighter, Type, Save, Eye, Trash2, Calendar,
  Tag, Settings, FileText, Globe, ChevronDown
} from "lucide-react";

// Language imports for code highlighting
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import python from "highlight.js/lib/languages/python";
import bash from "highlight.js/lib/languages/bash";
import css from "highlight.js/lib/languages/css";
import json from "highlight.js/lib/languages/json";
import rust from "highlight.js/lib/languages/rust";
import go from "highlight.js/lib/languages/go";
import yaml from "highlight.js/lib/languages/yaml";
import sql from "highlight.js/lib/languages/sql";
import xml from "highlight.js/lib/languages/xml";

const lowlight = createLowlight();
lowlight.register({ javascript, typescript, python, bash, css, json, rust, go, yaml, sql, xml });

// Types
type PostStatus = "draft" | "published" | "scheduled";
type PostType = "article" | "tutorial" | "snippet" | "project" | "note";
type Difficulty = "beginner" | "intermediate" | "advanced";

interface BlogFormData {
  title: string;
  slug: string;
  type: PostType;
  status: PostStatus;
  excerpt: string;
  coverImage: string;
  coverImageAlt: string;
  category: string;
  tags: string[];
  series: string;
  techStack: string[];
  difficulty: Difficulty | "";
  githubUrl: string;
  demoUrl: string;
  isFeatured: boolean;
  isPinned: boolean;
  commentsEnabled: boolean;
  scheduledAt: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
    focusKeyword: string;
    keywords: string;
    ogImage: string;
    noIndex: boolean;
  };
}

// Helper functions
function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function countWords(html: string) {
  const text = html.replace(/<[^>]*>/g, " ");
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// Media Upload Modal Component
function MediaUploadModal({ isOpen, onClose, onInsert }: any) {
  const [uploadType, setUploadType] = useState<"image" | "video">("image");
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: file.name, fileType: file.type }),
      });
      const { uploadUrl, key } = await res.json();
      
      await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });
      
      const finalUrl = `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${key}`;
      setUrl(finalUrl);
      setAlt(file.name.replace(/\.[^.]+$/, ""));
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleInsert = () => {
    if (!url) return;
    if (uploadType === "image") {
      onInsert({ type: "image", src: url, alt, caption });
    } else {
      onInsert({ type: "video", src: url, caption });
    }
    onClose();
    setUrl("");
    setAlt("");
    setCaption("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-[#1a1a2e] rounded-xl w-full max-w-2xl border border-white/10 shadow-2xl">
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setUploadType("image")}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              uploadType === "image" ? "bg-violet-600 text-white" : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <ImageIcon className="inline w-4 h-4 mr-2" />
            Insert Image
          </button>
          <button
            onClick={() => setUploadType("video")}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              uploadType === "video" ? "bg-violet-600 text-white" : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <VideoIcon className="inline w-4 h-4 mr-2" />
            Insert Video
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Upload File
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept={uploadType === "image" ? "image/*" : "video/*"}
              onChange={handleFileUpload}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-600 file:text-white hover:file:bg-violet-500"
            />
            {uploading && <p className="text-xs text-gray-500 mt-1">Uploading...</p>}
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-[#1a1a2e] text-gray-500">OR</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Or paste URL
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={uploadType === "image" ? "https://example.com/image.jpg" : "https://example.com/video.mp4"}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
          </div>
          
          {uploadType === "image" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Alt Text (SEO)
                </label>
                <input
                  type="text"
                  value={alt}
                  onChange={(e) => setAlt(e.target.value)}
                  placeholder="Describe the image for accessibility"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Caption
                </label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Image caption (optional)"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>
            </>
          )}
          
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleInsert}
              disabled={!url}
              className="flex-1 px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-white font-medium transition-colors disabled:opacity-50"
            >
              Insert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Link Modal Component
function LinkModal({ isOpen, onClose, onInsert, initialUrl = "" }: any) {
  const [url, setUrl] = useState(initialUrl);
  const [text, setText] = useState("");
  const [opensInNewTab, setOpensInNewTab] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setUrl(initialUrl);
    }
  }, [isOpen, initialUrl]);

  const handleInsert = () => {
    if (!url) return;
    onInsert({ url, text, opensInNewTab });
    onClose();
    setUrl("");
    setText("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-[#1a1a2e] rounded-xl w-full max-w-md border border-white/10 shadow-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Insert Link</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-violet-500"
              autoFocus
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Link Text (Optional)
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Click here"
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
          </div>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={opensInNewTab}
              onChange={(e) => setOpensInNewTab(e.target.checked)}
              className="accent-violet-500"
            />
            <span className="text-sm text-gray-300">Open in new tab</span>
          </label>
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleInsert}
            disabled={!url}
            className="flex-1 px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-white font-medium transition-colors disabled:opacity-50"
          >
            Insert Link
          </button>
        </div>
      </div>
    </div>
  );
}

// Table Modal Component
function TableModal({ isOpen, onClose, onInsert }: any) {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);

  const handleInsert = () => {
    onInsert(rows, cols);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-[#1a1a2e] rounded-xl w-full max-w-md border border-white/10 shadow-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Insert Table</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Number of Rows: {rows}
            </label>
            <input
              type="range"
              min={1}
              max={10}
              value={rows}
              onChange={(e) => setRows(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Number of Columns: {cols}
            </label>
            <input
              type="range"
              min={1}
              max={10}
              value={cols}
              onChange={(e) => setCols(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleInsert}
            className="flex-1 px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-white font-medium transition-colors"
          >
            Insert Table
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Component
export default function ClassicEditorPage() {
  const [activeTab, setActiveTab] = useState<"editor" | "seo" | "settings">("editor");
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [techInput, setTechInput] = useState("");
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showTableModal, setShowTableModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<BlogFormData>({
    title: "",
    slug: "",
    type: "article",
    status: "draft",
    excerpt: "",
    coverImage: "",
    coverImageAlt: "",
    category: "",
    tags: [],
    series: "",
    techStack: [],
    difficulty: "",
    githubUrl: "",
    demoUrl: "",
    isFeatured: false,
    isPinned: false,
    commentsEnabled: true,
    scheduledAt: "",
    seo: {
      metaTitle: "",
      metaDescription: "",
      focusKeyword: "",
      keywords: "",
      ogImage: "",
      noIndex: false,
    },
  });

  const setFormField = (key: keyof BlogFormData, val: any) =>
    setForm((f) => ({ ...f, [key]: val }));
  const setSEO = (key: keyof BlogFormData["seo"], val: any) =>
    setForm((f) => ({ ...f, seo: { ...f.seo, [key]: val } }));

  // Tiptap editor with all features
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Placeholder.configure({
        placeholder: "Start writing your post... Type / for commands",
      }),
      Image.configure({
        allowBase64: true,
        inline: true,
      }),
      Youtube.configure({
controls: false,      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-violet-400 hover:text-violet-300 underline transition-colors",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
      Typography,
      Underline,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      CodeBlockLowlight.configure({ lowlight }),
      CharacterCount,
    ],
    editorProps: {
      attributes: {
        class: "prose prose-invert prose-pre:bg-[#1e1e2e] prose-pre:rounded-lg prose-code:text-violet-300 max-w-none focus:outline-none min-h-[500px] p-6",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setWordCount(countWords(html));
    },
    immediatelyRender: false,
  });

  // Auto-generate slug
  useEffect(() => {
    if (form.title && !form.slug) {
      setFormField("slug", slugify(form.title));
    }
  }, [form.title]);

  // Auto-fill SEO meta title
  useEffect(() => {
    if (!form.seo.metaTitle && form.title) {
      setSEO("metaTitle", form.title.slice(0, 70));
    }
  }, [form.title]);

  // Auto-fill SEO description from excerpt
  useEffect(() => {
    if (!form.seo.metaDescription && form.excerpt) {
      setSEO("metaDescription", form.excerpt.slice(0, 160));
    }
  }, [form.excerpt]);

  // Editor commands
  const insertImage = () => setShowMediaModal(true);
  const insertVideo = () => setShowMediaModal(true);
  const insertLink = () => setShowLinkModal(true);
  const insertTable = () => setShowTableModal(true);

  const handleMediaInsert = (media: any) => {
    if (!editor) return;
    if (media.type === "image") {
      editor.chain().focus().setImage({ src: media.src, alt: media.alt }).run();
      if (media.caption) {
        editor.chain().focus().insertContent(`<figcaption>${media.caption}</figcaption>`).run();
      }
    } else if (media.type === "video") {
      editor.chain().focus().insertContent(`<video controls><source src="${media.src}" type="video/mp4"></video>`).run();
    }
  };

  const handleLinkInsert = ({ url, text, opensInNewTab }: any) => {
    if (!editor) return;
    if (text) {
      editor.chain().focus().insertContent(text).run();
      editor.chain().focus().extendMarkRange("link").setLink({ href: url, target: opensInNewTab ? "_blank" : undefined }).run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url, target: opensInNewTab ? "_blank" : undefined }).run();
    }
  };

  const handleTableInsert = (rows: number, cols: number) => {
    if (!editor) return;
    editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
  };

  // Cover upload
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setCoverPreview(localPreview);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: file.name, fileType: file.type }),
      });

      if (!res.ok) throw new Error("Failed to get upload URL");
      
      const { uploadUrl, key } = await res.json();
      await fetch(uploadUrl, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
      
      const finalS3Url = `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${key}`;
      setFormField("coverImage", finalS3Url);
      setFormField("coverImageAlt", file.name.replace(/\.[^.]+$/, "").replace(/-|_/g, " "));
    } catch (error) {
      console.error("Upload error:", error);
      alert("Image upload failed!");
      setCoverPreview(null);
    }
  };

  // Add tag
  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !form.tags.includes(t)) setFormField("tags", [...form.tags, t]);
    setTagInput("");
  };

  const addTech = () => {
    const t = techInput.trim();
    if (t && !form.techStack.includes(t)) setFormField("techStack", [...form.techStack, t]);
    setTechInput("");
  };

  // Submit handlers
  const handleSubmit = useCallback(async (status: PostStatus) => {
    if (!editor) return;
    setSaving(true);

    try {
      const content = editor.getHTML();
      
      if (!form.title.trim()) throw new Error("Please enter a title");
      if (!form.excerpt.trim()) throw new Error("Please enter an excerpt");
      if (!form.coverImage) throw new Error("Please upload a cover image");
      if (!form.category) throw new Error("Please select a category");
      
      const payload = { ...form, status, content };
      
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) throw new Error("Failed to save post");
      
      const savedPost = await response.json();
      alert(`Post ${status === "published" ? "published" : "saved"} successfully!`);
      
      if (status === "published") {
        window.location.href = `/blog/${savedPost.slug}`;
      } else {
        window.location.href = `/admin/posts/edit/${savedPost._id}`;
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to save post");
    } finally {
      setSaving(false);
    }
  }, [form, editor]);

  // Toolbar Component
  const Toolbar = () => {
    if (!editor) return null;

    const buttons = [
      { icon: <Bold className="w-4 h-4" />, action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive("bold"), title: "Bold" },
      { icon: <Italic className="w-4 h-4" />, action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive("italic"), title: "Italic" },
      { icon: <UnderlineIcon className="w-4 h-4" />, action: () => editor.chain().focus().toggleUnderline().run(), active: editor.isActive("underline"), title: "Underline" },
      { icon: <Highlighter className="w-4 h-4" />, action: () => editor.chain().focus().toggleHighlight().run(), active: editor.isActive("highlight"), title: "Highlight" },
      { type: "divider" },
      { icon: <Heading1 className="w-4 h-4" />, action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive("heading", { level: 1 }), title: "Heading 1" },
      { icon: <Heading2 className="w-4 h-4" />, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive("heading", { level: 2 }), title: "Heading 2" },
      { icon: <Heading3 className="w-4 h-4" />, action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive("heading", { level: 3 }), title: "Heading 3" },
      { icon: <Type className="w-4 h-4" />, action: () => editor.chain().focus().setParagraph().run(), active: editor.isActive("paragraph"), title: "Paragraph" },
      { type: "divider" },
      { icon: <AlignLeft className="w-4 h-4" />, action: () => editor.chain().focus().setTextAlign("left").run(), active: editor.isActive({ textAlign: "left" }), title: "Align Left" },
      { icon: <AlignCenter className="w-4 h-4" />, action: () => editor.chain().focus().setTextAlign("center").run(), active: editor.isActive({ textAlign: "center" }), title: "Align Center" },
      { icon: <AlignRight className="w-4 h-4" />, action: () => editor.chain().focus().setTextAlign("right").run(), active: editor.isActive({ textAlign: "right" }), title: "Align Right" },
      { icon: <AlignJustify className="w-4 h-4" />, action: () => editor.chain().focus().setTextAlign("justify").run(), active: editor.isActive({ textAlign: "justify" }), title: "Justify" },
      { type: "divider" },
      { icon: <List className="w-4 h-4" />, action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive("bulletList"), title: "Bullet List" },
      { icon: <ListOrdered className="w-4 h-4" />, action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive("orderedList"), title: "Numbered List" },
      { icon: <Quote className="w-4 h-4" />, action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive("blockquote"), title: "Quote" },
      { icon: <Code className="w-4 h-4" />, action: () => editor.chain().focus().toggleCodeBlock().run(), active: editor.isActive("codeBlock"), title: "Code Block" },
      { type: "divider" },
      { icon: <LinkIcon className="w-4 h-4" />, action: insertLink, title: "Insert Link" },
      { icon: <ImageIcon className="w-4 h-4" />, action: insertImage, title: "Insert Image" },
      { icon: <VideoIcon className="w-4 h-4" />, action: insertVideo, title: "Insert Video" },
      { icon: <TableIcon className="w-4 h-4" />, action: insertTable, title: "Insert Table" },
      { type: "divider" },
      { icon: <Undo className="w-4 h-4" />, action: () => editor.chain().focus().undo().run(), title: "Undo" },
      { icon: <Redo className="w-4 h-4" />, action: () => editor.chain().focus().redo().run(), title: "Redo" },
    ];

    return (
      <div className="sticky top-14 z-40 bg-[#0f0f17] border-b border-white/10 px-4 py-2">
        <div className="flex flex-wrap items-center gap-1">
          {buttons.map((btn, idx) => 
            btn.type === "divider" ? (
              <div key={idx} className="w-px h-6 bg-white/10 mx-1" />
            ) : (
              <button
                key={idx}
                type="button"
                title={btn.title}
                onClick={btn.action}
                className={`p-2 rounded-lg transition-colors ${
                  btn.active
                    ? "bg-violet-600 text-white"
                    : "text-gray-400 hover:text-gray-100 hover:bg-white/10"
                }`}
              >
                {btn.icon}
              </button>
            )
          )}
          
          {/* Language selector for code blocks */}
          {editor.isActive("codeBlock") && (
            <select
              className="ml-2 text-xs bg-[#1e1e2e] border border-white/10 text-gray-300 rounded px-2 py-1"
              onChange={(e) => editor.chain().focus().setCodeBlock({ language: e.target.value }).run()}
            >
              {["javascript", "typescript", "python", "bash", "css", "json", "rust", "go", "yaml", "sql", "html", "text"].map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#09090f] text-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#09090f]/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-violet-400" />
              <span className="text-violet-400 font-black text-lg tracking-tight">DevBlog</span>
            </div>
            <span className="text-gray-600">/</span>
            <span className="text-gray-400 text-sm">New Post</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 hidden md:block">
              {wordCount} words · {Math.max(1, Math.round(wordCount / 200))} min read
            </span>
            
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 hover:bg-white/10 rounded-lg"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
            
            <div className={`${showMobileMenu ? "absolute top-14 right-4 left-4 bg-[#1a1a2e] rounded-xl border border-white/10 p-4 space-y-2" : "hidden md:flex"} md:flex md:relative md:top-auto md:right-auto md:left-auto md:bg-transparent md:p-0 md:space-y-0 md:gap-2`}>
              <button
                onClick={() => handleSubmit("draft")}
                disabled={saving}
                className="w-full md:w-auto px-3 py-1.5 text-sm rounded border border-white/15 text-gray-300 hover:bg-white/5 transition-colors"
              >
                <Save className="inline w-3 h-3 mr-1" />
                Save Draft
              </button>
              <button
                onClick={() => handleSubmit("published")}
                disabled={saving || !form.title || !form.category}
                className="w-full md:w-auto px-4 py-1.5 text-sm rounded bg-violet-600 text-white font-medium hover:bg-violet-500 transition-colors disabled:opacity-40"
              >
                {saving ? "Publishing…" : "Publish →"}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-1 mb-8 border-b border-white/10">
          {[
            { id: "editor", label: "Editor", icon: <FileText className="w-4 h-4" /> },
            { id: "seo", label: "SEO", icon: <Globe className="w-4 h-4" /> },
            { id: "settings", label: "Settings", icon: <Settings className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all border-b-2 -mb-px ${
                activeTab === tab.id
                  ? "border-violet-500 text-violet-400"
                  : "border-transparent text-gray-500 hover:text-gray-300"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Editor Tab */}
        {activeTab === "editor" && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Main Editor Area */}
            <div className="xl:col-span-2 space-y-6">
              {/* Title */}
              <input
                type="text"
                placeholder="Add title..."
                value={form.title}
                onChange={(e) => setFormField("title", e.target.value)}
                className="w-full bg-transparent text-4xl font-black text-white placeholder-gray-700 focus:outline-none border-none p-0"
              />

              {/* Cover Image */}
              <div
                onClick={() => coverInputRef.current?.click()}
                className={`relative rounded-xl border-2 border-dashed cursor-pointer transition-all overflow-hidden ${
                  coverPreview ? "border-transparent" : "border-white/10 hover:border-violet-500/50"
                }`}
              >
                {coverPreview ? (
                  <div className="relative group">
                    <img src={coverPreview} alt="Cover preview" className="w-full max-h-96 object-cover rounded-xl" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                      <span className="text-white text-sm bg-black/50 px-3 py-1.5 rounded-lg">Change Cover</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-600">
                    <ImageIcon className="w-12 h-12" />
                    <span className="text-sm">Click to upload cover image</span>
                    <span className="text-xs text-gray-700">Recommended: 1200×630px, WebP/JPEG</span>
                  </div>
                )}
                <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
              </div>

              {/* Excerpt */}
              <div className="bg-white/5 rounded-xl p-4">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                  Excerpt
                </label>
                <textarea
                  placeholder="Write a compelling excerpt that summarizes your post..."
                  value={form.excerpt}
                  onChange={(e) => setFormField("excerpt", e.target.value.slice(0, 300))}
                  rows={3}
                  className="w-full bg-transparent text-gray-300 placeholder-gray-600 resize-none focus:outline-none"
                />
                <div className="text-xs text-gray-700 text-right mt-2">{form.excerpt.length}/300</div>
              </div>

              {/* Rich Text Editor */}
              <div className="rounded-xl border border-white/10 overflow-hidden bg-[#0d0d16]">
                <Toolbar />
                <div className="editor-content">
                  <EditorContent editor={editor} />
                </div>
              </div>
            </div>

            {/* Sidebar - Content Settings */}
            <aside className="space-y-6">
              {/* Post Type */}
              <div className="bg-white/5 rounded-xl p-4">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-3">
                  Post Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["article", "tutorial", "snippet", "project", "note"] as PostType[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setFormField("type", t)}
                      className={`py-2 rounded-lg text-sm capitalize transition-colors ${
                        form.type === t ? "bg-violet-600 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div className="bg-white/5 rounded-xl p-4">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                  Category *
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setFormField("category", e.target.value)}
                  className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-violet-500"
                >
                  <option value="">Select category…</option>
                  <option value="web-development">Web Development</option>
                  <option value="devops">DevOps</option>
                  <option value="ai-ml">AI / ML</option>
                  <option value="open-source">Open Source</option>
                  <option value="career">Career</option>
                </select>
              </div>

              {/* Tags */}
              <div className="bg-white/5 rounded-xl p-4">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {form.tags.map((t) => (
                    <span
                      key={t}
                      onClick={() => setFormField("tags", form.tags.filter((x) => x !== t))}
                      className="px-2.5 py-1 bg-violet-950 text-violet-400 text-xs rounded-full cursor-pointer hover:bg-red-950 hover:text-red-400 transition-colors"
                    >
                      #{t} ×
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    placeholder="Add tag..."
                    className="flex-1 bg-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                </div>
              </div>

              {/* Difficulty */}
              <div className="bg-white/5 rounded-xl p-4">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                  Difficulty Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["beginner", "intermediate", "advanced"] as Difficulty[]).map((d) => (
                    <button
                      key={d}
                      onClick={() => setFormField("difficulty", form.difficulty === d ? "" : d)}
                      className={`py-2 rounded-lg text-sm capitalize transition-colors ${
                        form.difficulty === d
                          ? d === "beginner" ? "bg-emerald-600" : d === "intermediate" ? "bg-amber-600" : "bg-red-600"
                          : "bg-white/5 text-gray-400 hover:bg-white/10"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="bg-white/5 rounded-xl p-4 space-y-3">
                {[
                  ["isFeatured", "Feature this post (show on homepage)"],
                  ["isPinned", "Pin to top of blog"],
                  ["commentsEnabled", "Enable comments"],
                ].map(([key, label]) => (
                  <label key={key} className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-gray-300">{label}</span>
                    <div
                      onClick={() => setFormField(key as keyof BlogFormData, !form[key as keyof BlogFormData])}
                      className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                        form[key as keyof BlogFormData] ? "bg-violet-600" : "bg-white/20"
                      }`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                        form[key as keyof BlogFormData] ? "translate-x-5" : "translate-x-0.5"
                      }`} />
                    </div>
                  </label>
                ))}
              </div>

              {/* Schedule */}
              <div className="bg-white/5 rounded-xl p-4">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                  <Calendar className="inline w-3 h-3 mr-1" />
                  Schedule Publish
                </label>
                <input
                  type="datetime-local"
                  value={form.scheduledAt}
                  onChange={(e) => setFormField("scheduledAt", e.target.value)}
                  className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>
            </aside>
          </div>
        )}

        {/* SEO Tab */}
        {activeTab === "seo" && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">SEO Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Focus Keyword
                  </label>
                  <input
                    value={form.seo.focusKeyword}
                    onChange={(e) => setSEO("focusKeyword", e.target.value)}
                    placeholder="Primary keyword to rank for"
                    className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-300">
                      Meta Title
                    </label>
                    <span className={`text-xs ${form.seo.metaTitle.length > 70 ? "text-red-400" : "text-gray-500"}`}>
                      {form.seo.metaTitle.length}/70
                    </span>
                  </div>
                  <input
                    value={form.seo.metaTitle}
                    onChange={(e) => setSEO("metaTitle", e.target.value.slice(0, 70))}
                    placeholder="SEO title (50–70 chars)"
                    className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-300">
                      Meta Description
                    </label>
                    <span className={`text-xs ${form.seo.metaDescription.length > 160 ? "text-red-400" : "text-gray-500"}`}>
                      {form.seo.metaDescription.length}/160
                    </span>
                  </div>
                  <textarea
                    value={form.seo.metaDescription}
                    onChange={(e) => setSEO("metaDescription", e.target.value.slice(0, 160))}
                    rows={3}
                    placeholder="Compelling description for search results (120–160 chars)"
                    className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Keywords (comma separated)
                  </label>
                  <input
                    value={form.seo.keywords}
                    onChange={(e) => setSEO("keywords", e.target.value)}
                    placeholder="keyword1, keyword2, keyword3"
                    className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                </div>

                {/* SERP Preview */}
                <div className="pt-4">
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Google Search Preview
                  </label>
                  <div className="bg-white rounded-xl p-4 shadow-lg">
                    <p className="text-[#1a0dab] text-lg font-normal leading-6 line-clamp-1">
                      {form.seo.metaTitle || form.title || "Your post title"}
                    </p>
                    <p className="text-[#006621] text-sm mt-1">
                      yourdomain.com › blog › {form.slug || "post-slug"}
                    </p>
                    <p className="text-[#545454] text-sm mt-1 leading-5 line-clamp-2">
                      {form.seo.metaDescription || form.excerpt || "Your meta description will appear here..."}
                    </p>
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer pt-2">
                  <input
                    type="checkbox"
                    checked={form.seo.noIndex}
                    onChange={(e) => setSEO("noIndex", e.target.checked)}
                    className="accent-violet-500"
                  />
                  <span className="text-sm text-gray-300">Prevent search engines from indexing this post (noindex)</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Post Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Post Slug / URL
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">yourdomain.com/blog/</span>
                    <input
                      value={form.slug}
                      onChange={(e) => setFormField("slug", slugify(e.target.value))}
                      className="flex-1 bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm text-violet-400 font-mono focus:outline-none focus:ring-1 focus:ring-violet-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Custom OG Image URL
                  </label>
                  <input
                    value={form.seo.ogImage}
                    onChange={(e) => setSEO("ogImage", e.target.value)}
                    placeholder="https://... (defaults to cover image)"
                    className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Tech Stack
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {form.techStack.map((t) => (
                      <span
                        key={t}
                        onClick={() => setFormField("techStack", form.techStack.filter((x) => x !== t))}
                        className="px-2.5 py-1 bg-cyan-950 text-cyan-400 text-xs rounded-full cursor-pointer hover:bg-red-950 hover:text-red-400 transition-colors"
                      >
                        {t} ×
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTech())}
                      placeholder="e.g. Next.js, TypeScript, Tailwind..."
                      className="flex-1 bg-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                    <button onClick={addTech} className="px-3 py-2 bg-cyan-900/50 text-cyan-400 rounded-lg text-sm hover:bg-cyan-800/50">
                      Add
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      GitHub URL
                    </label>
                    <input
                      value={form.githubUrl}
                      onChange={(e) => setFormField("githubUrl", e.target.value)}
                      placeholder="https://github.com/you/repo"
                      className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Live Demo URL
                    </label>
                    <input
                      value={form.demoUrl}
                      onChange={(e) => setFormField("demoUrl", e.target.value)}
                      placeholder="https://demo.example.com"
                      className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-violet-500"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="bg-white/5 rounded-lg p-4 space-y-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Post Statistics</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Total Words</span>
                      <span className="text-gray-300 font-mono">{wordCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Reading Time</span>
                      <span className="text-gray-300 font-mono">{Math.max(1, Math.round(wordCount / 200))} min</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Tags</span>
                      <span className="text-gray-300 font-mono">{form.tags.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Tech Stack Items</span>
                      <span className="text-gray-300 font-mono">{form.techStack.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Current Status</span>
                      <span className={`font-mono ${form.status === "published" ? "text-emerald-400" : "text-amber-400"}`}>
                        {form.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
                        console.log("Delete post");
                      }
                    }}
                    className="w-full py-2 text-sm text-red-400 border border-red-900/50 rounded-lg hover:bg-red-950/30 transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <MediaUploadModal
        isOpen={showMediaModal}
        onClose={() => setShowMediaModal(false)}
        onInsert={handleMediaInsert}
      />
      
      <LinkModal
        isOpen={showLinkModal}
        onClose={() => setShowLinkModal(false)}
        onInsert={handleLinkInsert}
      />
      
      <TableModal
        isOpen={showTableModal}
        onClose={() => setShowTableModal(false)}
        onInsert={handleTableInsert}
      />

      {/* Custom Styles */}
      <style jsx global>{`
        .ProseMirror {
          min-height: 500px;
          padding: 1.5rem;
        }
        
        .ProseMirror pre {
          background: #1e1e2e !important;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px;
          padding: 1.25rem 1.5rem;
          overflow-x: auto;
        }
        
        .ProseMirror pre code {
          color: #cdd6f4;
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          font-size: 0.82rem;
          line-height: 1.7;
          background: transparent !important;
        }
        
        .ProseMirror table {
          border-collapse: collapse;
          margin: 1rem 0;
          width: 100%;
        }
        
        .ProseMirror th,
        .ProseMirror td {
          border: 1px solid rgba(255,255,255,0.1);
          padding: 0.75rem;
          text-align: left;
        }
        
        .ProseMirror th {
          background: rgba(255,255,255,0.05);
          font-weight: 600;
        }
        
        .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
        }
        
        .ProseMirror video {
          max-width: 100%;
          border-radius: 8px;
        }
        
        .ProseMirror figcaption {
          text-align: center;
          font-size: 0.875rem;
          color: #94a3b8;
          margin-top: 0.5rem;
        }
        
        .ProseMirror blockquote {
          border-left: 3px solid #7c3aed;
          padding-left: 1rem;
          color: #94a3b8;
          font-style: italic;
          margin: 1rem 0;
        }
        
        .ProseMirror hr {
          border-color: rgba(255,255,255,0.08);
          margin: 2rem 0;
        }
        
        .ProseMirror a {
          color: #a78bfa;
          text-decoration: underline;
        }
        
        .ProseMirror h1 {
          font-size: 2.5rem;
          font-weight: 800;
          margin: 1.5rem 0 1rem;
        }
        
        .ProseMirror h2 {
          font-size: 2rem;
          font-weight: 700;
          margin: 1.25rem 0 0.75rem;
        }
        
        .ProseMirror h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 1rem 0 0.5rem;
        }
        
        .ProseMirror p.is-editor-empty:first-child::before {
          color: #3d3d5c;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
        
        /* Syntax highlighting */
        .hljs-keyword, .hljs-selector-tag { color: #cba6f7; }
        .hljs-title, .hljs-title.class_, .hljs-title.function_ { color: #89b4fa; }
        .hljs-string, .hljs-attr { color: #a6e3a1; }
        .hljs-number, .hljs-literal { color: #fab387; }
        .hljs-comment { color: #6c7086; font-style: italic; }
        .hljs-variable, .hljs-params { color: #cdd6f4; }
        .hljs-built_in, .hljs-type { color: #f38ba8; }
        .hljs-operator, .hljs-punctuation { color: #89dceb; }
        .hljs-property { color: #f9e2af; }
        .hljs-tag { color: #f38ba8; }
        .hljs-name { color: #cba6f7; }
      `}</style>
    </div>
  );
}