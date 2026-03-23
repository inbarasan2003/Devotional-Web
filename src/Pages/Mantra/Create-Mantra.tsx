import { useState } from "react";
import { createMantra } from "../../services/Mantra-api";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

export default function CreateMantra() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    title: "",
    content: "",
    tags: "",
  });

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      await createMantra({
        title: form.title,
        content: form.content,
        tags: form.tags.split(","),
      });

      queryClient.invalidateQueries({ queryKey: ["mantras"] });

      alert("Mantra Created ✅");
      navigate("/mantra");
    } catch (err) {
      console.error(err);
      alert(err);
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
        name="content"
        placeholder="Content"
        className="border p-2 w-full mb-3"
        onChange={handleChange}
      />

      <input
        name="tags"
        placeholder="tags (comma separated)"
        className="border p-2 w-full mb-3"
        onChange={handleChange}
      />

      <button
        onClick={handleSubmit}
        className="bg-orange-500 text-white px-4 py-2 rounded"
      >
        Create
      </button>
    </div>
  );
}