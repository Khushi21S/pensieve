'use client'
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2'
import { useRouter } from "next/navigation";


export default function BlogsListPage() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch('/api/blogs')
        const data = await res.json()
        if (res.status == 200) {
          setBlogs(data.blogs)
        }
      } catch (err) {
        console.error('Failed to fetch blogs:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [])

const handleDelete = async (slug) => {
  const confirmResult = await Swal.fire({
    title: `Delete "${slug}"?`,
    text: 'This action cannot be undone!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
  })

  if (!confirmResult.isConfirmed) return

  Swal.fire({
    title: 'Deleting...',
    text: 'Please wait while the blog is being deleted.',
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading()
    },
  })

  try {
    const res = await fetch('/api/delete-blog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    })

    const result = await res.json()

    if (result.success) {
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Blog has been deleted.',
      }).then(() => {
        window.location.reload()
      })
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Delete Failed',
        text: result.error,
      })
    }
  } catch (err) {
    console.error('Error deleting blog:', err)
    Swal.fire({
      icon: 'error',
      title: 'Something went wrong',
      text: 'Could not delete the blog.',
    })
  }
}


  return (
    <div className="p-6 max-w-6xl mx-auto">
     <div className="flex gap-10 align-center">
      <h1 className="text-2xl font-bold text-left">List of All Blogs</h1>
      <div className="text-right mr-40">
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer"
          onClick={()=>  router.push("/admin/create")}
        >
          Create a Blog
        </button>
      </div>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : blogs.length === 0 ? (
        <p>No blogs found.</p>
      ) : (
        <div className="overflow-x-auto border rounded shadow mt-10">
          <table className="min-w-full text-sm table-auto">
            <thead className=" text-left">
              <tr>
                <th className="px-4 py-2">S.No</th>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Slug</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Author</th>
                <th className="px-4 py-2">Tags</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog, idx) => (
                <tr key={idx} className="border-t">
                  
                  <td className="px-4 py-2">{idx + 1}</td>
                  <td className="px-4 py-2">{blog.title}</td>
                  <td className="px-4 py-2">{blog.slug}</td>
                  <td className="px-4 py-2">{blog.date}</td>
                  <td className="px-4 py-2">{blog.author || "-"}</td>
                  <td className="px-4 py-2">{blog.tags?.join(', ')}</td>
                  <td className="px-4 py-2">
                    <button className="bg-green-600 text-white px-2 py-1 rounded cursor-pointer text-sm" onClick={() => handleDelete(blog.slug)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
