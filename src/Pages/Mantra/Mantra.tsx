import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMantras, deleteMantra } from "../../services/Mantra-api";
import AppPagination from "../../components/Pagination";
import toast from "react-hot-toast";

export default function MantraPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // 🔥 modal state
  const [deleteItem, setDeleteItem] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();
  const itemsPerPage = 8;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["mantras"],
    queryFn: getMantras,
  });

  const filteredMantras = (data ?? []).filter((item: any) =>
    item.title?.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredMantras.length / itemsPerPage),
  );

  const startIndex = (currentPage - 1) * itemsPerPage;

  const paginatedData = filteredMantras.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // 🔥 confirm delete function
  const confirmDelete = async () => {
    if (!deleteItem) return;

    try {
      await toast.promise(
        deleteMantra(deleteItem._id),
        {
          loading: "Deleting...",
          success: "Deleted Successfully ✅",
          error: "Delete Failed ❌",
        }
      );

      await queryClient.invalidateQueries({ queryKey: ["mantras"] });

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
          className="w-full md:w-72 px-4 py-2 rounded-full border bg-white shadow-md text-sm"
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
            {paginatedData.map((item: any) => {
              const tagsArray = Array.isArray(item.tags)
                ? item.tags
                : item.tags?.split(",") || [];

              return (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl flex flex-col"
                >

                  {/* IMAGE */}
                  {item.photos?.length > 0 && (
                    <img
                      src={item.photos[0]}
                      alt="mantra"
                      className="w-full h-48 object-cover rounded-t-2xl"
                    />
                  )}

                  {/* CONTENT */}
                  <div className="p-4 flex flex-col flex-1">

                    <h2 className="text-sm font-semibold text-orange-600">
                      {item.title}
                    </h2>

                    <p className="text-xs text-gray-600 mt-1">
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

                    {/* DELETE BUTTON */}
                    <div className="flex justify-end mt-auto pt-3">
                      <button
                        onClick={() => {
                          setDeleteItem(item);
                          setOpen(true);
                        }}
                        className="text-xs bg-red-500 text-white px-3 py-1 rounded-full"
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
          <div className="mt-10 flex justify-center">
            <AppPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      )}

      {/* 🔥 MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl p-6 w-[90%] max-w-sm text-center shadow-lg">

            <h2 className="text-lg font-semibold text-red-600 mb-2">
              Delete Mantra
            </h2>

            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete <br />
              <span className="font-medium text-black">
                {deleteItem?.title}
              </span> ?
            </p>

            <div className="flex justify-center gap-3">

              <button
                onClick={() => setOpen(false)}
                className="px-4 py-1 bg-gray-200 rounded-md text-sm"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-1 bg-red-500 text-white rounded-md text-sm"
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