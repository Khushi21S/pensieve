import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export async function GET() {
  try {
    const blogDir = path.join(process.cwd(), 'content/blogs')

    if (!fs.existsSync(blogDir)) {
      return new Response(JSON.stringify({ blogs: [] }), { status: 200 })
    }

    const files = fs.readdirSync(blogDir)

    const blogs = files
      .filter(file => file.endsWith('.md'))
      .map(file => {
        const content = fs.readFileSync(path.join(blogDir, file), 'utf-8')
        const { data } = matter(content)
        return {
          title: data.title || '',
          date: data.date || '',
          tags: data.tags || [],
          author: data.author || '',
          image: data.image || '',
          slug: file.replace(/\.md$/, ''),
        }
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date))

    return new Response(JSON.stringify({ blogs }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error reading blogs:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to load blogs.' }),
      { status: 500 }
    )
  }
}
