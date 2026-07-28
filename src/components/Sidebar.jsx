import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    FileText,
    PlusSquare,
} from "lucide-react";

export default function Sidebar() {
    const link =
        "flex items-center gap-3 px-4 py-3 rounded-2xl transition text-sm font-semibold";

    const active =
        "bg-[#1B8C86] text-white shadow-lg";

    const normal =
        "text-white/60 hover:bg-white/10 hover:text-white";

    return (
        <aside className="tlca-glass fixed left-0 top-0 h-screen w-72 flex flex-col z-20 rounded-none">

            <div className="p-8 border-b border-white/10">
                <h1 className="tlca-display text-xl font-semibold text-white">
                    TLC Admin
                </h1>
                <p className="text-xs text-[#7FDCD2] mt-1 uppercase tracking-widest font-semibold">
                    Management Portal
                </p>
            </div>

            <nav className="flex-1 p-5 space-y-2">

                <NavLink
                    to="/"
                    end
                    className={({ isActive }) => `${link} ${isActive ? active : normal}`}
                >
                    <LayoutDashboard size={18} />
                    Dashboard
                </NavLink>

                <NavLink
                    to="/blogs"
                    className={({ isActive }) => `${link} ${isActive ? active : normal}`}
                >
                    <FileText size={18} />
                    Blogs
                </NavLink>

                <NavLink
                    to="/blogs/create"
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
    );
}