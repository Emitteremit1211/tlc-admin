const API = import.meta.env.VITE_API_URL;

export async function getBlogs() {

    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/api/blogs`, {

        headers: {

            Authorization: `Bearer ${token}`

        }

    });

    return await res.json();

}

export async function deleteBlog(id) {

    const token = localStorage.getItem("token");

    await fetch(`${API}/api/blogs/${id}`, {

        method: "DELETE",

        headers: {

            Authorization: `Bearer ${token}`

        }

    });

}