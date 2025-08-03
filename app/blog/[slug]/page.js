import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const dynamicParams = true

export async function generateStaticParams() {
  const blogDir = path.join(process.cwd(), 'content/blogs')
  const files = fs.readdirSync(blogDir)

  return files.map((file) => ({
    slug: file.replace('.md', ''),
  }))
}

async function getBlogContent(slug) {
  const filePath = path.join(process.cwd(), 'content/blogs', `${slug}.md`)

  if (!fs.existsSync(filePath)) {
    notFound()
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(fileContent)
  const processedContent = await remark().use(html).process(content)
  const contentHtml = processedContent.toString()

  return {
    title: data.title,
    author: data.author || 'Unknown',
    date: data.date,
    tags: data.tags,
    image: data.image || null,
    contentHtml,
    slug,
  }
}

export async function generateMetadata({ params }) {
  const slug = params.slug
  const blog = await getBlogContent(slug)

  return {
    title: blog.title,
    description: blog.contentHtml.replace(/<[^>]+>/g, '').slice(0, 150),
    openGraph: {
      title: blog.title,
      description: blog.contentHtml.replace(/<[^>]+>/g, '').slice(0, 150),
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/blog/${slug}`,
      type: 'article',
      images: [
        {
          url: blog.image || '/og-image.png',
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.contentHtml.replace(/<[^>]+>/g, '').slice(0, 150),
      images: [blog.image || '/og-image.png'],
    },
  }
}

export default async function BlogPage({ params }) {
  const { slug } = params
  const blog = await getBlogContent(slug)
  const fullUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/blog/${blog.slug}`

  const tagList = Array.isArray(blog.tags) ? blog.tags : blog.tags?.split(',')

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-white">
      {/* Top Bar with Back and Share */}
      <div className="flex justify-between items-center mb-6">
        <Link
          href="/blog"
          className="text-sm text-green-400 hover:underline hover:text-green-300"
        >
          ← Back to All Blogs
        </Link>

        {/* <button
          className="text-sm text-gray-400 hover:text-white"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(fullUrl)
              alert('Blog link copied to clipboard!')
            } catch (e) {
              alert('Failed to copy link.')
            }
          }}
        >
          🔗 Share
        </button> */}
      </div>

      {/* Blog Title */}
      <h1 className="text-3xl font-bold mb-2 text-white">{blog.title}</h1>

      {/* Author and Date */}
      <p className="text-sm text-gray-400 mb-4">
        By <span className="text-green-300">{blog.author}</span> on{' '}
        {new Date(blog.date).toDateString()}
      </p>

      {/* Tags */}
      {tagList?.length > 0 && (
        <div className="mb-6 text-sm text-green-400">
          {tagList.map((tag) => (
            <span key={tag.trim()} className="mr-2">#{tag.trim()}</span>
          ))}
        </div>
      )}

      {/* Image */}
      {blog.image && (
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full max-w-3xl mx-auto rounded-lg object-cover mb-8"
          style={{ maxHeight: '400px' }}
        />
      )}

      {/* Content */}
      <article
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: blog.contentHtml }}
      />
    </div>
  )
}
