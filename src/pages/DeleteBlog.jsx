import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Loader, AlertCircle, CheckCircle2, Trash2 } from 'lucide-react'
import AdminLayout from '../components/AdminLayout'
import { API_URL, getToken } from '../lib/auth'

const DeleteBlog = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [status, setStatus] = useState('idle') // idle | deleting | deleted | error
  const [errorMsg, setErrorMsg] = useState('')
  const [showConfirmation, setShowConfirmation] = useState(false)

  // Fetch blog details
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const token = getToken()
        if (!token) {
          navigate('/admin/login')
          return
        }

        const response = await fetch(`${API_URL}/api/blogs/admin/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) throw new Error('Failed to fetch blog')

        const data = await response.json()
        setBlog(data)
      } catch (err) {
        console.error('Error fetching blog:', err)
        setErrorMsg('Could not load blog details.')
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchBlog()
  }, [id, navigate])

  const handleDelete = async () => {
    setStatus('deleting')
    setDeleting(true)

    try {
      const token = getToken()

      const response = await fetch(`${API_URL}/api/blogs/admin/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error('Failed to delete blog')

      setStatus('deleted')
      setTimeout(() => navigate('/blogs'), 1500)
    } catch (err) {
      console.error('Error deleting blog:', err)
      setErrorMsg(err.message || 'Could not delete blog')
      setStatus('error')
    } finally {
      setDeleting(false)
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

        <div className="max-w-2xl mx-auto px-6 py-12 relative z-10">

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
              Delete Blog Post
            </h1>
            <p className="mt-2 text-[#4A5D6B]">
              This action cannot be undone.
            </p>
          </div>

          {/* Success Alert */}
          {status === 'deleted' && (
            <div className="tlc-glass-dark rounded-2xl p-6 flex items-start gap-3 mb-6">
              <CheckCircle2 className="w-6 h-6 text-green-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Blog deleted successfully!</p>
                <p className="text-gray-300 text-sm mt-1">Redirecting to blogs list...</p>
              </div>
            </div>
          )}

          {/* Error Alert */}
          {status === 'error' && (
            <div className="tlc-glass rounded-2xl p-6 flex items-start gap-3 mb-6 border border-red-300">
              <AlertCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-700">Error deleting blog</p>
                <p className="text-red-600 text-sm mt-1">{errorMsg}</p>
              </div>
            </div>
          )}

          {/* Blog Info Card */}
          {blog && !showConfirmation && (
            <div className="tlc-glass rounded-3xl p-8 tlc-sheen overflow-hidden mb-6 space-y-4">
              <div>
                <p className="text-xs font-bold text-[#1B8C86] uppercase tracking-[0.2em] block mb-2">
                  Blog Title
                </p>
                <p className="text-lg font-semibold text-[#0D2B3E]">{blog.title}</p>
              </div>

              <div>
                <p className="text-xs font-bold text-[#1B8C86] uppercase tracking-[0.2em] block mb-2">
                  Category
                </p>
                <p className="text-sm text-[#4A5D6B]">{blog.category || 'N/A'}</p>
              </div>

              <div>
                <p className="text-xs font-bold text-[#1B8C86] uppercase tracking-[0.2em] block mb-2">
                  Status
                </p>
                <p className="text-sm text-[#4A5D6B] capitalize">{blog.status || 'Draft'}</p>
              </div>

              {blog.coverImage && (
                <div>
                  <p className="text-xs font-bold text-[#1B8C86] uppercase tracking-[0.2em] block mb-2">
                    Cover Image
                  </p>
                  <img
                    src={blog.coverImage}
                    alt={blog.title}
                    className="w-full h-48 object-cover rounded-2xl"
                  />
                </div>
              )}
            </div>
          )}

          {/* Confirmation Dialog */}
          {showConfirmation && (
            <div className="tlc-glass-dark rounded-3xl p-8 tlc-sheen overflow-hidden mb-6 border border-red-400">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-red-400 shrink-0" />
                <h2 className="text-xl font-semibold text-white">Are you sure?</h2>
              </div>
              <p className="text-gray-300 mb-6">
                You are about to permanently delete <strong>"{blog?.title}"</strong>. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 bg-red-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-red-700 transition disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                >
                  {deleting ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Yes, Delete
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowConfirmation(false)}
                  disabled={deleting}
                  className="flex-1 tlc-glass text-[#0D2B3E] px-6 py-3 rounded-2xl font-semibold hover:bg-white/70 transition disabled:opacity-60"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {!showConfirmation && status !== 'deleted' && (
            <div className="flex gap-4">
              <button
                onClick={() => setShowConfirmation(true)}
                disabled={deleting || status === 'deleted'}
                className="flex-1 bg-red-600 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-red-700 transition disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Blog
              </button>
              <button
                onClick={() => navigate('/blogs')}
                className="flex-1 tlc-glass text-[#0D2B3E] px-8 py-4 rounded-2xl font-semibold hover:bg-white/70 transition"
              >
                Cancel
              </button>
            </div>
          )}

        </div>

      </div>
    </AdminLayout>
  )
}

export default DeleteBlog