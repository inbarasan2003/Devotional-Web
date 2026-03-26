// React state
import { useState } from "react";

// React Query (API + cache)
import { useQuery, useQueryClient } from "@tanstack/react-query";

// API functions
import { getMantras, deleteMantra } from "../../services/Mantra-api";

// Pagination component
import AppPagination from "../../components/Pagination";

// Toast notifications
import toast from "react-hot-toast";

// Loading spinner
import { Commet } from "react-loading-indicators";

// Global audio system
import { useAudio } from "../../context/AudioProvider";

// Animation
import { motion } from "framer-motion";

export default function MantraPage() {

  // Search input state
  const [search, setSearch] = useState("");

  // Current page (pagination)
  const [currentPage, setCurrentPage] = useState(1);

  // Selected mantra for delete
  const [deleteItem, setDeleteItem] = useState<any>(null);

  // Modal open/close
  const [open, setOpen] = useState(false);

  // React Query cache
  const queryClient = useQueryClient();

  // Global audio controls
  const { setAudio, setTitle, setImage, audio } = useAudio();

  // Items per page
  const itemsPerPage = 5;

  // Fetch mantras from API
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["mantras"], // cache key
    queryFn: getMantras,   // API call
  });

  // Filter based on search
  const filteredMantras = (data ?? []).filter((item: any) =>
    item.title?.toLowerCase().includes(search.toLowerCase()),
  );

  // Total pages calculation
  const totalPages = Math.max(
    1,
    Math.ceil(filteredMantras.length / itemsPerPage),
  );

  // Start index for pagination
  const startIndex = (currentPage - 1) * itemsPerPage;

  // Slice data for current page
  const paginatedData = filteredMantras.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Delete confirm function
  const confirmDelete = async () => {

    if (!deleteItem) return; // safety check

    try {
      // Toast with loading + success + error
      await toast.promise(deleteMantra(deleteItem._id), {
        loading: "Deleting...",
        success: "Deleted Successfully ✅",
        error: "Delete Failed ❌",
      });

      // Refresh data after delete
      await queryClient.invalidateQueries({ queryKey: ["mantras"] });

      setOpen(false);       // close modal
      setDeleteItem(null);  // reset item

    } catch (err) {
      console.error(err);
    }
  };

  // Error UI
  if (isError) {
    return (
      <div className="text-red-500 text-center mt-10">
        {(error as any)?.message || "Error ❌"}
      </div>
    );
  }

  return (

    // Main container
    <div className="min-h-screen bg-linear-to-br from-[#0f172a] via-[#1e293b] to-black text-white p-4 md:p-6 mt-15 pb-28">

      {/* 🔥 HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">

        {/* Page title */}
        <h1 className="text-2xl font-bold text-orange-400">
          🪔 Devotional Mantras
        </h1>

        {/* Search input */}
        <input
          type="text"
          placeholder="Search mantra..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value); // update search
            setCurrentPage(1);         // reset page
          }}
          className="w-full md:w-64 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm"
        />
      </div>

      {/* 🔥 LOADING */}
      {isLoading ? (
        <div className="flex justify-center mt-10">
          <Commet color="#f97316" size="medium" text="Loading" textColor="#fb923c" />
        </div>
      ) : (
        <>
          {/* 🔥 GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

            {paginatedData.map((item: any, index: number) => {

              // Convert tags string → array
              const tagsArray = Array.isArray(item.tags)
                ? item.tags
                : item.tags?.split(",") || [];

              return (
                <motion.div
                  key={item._id} // unique key
                  initial={{ opacity: 0, y: 40 }} // animation start
                  animate={{ opacity: 1, y: 0 }}  // animation end
                  transition={{ delay: index * 0.05 }} // stagger
                  whileHover={{ scale: 1.04 }} // hover effect
                  className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg overflow-hidden flex flex-col"
                >

                  {/* 🔥 IMAGE */}
                  {item.photos?.length > 0 && (
                    <div className="relative w-full aspect-2/3 overflow-hidden">
                      <img
                        src={item.photos[0]}
                        alt="mantra"
                        className="w-full h-full object-cover"
                      />
                      {/* overlay gradient */}
                      <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
                    </div>
                  )}

                  {/* 🔥 CONTENT */}
                  <div className="p-3 flex flex-col flex-1">

                    {/* Title */}
                    <h2 className="text-sm font-semibold text-orange-400">
                      {item.title}
                    </h2>

                    {/* Description */}
                    <p className="text-xs text-gray-300 mt-1 line-clamp-2">
                      {item.description}
                    </p>

                    {/* TAGS */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {tagsArray.map((tag: string, i: number) => (
                        <span
                          key={i}
                          className="text-[10px] bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded-full"
                        >
                          #{tag.trim()}
                        </span>
                      ))}
                    </div>

                    {/* 🔥 PLAY BUTTON */}
                    {item.audio && (
                      <button
                        onClick={() => {
                          setAudio(item.audio); // set audio
                          setTitle(item.title); // set title
                          setImage(item.photos?.[0] || item.titlePhoto); // set image
                        }}
                        className="mt-3 w-full bg-linear-to-r from-orange-500 to-yellow-500 text-white text-xs py-1.5 rounded-full"
                      >
                        ▶ Play
                      </button>
                    )}

                    {/* 🔥 PLAYING STATUS */}
                    {audio === item.audio && (
                      <span className="text-green-400 text-xs mt-1">
                        Playing...
                      </span>
                    )}

                    {/* 🔥 DELETE */}
                    <div className="flex justify-end mt-auto pt-2">
                      <button
                        onClick={() => {
                          setDeleteItem(item); // select item
                          setOpen(true);       // open modal
                        }}
                        className="text-[10px] bg-red-500 text-white px-2 py-1 rounded-full"
                      >
                        Delete
                      </button>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* 🔥 PAGINATION */}
          <div className="mt-10 flex justify-center">
            <AppPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      )}

      {/* 🔥 DELETE MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/10 backdrop-blur-lg border border-white/10 p-6 rounded-xl text-center w-80 shadow-xl"
          >

            {/* Title */}
            <h2 className="text-lg font-semibold text-red-400">
              Delete Mantra
            </h2>

            {/* Message */}
            <p className="text-sm mt-2 text-gray-300">
              Delete <b>{deleteItem?.title}</b> ?
            </p>

            {/* Buttons */}
            <div className="flex justify-center gap-3 mt-4">

              <button
                onClick={() => setOpen(false)}
                className="px-3 py-1 bg-white/10 rounded"
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

          </motion.div>
        </div>
      )}

    </div>
  );
}