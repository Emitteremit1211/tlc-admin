import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    LogOut, Trash2, RefreshCcw, Search, Calendar, Clock, Phone, Mail,
} from 'lucide-react'
import { API_URL, getToken, clearToken } from '../lib/auth'

const STATUS_OPTIONS = ["Pending", "Confirmed", "Cancelled", "Completed"]

const STATUS_STYLES = {
    Pending: "bg-amber-100 text-amber-700",
    Confirmed: "bg-emerald-100 text-emerald-700",
    Cancelled: "bg-red-100 text-red-700",
    Completed: "bg-slate-200 text-slate-600",
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <div className="min-h-screen w-full bg-[#F3F6F7]">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
                .tlca-display { font-family: 'Fraunces', Georgia, serif; }
                .tlca-root { font-family: 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif; }
            `}</style>

            <div className="tlca-root">
                {/* TOP BAR */}
                <header className="bg-[#0D2B3E] text-white">
                    <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
                        <div>
                            <span className="text-[#7FDCD2] text-xs font-bold uppercase tracking-[0.2em]">TLC Assist Living</span>
                            <h1 className="tlca-display text-xl font-semibold">Admin Dashboard</h1>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2.5 rounded-xl text-sm font-semibold transition"
                        >
                            <LogOut className="w-4 h-4" /> Log Out
                        </button>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-6 py-10">

                    {/* STATS */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {[
                            { label: 'Total Bookings', value: counts.Total },
                            { label: 'Pending', value: counts.Pending },
                            { label: 'Confirmed', value: counts.Confirmed },
                            { label: 'Completed', value: counts.Completed },
                        ].map((s) => (
                            <div key={s.label} className="bg-white rounded-2xl p-5 border border-slate-100">
                                <p className="tlca-display text-2xl font-semibold text-[#0D2B3E]">{s.value}</p>
                                <p className="text-slate-500 text-xs mt-1">{s.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* CONTROLS */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name, email, or phone..."
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-[#1B8C86]"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm"
                        >
                            <option value="All">All Statuses</option>
                            {STATUS_OPTIONS.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                        <button
                            onClick={fetchAppointments}
                            className="flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 hover:text-[#0D2B3E] transition"
                        >
                            <RefreshCcw className="w-4 h-4" /> Refresh
                        </button>
                    </div>

                    {/* LIST */}
                    {loading ? (
                        <p className="text-slate-400 text-sm py-10 text-center">Loading appointments...</p>
                    ) : error ? (
                        <p className="text-red-500 text-sm py-10 text-center">{error}</p>
                    ) : filtered.length === 0 ? (
                        <p className="text-slate-400 text-sm py-10 text-center">No appointments match your search.</p>
                    ) : (
                        <div className="space-y-3">
                            {filtered.map((a) => (
                                <div key={a._id} className="bg-white rounded-2xl border border-slate-100 p-5">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <h3 className="font-semibold text-[#0D2B3E]">{a.name}</h3>
                                                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${STATUS_STYLES[a.status]}`}>
                                                    {a.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-500 mt-1">{a.service}</p>

                                            <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3 text-xs text-slate-400">
                                                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {a.email}</span>
                                                <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {a.phone}</span>
                                                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {a.preferredDate}</span>
                                                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {a.preferredTime}</span>
                                            </div>

                                            {a.message && (
                                                <p className="text-xs text-slate-500 mt-3 bg-slate-50 rounded-lg p-3">{a.message}</p>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                            <select
                                                value={a.status}
                                                onChange={(e) => updateStatus(a._id, e.target.value)}
                                                className="text-sm border border-slate-200 rounded-xl px-3 py-2.5"
                                            >
                                                {STATUS_OPTIONS.map((s) => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                            <button
                                                onClick={() => deleteAppointment(a._id)}
                                                className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 transition"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}