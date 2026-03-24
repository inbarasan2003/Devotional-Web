import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import AppPagination from "../../components/Pagination";
import { deleteStories, getStories } from "../../services/Story-api";

export default function MantraPage() {

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const queryClient = useQueryClient();
  const itemsPerPage = 8;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["stories"],
    queryFn: getStories,
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
    if (!window.confirm("Delete this Story?")) return;

    try {
      await deleteStories(id);
      await queryClient.invalidateQueries({ queryKey: ["stories"] });
    } catch {
      alert(error?.message);
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

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">

        <h1 className="text-xl md:text-2xl font-bold text-orange-600">
          🪔 Devotional Stories
        </h1>

        <input
          type="text"
          placeholder="Search Story..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full md:w-64 px-4 py-2 rounded-full border bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
        />
      </div>

      {/* LOADING */}
      {isLoading ? (
        <div className="flex justify-center mt-10">
          <p className="text-gray-500 text-sm animate-pulse">
            Loading...
          </p>
        </div>
      ) : (
        <>
          {/* GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">

            {paginatedData.length > 0 ? (
              paginatedData.map((item: any) => {

                const tagsArray = Array.isArray(item.tags)
                  ? item.tags
                  : item.tags?.split(",") || [];

                // 🔥 FIX: main image logic
                const imageUrl =
                  item.titlePhoto || item.photos?.[0];

                return (
                  <div
                    key={item._id}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden flex flex-col max-w-75 mx-auto"
                  >

                    {/* IMAGE */}
                    {imageUrl && (
                      <div className="w-full h-36 overflow-hidden">
                        <img
                          src={imageUrl}
                          alt="story"
                          loading="lazy"
                          className="w-full h-full object-cover object-center"
                        />
                      </div>
                    )}

                    {/* CONTENT */}
                    <div className="p-4 flex flex-col flex-1">

                      <h2 className="text-sm font-semibold text-orange-600 truncate">
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
                          className="mt-3 w-full h-8"
                        />
                      )}

                      {/* DELETE */}
                      <div className="flex justify-end mt-auto pt-3">
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
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
                No Stories found 😐
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