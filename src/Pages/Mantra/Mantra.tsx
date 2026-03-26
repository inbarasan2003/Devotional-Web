import { useState } from "react"; // React state
import { useQuery, useQueryClient } from "@tanstack/react-query"; // API + cache
import { getMantras, deleteMantra } from "../../services/Mantra-api"; // API functions
import AppPagination from "../../components/Pagination"; // pagination component
import toast from "react-hot-toast"; // toast notification
import { Commet } from "react-loading-indicators"; // loading spinner
import { useAudio } from "../../context/AudioProvider"; // 🔥 global audio

export default function MantraPage() {

  // search input state
  const [search, setSearch] = useState("");

  // current page number
  const [currentPage, setCurrentPage] = useState(1);

  // selected item for delete
  const [deleteItem, setDeleteItem] = useState<any>(null);

  // modal open state
  const [open, setOpen] = useState(false);

  // react query cache
  const queryClient = useQueryClient();

  // 🔥 audio global control
  const { setAudio, setTitle, setImage, audio } = useAudio();

  // items per page
  const itemsPerPage = 5;

  // fetch data from API
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["mantras"], // cache key
    queryFn: getMantras,   // API call
  });

  // filter data based on search
  const filteredMantras = (data ?? []).filter((item: any) =>
    item.title?.toLowerCase().includes(search.toLowerCase()),
  );

  // total pages calculation
  const totalPages = Math.max(
    1,
    Math.ceil(filteredMantras.length / itemsPerPage),
  );

  // starting index
  const startIndex = (currentPage - 1) * itemsPerPage;

  // slice data for current page
  const paginatedData = filteredMantras.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // delete confirm function
  const confirmDelete = async () => {

    if (!deleteItem) return; // safety check

    try {
      // toast with promise
      await toast.promise(deleteMantra(deleteItem._id), {
        loading: "Deleting...",
        success: "Deleted Successfully ✅",
        error: "Delete Failed ❌",
      });

      // refresh data
      await queryClient.invalidateQueries({ queryKey: ["mantras"] });

      setOpen(false); // close modal
      setDeleteItem(null); // reset item

    } catch (err) {
      console.error(err); // error log
    }
  };

  // error UI
  if (isError) {
    return (
      <div className="text-red-500 text-center mt-10">
        {(error as any)?.message || "Error ❌"}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 p-4 md:p-6 mt-15 pb-28">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-5">

        {/* page title */}
        <h1 className="text-xl md:text-2xl font-bold text-orange-600">
          🪔 Devotional Mantras
        </h1>

        {/* search input */}
        <input
          type="text"
          placeholder="Search mantra..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value); // update search
            setCurrentPage(1); // reset page
          }}
          className="w-full md:w-64 px-3 py-2 rounded-full border bg-white text-sm"
        />
      </div>

      {/* LOADING */}
      {isLoading ? (
        <div className="flex justify-center mt-10">
          <Commet color="#cc3f31" size="medium" text="Loading" textColor="#bf3f00" />
        </div>
      ) : (
        <>
          {/* GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 justify-items-center">

            {/* loop each mantra */}
            {paginatedData.map((item: any) => {

              // convert tags string → array
              const tagsArray = Array.isArray(item.tags)
                ? item.tags
                : item.tags?.split(",") || [];

              return (
                <div
                  key={item._id} // unique key
                  className="bg-white rounded-xl shadow-md flex flex-col w-65 overflow-hidden hover:shadow-lg transition"
                >

                  {/* IMAGE */}
                  {item.photos?.length > 0 && (
                    <div className="w-full aspect-2/3 overflow-hidden">
                      <img
                        src={item.photos[0]} // first image
                        alt="mantra"
                        className="w-full h-full object-cover object-[center_top]"
                      />
                    </div>
                  )}

                  {/* CONTENT */}
                  <div className="p-3 flex flex-col flex-1">

                    {/* title */}
                    <h2 className="text-sm font-semibold text-orange-600">
                      {item.title}
                    </h2>

                    {/* description */}
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {item.description}
                    </p>

                    {/* TAGS */}
                    <div className="flex flex-wrap gap-1 mt-2">

                      {/* loop tags */}
                      {tagsArray.map((tag: string, i: number) => (
                        <span
                          key={i}
                          className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full"
                        >
                          #{tag.trim()}
                        </span>
                      ))}

                    </div>

                    {/* 🔥 PLAY BUTTON (GLOBAL AUDIO) */}
                    {item.audio && (
                      <button
                        onClick={() => {

                          setAudio(item.audio); // set audio
                          setTitle(item.title); // set title

                          // 🔥 set image
                          setImage(item.photos?.[0] || item.titlePhoto);

                        }}
                        className="mt-2 w-full bg-orange-500 hover:bg-orange-600 text-white text-xs py-1 rounded"
                      >
                        ▶ Play
                      </button>
                    )}

                    {/* 🔥 SHOW PLAYING STATUS */}
                    {audio === item.audio && (
                      <span className="text-green-500 text-xs mt-1">
                        Playing...
                      </span>
                    )}

                    {/* DELETE */}
                    <div className="flex justify-end mt-auto pt-2">
                      <button
                        onClick={() => {
                          setDeleteItem(item); // set item
                          setOpen(true);       // open modal
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
              currentPage={currentPage} // current page
              totalPages={totalPages}   // total pages
              onPageChange={setCurrentPage} // change page
            />
          </div>
        </>
      )}

      {/* DELETE MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white p-5 rounded-xl text-center w-75 shadow-lg">

            <h2 className="text-lg font-semibold text-red-500">
              Delete Mantra
            </h2>

            <p className="text-sm mt-2">
              Delete <b>{deleteItem?.title}</b> ?
            </p>

            <div className="flex justify-center gap-3 mt-4">

              {/* cancel */}
              <button
                onClick={() => setOpen(false)}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                Cancel
              </button>

              {/* confirm delete */}
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