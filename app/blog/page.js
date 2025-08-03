import { getAllBlogs } from '@/lib/blogs'
import BlogCard from "./../components/BlogCard"

export const metadata = {
  title: 'Pensieve Blog',
  description: 'Explore insightful blogs on technology, development, and more.',
  openGraph: {
    title: 'Pensieve Blog',
    description: 'Explore insightful blogs on technology, development, and more.',
    url: '/blog',
    siteName: 'Pensieve',
    images: [
      {
        url: '/og-image.png', // customize if needed
        width: 1200,
        height: 630,
        alt: 'Pensieve Blog',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

export default async function BlogPage() {
  const blogs = await getAllBlogs();
  console.log(blogs);
  

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Pensieve Blog</h1>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {blogs.map(blog => (
          <BlogCard key={blog.slug} blog={blog} />
        ))}
      </div>
    </div>
  )
}
