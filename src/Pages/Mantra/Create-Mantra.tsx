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
        audio: form.audio,
      };

      await createMantra(payload);

      // 🔥 refresh list
      await queryClient.invalidateQueries({ queryKey: ["mantras"] });

      alert("Mantra Created ✅");

      navigate("/mantra");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Error ❌");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Add Mantra</h1>

      <input
        name="title"
        placeholder="Title"
        className="border p-2 w-full mb-3"
        onChange={handleChange}
      />

      <textarea
        name="description"
        placeholder="Description"
        className="border p-2 w-full mb-3"
        onChange={handleChange}
      />

      <input
        name="tags"
        placeholder="tags (comma separated)"
        className="border p-2 w-full mb-3"
        onChange={handleChange}
      />

      <input
        placeholder="Photos URLs (comma separated)"
        className="border p-2 w-full mb-3"
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
        className="border p-2 w-full mb-3"
        onChange={handleChange}
      />

      <button
        onClick={handleSubmit}
        className="bg-orange-500 text-white px-4 py-2 rounded w-full"
      >
        Create
      </button>
    </div>
  );
}