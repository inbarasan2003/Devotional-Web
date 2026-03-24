import { useState } from "react";
import { createMantra } from "../../services/Mantra-api";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

export default function CreateMantra() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    title: "",
    description: "",
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
    if (!form.title || !form.description) {
      alert("Fill required fields ❌");
      return;
    }

    try {
      const payload = {
        title: form.title,
        description: form.description,
        tags: form.tags.trim(),
        photos: form.photos,
        audio: form.audio.trim(),
      };

      await createMantra(payload);

      await queryClient.invalidateQueries({ queryKey: ["mantras"] });

      alert("Mantra Created ✅");

      navigate("/mantra");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Error ❌");
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4">
      {/* 🔥 CARD */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-5">
        {/* 🔙 HEADER */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate("/mantra")}
            className="text-sm text-orange-600 hover:underline"
          >
            ← Back
          </button>
          <h1 className="text-lg font-bold text-orange-600">Add Mantra 🪔</h1>
          <div /> {/* spacer */}
        </div>

        {/* 📝 FORM */}
        <div className="space-y-3">
          {/* Title */}
          <input
            name="title"
            placeholder="Mantra Title"
            className="w-full border p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            onChange={handleChange}
          />

          {/* Description */}
          <textarea
            name="description"
            placeholder="Description"
            rows={3}
            className="w-full border p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            onChange={handleChange}
          />

          {/* Tags */}
          <input
            name="tags"
            placeholder="Max 3 tags (comma separated)"
            className="w-full border p-2 rounded text-sm"
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

          {/* Photos */}
          <input
            placeholder="Image URLs (comma separated)"
            className="w-full border p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            onChange={(e) =>
              setForm({
                ...form,
                photos: e.target.value.split(","),
              })
            }
          />

          {/* Audio */}
          <input
            name="audio"
            placeholder="Audio URL (mp3 link)"
            className="w-full border p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            onChange={handleChange}
          />
        </div>

        {/* 🔥 BUTTON */}
        <button
          onClick={handleSubmit}
          className="mt-5 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-medium transition"
        >
          Create Mantra
        </button>
      </div>
    </div>
  );
}
