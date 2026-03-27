// React hooks for state and lifecycle
import { useState, useEffect } from "react";

// API functions for CRUD
import {
  createMantra,
  updateMantra,
  getSingleMantra,
} from "../../services/Mantra-api";

// React Router hooks
import { useNavigate, useParams } from "react-router-dom";

// React Query hooks
import { useQueryClient, useQuery } from "@tanstack/react-query";

// Toast notifications
import toast from "react-hot-toast";

// Animation library
import { motion } from "framer-motion";

export default function CreateOrUpdateMantra() {
  // Navigation function
  const navigate = useNavigate();

  // React Query cache controller
  const queryClient = useQueryClient();

  // Get ID from URL (used for edit)
  const { id } = useParams();

  // Check if it's Edit mode or Create mode
  const isEdit = !!id;

  // Form state
  const [form, setForm] = useState({
    title: "",
    description: "",
    tags: "",
    photos: [] as string[],
    audio: "",
  });

  // Fetch single mantra ONLY if edit mode
  const { data } = useQuery({
    queryKey: ["mantra", id], // unique cache key
    queryFn: () => getSingleMantra(id!), // API call
    enabled: isEdit, // runs only if editing
  });

  // Prefill form when data is loaded
  useEffect(() => {
    if (isEdit && data) {
      setForm({
        title: data.title || "", // fallback if empty
        description: data.description || "",
        tags: Array.isArray(data.tags)
          ? data.tags.join(",") // convert array → string
          : data.tags || "",
        photos: data.photos || [],
        audio: data.audio || "",
      });
    }
  }, [data, isEdit]);

  // Handle input changes (controlled inputs)
  const handleChange = (e: any) => {
    setForm({
      ...form, // keep previous values
      [e.target.name]: e.target.value, // update changed field
    });
  };

  // Submit handler (Create / Update)
  const handleSubmit = async () => {
    // Basic validation
    if (!form.title || !form.description) {
      toast.error("Fill required fields ❌");
      return;
    }

    try {
      // CREATE MODE
      if (!isEdit) {
        const payload = {
          title: form.title,
          description: form.description,
          tags: form.tags.trim(), // remove extra spaces
          photos: form.photos,
          audio: form.audio.trim(),
        };

        // Show loading/success/error toast
        await toast.promise(
          createMantra(payload),
          {
            loading: "Creating Mantra...",
            success: "Created Successfully ✅",
            error: "Failed ❌",
          },
          {
            style: {
              background: "rgba(255,255,255,0.1)",
              color: "#fff",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
            },
          },
        );
      } else {
        // UPDATE MODE
        const payload = {
          id,
          title: form.title,
          description: form.description,
          tags: form.tags.trim(),
          photos: form.photos,
          audio: form.audio.trim(),
        };

        // Update API call with toast
        await toast.promise(
          updateMantra(payload),
          {
            loading: "Updating Mantra...",
            success: "Updated Successfully ✅",
            error: "Failed ❌",
          },
          {
            style: {
              background: "rgba(255,255,255,0.1)",
              color: "#fff",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
            },
          },
        );
      }

      // Refresh mantra list cache
      await queryClient.invalidateQueries({ queryKey: ["mantras"] });

      // Redirect to mantra list page
      navigate("/mantra");
    } catch (err: any) {
      console.error(err); // log error
    }
  };

  return (
    // Full screen container with gradient background
    <div className="min-h-screen bg-linear-to-br from-[#0f172a] via-[#1e293b] to-black flex items-center justify-center px-4 text-white">
      {/* Animated card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }} // start animation
        animate={{ opacity: 1, y: 0 }} // end animation
        className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl p-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          {/* Back button */}
          <button
            onClick={() => navigate("/mantra")}
            className="text-sm text-orange-400 hover:underline"
          >
            ← Back
          </button>
          {/* Dynamic title */}
          <h1 className="text-lg font-bold text-orange-400">
            {isEdit ? "Edit Mantra 🪔" : "Add Mantra 🪔"}
          </h1>
          <div /> {/* empty spacer */}
        </div>

        {/* Form inputs */}
        <div className="space-y-4">
          {/* Title input */}
          <input
            name="title"
            value={form.title}
            placeholder="Mantra Title"
            className="w-full bg-white/10 border border-white/20 p-2 rounded-md text-sm"
            onChange={handleChange}
          />

          {/* Description input */}
          <textarea
            name="description"
            value={form.description}
            placeholder="Description"
            rows={3}
            className="w-full bg-white/10 border border-white/20 p-2 rounded-md text-sm"
            onChange={handleChange}
          />

          {/* Tags input (max 3 tags) */}
          <input
            name="tags"
            value={form.tags}
            placeholder="Max 3 tags"
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

          {/* Image URLs input (comma separated) */}
          <input
            placeholder="Image URLs"
            className="w-full bg-white/10 border border-white/20 p-2 rounded-md text-sm"
            onChange={(e) =>
              setForm({
                ...form,
                photos: e.target.value.split(","), // convert to array
              })
            }
          />

          {/* Audio URL input */}
          <input
            name="audio"
            value={form.audio}
            placeholder="Audio URL"
            className="w-full bg-white/10 border border-white/20 p-2 rounded-md text-sm"
            onChange={handleChange}
          />
        </div>

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          className="mt-6 w-full bg-linear-to-r from-orange-500 to-yellow-500 text-white py-2 rounded-full shadow-lg hover:scale-105 transition"
        >
          {isEdit ? "Update Mantra" : "Create Mantra"}
        </button>
      </motion.div>
    </div>
  );
}
