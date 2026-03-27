// API
import {
  CreateStories,
  getSIngleStory,
  UpdateStories,
} from "../../services/Story-api";

// React Query
import { useQuery, useQueryClient } from "@tanstack/react-query";

// React
import { useEffect, useState } from "react";

// Toast
import toast from "react-hot-toast";

// Router
import { useNavigate, useParams } from "react-router-dom";

// Animation
import { motion } from "framer-motion";

export default function CreateStory() {
  const { id } = useParams();
  const isEdit = !!id;

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // FORM STATE
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    titlePhoto: "",
    tags: "",
    photos: [] as string[],
    audio: "",
  });

  // FETCH SINGLE STORY
  const { data } = useQuery({
    queryKey: ["story", id],
    queryFn: () => getSIngleStory(id!),
    enabled: isEdit,
  });

  // PREFILL FORM
  useEffect(() => {
    if (isEdit && data) {
      console.log("EDIT DATA:", data); // 🔥 debug

      setForm({
        title: data.title || "",
        description: data.description || "",
        category: data.category || "",
        titlePhoto: data.titlePhoto || "",
        tags: Array.isArray(data.tags) ? data.tags.join(",") : data.tags || "",
        photos: data.photos || [],
        audio: data.audio || "",
      });
    }
  }, [data, isEdit]);

  // HANDLE INPUT
  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // SUBMIT
  const handleSubmit = async () => {
    console.log("EDIT MODE:", isEdit);
    console.log("ID:", id);
    console.log("FORM:", form);

    if (
      !form.title ||
      !form.description ||
      !form.category ||
      !form.titlePhoto
    ) {
      toast.error("Fill all required fields ❌");
      return;
    }

    try {
      // 🔥 CREATE
      if (!isEdit) {
        const payload = {
          title: form.title,
          description: form.description,
          category: form.category,
          titlePhoto: form.titlePhoto,
          tags: form.tags.trim(),
          photos: form.photos,
          audio: form.audio.trim(),
        };

        console.log("CREATE PAYLOAD:", payload);

        await toast.promise(
          CreateStories(payload),
          {
            loading: "Creating Story...",
            success: "Story Created ✅",
            error: "Failed ❌",
          },
          {
            style: {
              background: "rgba(15,23,42,0.85)", // dark theme match
              color: "#fff",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "14px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
            },
          },
        );
      } else {
        // 🔥 UPDATE (SAFE VERSION)
        const payload = {
          id, // important
          title: form.title,
          description: form.description,
          category: form.category,
          titlePhoto: form.titlePhoto,
          tags: form.tags.trim(),
          photos: form.photos,
          audio: form.audio.trim(),
        };

        console.log("UPDATE PAYLOAD:", payload);

        await toast.promise(
          UpdateStories(payload),
          {
            loading: "Updating Story...",
            success: "Story Updated ✅",
            error: "Failed ❌",
          },
          {
            style: {
              background: "rgba(15,23,42,0.85)", // dark theme match
              color: "#fff",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "14px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
            },
          },
        );
      }

      // REFRESH
      await queryClient.invalidateQueries({ queryKey: ["stories"] });

      // NAVIGATE
      navigate("/stories");
    } catch (error: any) {
      // 🔥 FULL DEBUG
      console.log("ERROR:", error);
      console.log("RESPONSE:", error?.response);
      console.log("DATA:", error?.response?.data);

      toast.error(error?.response?.data?.message || "Something went wrong ❌");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0f172a] via-[#1e293b] to-black flex items-center justify-center px-4 text-white">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl p-6"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={() => navigate("/stories")}
            className="text-sm text-orange-400 hover:underline"
          >
            ← Back
          </button>

          <h1 className="text-lg font-bold text-orange-400">
            {isEdit ? "Edit Story 🪔" : "Add Story 🪔"}
          </h1>

          <div />
        </div>

        {/* FORM */}
        <div className="space-y-4">
          <input
            name="title"
            value={form.title}
            placeholder="Story Title"
            onChange={handleChange}
            className="w-full bg-white/10 border border-white/20 p-2 rounded-md text-sm"
          />

          <textarea
            name="description"
            value={form.description}
            placeholder="Story Description"
            rows={3}
            onChange={handleChange}
            className="w-full bg-white/10 border border-white/20 p-2 rounded-md text-sm"
          />

          <input
            name="category"
            value={form.category}
            placeholder="Category"
            onChange={handleChange}
            className="w-full bg-white/10 border border-white/20 p-2 rounded-md text-sm"
          />

          <input
            name="titlePhoto"
            value={form.titlePhoto}
            placeholder="Title Image URL"
            onChange={handleChange}
            className="w-full bg-white/10 border border-white/20 p-2 rounded-md text-sm"
          />

          {/* TAGS */}
          <input
            name="tags"
            value={form.tags}
            placeholder="Max 3 tags"
            className="w-full bg-white/10 border border-white/20 p-2 rounded-md text-sm"
            onChange={(e) => {
              const value = e.target.value;
              const tags = value.split(",");

              if (tags.length <= 3) {
                setForm({ ...form, tags: value });
              }
            }}
          />

          {/* PHOTOS */}
          <input
            placeholder="Image URLs"
            className="w-full bg-white/10 border border-white/20 p-2 rounded-md text-sm"
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
            value={form.audio}
            placeholder="Audio URL"
            onChange={handleChange}
            className="w-full bg-white/10 border border-white/20 p-2 rounded-md text-sm"
          />
        </div>

        {/* SUBMIT */}
        <button
          onClick={handleSubmit}
          className="mt-6 w-full bg-linear-to-r from-orange-500 to-yellow-500 text-white py-2 rounded-full shadow-lg hover:scale-105 transition"
        >
          {isEdit ? "Update Story" : "Create Story"}
        </button>
      </motion.div>
    </div>
  );
}
