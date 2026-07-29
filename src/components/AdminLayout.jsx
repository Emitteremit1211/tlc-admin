import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AdminLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="tlca-root flex h-screen overflow-hidden relative bg-gradient-to-br from-[#0D2B3E] via-[#0F3550] to-[#081C29]">

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

                .tlca-root { font-family: 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif; }
                .tlca-display { font-family: 'Fraunces', Georgia, serif; }

                .tlca-blob {
                    position: absolute;
                    border-radius: 9999px;
                    filter: blur(90px);
                    opacity: 0.3;
                    pointer-events: none;
                }

                .tlca-glass {
                    background: rgba(255,255,255,0.06);
                    backdrop-filter: blur(22px) saturate(160%);
                    -webkit-backdrop-filter: blur(22px) saturate(160%);
                    border: 1px solid rgba(255,255,255,0.12);
                    box-shadow: 0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.06);
                }

                .tlca-glass-light {
                    background: rgba(255,255,255,0.9);
                    backdrop-filter: blur(20px) saturate(160%);
                    -webkit-backdrop-filter: blur(20px) saturate(160%);
                    border: 1px solid rgba(13,43,62,0.06);
                    box-shadow: 0 8px 24px rgba(15,42,61,0.06);
                }

                @media (prefers-reduced-motion: reduce) {
                    .tlca-blob { animation: none; }
                }
            `}</style>

            {/* ambient background blobs */}
            <div className="tlca-blob w-[420px] h-[420px] bg-[#1B8C86] -top-32 -left-24" />
            <div className="tlca-blob w-[360px] h-[360px] bg-[#FFC9A3] bottom-0 right-0" />

            {/* SIDEBAR (off-canvas on mobile, fixed on desktop) */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* SCROLLABLE CONTENT */}
            <div className="flex-1 md:ml-72 flex flex-col relative z-10 overflow-hidden">
                <Topbar onMenuClick={() => setSidebarOpen(true)} />
                <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#F3F6F7] ">
                    {children}
                </main>
            </div>
        </div>
    );
}