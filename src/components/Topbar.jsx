import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { clearToken } from "../lib/auth";

export default function Topbar() {

    const navigate = useNavigate();

    function logout() {
        clearToken();
        navigate("/login");
    }

    return (

        <header className="h-20 bg-[#0D2B3E] flex items-center justify-between px-8 text-white">

            <div>

                <h2 className="text-2xl font-bold">
                    TLC Assist Living
                </h2>

                <p className="text-sm text-white/70">
                    Admin Dashboard
                </p>

            </div>

            <button
                onClick={logout}
                className="flex items-center gap-2 bg-[#1B8C86] px-5 py-3 rounded-xl hover:bg-[#166d69]"
            >
                <LogOut size={18} />
                Logout
            </button>

        </header>

    );
}