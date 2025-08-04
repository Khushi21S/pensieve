"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { remark } from "remark";
import html from "remark-html";
import "@uiw/react-markdown-preview/markdown.css";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function CreateBlogPage() {
  const [form, setForm] = useState({
    title: "",
    slug: "",
    date: new Date().toISOString().split("T")[0],
    tags: "",
    author: "",
    image: "",
    content: "",
  });

  const [errors, setErrors] = useState({});
  const [previewHtml, setPreviewHtml] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isSlugTouched, setIsSlugTouched] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const renderPreview = async () => {
      const processed = await remark().use(html).process(form.content);
      setPreviewHtml(processed.toString());
    };
    renderPreview();
  }, [form.content]);

  const updateForm = (field, value) => {
    setForm((prev) => {
      let newForm = { ...prev, [field]: value };

      if (field === "title" && !isSlugTouched) {
        newForm.slug = generateSlug(value);
      }

      return newForm;
    });

    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.slug.trim()) {
      newErrors.slug = "Slug is required";
    } else if (!/^[a-z0-9-]+$/.test(form.slug)) {
      newErrors.slug = "Slug must be lowercase and hyphen-separated";
    }
    if (!form.date.trim()) newErrors.date = "Date is required";
    if (!form.tags.trim()) newErrors.tags = "Tags are required";
    if (!form.author.trim()) newErrors.author = "Author is required";
 if (!form.image.trim()) {
  newErrors.image = "Image URL is required";
} else if (
  !/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)(\?.*)?$|^https?:\/\/.*(unsplash|cloudinary|images\.vercel\.app).*$/i.test(form.image)
) {
  newErrors.image = "Must be a valid image URL";
}

    if (!form.content.trim()) newErrors.content = "Content is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  // Show loading SweetAlert
  Swal.fire({
    title: "Saving Blog...",
    text: "Please wait while your blog is being saved.",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  setSubmitting(true);
  try {
    const res = await fetch("/api/save-blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const result = await res.json();

    if (result.success) {
      Swal.fire({
        icon: "success",
        title: "Blog Saved!",
        text: `Blog saved as "${result.fileName}"`,
        confirmButtonColor: "#10B981", // Tailwind green-600
      }).then(() => {
        router.push("/admin/blogs");
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Save Failed",
        text: result.error || "Something went wrong.",
      });
    }
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Error saving blog: " + err.message,
    });
  } finally {
    setSubmitting(false);
  }
};

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-");
  };


  return (
    <div className=" max-w-7xl mx-auto p-4 flex flex-col space-y-2">
      {/* Header */}
      <div className="flex gap-10 align-center">
        <h1 className="text-2xl font-bold text-left ml-6">Create Blog</h1>
        <div className="text-right mr-40">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer"
            onClick={() => router.push("/admin/blogs")}
          >
            See Blog List
          </button>
        </div>
      </div>

      {/* Main Layout: 75% Form | 25% Preview */}
      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* Form Section - 75% */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 w-3/4 overflow-hidden"
        >
          {/* Input Fields in Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6 mr-6 mt-2">
            <div>
              <input
                type="text"
                placeholder="Title"
                className="w-full border p-2 rounded"
                value={form.title}
                onChange={(e) => updateForm("title", e.target.value)}
              />
              {errors.title && (
                <p className="text-red-600 text-sm">{errors.title}</p>
              )}
            </div>

            <div>
              <input
                type="text"
                placeholder="Slug (e.g. my-blog-post)"
                value={form.slug}
                onChange={(e) => {
                  setIsSlugTouched(true);
                  updateForm("slug", e.target.value);
                }}
                className="w-full border p-2 rounded"
              />
              {errors.slug && (
                <p className="text-red-600 text-sm">{errors.slug}</p>
              )}
            </div>

            <div>
              <input
                type="text"
                placeholder="Author"
                className="w-full border p-2 rounded"
                value={form.author}
                onChange={(e) => updateForm("author", e.target.value)}
              />
              {errors.author && (
                <p className="text-red-600 text-sm">{errors.author}</p>
              )}
            </div>

            <div>
              <input
                type="date"
                className="w-full border p-2 rounded"
                value={form.date}
                onChange={(e) => updateForm("date", e.target.value)}
              />
              {errors.date && (
                <p className="text-red-600 text-sm">{errors.date}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Tags (comma separated)"
                className="w-full border p-2 rounded"
                value={form.tags}
                onChange={(e) => updateForm("tags", e.target.value)}
              />
              {errors.tags && (
                <p className="text-red-600 text-sm">{errors.tags}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Image URL"
                className="w-full border p-2 rounded"
                value={form.image}
                onChange={(e) => updateForm("image", e.target.value)}
              />
              {errors.image && (
                <p className="text-red-600 text-sm">{errors.image}</p>
              )}
            </div>
          </div>

          {/* Markdown Editor */}
          <div className="flex-1 min-h-0 ml-6 mr-6">
            <MDEditor
              value={form.content}
              height={300}
              onChange={(value) => updateForm("content", value || "")}
              preview="edit" 
            />
            {errors.content && (
              <p className="text-red-600 text-sm">{errors.content}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="text-left ml-6">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer"
            >
              Save Blog
            </button>
          </div>
        </form>

        {/* Preview Section - 25% */}
        <div className="w-1/4 h-screen border rounded p-2 overflow-auto prose prose-sm bg-white">
          <h2 className="font-semibold text-base text-black mb-2">
            Live Preview
          </h2>
          <div className="text-black" dangerouslySetInnerHTML={{ __html: previewHtml }} />
        </div>
      </div>
    </div>
  );
}
