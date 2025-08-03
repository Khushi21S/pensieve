import fs from 'fs'
import path from 'path'

export async function POST(req) {
  try {
    const { slug } = await req.json()

    if (!slug) {
      return new Response(JSON.stringify({ success: false, error: 'Slug is required' }), { status: 400 })
    }

    const fileName = `${slug}.md`
    const filePath = path.join(process.cwd(), 'content', 'blogs', fileName)

    if (!fs.existsSync(filePath)) {
      return new Response(JSON.stringify({ success: false, error: 'Blog not found' }), { status: 404 })
    }

    fs.unlinkSync(filePath)

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (error) {
    console.error('Error deleting blog:', error)
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 })
  }
}
