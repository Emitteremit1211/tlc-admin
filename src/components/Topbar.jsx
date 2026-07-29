import { LogOut, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { clearToken } from "../lib/auth";

export default function Topbar({ onMenuClick }) {

    const navigate = useNavigate();

    function logout() {
        clearToken();
        navigate("/login");
    }

    return (

        <header className="tlca-glass h-20 flex items-center justify-between px-4 md:px-8 rounded-none border-t-0 border-l-0 border-r-0 relative z-10">

            <div className="flex items-center gap-3">
                {/* hamburger — mobile only */}
                <button
                    onClick={onMenuClick}
                    className="md:hidden text-white p-2 -ml-2 hover:bg-white/10 rounded-xl transition"
                >
                    <Menu size={22} />
                </button>

                <div>
                    <h2 className="tlca-display text-lg md:text-xl font-semibold text-white">
                        TLC Assist Living
                    </h2>
                    <p className="text-xs text-white/50 mt-0.5 hidden sm:block">
                        Admin Dashboard
                    </p>
                </div>
            </div>

            <button
                onClick={logout}
                className="flex items-center gap-2 bg-[#1B8C86] hover:bg-[#166d69] text-white px-3 md:px-5 py-2.5 rounded-xl text-sm font-semibold transition"
            >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
            </button>

        </header>

    );
}