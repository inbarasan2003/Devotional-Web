import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMantras, deleteMantra } from "../../services/Mantra-api";
import AppPagination from "../../components/Pagination";

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
    <div className="min-h-screen bg-linear-to-b from-orange-50 via-white to-orange-50 p-4 md:p-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">

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
          className="w-full md:w-72 px-4 py-2 rounded-full border bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
        />
      </div>

      {/* LOADING */}
      {isLoading ? (
        <div className="flex justify-center mt-10">
          <p className="text-gray-500 animate-pulse text-sm">
            Loading mantras...
          </p>
        </div>
      ) : (
        <>
          {/* GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

            {paginatedData.length > 0 ? (
              paginatedData.map((item: any) => {

                const tagsArray = Array.isArray(item.tags)
                  ? item.tags
                  : item.tags?.split(",") || [];

                return (
                  <div
                    key={item._id}
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden flex flex-col"
                  >

                    {/* 🔥 IMAGE FIXED */}
                    {item.photos?.length > 0 && (
                      <div className="relative w-full aspect-3/4 overflow-hidden">
                        <img
                          src={item.photos[0]}
                          alt="mantra"
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover transition duration-300 hover:scale-105"
                        />
                      </div>
                    )}

                    {/* CONTENT */}
                    <div className="p-4 flex flex-col flex-1">

                      <h2 className="text-sm font-semibold text-orange-600 line-clamp-1">
                        {item.title}
                      </h2>

                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {item.description}
                      </p>

                      {/* TAGS */}
                      {tagsArray.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {tagsArray.map((tag: string, i: number) => (
                            <span
                              key={i}
                              className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full"
                            >
                              #{tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* AUDIO */}
                      {item.audio && (
                        <audio
                          controls
                          src={item.audio}
                          className="mt-3 w-full"
                        />
                      )}

                      {/* DELETE */}
                      <div className="flex justify-end mt-auto pt-3">
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full"
                        >
                          Delete
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center col-span-full text-gray-500">
                No mantras found 😐
              </p>
            )}
          </div>

          {/* PAGINATION */}
          <div className="mt-10 flex justify-center">
            <AppPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      )}
    </div>
  );
}