// React state hook
import { useState } from "react";

// API function to create mantra
import { createMantra } from "../../services/Mantra-api";

// Navigation hook
import { useNavigate } from "react-router-dom";

// React Query cache control
import { useQueryClient } from "@tanstack/react-query";

export default function CreateMantra() {
  // for page navigation
  const navigate = useNavigate();

  // for refetching data after create
  const queryClient = useQueryClient();

  // form state (all input values stored here)
  const [form, setForm] = useState({
    title: "",
    description: "",
    tags: "",
    photos: [] as string[],
    audio: "",
  });

  // handles input changes (common for all fields)
  const handleChange = (e: any) => {
    setForm({
      ...form, // keep old values
      [e.target.name]: e.target.value, // update specific field
    });
  };

  // submit function (called when button clicked)
  const handleSubmit = async () => {

    // validation check
    if (!form.title || !form.description) {
      alert("Fill required fields ❌");
      return;
    }

    try {
      // preparing data to send to backend
      const payload = {
        title: form.title,
        description: form.description,
        tags: form.tags.trim(),
        photos: form.photos,
        audio: form.audio.trim(),
      };

      // API call to create mantra
      await createMantra(payload);

      // refresh mantra list after create
      await queryClient.invalidateQueries({ queryKey: ["mantras"] });

      // success message
      alert("Mantra Created ✅");

      // navigate back to list page
      navigate("/mantra");

    } catch (err: any) {
      // log error for debugging
      console.error(err);

      // show backend error if exists
      alert(err.response?.data?.message || "Error ❌");
    }
  };

  return (
    // full page container
    <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4">

      {/* main card container */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-5">

        {/* header section */}
        <div className="flex items-center justify-between mb-4">

          {/* back button */}
          <button
            onClick={() => navigate("/mantra")}
            className="text-sm text-orange-600 hover:underline"
          >
            ← Back
          </button>

          {/* title */}
          <h1 className="text-lg font-bold text-orange-600">
            Add Mantra 🪔
          </h1>

          {/* empty div for spacing */}
          <div />
        </div>

        {/* form inputs */}
        <div className="space-y-3">

          {/* title input */}
          <input
            name="title"
            placeholder="Mantra Title"
            className="w-full border p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            onChange={handleChange}
          />

          {/* description textarea */}
          <textarea
            name="description"
            placeholder="Description"
            rows={3}
            className="w-full border p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            onChange={handleChange}
          />

          {/* tags input (max 3 tags logic) */}
          <input
            name="tags"
            placeholder="Max 3 tags (comma separated)"
            className="w-full border p-2 rounded text-sm"
            onChange={(e) => {
              const value = e.target.value;

              const tags = value.split(",");

              // allow only 3 tags
              if (tags.length <= 3) {
                setForm({
                  ...form,
                  tags: value,
                });
              }
            }}
          />

          {/* photos input (convert string → array) */}
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

          {/* audio input */}
          <input
            name="audio"
            placeholder="Audio URL (mp3 link)"
            className="w-full border p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            onChange={handleChange}
          />
        </div>

        {/* submit button */}
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