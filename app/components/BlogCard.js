'use client'

import Link from 'next/link'
import ReactMarkdown from 'react-markdown'

export default function BlogCard({ blog }) {
  return (
    <div className="border border-gray-700 rounded-lg shadow-md hover:shadow-xl hover:scale-[1.02] transform transition duration-200 p-4 bg-neutral-900 text-white cursor-pointer">
      <Link href={`/blog/${blog.slug}`} className="block">
        {blog.image && (
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-48 object-cover rounded mb-3"
          />
        )}

        <h2 className="text-xl font-semibold text-green-400 mb-1">{blog.title}</h2>

        <p className="text-sm text-gray-400 mb-2">
          {new Date(blog.date).toDateString()} &middot; {blog.author}
        </p>

        <div className="text-sm text-gray-300 line-clamp-4 prose prose-invert prose-sm max-w-none">
          <ReactMarkdown>{blog.content.slice(0, 250) + '...'}</ReactMarkdown>
        </div>
      </Link>

      <div className="mt-4 text-left">
        <Link
          href={`/blog/${blog.slug}`}
          className="text-sm text-green-400 hover:text-green-300 underline"
        >
          Read More →
        </Link>
      </div>
    </div>
  )
}
