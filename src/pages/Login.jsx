import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Mail, AlertCircle } from 'lucide-react'
import { API_URL, setToken } from '../lib/auth'

export default function Login() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const res = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Login failed')
            }

            setToken(data.token)
            navigate('/')
        } catch (err) {
            setError(err.message || 'Invalid email or password.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-[#0D2B3E] to-[#081C29] px-6">

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
                .tlca-display { font-family: 'Fraunces', Georgia, serif; }
                .tlca-root { font-family: 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif; }

                .tlca-blob {
                    position: absolute;
                    border-radius: 9999px;
                    filter: blur(90px);
                    opacity: 0.35;
                    animation: tlca-drift 12s ease-in-out infinite;
                }
                @keyframes tlca-drift {
                    0%, 100% { transform: translate(0,0) scale(1); }
                    50% { transform: translate(20px,-20px) scale(1.08); }
                }
                .tlca-glass {
                    background: rgba(255,255,255,0.06);
                    backdrop-filter: blur(22px) saturate(160%);
                    -webkit-backdrop-filter: blur(22px) saturate(160%);
                    border: 1px solid rgba(255,255,255,0.14);
                    box-shadow: 0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08);
                }
                .tlca-input {
                    background: rgba(255,255,255,0.06);
                    border: 1px solid rgba(255,255,255,0.14);
                    color: white;
                }
                .tlca-input:focus {
                    outline: none;
                    border-color: #1B8C86;
                    box-shadow: 0 0 0 3px rgba(27,140,134,0.25);
                }
                .tlca-input::placeholder { color: rgba(255,255,255,0.35); }

                @media (prefers-reduced-motion: reduce) {
                    .tlca-blob { animation: none; }
                }
            `}</style>

            <div className="tlca-blob w-[380px] h-[380px] bg-[#1B8C86] -top-24 -left-24" />
            <div className="tlca-blob w-[320px] h-[320px] bg-[#FFC9A3] -bottom-28 -right-16" />

            <div className="tlca-root tlca-glass relative z-10 w-full max-w-md rounded-3xl p-10">
                <div className="text-center mb-8">
                    <span className="text-[#7FDCD2] text-xs font-bold uppercase tracking-[0.2em]">TLC Assist Living</span>
                    <h1 className="tlca-display mt-3 text-2xl font-semibold text-white">Admin Sign In</h1>
                    <p className="mt-2 text-white/50 text-sm">Manage appointments and bookings</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="text-xs font-semibold text-white/70 mb-1.5 flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5" /> Email
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@tlcassistliving.com"
                            className="tlca-input w-full px-4 py-3 rounded-xl text-sm"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-white/70 mb-1.5 flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5" /> Password
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="tlca-input w-full px-4 py-3 rounded-xl text-sm"
                        />
                    </div>

                    {error && (
                        <div className="flex items-start gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            <p>{error}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#1B8C86] text-white py-3.5 rounded-xl font-semibold hover:bg-[#166f6a] transition disabled:opacity-60"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    )
}