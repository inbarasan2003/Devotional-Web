import { CreateStories } from "../../services/Story-api";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateStory() {

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",      // ✅ added
    titlePhoto: "",    // ✅ added
    tags: "",
    photos: [] as string[],
    audio: "",
  });

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {

    if (!form.title || !form.description || !form.category || !form.titlePhoto) {
      alert("Fill all required fields ❌");
      return;
    }

    try {
      const payload = {
        title: form.title,
        description: form.description,
        category: form.category,        // ✅ added
        titlePhoto: form.titlePhoto,    // ✅ added
        tags: form.tags.trim(),
        photos: form.photos,
        audio: form.audio.trim(),
      };

      await CreateStories(payload);

      await queryClient.invalidateQueries({ queryKey: ["stories"] });

      alert("Story Created ✅");

      navigate("/stories");
    } catch (error: any) {
      alert(error.response?.data?.message || "Error ❌");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center px-4">

      {/* CARD */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-5 sm:p-6">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">

          <button
            onClick={() => navigate("/stories")}
            className="text-sm text-orange-600 hover:underline"
          >
            ← Back
          </button>

          <h1 className="text-lg sm:text-xl font-bold text-orange-600">
            Add Story 🪔
          </h1>

          <div />
        </div>

        {/* FORM */}
        <div className="space-y-3">

          {/* TITLE */}
          <input
            name="title"
            placeholder="Story Title"
            onChange={handleChange}
            className="w-full border p-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
          />

          {/* DESCRIPTION */}
          <textarea
            name="description"
            placeholder="Story Description"
            rows={3}
            onChange={handleChange}
            className="w-full border p-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
          />

          {/* CATEGORY */}
          <input
            name="category"
            placeholder="Category (e.g. Shiva, Vishnu)"
            onChange={handleChange}
            className="w-full border p-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
          />

          {/* TITLE PHOTO */}
          <input
            name="titlePhoto"
            placeholder="Title Image URL"
            onChange={handleChange}
            className="w-full border p-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
          />

          {/* TAGS */}
          <input
            name="tags"
            placeholder="Max 3 tags (comma separated)"
            className="w-full border p-2 rounded-md text-sm"
            onChange={(e) => {
              const value = e.target.value;
              const tags = value.split(",");

              if (tags.length <= 3) {
                setForm({
                  ...form,
                  tags: value,
                });
              }
            }}
          />

          {/* PHOTOS */}
          <input
            placeholder="Image URLs (comma separated)"
            className="w-full border p-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            onChange={(e) =>
              setForm({
                ...form,
                photos: e.target.value.split(","),
              })
            }
          />

          {/* AUDIO */}
          <input
            name="audio"
            placeholder="Audio URL (mp3 link)"
            onChange={handleChange}
            className="w-full border p-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
        </div>

        {/* BUTTON */}
        <button
          onClick={handleSubmit}
          className="mt-5 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-medium transition"
        >
          Create Story
        </button>

      </div>
    </div>
  );
}