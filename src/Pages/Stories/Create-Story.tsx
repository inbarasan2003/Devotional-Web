import { CreateStories } from "../../services/Story-api";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function CreateStory() {

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    titlePhoto: "",
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

    // validation
    if (!form.title || !form.description || !form.category || !form.titlePhoto) {
      toast.error("Fill all required fields ❌");
      return;
    }

    const payload = {
      title: form.title,
      description: form.description,
      category: form.category,
      titlePhoto: form.titlePhoto,
      tags: form.tags.trim(),
      photos: form.photos,
      audio: form.audio.trim(),
    };

    try {

      // toast promise (single API call)
      await toast.promise(
        CreateStories(payload),
        {
          loading: "Creating Story...",
          success: "Story Created ✅",
          error: "Failed ❌",
        }
      );

      // refresh list
      await queryClient.invalidateQueries({ queryKey: ["stories"] });

      // redirect
      navigate("/stories");

    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-orange-50 to-white flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-5 sm:p-6">

        {/* header */}
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

        {/* form */}
        <div className="space-y-3">

          <input
            name="title"
            placeholder="Story Title"
            onChange={handleChange}
            className="w-full border p-2 rounded-md text-sm"
          />

          <textarea
            name="description"
            placeholder="Story Description"
            rows={3}
            onChange={handleChange}
            className="w-full border p-2 rounded-md text-sm"
          />

          <input
            name="category"
            placeholder="Category"
            onChange={handleChange}
            className="w-full border p-2 rounded-md text-sm"
          />

          <input
            name="titlePhoto"
            placeholder="Title Image URL"
            onChange={handleChange}
            className="w-full border p-2 rounded-md text-sm"
          />

          {/* max 3 tags */}
          <input
            name="tags"
            placeholder="Max 3 tags"
            className="w-full border p-2 rounded-md text-sm"
            onChange={(e) => {
              const value = e.target.value;
              const tags = value.split(",");

              if (tags.length <= 3) {
                setForm({ ...form, tags: value });
              }
            }}
          />

          <input
            placeholder="Image URLs"
            className="w-full border p-2 rounded-md text-sm"
            onChange={(e) =>
              setForm({
                ...form,
                photos: e.target.value.split(","),
              })
            }
          />

          <input
            name="audio"
            placeholder="Audio URL"
            onChange={handleChange}
            className="w-full border p-2 rounded-md text-sm"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="mt-5 w-full bg-orange-500 text-white py-2 rounded-lg"
        >
          Create Story
        </button>

      </div>
    </div>
  );
}