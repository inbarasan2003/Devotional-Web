// Import API function to create story
import { CreateStories } from "../../services/Story-api";

// React Query cache (used to refresh data after create)
import { useQueryClient } from "@tanstack/react-query";

// React state hook
import { useState } from "react";

// Toast notification
import toast from "react-hot-toast";

// Navigation
import { useNavigate } from "react-router-dom";

// Animation library
import { motion } from "framer-motion";

export default function CreateStory() {

  // Used to navigate between pages
  const navigate = useNavigate();

  // Used to refresh API cache
  const queryClient = useQueryClient();

  // Form state (stores all input values)
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    titlePhoto: "",
    tags: "",
    photos: [] as string[],
    audio: "",
  });

  // Handle input change (updates form state)
  const handleChange = (e: any) => {
    setForm({
      ...form, // keep old values
      [e.target.name]: e.target.value, // update changed field
    });
  };

  // Submit form
  const handleSubmit = async () => {

    // Validation check (required fields)
    if (!form.title || !form.description || !form.category || !form.titlePhoto) {
      toast.error("Fill all required fields ❌");
      return;
    }

    // Prepare API payload
    const payload = {
      title: form.title,
      description: form.description,
      category: form.category,
      titlePhoto: form.titlePhoto,
      tags: form.tags.trim(), // remove extra space
      photos: form.photos,
      audio: form.audio.trim(),
    };

    try {

      // Show loading + success + error using toast
      await toast.promise(
        CreateStories(payload),
        {
          loading: "Creating Story...",
          success: "Story Created ✅",
          error: "Failed ❌",
        }
      );

      // Refresh stories list
      await queryClient.invalidateQueries({ queryKey: ["stories"] });

      // Navigate back to stories page
      navigate("/stories");

    } catch (error: any) {
      console.error(error); // log error
    }
  };

  return (

    // Full page container with dark gradient background
    <div className="min-h-screen bg-linear-to-br from-[#0f172a] via-[#1e293b] to-black flex items-center justify-center px-4 text-white">

      {/* Animated form container */}
      <motion.div
        initial={{ opacity: 0, y: 40 }} // start animation
        animate={{ opacity: 1, y: 0 }}  // end animation
        className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl p-6"
      >

        {/* HEADER SECTION */}
        <div className="flex items-center justify-between mb-5">

          {/* Back button */}
          <button
            onClick={() => navigate("/stories")}
            className="text-sm text-orange-400 hover:underline"
          >
            ← Back
          </button>

          {/* Page title */}
          <h1 className="text-lg font-bold text-orange-400">
            Add Story 🪔
          </h1>

          {/* Empty div for spacing */}
          <div />
        </div>

        {/* FORM SECTION */}
        <div className="space-y-4">

          {/* Title input */}
          <input
            name="title"
            placeholder="Story Title"
            onChange={handleChange}
            className="w-full bg-white/10 border border-white/20 p-2 rounded-md text-sm"
          />

          {/* Description textarea */}
          <textarea
            name="description"
            placeholder="Story Description"
            rows={3}
            onChange={handleChange}
            className="w-full bg-white/10 border border-white/20 p-2 rounded-md text-sm"
          />

          {/* Category input */}
          <input
            name="category"
            placeholder="Category"
            onChange={handleChange}
            className="w-full bg-white/10 border border-white/20 p-2 rounded-md text-sm"
          />

          {/* Title image URL */}
          <input
            name="titlePhoto"
            placeholder="Title Image URL"
            onChange={handleChange}
            className="w-full bg-white/10 border border-white/20 p-2 rounded-md text-sm"
          />

          {/* Tags (max 3) */}
          <input
            name="tags"
            placeholder="Max 3 tags (comma separated)"
            className="w-full bg-white/10 border border-white/20 p-2 rounded-md text-sm"
            onChange={(e) => {
              const value = e.target.value;
              const tags = value.split(",");

              // Allow only 3 tags
              if (tags.length <= 3) {
                setForm({ ...form, tags: value });
              }
            }}
          />

          {/* Multiple image URLs */}
          <input
            placeholder="Image URLs (comma separated)"
            className="w-full bg-white/10 border border-white/20 p-2 rounded-md text-sm"
            onChange={(e) =>
              setForm({
                ...form,
                photos: e.target.value.split(","), // convert to array
              })
            }
          />

          {/* Audio URL */}
          <input
            name="audio"
            placeholder="Audio URL"
            onChange={handleChange}
            className="w-full bg-white/10 border border-white/20 p-2 rounded-md text-sm"
          />

        </div>

        {/* SUBMIT BUTTON */}
        <button
          onClick={handleSubmit}
          className="mt-6 w-full bg-linear-to-r from-orange-500 to-yellow-500 text-white py-2 rounded-full shadow-lg hover:scale-105 transition"
        >
          Create Story
        </button>

      </motion.div>
    </div>
  );
}