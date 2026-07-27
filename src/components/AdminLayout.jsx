import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AdminLayout({ children }) {
    return (
        <div className="flex h-screen overflow-hidden">
            {/* FIXED SIDEBAR */}
            <Sidebar />

            {/* SCROLLABLE CONTENT */}
            <main className="flex-1 ml-72 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}