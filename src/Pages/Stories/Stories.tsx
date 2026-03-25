import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import AppPagination from "../../components/Pagination";
import { deleteStories, getStories } from "../../services/Story-api";
import toast from "react-hot-toast";
import { Riple } from "react-loading-indicators";
export default function StoriesPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [deleteItem, setDeleteItem] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();
  const itemsPerPage = 5;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["stories"],
    queryFn: getStories,
  });

  const filtered = (data ?? []).filter((item: any) =>
    item.title?.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));

  const startIndex = (currentPage - 1) * itemsPerPage;

  const paginatedData = filtered.slice(startIndex, startIndex + itemsPerPage);

  const confirmDelete = async () => {
    if (!deleteItem) return;

    try {
      await toast.promise(deleteStories(deleteItem._id), {
        loading: "Deleting...",
        success: "Deleted ✅",
        error: "Failed ❌",
      });

      await queryClient.invalidateQueries({ queryKey: ["stories"] });

      setOpen(false);
      setDeleteItem(null);
    } catch (err) {
      console.error(err);
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
    <div className="min-h-screen bg-orange-50 p-4 md:p-6 mt-15">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-5">
        <h1 className="text-xl md:text-2xl font-bold text-orange-600">
          🪔 Devotional Stories
        </h1>

        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full md:w-64 px-3 py-2 rounded-full border bg-white text-sm"
        />
      </div>

      {/* LOADING */}
      {isLoading ? (
        <div className="text-center mt-10"><Riple color="#32cd32" size="large" text="Loading" textColor="#00ff54" /></div>
      ) : (
        <>
          {/* GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 justify-items-center">
            {paginatedData.map((item: any) => {
              const tagsArray = Array.isArray(item.tags)
                ? item.tags
                : item.tags?.split(",") || [];

              const imageUrl = item.titlePhoto || item.photos?.[0];

              return (
                <div
                  key={item._id}
                  className="bg-white rounded-xl shadow-md flex flex-col w-65 overflow-hidden hover:shadow-lg transition"
                >
                  {/* 🔥 IMAGE FIXED (CENTER TOP) */}
                  {imageUrl && (
                    <div className="w-full aspect-2/3 overflow-hidden">
                      <img
                        src={imageUrl}
                        alt="story"
                        className="w-full h-full object-cover object-[center_top]"
                      />
                    </div>
                  )}

                  {/* CONTENT */}
                  <div className="p-3 flex flex-col flex-1">
                    <h2 className="text-sm font-semibold text-orange-600">
                      {item.title}
                    </h2>

                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {item.description}
                    </p>

                    {/* TAGS */}
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

                    {/* AUDIO */}
                    {item.audio && (
                      <audio
                        controls
                        src={item.audio}
                        className="mt-2 w-full h-7"
                      />
                    )}

                    {/* DELETE */}
                    <div className="flex justify-end mt-auto pt-2">
                      <button
                        onClick={() => {
                          setDeleteItem(item);
                          setOpen(true);
                        }}
                        className="text-[10px] bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* PAGINATION */}
          <div className="mt-8 flex justify-center">
            <AppPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      )}

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-5 rounded-xl text-center w-75 shadow-lg">
            <h2 className="text-lg font-semibold text-red-500">Delete Story</h2>

            <p className="text-sm mt-2">
              Delete <b>{deleteItem?.title}</b> ?
            </p>

            <div className="flex justify-center gap-3 mt-4">
              <button
                onClick={() => setOpen(false)}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
