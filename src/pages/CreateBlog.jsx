import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { API_URL, getToken } from "../lib/auth";

export default function CreateBlog() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        excerpt: "",
        content: "",
        category: "",
        tags: "",
        readTime: "",
        status: "draft",
        featured: false,
    });

    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            const formData = new FormData();

            Object.keys(form).forEach((key) => {
                formData.append(key, form[key]);
            });

            if (image) {
                formData.append("image", image);
            }

            const res = await fetch(`${API_URL}/api/blogs`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
                body: formData,
            });

            if (!res.ok) {
                throw new Error("Failed to create blog");
            }

            alert("Blog created successfully");

            navigate("/blogs");
        } catch (err) {
            alert(err.message);
        }

        setLoading(false);
    };

    return (
        <AdminLayout>

            <div className="max-w-5xl mx-auto">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#0D2B3E]">
                        Create Blog
                    </h1>

                    <p className="text-slate-500 mt-2">
                        Publish a new article for the TLC website.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-3xl shadow-lg p-8 space-y-6"
                >

                    <div>
                        <label className="font-semibold">
                            Blog Title
                        </label>

                        <input
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            className="w-full mt-2 border rounded-xl p-3"
                            required
                        />
                    </div>

                    <div>
                        <label className="font-semibold">
                            Short Description
                        </label>

                        <textarea
                            rows="3"
                            name="excerpt"
                            value={form.excerpt}
                            onChange={handleChange}
                            className="w-full mt-2 border rounded-xl p-3"
                            required
                        />
                    </div>

                    <div>
                        <label className="font-semibold">
                            Blog Content
                        </label>

                        <textarea
                            rows="12"
                            name="content"
                            value={form.content}
                            onChange={handleChange}
                            className="w-full mt-2 border rounded-xl p-3"
                            required
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">

                        <div>
                            <label className="font-semibold">
                                Category
                            </label>

                            <input
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                className="w-full mt-2 border rounded-xl p-3"
                            />
                        </div>

                        <div>
                            <label className="font-semibold">
                                Read Time
                            </label>

                            <input
                                name="readTime"
                                placeholder="5 min read"
                                value={form.readTime}
                                onChange={handleChange}
                                className="w-full mt-2 border rounded-xl p-3"
                            />
                        </div>

                    </div>

                    <div>
                        <label className="font-semibold">
                            Tags
                        </label>

                        <input
                            name="tags"
                            placeholder="care, staffing, seniors"
                            value={form.tags}
                            onChange={handleChange}
                            className="w-full mt-2 border rounded-xl p-3"
                        />
                    </div>

                    <div>
                        <label className="font-semibold">
                            Cover Image
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                            className="w-full mt-2"
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">

                        <div>

                            <label className="font-semibold">
                                Status
                            </label>

                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                className="w-full mt-2 border rounded-xl p-3"
                            >
                                <option value="draft">
                                    Draft
                                </option>

                                <option value="published">
                                    Published
                                </option>

                            </select>

                        </div>

                        <div className="flex items-end">

                            <label className="flex items-center gap-3">

                                <input
                                    type="checkbox"
                                    name="featured"
                                    checked={form.featured}
                                    onChange={handleChange}
                                />

                                Feature this blog

                            </label>

                        </div>

                    </div>

                    <button
                        disabled={loading}
                        className="bg-[#1B8C86] text-white px-8 py-3 rounded-xl hover:bg-[#166d69]"
                    >
                        {loading ? "Publishing..." : "Publish Blog"}
                    </button>

                </form>

            </div>

        </AdminLayout>
    );
}