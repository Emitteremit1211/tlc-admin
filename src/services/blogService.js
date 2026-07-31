import { getToken } from "../lib/auth";

const API = import.meta.env.VITE_API_URL;

export async function getBlogs() {
    const token = getToken();

    const res = await fetch(`${API}/api/blogs/admin/all`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch blogs");
    }

    return await res.json();
}

export async function deleteBlog(id) {
    const token = getToken();

    const res = await fetch(`${API}/api/blogs/admin/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error("Failed to delete blog");
    }

    return await res.json();
}