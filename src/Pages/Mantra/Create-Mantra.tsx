// React state hook (for managing form data)
import { useState } from "react";

// API function to create mantra
import { createMantra } from "../../services/Mantra-api";

// Navigation hook
import { useNavigate } from "react-router-dom";

// React Query (used for cache refresh)
import { useQueryClient } from "@tanstack/react-query";

// Toast notifications
import toast from "react-hot-toast";

// Animation
import { motion } from "framer-motion";

export default function CreateMantra() {

  // Used to navigate between pages
  const navigate = useNavigate();

  // Used to refresh API cache
  const queryClient = useQueryClient();

  // Form state (stores all input values)
  const [form, setForm] = useState({
    title: "",
    description: "",
    tags: "",
    photos: [] as string[],
    audio: "",
  });

  // Handle input change (update form state)
  const handleChange = (e: any) => {
    setForm({
      ...form, // keep old values
      [e.target.name]: e.target.value, // update changed field
    });
  };

  // Submit form
  const handleSubmit = async () => {

    // Validation (required fields)
    if (!form.title || !form.description) {
      toast.error("Fill required fields ❌");
      return;
    }

    // Prepare API payload
    const payload = {
      title: form.title,
      description: form.description,
      tags: form.tags.trim(), // remove extra spaces
      photos: form.photos,
      audio: form.audio.trim(),
    };

    try {

      // Show loading + success + error using toast
      await toast.promise(
        createMantra(payload),
        {
          loading: "Creating Mantra...",
          success: "Mantra Created ✅",
          error: "Failed ❌",
        }
      );

      // Refresh mantra list
      await queryClient.invalidateQueries({ queryKey: ["mantras"] });

      // Navigate back to mantra page
      navigate("/mantra");

    } catch (err: any) {
      console.error(err); // log error
    }
  };

  return (

    // Full page container with dark gradient background
    <div className="min-h-screen bg-linear-to-br from-[#0f172a] via-[#1e293b] to-black flex items-center justify-center px-4 text-white">

      {/* Animated form container */}
      <motion.div
        initial={{ opacity: 0, y: 40 }} // animation start
        animate={{ opacity: 1, y: 0 }}  // animation end
        className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl p-6"
      >

        {/* 🔥 HEADER */}
        <div className="flex items-center justify-between mb-5">

          {/* Back button */}
          <button
            onClick={() => navigate("/mantra")}
            className="text-sm text-orange-400 hover:underline"
          >
            ← Back
          </button>

          {/* Page title */}
          <h1 className="text-lg font-bold text-orange-400">
            Add Mantra 🪔
          </h1>

          {/* Empty div (for spacing alignment) */}
          <div />
        </div>

        {/* 🔥 FORM */}
        <div className="space-y-4">

          {/* TITLE INPUT */}
          <input
            name="title"
            placeholder="Mantra Title"
            className="w-full bg-white/10 border border-white/20 p-2 rounded-md text-sm"
            onChange={handleChange}
          />

          {/* DESCRIPTION */}
          <textarea
            name="description"
            placeholder="Description"
            rows={3}
            className="w-full bg-white/10 border border-white/20 p-2 rounded-md text-sm"
            onChange={handleChange}
          />

          {/* TAGS (max 3) */}
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

          {/* PHOTOS (multiple URLs) */}
          <input
            placeholder="Image URLs (comma separated)"
            className="w-full bg-white/10 border border-white/20 p-2 rounded-md text-sm"
            onChange={(e) =>
              setForm({
                ...form,
                photos: e.target.value.split(","), // convert string → array
              })
            }
          />

          {/* AUDIO */}
          <input
            name="audio"
            placeholder="Audio URL"
            className="w-full bg-white/10 border border-white/20 p-2 rounded-md text-sm"
            onChange={handleChange}
          />

        </div>

        {/* 🔥 SUBMIT BUTTON */}
        <button
          onClick={handleSubmit}
          className="mt-6 w-full bg-linear-to-r from-orange-500 to-yellow-500 text-white py-2 rounded-full shadow-lg hover:scale-105 transition"
        >
          Create Mantra
        </button>

      </motion.div>
    </div>
  );
}