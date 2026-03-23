import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMantras, deleteMantra } from "../../services/Mantra-api";

export default function MantraPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const queryClient = useQueryClient();

  const itemsPerPage = 5;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["mantras"],
    queryFn: getMantras,
  });

  // 🔥 DELETE HANDLER
  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Delete this mantra?");

    if (!confirm) return;

    try {
      await deleteMantra(id);

      // 🔥 refresh list
      await queryClient.invalidateQueries({ queryKey: ["mantras"] });

      alert("Deleted ✅");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Delete failed ❌");
    }
  };

  const filteredMantras = (data ?? []).filter((item: any) =>
    item.title?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredMantras.length / itemsPerPage)
  );

  const startIndex = (currentPage - 1) * itemsPerPage;

  const paginatedData = filteredMantras.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (isError) {
    return (
      <div className="text-red-500">
        {(error as any)?.message || "Error ❌"}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Mantras</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search mantra..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        className="mt-4 p-2 border rounded w-full max-w-sm"
      />

      {/* Loading */}
      {isLoading ? (
        <p className="mt-6">Loading...</p>
      ) : (
        <>
          {/* List */}
          <div className="mt-6 space-y-3">
            {paginatedData.length > 0 ? (
              paginatedData.map((item: any) => (
                <div
                  key={item._id}
                  className="p-4 bg-white shadow rounded"
                >
                  <p className="font-semibold">{item.title}</p>

                  <p className="text-sm text-gray-600">
                    {item.description}
                  </p>

                  {/* 🔥 DELETE BUTTON */}
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="mt-2 bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              ))
            ) : (
              <p>No mantras found 😐</p>
            )}
          </div>

          {/* Pagination */}
          <div className="mt-6 flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 border rounded"
            >
              Prev
            </button>

            <span>
              {currentPage} / {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 border rounded"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}