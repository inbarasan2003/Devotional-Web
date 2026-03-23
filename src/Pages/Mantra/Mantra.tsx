import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMantras, deleteMantra } from "../../services/Mantra-api";

export default function MantraPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const queryClient = useQueryClient();
  const itemsPerPage = 8;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["mantras"],
    queryFn: getMantras,
  });

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

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this mantra?")) return;

    try {
      await deleteMantra(id);
      await queryClient.invalidateQueries({ queryKey: ["mantras"] });
    } catch {
      alert("Delete failed ❌");
    }
  };

  if (isError) {
    return (
      <div className="text-red-500 text-center mt-10">
        {(error as any)?.message || "Error ❌"}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 p-4 md:p-6">
      
      {/* 🔥 HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-orange-600">
          🪔 Devotional Mantras
        </h1>

        <input
          type="text"
          placeholder="Search mantra..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="p-2 border rounded w-full md:w-64 shadow-sm text-sm"
        />
      </div>

      {/* ⏳ Loading */}
      {isLoading ? (
        <p className="mt-6 text-center">Loading...</p>
      ) : (
        <>
          {/* 🔥 GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
            
            {paginatedData.length > 0 ? (
              paginatedData.map((item: any) => (
                
                <div
                  key={item._id}
                  className="bg-white rounded-xl shadow-sm px-25  max-w-sm mx-auto hover:shadow-md transition flex justify-center items-center flex-col"
                >
                  {/* 🟠 TITLE */}
                  <h2 className="text-sm font-semibold text-orange-600 truncate">
                    {item.title}
                  </h2>

                  {/* 📝 DESCRIPTION */}
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {item.description}
                  </p>

                  {/* 🖼️ IMAGE */}
                  {item.photos?.length > 0 && (
                    <div className="mt-2 w-full h-32 overflow-hidden rounded-lg">
                      <img
                        src={item.photos[0]}
                        alt="mantra"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* 🔊 AUDIO */}
                  {item.audio && (
                    <audio
                      controls
                      src={item.audio}
                      className="mt-2   h-8"
                    />
                  )}

                  {/* 🏷️ TAGS */}
                  {item.tags && (
                    <p className="text-[10px] text-gray-400 mt-1 truncate">
                      #{item.tags}
                    </p>
                  )}

                  {/* ❌ DELETE */}
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center col-span-full text-gray-500">
                No mantras found 😐
              </p>
            )}
          </div>

          {/* 📄 PAGINATION */}
          <div className="flex justify-center items-end gap-3 mt-8">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 border rounded text-sm"
            >
              Prev
            </button>

            <span className="text-sm font-medium">
              {currentPage} / {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 border rounded text-sm"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}