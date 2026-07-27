import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    FileText,
    PlusSquare,
} from "lucide-react";

export default function Sidebar() {
    const link =
        "flex items-center gap-3 px-4 py-3 rounded-xl transition";

    const active =
        "bg-[#1B8C86] text-white";

    const normal =
        "text-slate-600 hover:bg-slate-100";

    return (
        <aside className="w-72 bg-white border-r border-slate-200 flex flex-col">

            <div className="p-8 border-b">

                <h1 className="text-2xl font-bold text-[#0D2B3E]">
                    TLC Admin
                </h1>

                <p className="text-sm text-slate-500">
                    Management Portal
                </p>

            </div>

            <nav className="flex-1 p-5 space-y-2">

                <NavLink
                    to="/"
                    end
                    className={({ isActive }) =>
                        `${link} ${isActive ? active : normal}`
                    }
                >
                    <LayoutDashboard size={20} />
                    Dashboard
                </NavLink>

                <NavLink
                    to="/blogs"
                    className={({ isActive }) =>
                        `${link} ${isActive ? active : normal}`
                    }
                >
                    <FileText size={20} />
                    Blogs
                </NavLink>

                <NavLink
                    to="/blogs/create"
                    className={({ isActive }) =>
                        `${link} ${isActive ? active : normal}`
                    }
                >
                    <PlusSquare size={20} />
                    Create Blog
                </NavLink>

            </nav>
        </aside>
    );
}