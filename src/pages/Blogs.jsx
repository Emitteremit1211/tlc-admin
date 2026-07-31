import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Plus,
    Trash2,
    Edit3,
    BookOpen,
    ArrowRight,
    Sparkles,
} from "lucide-react";
import { getBlogs, deleteBlog } from "../services/blogService";
import AdminLayout from "../components/AdminLayout";

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hoveredId, setHoveredId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        loadBlogs();
    }, []);

    /* ============================
       LOAD BLOGS
    ============================ */

    async function loadBlogs() {
        try {
            setLoading(true);

            const data = await getBlogs();

            setBlogs(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to load blogs:", error);
        } finally {
            setLoading(false);
        }
    }

    /* ============================
       DELETE BLOG
    ============================ */

    async function handleDelete(id) {
    const confirmed = window.confirm(
        "Are you sure you want to delete this blog?\n\nThis action cannot be undone."
    );

    if (!confirmed) return;

    try {
        setDeletingId(id);

        await deleteBlog(id);

        // Remove it from the current UI
        setBlogs((currentBlogs) =>
            currentBlogs.filter(
                (blog) => String(blog._id) !== String(id)
            )
        );

        alert("Blog deleted successfully.");
    } catch (error) {
        console.error("Failed to delete blog:", error);

        alert(
            error?.message ||
                "Failed to delete blog. Please try again."
        );
    } finally {
        setDeletingId(null);
    }
}

    return (
        <AdminLayout>
            <div className="w-full min-h-screen relative overflow-hidden bg-gradient-to-br from-[#EAF6F6] via-[#F0FBFA] to-[#E8F5F3]">

                <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

                .tlc-display {
                    font-family: 'Fraunces', Georgia, serif;
                }

                .tlc-blob {
                    position: absolute;
                    border-radius: 9999px;
                    filter: blur(90px);
                    opacity: 0.6;
                    animation: tlc-drift 20s ease-in-out infinite;
                    pointer-events: none;
                }

                @keyframes tlc-drift {
                    0%, 100% {
                        transform: translate(0px, 0px) scale(1);
                    }

                    25% {
                        transform: translate(30px, -40px) scale(1.1);
                    }

                    50% {
                        transform: translate(-20px, 30px) scale(0.95);
                    }

                    75% {
                        transform: translate(40px, 20px) scale(1.05);
                    }
                }

                .tlc-glass {
                    background: linear-gradient(
                        135deg,
                        rgba(255,255,255,0.72) 0%,
                        rgba(255,255,255,0.45) 100%
                    );

                    backdrop-filter: blur(30px) saturate(200%) brightness(1.1);
                    -webkit-backdrop-filter: blur(30px) saturate(200%) brightness(1.1);

                    border: 1px solid rgba(255,255,255,0.85);

                    box-shadow:
                        0 8px 32px rgba(15,42,61,0.08),
                        inset 0 1px 1px rgba(255,255,255,0.9),
                        inset 0 0 20px rgba(127,220,210,0.1);
                }

                .tlc-glass:hover {
                    background: linear-gradient(
                        135deg,
                        rgba(255,255,255,0.8) 0%,
                        rgba(255,255,255,0.55) 100%
                    );

                    box-shadow:
                        0 16px 48px rgba(15,42,61,0.15),
                        inset 0 1px 1px rgba(255,255,255,0.95),
                        inset 0 0 30px rgba(127,220,210,0.15);
                }

                .tlc-glass-premium {
                    background: linear-gradient(
                        135deg,
                        rgba(255,255,255,0.75) 0%,
                        rgba(255,255,255,0.5) 100%
                    );

                    backdrop-filter: blur(40px) saturate(220%) brightness(1.15);
                    -webkit-backdrop-filter: blur(40px) saturate(220%) brightness(1.15);

                    border: 1.5px solid rgba(255,255,255,0.9);

                    box-shadow:
                        0 10px 40px rgba(15,42,61,0.1),
                        inset 0 2px 4px rgba(255,255,255,1),
                        inset 0 0 30px rgba(127,220,210,0.15);
                }

                .liquid-glass {
                    position: relative;
                    overflow: hidden;
                }

                .liquid-glass::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;

                    background:
                        radial-gradient(
                            circle at 20% 50%,
                            rgba(127,220,210,0.1),
                            transparent 50%
                        ),
                        radial-gradient(
                            circle at 80% 80%,
                            rgba(255,201,163,0.1),
                            transparent 50%
                        );

                    animation: liquid-shift 15s ease-in-out infinite;
                    pointer-events: none;
                }

                @keyframes liquid-shift {
                    0%, 100% {
                        transform: translate(0, 0);
                    }

                    25% {
                        transform: translate(30px, -30px);
                    }

                    50% {
                        transform: translate(-20px, 40px);
                    }

                    75% {
                        transform: translate(40px, 10px);
                    }
                }

                .tlc-sheen::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;

                    background: linear-gradient(
                        90deg,
                        transparent,
                        rgba(255,255,255,0.3),
                        transparent
                    );

                    animation: shine 6s infinite;
                }

                @keyframes shine {
                    0% {
                        left: -100%;
                    }

                    50% {
                        left: 100%;
                    }

                    100% {
                        left: 100%;
                    }
                }

                @keyframes tlc-fade-up {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }

                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes float-in {
                    from {
                        opacity: 0;
                        transform: translateY(40px) scale(0.95);
                    }

                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                .tlc-fade-up {
                    animation: tlc-fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
                }

                .float-in {
                    animation: float-in 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) both;
                }

                .blog-card {
                    transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
                }

                .blog-card:hover {
                    transform: translateY(-8px) scale(1.02);
                }

                .blog-card:hover .blog-overlay {
                    opacity: 1;
                }

                .blog-overlay {
                    opacity: 0;
                    transition: opacity 0.5s ease;
                }

                @media (prefers-reduced-motion: reduce) {
                    .tlc-blob,
                    .tlc-fade-up,
                    .float-in,
                    .blog-card,
                    .blog-card:hover {
                        animation: none;
                        transform: none;
                    }
                }
            `}</style>

                {/* DYNAMIC BLOB BACKGROUND */}

                <div className="tlc-blob w-[500px] h-[500px] bg-gradient-to-br from-[#7FDCD2] to-[#5BC4CA] -top-40 -left-32" />

                <div className="tlc-blob w-[400px] h-[400px] bg-gradient-to-br from-[#FFC9A3] to-[#FFB88C] -bottom-32 -right-24" />

                <div className="tlc-blob w-[350px] h-[350px] bg-gradient-to-br from-[#9FD8F2] to-[#7FDCD2] top-1/3 right-1/4" />

                {/* CONTENT */}

                <div className="relative z-10 w-full px-6 md:px-12 py-16">
                    <div className="max-w-7xl mx-auto">

                        {/* HEADER */}

                        <div className="mb-16">

                            <div
                                className="tlc-fade-up flex items-center gap-3 mb-4"
                                style={{ animationDelay: "0ms" }}
                            >
                                <div className="relative">
                                    <BookOpen className="w-10 h-10 text-[#1B8C86]" />

                                    <Sparkles className="w-5 h-5 text-[#FFC9A3] absolute -top-1 -right-1" />
                                </div>

                                <span className="text-[#1B8C86] text-sm font-bold uppercase tracking-[0.2em]">
                                    ✨ Creative Content Hub
                                </span>
                            </div>

                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                                <div
                                    className="tlc-fade-up"
                                    style={{ animationDelay: "100ms" }}
                                >
                                    <h1 className="tlc-display text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#0D2B3E] via-[#1B8C86] to-[#0D2B3E] bg-clip-text text-transparent mb-3">
                                        Blog Collection
                                    </h1>

                                    <p className="text-[#4A5D6B] text-lg max-w-2xl">
                                        Curate, manage, and share compelling stories that resonate with your audience
                                    </p>
                                </div>

                                <Link
                                    to="/blogs/create"
                                    className="tlc-fade-up tlc-glass-premium liquid-glass tlc-sheen inline-flex items-center gap-3 text-white px-10 py-4 rounded-2xl font-bold hover:shadow-2xl relative group overflow-hidden whitespace-nowrap"
                                    style={{ animationDelay: "200ms" }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#1B8C86] to-[#0D2B3E] group-hover:from-[#0D2B3E] group-hover:to-[#1B8C86] transition-all duration-500 -z-10" />

                                    <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />

                                    Create Blog

                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>

                            </div>
                        </div>

                        {/* STATS CARD */}

                        <div
                            className="tlc-fade-up tlc-glass-premium liquid-glass rounded-3xl p-8 md:p-12 mb-16 relative overflow-hidden"
                            style={{ animationDelay: "300ms" }}
                        >
                            <div className="flex items-center justify-between">

                                <div>
                                    <p className="text-[#4A5D6B] text-sm font-semibold mb-3 uppercase tracking-wide">
                                        Total Stories
                                    </p>

                                    <p className="tlc-display text-6xl font-bold text-transparent bg-gradient-to-r from-[#1B8C86] to-[#7FDCD2] bg-clip-text">
                                        {blogs.length}
                                    </p>
                                </div>

                                <BookOpen className="w-24 h-24 text-[#7FDCD2] opacity-20" />

                            </div>
                        </div>

                        {/* LOADING */}

                        {loading && (
                            <div className="tlc-glass-premium rounded-3xl p-16 text-center">

                                <div className="inline-block">

                                    <div className="w-12 h-12 border-4 border-[#7FDCD2]/30 border-t-[#1B8C86] rounded-full animate-spin mx-auto mb-4" />

                                    <p className="text-[#4A5D6B] font-semibold">
                                        Loading your blogs...
                                    </p>

                                </div>

                            </div>
                        )}

                        {/* EMPTY */}

                        {!loading && blogs.length === 0 && (
                            <div className="tlc-glass-premium liquid-glass rounded-3xl p-20 text-center relative overflow-hidden">

                                <BookOpen className="w-20 h-20 text-[#7FDCD2] opacity-20 mx-auto mb-6" />

                                <h2 className="tlc-display text-3xl font-bold text-[#0D2B3E] mb-4">
                                    No Stories Yet
                                </h2>

                                <p className="text-[#4A5D6B] text-lg mb-8 max-w-md mx-auto">
                                    Start your creative journey by publishing your first blog post
                                </p>

                                <Link
                                    to="/blogs/create"
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-[#1B8C86] to-[#7FDCD2] text-white px-8 py-4 rounded-2xl font-bold hover:shadow-lg transition-all group"
                                >
                                    <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    Write First Blog
                                </Link>

                            </div>
                        )}

                        {/* BLOG GRID */}

                        {!loading && blogs.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                                {blogs.map((blog, index) => (

                                    <div
                                        key={blog._id}
                                        className="blog-card tlc-glass liquid-glass rounded-3xl p-8 flex flex-col relative overflow-hidden float-in group"
                                        style={{
                                            animationDelay: `${400 + index * 60}ms`,
                                        }}
                                        onMouseEnter={() =>
                                            setHoveredId(blog._id)
                                        }
                                        onMouseLeave={() =>
                                            setHoveredId(null)
                                        }
                                    >

                                        {/* GRADIENT OVERLAY */}

                                        <div className="blog-overlay absolute inset-0 bg-gradient-to-br from-[#1B8C86]/5 to-[#FFC9A3]/5 pointer-events-none" />

                                        {/* STATUS */}

                                        <div className="flex items-center justify-between gap-3 mb-6">

                                            <span
                                                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm ${
                                                    blog.status === "Published"
                                                        ? "bg-emerald-100/80 text-emerald-700"
                                                        : "bg-amber-100/80 text-amber-700"
                                                }`}
                                            >
                                                {blog.status || "Draft"}
                                            </span>

                                            <span className="text-xs text-[#4A5D6B] font-medium">
                                                {blog.createdAt
                                                    ? new Date(
                                                          blog.createdAt
                                                      ).toLocaleDateString()
                                                    : ""}
                                            </span>

                                        </div>

                                        {/* TITLE */}

                                        <h3 className="tlc-display text-2xl font-bold text-[#0D2B3E] mb-4 line-clamp-2 group-hover:text-[#1B8C86] transition-colors">
                                            {blog.title}
                                        </h3>

                                        {/* DESCRIPTION */}

                                        <p className="text-sm text-[#4A5D6B] line-clamp-3 mb-6 leading-relaxed flex-grow">
                                            {blog.description ||
                                                blog.excerpt ||
                                                blog.content?.substring(
                                                    0,
                                                    120
                                                ) +
                                                    "..."}
                                        </p>

                                        {/* CATEGORY */}

                                        <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b border-white/40">

                                            <span className="px-3 py-1.5 rounded-full bg-gradient-to-r from-[#1B8C86]/10 to-[#7FDCD2]/10 text-[#1B8C86] text-xs font-semibold">
                                                {blog.category ||
                                                    "Uncategorized"}
                                            </span>

                                        </div>

                                        {/* ACTION BUTTONS */}

                                        <div className="flex gap-3 pt-4 relative z-20">

                                            {/* EDIT */}

                                            <Link
                                                to={`/blogs/edit/${blog._id}`}
                                                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-400/20 to-blue-500/20 text-blue-700 py-3 rounded-xl hover:from-blue-400/40 hover:to-blue-500/40 transition-all font-semibold text-sm group/btn"
                                            >
                                                <Edit3 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />

                                                Edit
                                            </Link>

                                            {/* DELETE */}

                                            <button
                                                type="button"
                                                disabled={deletingId === blog._id}
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    event.stopPropagation();

                                                    handleDelete(blog._id);
                                                }}
                                                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-400/20 to-red-500/20 text-red-700 py-3 rounded-xl hover:from-red-400/40 hover:to-red-500/40 transition-all font-semibold text-sm group/btn disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {deletingId === blog._id ? (
                                                    <>
                                                        <span className="w-4 h-4 border-2 border-red-700/30 border-t-red-700 rounded-full animate-spin" />
                                                        Deleting...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Trash2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                                        Delete
                                                    </>
                                                )}
                                            </button>

                                        </div>

                                    </div>

                                ))}

                            </div>
                        )}

                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Blogs;
