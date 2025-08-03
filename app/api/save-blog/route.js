import { writeFile } from 'fs/promises'
import path from 'path'
import fs from 'fs'

export async function POST(req) {
  try {
    const body = await req.json()
    const { title, slug, date, tags, author, image, content } = body

    // Basic required field check
    if (!title || !slug || !date || !content) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Title, slug, date, and content are required.',
      }), { status: 400 })
    }

    // ✅ Slug validation: lowercase only, no spaces, only dashes allowed
    const slugRegex = /^[a-z0-9\-]+$/
    if (!slugRegex.test(slug)) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Slug must contain only lowercase letters, numbers, and hyphens (no spaces or uppercase).',
      }), { status: 400 })
    }

    // ✅ Uniqueness check: ensure slug doesn't already exist
    const filePath = path.join(process.cwd(), 'content', 'blogs', `${slug}.md`)
    if (fs.existsSync(filePath)) {
      return new Response(JSON.stringify({
        success: false,
        error: 'A blog with this slug already exists. Please choose a unique slug.',
      }), { status: 400 })
    }

    // ✅ Image validation: must be a valid URL
    try {
      new URL(image)
    } catch {
      return new Response(JSON.stringify({
        success: false,
        error: 'Image must be a valid URL.',
      }), { status: 400 })
    }

    // ✅ Tag formatting
    const formattedTags = tags
      ? tags.split(',').map(tag => `"${tag.trim()}"`).join(', ')
      : ''

    // ✅ Prepare frontmatter
    const frontmatter = [
      '---',
      `title: "${title}"`,
      `slug: "${slug}"`,
      `date: "${date}"`,
      `tags: [${formattedTags}]`,
      `author: "${author || 'Anonymous'}"`,
      `image: "${image}"`,
      '---',
      '',
    ].join('\n')

    const markdown = `${frontmatter}${content}`

    await writeFile(filePath, markdown)

    return new Response(JSON.stringify({ success: true, fileName: `${slug}.md` }), { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
    })
  }
}
