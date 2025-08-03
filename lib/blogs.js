import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'

const BLOG_DIR = path.join(process.cwd(), 'content/blogs')

export async function getAllBlogs() {
  const files = await fs.readdir(BLOG_DIR)

  const blogs = await Promise.all(
    files.map(async (filename) => {
      const filePath = path.join(BLOG_DIR, filename)
      const fileContent = await fs.readFile(filePath, 'utf-8')
      const { data, content } = matter(fileContent)

      return {
        ...data,
        slug: data.slug || filename.replace('.md', ''),
        content: content.trim(), 
      }
    })
  )

  return blogs.sort((a, b) => new Date(b.date) - new Date(a.date))
}


export async function getBlogBySlug(slug) {
  const filePath = path.join(BLOG_DIR, `${slug}.md`)
  const fileContent = await fs.readFile(filePath, 'utf-8')

  const { data, content } = matter(fileContent)
  return { meta: data, content }
}
