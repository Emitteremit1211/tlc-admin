import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Upload, CheckCircle2, AlertCircle, Loader } from 'lucide-react'
import AdminLayout from '../components/AdminLayout'
import { API_URL, getToken } from '../lib/auth'

const EditBlog = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState('idle') // idle | saving | saved | error
  const [errorMsg, setErrorMsg] = useState('')
  const [imagePreview, setImagePreview] = useState(null)

  const [form, setForm] = useState({
    title: '',
    slug: '',
    category: '',
    tags: '',
    featured: false,
    content: '',
    coverImage: null,
    status: 'draft',
  })

  const categories = [
    'Staffing Tips',
    'Healthcare Updates',
    'Caregiver Stories',
    'Senior Wellness',
    'Industry News',
    'Care Guides',
  ]

  // Fetch blog by ID
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const token = getToken()
        if (!token) {
          navigate('/admin/login')
          return
        }

        const response = await fetch(`${API_URL}/blogs/admin/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch blog')

        const data = await response.json()
        setBlog(data)
        setForm({
          title: data.title || '',
          slug: data.slug || '',
          category: data.category || '',
          tags: data.tags?.join(', ') || '',
          featured: data.featured || false,
          content: data.content || '',
          coverImage: null,
          status: data.status || 'draft',
        })
        setImagePreview(data.coverImage)
      } catch (err) {
        console.error('Error fetching blog:', err)
        setErrorMsg('Could not load blog. Make sure the backend has the admin route.')
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchBlog()
  }, [id, navigate])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setForm(prev => ({ ...prev, coverImage: file }))
      const reader = new FileReader()
      reader.onload = (evt) => setImagePreview(evt.target?.result)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('saving')
    setSubmitting(true)

    try {
      const token = getToken()
      const formData = new FormData()

      formData.append('title', form.title)
      formData.append('slug', form.slug || form.title.toLowerCase().replace(/\s+/g, '-'))
      formData.append('category', form.category)
      formData.append('tags', form.tags)  // ✅ FIXED: Send tags as comma-separated string
      formData.append('featured', form.featured)
      formData.append('content', form.content)
      formData.append('status', form.status)
      if (form.coverImage instanceof File) {
        formData.append('coverImage', form.coverImage)
      }

      const response = await fetch(`${API_URL}/blogs/admin/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to update blog')

      const updated = await response.json()
      setBlog(updated)
      setStatus('saved')
      setTimeout(() => navigate('/blogs'), 1500)
    } catch (err) {
      console.error('Error updating blog:', err)
      setErrorMsg(err.message)
      setStatus('error')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <Loader className="w-8 h-8 text-[#1B8C86] animate-spin" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .tlc-root { font-family: 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif; }
        .tlc-display { font-family: 'Fraunces', Georgia, serif; }

        .tlc-blob {
          position: absolute;
          border-radius: 9999px;
          filter: blur(70px);
          opacity: 0.5;
          animation: tlc-drift 16s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes tlc-drift {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50%      { transform: translate(25px, -30px) scale(1.08); }
        }

        .tlc-glass {
          background: rgba(255,255,255,0.5);
          backdrop-filter: blur(22px) saturate(160%);
          -webkit-backdrop-filter: blur(22px) saturate(160%);
          border: 1px solid rgba(255,255,255,0.65);
          box-shadow: 0 8px 32px rgba(15,42,61,0.14), inset 0 1px 0 rgba(255,255,255,0.6);
        }
        .tlc-glass-dark {
          background: rgba(13,43,62,0.55);
          backdrop-filter: blur(22px) saturate(160%);
          -webkit-backdrop-filter: blur(22px) saturate(160%);
          border: 1px solid rgba(255,255,255,0.14);
          box-shadow: 0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.08);
        }
        .tlc-sheen::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(120deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 30%);
          pointer-events: none;
        }
        .tlc-input {
          background: rgba(255,255,255,0.6);
          border: 1px solid rgba(13,43,62,0.12);
        }
        .tlc-input:focus {
          outline: none;
          border-color: #1B8C86;
          box-shadow: 0 0 0 3px rgba(27,140,134,0.15);
        }

        @keyframes tlc-fade-up {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .tlc-fade-up {
          animation: tlc-fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @media (prefers-reduced-motion: reduce) {
          .tlc-blob { animation: none; }
          .tlc-fade-up { animation: none; }
        }
      `}</style>

      <div className="tlc-root w-full relative overflow-hidden bg-gradient-to-b from-[#EAF6F6] via-[#F3FAF9] to-white min-h-screen">

        {/* Ambient blobs */}
        <div className="tlc-blob w-[420px] h-[420px] bg-[#7FDCD2] top-[-120px] left-[-100px]" />
        <div className="tlc-blob w-[380px] h-[380px] bg-[#FFC9A3] top-[600px] right-[-120px]" />

        <div className="max-w-4xl mx-auto px-6 py-12 relative z-10">

          {/* Header */}
          <div className="mb-10">
            <button
              onClick={() => navigate('/blogs')}
              className="inline-flex items-center gap-2 text-[#1B8C86] hover:text-[#0D2B3E] transition mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blogs
            </button>
            <h1 className="tlc-display text-4xl font-semibold text-[#0D2B3E]">
              Edit Blog Post
            </h1>
            <p className="mt-2 text-[#4A5D6B]">
              Update the content and settings for this article.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Success / Error alerts */}
            {status === 'saved' && (
              <div className="tlc-glass-dark rounded-2xl p-6 flex items-start gap-3 mb-6">
                <CheckCircle2 className="w-6 h-6 text-green-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Blog updated successfully!</p>
                  <p className="text-gray-300 text-sm mt-1">Redirecting to blogs list...</p>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="tlc-glass rounded-2xl p-6 flex items-start gap-3 mb-6 border border-red-300">
                <AlertCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-700">Error saving blog</p>
                  <p className="text-red-600 text-sm mt-1">{errorMsg}</p>
                </div>
              </div>
            )}

            {/* Image Upload */}
            <div className="tlc-glass rounded-3xl p-8 tlc-sheen overflow-hidden">
              <label className="text-xs font-bold text-[#1B8C86] uppercase tracking-[0.2em] block mb-4">
                Cover Image
              </label>
              <div className="flex gap-6 flex-col md:flex-row">
                <div className="flex-1">
                  <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-[#1B8C86]/30 rounded-2xl cursor-pointer hover:border-[#1B8C86]/60 transition bg-[#1B8C86]/5">
                    <div className="flex flex-col items-center justify-center">
                      <Upload className="w-6 h-6 text-[#1B8C86]" />
                      <span className="text-sm text-[#0D2B3E] font-medium mt-2">Click to upload</span>
                      <span className="text-xs text-[#4A5D6B]">PNG, JPG up to 5MB</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
                {imagePreview && (
                  <div className="md:w-32 md:h-32 rounded-2xl overflow-hidden border border-[#1B8C86]/20">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Title & Slug */}
            <div className="tlc-glass rounded-3xl p-8 tlc-sheen overflow-hidden space-y-5">
              <div>
                <label className="text-xs font-bold text-[#1B8C86] uppercase tracking-[0.2em] block mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={form.title}
                  onChange={handleChange}
                  placeholder="E.g., Finding the Right Home Care Provider"
                  className="tlc-input w-full rounded-xl px-4 py-3 text-sm text-[#0D2B3E] placeholder:text-[#4A5D6B]/50"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#1B8C86] uppercase tracking-[0.2em] block mb-2">
                  URL Slug
                </label>
                <input
                  type="text"
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  placeholder="finding-the-right-home-care-provider"
                  className="tlc-input w-full rounded-xl px-4 py-3 text-sm text-[#0D2B3E] placeholder:text-[#4A5D6B]/50"
                />
                <p className="text-xs text-[#4A5D6B] mt-2">Auto-generated from title if left blank</p>
              </div>
            </div>

            {/* Category & Tags */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="tlc-glass rounded-3xl p-8 tlc-sheen overflow-hidden">
                <label className="text-xs font-bold text-[#1B8C86] uppercase tracking-[0.2em] block mb-2">
                  Category
                </label>
                <select
                  name="category"
                  required
                  value={form.category}
                  onChange={handleChange}
                  className="tlc-input w-full rounded-xl px-4 py-3 text-sm text-[#0D2B3E]"
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="tlc-glass rounded-3xl p-8 tlc-sheen overflow-hidden">
                <label className="text-xs font-bold text-[#1B8C86] uppercase tracking-[0.2em] block mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  value={form.tags}
                  onChange={handleChange}
                  placeholder="e.g., caregiving, health, tips"
                  className="tlc-input w-full rounded-xl px-4 py-3 text-sm text-[#0D2B3E] placeholder:text-[#4A5D6B]/50"
                />
                <p className="text-xs text-[#4A5D6B] mt-2">Comma-separated</p>
              </div>
            </div>

            {/* Content */}
            <div className="tlc-glass rounded-3xl p-8 tlc-sheen overflow-hidden">
              <label className="text-xs font-bold text-[#1B8C86] uppercase tracking-[0.2em] block mb-2">
                Content
              </label>
              <textarea
                name="content"
                required
                rows={12}
                value={form.content}
                onChange={handleChange}
                placeholder="Write your blog post here... Markdown is supported."
                className="tlc-input w-full rounded-xl px-4 py-3 text-sm text-[#0D2B3E] placeholder:text-[#4A5D6B]/50 resize-none"
              />
            </div>

            {/* Status & Featured */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="tlc-glass rounded-3xl p-8 tlc-sheen overflow-hidden">
                <label className="text-xs font-bold text-[#1B8C86] uppercase tracking-[0.2em] block mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="tlc-input w-full rounded-xl px-4 py-3 text-sm text-[#0D2B3E]"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div className="tlc-glass rounded-3xl p-8 tlc-sheen overflow-hidden flex items-center">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={form.featured}
                    onChange={handleChange}
                    className="w-5 h-5 rounded-lg border-2 border-[#1B8C86] checked:bg-[#1B8C86] cursor-pointer"
                  />
                  <span className="text-sm font-semibold text-[#0D2B3E]">
                    Feature on homepage
                  </span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={submitting || status === 'saved'}
                className="flex-1 bg-[#0D2B3E] text-white px-8 py-4 rounded-2xl font-semibold hover:bg-[#1B8C86] transition disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/blogs')}
                className="tlc-glass text-[#0D2B3E] px-8 py-4 rounded-2xl font-semibold hover:bg-white/70 transition"
              >
                Cancel
              </button>
            </div>

          </form>

        </div>

      </div>
    </AdminLayout>
  )
}

export default EditBlog