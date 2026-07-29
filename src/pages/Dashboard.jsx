import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, Trash2, RefreshCcw, Search, Calendar, Clock, Phone, Mail, AlertCircle, CheckCircle } from 'lucide-react'
import { API_URL, getToken, clearToken } from '../lib/auth'
import AdminLayout from '../components/AdminLayout'

const STATUS_OPTIONS = ["Pending", "Confirmed", "Cancelled", "Completed"]

const STATUS_COLORS = {
    Pending: { bg: 'bg-amber-100', text: 'text-amber-700', icon: 'text-amber-500' },
    Confirmed: { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: 'text-emerald-500' },
    Cancelled: { bg: 'bg-red-100', text: 'text-red-700', icon: 'text-red-500' },
    Completed: { bg: 'bg-blue-100', text: 'text-blue-700', icon: 'text-blue-500' },
}

export default function Dashboard() {
    const navigate = useNavigate()
    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('All')

    const authHeaders = () => ({
        Authorization: `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
    })

    const fetchAppointments = async () => {
        setLoading(true)
        setError('')
        try {
            const res = await fetch(`${API_URL}/api/appointments`, {
                headers: authHeaders(),
            })

            if (res.status === 401) {
                clearToken()
                navigate('/login')
                return
            }

            if (!res.ok) throw new Error('Failed to load appointments')

            const data = await res.json()
            setAppointments(data)
        } catch (err) {
            setError('Could not load appointments. Try refreshing.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAppointments()
    }, [])

    const updateStatus = async (id, status) => {
        try {
            const res = await fetch(`${API_URL}/api/appointments/${id}`, {
                method: 'PATCH',
                headers: authHeaders(),
                body: JSON.stringify({ status }),
            })
            if (!res.ok) throw new Error()
            const updated = await res.json()
            setAppointments((prev) => prev.map((a) => (a._id === id ? updated : a)))
        } catch {
            alert('Failed to update status. Please try again.')
        }
    }

    const deleteAppointment = async (id) => {
        if (!window.confirm('Delete this appointment? This cannot be undone.')) return
        try {
            const res = await fetch(`${API_URL}/api/appointments/${id}`, {
                method: 'DELETE',
                headers: authHeaders(),
            })
            if (!res.ok) throw new Error()
            setAppointments((prev) => prev.filter((a) => a._id !== id))
        } catch {
            alert('Failed to delete appointment. Please try again.')
        }
    }

    const handleLogout = () => {
        clearToken()
        navigate('/login')
    }

    const filtered = appointments.filter((a) => {
        const matchesSearch =
            a.name.toLowerCase().includes(search.toLowerCase()) ||
            a.email.toLowerCase().includes(search.toLowerCase()) ||
            a.phone.includes(search)
        const matchesStatus = statusFilter === 'All' || a.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const counts = {
        Pending: appointments.filter((a) => a.status === 'Pending').length,
        Confirmed: appointments.filter((a) => a.status === 'Confirmed').length,
        Completed: appointments.filter((a) => a.status === 'Completed').length,
        Total: appointments.length,
    }

    return (
        <AdminLayout>

            <div className="w-full min-h-screen relative overflow-hidden bg-gradient-to-b from-[#EAF6F6] via-[#F3FAF9] to-white">

                <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

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

                @keyframes tlc-fade-up {
                    from { opacity: 0; transform: translateY(18px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .tlc-fade-up {
                    animation: tlc-fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
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

                @media (prefers-reduced-motion: reduce) {
                    .tlc-blob, .tlc-fade-up { animation: none; }
                }
            `}</style>

                {/* Ambient blobs */}
                <div className="tlc-blob w-[420px] h-[420px] bg-[#7FDCD2] -top-32 -left-24" />
                <div className="tlc-blob w-[360px] h-[360px] bg-[#FFC9A3] -bottom-28 -right-16" />

                {/* MAIN CONTENT */}
                <main className="tlc-root relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-12">

                    {/* STATS CARDS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {[
                            { label: 'Total Bookings', value: counts.Total, icon: '📋', color: '#1B8C86' },
                            { label: 'Pending', value: counts.Pending, icon: '⏳', color: '#FFC9A3' },
                            { label: 'Confirmed', value: counts.Confirmed, icon: '✓', color: '#7FDCD2' },
                            { label: 'Completed', value: counts.Completed, icon: '✓✓', color: '#0D2B3E' },
                        ].map((s, i) => (
                            <div
                                key={s.label}
                                className="tlc-glass tlc-fade-up rounded-2xl p-6 md:p-8"
                                style={{ animationDelay: `${i * 80}ms` }}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-[#4A5D6B] text-sm font-medium mb-2">{s.label}</p>
                                        <p className="tlc-display text-3xl md:text-4xl font-bold" style={{ color: s.color }}>
                                            {s.value}
                                        </p>
                                    </div>
                                    <span className="text-3xl opacity-20">{s.icon}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* SEARCH & FILTER */}
                    <div className="tlc-glass tlc-fade-up rounded-2xl p-6 mb-10" style={{ animationDelay: '400ms' }}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Search */}
                            <div className="md:col-span-2 relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1B8C86]" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by name, email, or phone..."
                                    className="tlc-input w-full pl-12 py-3 rounded-xl text-sm text-[#0D2B3E] placeholder:text-[#4A5D6B]/50"
                                />
                            </div>

                            {/* Filter */}
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="tlc-input px-4 py-3 rounded-xl text-sm text-[#0D2B3E]"
                            >
                                <option value="All">All Statuses</option>
                                {STATUS_OPTIONS.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>

                        {/* Refresh Button */}
                        <button
                            onClick={fetchAppointments}
                            className="mt-4 flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1B8C86] text-white text-sm font-semibold hover:bg-[#0D2B3E] transition"
                        >
                            <RefreshCcw className="w-4 h-4" /> Refresh
                        </button>
                    </div>

                    {/* ERROR STATE */}
                    {error && (
                        <div className="tlc-fade-up mb-8 flex items-start gap-3 bg-red-50/80 border border-red-200 rounded-2xl p-6" style={{ animationDelay: '500ms' }}>
                            <AlertCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                            <p className="text-red-700">{error}</p>
                        </div>
                    )}

                    {/* LOADING STATE */}
                    {loading && (
                        <div className="tlc-glass rounded-2xl p-12 text-center">
                            <p className="text-[#4A5D6B]">Loading appointments...</p>
                        </div>
                    )}

                    {/* EMPTY STATE */}
                    {!loading && filtered.length === 0 && (
                        <div className="tlc-glass tlc-fade-up rounded-2xl p-12 text-center" style={{ animationDelay: '500ms' }}>
                            <AlertCircle className="w-16 h-16 text-[#7FDCD2] opacity-30 mx-auto mb-4" />
                            <p className="text-[#4A5D6B] text-lg">No appointments match your search.</p>
                        </div>
                    )}

                    {/* APPOINTMENTS GRID */}
                    {!loading && filtered.length > 0 && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {filtered.map((a, index) => (
                                <div
                                    key={a._id}
                                    className="tlc-glass tlc-fade-up rounded-2xl p-6 hover:shadow-lg transition"
                                    style={{ animationDelay: `${500 + index * 50}ms` }}
                                >
                                    {/* Header */}
                                    <div className="flex items-start justify-between gap-4 mb-4 pb-4 border-b border-white/30">
                                        <div className="flex-1">
                                            <h3 className="tlc-display text-lg font-semibold text-[#0D2B3E]">
                                                {a.name}
                                            </h3>
                                            <p className="text-sm text-[#4A5D6B] mt-1">{a.service}</p>
                                        </div>
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${STATUS_COLORS[a.status].bg} ${STATUS_COLORS[a.status].text}`}>
                                            {a.status}
                                        </span>
                                    </div>

                                    {/* Contact Info */}
                                    <div className="space-y-2 mb-5 text-sm text-[#4A5D6B]">
                                        <div className="flex items-center gap-3">
                                            <Mail className="w-4 h-4 text-[#1B8C86]" />
                                            <span>{a.email}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Phone className="w-4 h-4 text-[#1B8C86]" />
                                            <span>{a.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Calendar className="w-4 h-4 text-[#1B8C86]" />
                                            <span>{new Date(a.preferredDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Clock className="w-4 h-4 text-[#1B8C86]" />
                                            <span>{a.preferredTime}</span>
                                        </div>
                                    </div>

                                    {/* Message */}
                                    {a.message && (
                                        <div className="bg-[#0D2B3E]/5 rounded-xl p-3 mb-5">
                                            <p className="text-xs text-[#4A5D6B] line-clamp-2">"{a.message}"</p>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex gap-3 items-center pt-5 border-t border-white/30">
                                        <select
                                            value={a.status}
                                            onChange={(e) => updateStatus(a._id, e.target.value)}
                                            className="tlc-input flex-1 px-3 py-2 rounded-lg text-sm text-[#0D2B3E]"
                                        >
                                            {STATUS_OPTIONS.map((s) => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={() => deleteAppointment(a._id)}
                                            className="p-2.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                </main>
            </div>
        </AdminLayout>
    )
}