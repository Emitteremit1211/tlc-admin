import { NavLink } from "react-router-dom";
import { LayoutDashboard, FileText, PlusSquare, X } from "lucide-react";

export default function Sidebar({ isOpen, onClose }) {
    const link =
        "flex items-center gap-3 px-4 py-3 rounded-2xl transition text-sm font-semibold";

    const active =
        "bg-[#1B8C86] text-white shadow-lg";

    const normal =
        "text-white/60 hover:bg-white/10 hover:text-white";

    return (
        <>
            {/* BACKDROP — mobile only, tap to close */}
            <div
                onClick={onClose}
                className={`fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity duration-300 ${
                    isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
            />

            {/* SIDEBAR — off-canvas drawer on mobile, fixed on desktop */}
            <aside
                className={`tlca-glass fixed left-0 top-0 h-screen w-72 flex flex-col z-40 rounded-none
                    transition-transform duration-300 ease-out
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                    md:translate-x-0
                `}
            >
                <div className="p-8 border-b border-white/10 flex items-start justify-between">
                    <div>
                        <h1 className="tlca-display text-xl font-semibold text-white">
                            TLC Admin
                        </h1>
                        <p className="text-xs text-[#7FDCD2] mt-1 uppercase tracking-widest font-semibold">
                            Management Portal
                        </p>
                    </div>

                    {/* close button — mobile only */}
                    <button
                        onClick={onClose}
                        className="md:hidden text-white/50 hover:text-white transition p-1"
                    >
                        <X size={22} />
                    </button>
                </div>

                <nav className="flex-1 p-5 space-y-2">

                    <NavLink
                        to="/"
                        end
                        onClick={onClose}
                        className={({ isActive }) => `${link} ${isActive ? active : normal}`}
                    >
                        <LayoutDashboard size={18} />
                        Dashboard
                    </NavLink>

                    <NavLink
                        to="/blogs"
                        onClick={onClose}
                        className={({ isActive }) => `${link} ${isActive ? active : normal}`}
                    >
                        <FileText size={18} />
                        Blogs
                    </NavLink>

                    <NavLink
                        to="/blogs/create"
                        onClick={onClose}
                        className={({ isActive }) => `${link} ${isActive ? active : normal}`}
                    >
                        <PlusSquare size={18} />
                        Create Blog
                    </NavLink>

                </nav>

                <div className="p-5 border-t border-white/10">
                    <p className="text-white/30 text-xs text-center">
                        TLC Assist Living © {new Date().getFullYear()}
                    </p>
                </div>
            </aside>
        </>
    );
}