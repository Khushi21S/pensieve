# 🧠 Pensieve – A Lightweight Blog CMS (Frontend-Only)

**Pensieve** is a minimal and elegant frontend-only blog CMS built with **Next.js 15 App Router** and **TailwindCSS**. It allows admins to create, edit, and manage markdown-based blogs directly from the browser UI, while supporting markdown formatting, image embedding, tagging, and live preview.

---

## 🚀 Features

- ✅ Fully responsive blog website
- ✅ Admin panel (client-side) for creating, editing, deleting blogs
- ✅ Markdown editor with live preview
- ✅ Supports `title`, `slug`, `author`, `date`, `tags`, `image`, and `content`
- ✅ Blogs stored as `.md` files in `content/blogs` for static rendering
- ✅ Dynamic routing based on blog `slug`
- ✅ Basic client-side authentication for admin access
- ✅ SEO-friendly metadata (OpenGraph + Twitter Cards)
- ✅ Blog search & tag filtering (planned)
- ✅ Clean and readable UI with dark theme

---

## 🧱 Tech Stack

- **Framework**: [Next.js 15 App Router](https://nextjs.org/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **Markdown Parser**: `gray-matter`, `remark`, `remark-html`
- **Editor**: `@uiw/react-md-editor`
- **File System**: `fs` + `path` (via Next.js API routes for local development)
- **Deployment**: Optimized for [Vercel](https://vercel.com)

---

## 📁 Folder Structure

```
pensieve/
├── app/
│   ├── blog/
│   │   ├── [slug]/
│   │   │   └── page.js         # Blog reader page
│   ├── admin/
│   │   ├── login.js            # Login page
│   │   ├── dashboard.js        # List blogs
│   │   └── create.js           # Create/edit blog UI
│   └── layout.js
├── content/
│   └── blogs/                  # Blog markdown files stored here
├── public/
│   └── og-image.png            # Default OpenGraph image
├── utils/
│   └── generateBlogSchema.js   # (Optional) JSON-LD schema generator
├── styles/
│   └── globals.css
├── README.md
└── package.json
```

---

## 🛠️ Running Locally

```bash
# 1. Clone the repo
git clone https://github.com/yourusername/pensieve.git
cd pensieve

# 2. Install dependencies
npm install

# 3. Run the development server
npm run dev
```

Then go to [http://localhost:3000](http://localhost:3000)

---

## 🔐 Admin Access

- Admin routes (`/admin`) are protected with simple client-side login.
- Test credentials are hardcoded inside the login file.
- No database or external auth service is used (meant for local & demo usage).

---

## ✍️ Creating Blogs

1. Go to `/admin/login` and log in
2. Click **"Create New Blog"**
3. Fill out:
   - Title
   - Slug (unique)
   - Author
   - Date
   - Tags (comma-separated)
   - Image URL
   - Markdown Content
4. Live preview is available on the right
5. Save to store as `.md` file inside `content/blogs/`

---

## 🌐 Deployment

This app works well with **Vercel**, but since it depends on the file system for blog storage, full admin functionality (create/update blogs) works only in **local dev mode**.

For production:
- Use GitHub integration to push `.md` files
- Or build a backend service to persist content to GitHub repo via API

---

## 📌 Future Enhancements

- [ ] Search & filter blogs by title/tags
- [ ] Pagination for blog list
- [ ] Add categories
- [ ] Dark/light toggle
- [ ] Rich image embedding from UI
- [ ] GitHub integration for production writing

---


Feel free to fork, modify, and use for personal or learning projects.

---

## 🙋‍♂️ Author

Built with ❤️ by Khushi

If you like this project, feel free to ⭐️ it and contribute!
