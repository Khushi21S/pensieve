export function generateBlogSchema(blog, baseUrl = 'https://pensieve-here.vercel.app') {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "image": blog.image || `${baseUrl}/og-image.png`,
    "author": {
      "@type": "Person",
      "name": blog.author || "Unknown"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Pensieve",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/og-image.png`
      }
    },
    "datePublished": blog.date,
    "dateModified": blog.date,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${baseUrl}/blog/${blog.slug}`
    },
    "description": blog.contentHtml
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .slice(0, 150)
  };
}
