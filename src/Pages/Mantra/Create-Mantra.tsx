// React state
import { useState } from "react";

// API
import { createMantra } from "../../services/Mantra-api";

// Navigation
import { useNavigate } from "react-router-dom";

// React Query
import { useQueryClient } from "@tanstack/react-query";

// Toast
import toast from "react-hot-toast";

export default function CreateMantra() {

  // navigation
  const navigate = useNavigate();

  // query refresh
  const queryClient = useQueryClient();

  // form state
  const [form, setForm] = useState({
    title: "",
    description: "",
    tags: "",
    photos: [] as string[],
    audio: "",
  });

  // handle input change
  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // submit
  const handleSubmit = async () => {

    // validation
    if (!form.title || !form.description) {
      toast.error("Fill required fields ❌");
      return;
    }

    // prepare data
    const payload = {
      title: form.title,
      description: form.description,
      tags: form.tags.trim(),
      photos: form.photos,
      audio: form.audio.trim(),
    };

    try {

      // toast promise (loading, success, error)
      await toast.promise(
        createMantra(payload),
        {
          loading: "Creating Mantra...",
          success: "Mantra Created ✅",
          error: "Failed ❌",
        }
      );

      // refresh list
      await queryClient.invalidateQueries({ queryKey: ["mantras"] });

      // redirect
      navigate("/mantra");

    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-5">

        {/* header */}
        <div className="flex items-center justify-between mb-4">

          <button
            onClick={() => navigate("/mantra")}
            className="text-sm text-orange-600 hover:underline"
          >
            ← Back
          </button>

          <h1 className="text-lg font-bold text-orange-600">
            Add Mantra 🪔
          </h1>

          <div />
        </div>

        {/* form */}
        <div className="space-y-3">

          <input
            name="title"
            placeholder="Mantra Title"
            className="w-full border p-2 rounded text-sm"
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Description"
            rows={3}
            className="w-full border p-2 rounded text-sm"
            onChange={handleChange}
          />

          {/* max 3 tags */}
          <input
            name="tags"
            placeholder="Max 3 tags"
            className="w-full border p-2 rounded text-sm"
            onChange={(e) => {
              const value = e.target.value;
              const tags = value.split(",");

              if (tags.length <= 3) {
                setForm({ ...form, tags: value });
              }
            }}
          />

          {/* photos */}
          <input
            placeholder="Image URLs"
            className="w-full border p-2 rounded text-sm"
            onChange={(e) =>
              setForm({
                ...form,
                photos: e.target.value.split(","),
              })
            }
          />

          {/* audio */}
          <input
            name="audio"
            placeholder="Audio URL"
            className="w-full border p-2 rounded text-sm"
            onChange={handleChange}
          />
        </div>

        {/* button */}
        <button
          onClick={handleSubmit}
          className="mt-5 w-full bg-orange-500 text-white py-2 rounded-lg"
        >
          Create Mantra
        </button>

      </div>
    </div>
  );
}