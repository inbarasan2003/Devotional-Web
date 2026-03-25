import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import AppPagination from "../../components/Pagination";
import { deleteStories, getStories } from "../../services/Story-api";
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

  // 🔥 confirm delete
  const confirmDelete = async () => {
    if (!deleteItem) return;

    try {
      await toast.promise(
        deleteStories(deleteItem._id),
        {
          loading: "Deleting Story...",
          success: "Story Deleted ✅",
          error: "Delete Failed ❌",
        }
      );

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
          className="w-full md:w-64 px-4 py-2 rounded-full border bg-white shadow-sm text-sm"
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

                const imageUrl =
                  item.titlePhoto || item.photos?.[0];

                return (
                  <div
                    key={item._id}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg flex flex-col max-w-75 mx-auto"
                  >

                    {/* IMAGE */}
                    {imageUrl && (
                      <img
                        src={imageUrl}
                        alt="story"
                        className="w-full h-36 object-cover"
                      />
                    )}

                    {/* CONTENT */}
                    <div className="p-4 flex flex-col flex-1">

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

                      {/* DELETE */}
                      <div className="flex justify-end mt-auto pt-3">
                        <button
                          onClick={() => {
                            setDeleteItem(item);
                            setOpen(true);
                          }}
                          className="text-xs bg-red-500 text-white px-3 py-1 rounded-md"
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

      {/* 🔥 MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl p-6 w-[90%] max-w-sm text-center shadow-lg">

            <h2 className="text-lg font-semibold text-red-600 mb-2">
              Delete Story
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