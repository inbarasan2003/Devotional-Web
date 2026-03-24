// React state
import { useState } from "react";

// React Query hooks (fetch + cache control)
import { useQuery, useQueryClient } from "@tanstack/react-query";

// API functions
import { getMantras, deleteMantra } from "../../services/Mantra-api";

// reusable pagination component
import AppPagination from "../../components/Pagination";

export default function MantraPage() {

  // search input state
  const [search, setSearch] = useState("");

  // current page state
  const [currentPage, setCurrentPage] = useState(1);

  // react query cache handler
  const queryClient = useQueryClient();

  // number of items per page
  const itemsPerPage = 8;

  // fetch all mantras
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["mantras"], // cache key
    queryFn: getMantras,   // API call
  });

  // filter based on search input
  const filteredMantras = (data ?? []).filter((item: any) =>
    item.title?.toLowerCase().includes(search.toLowerCase()),
  );

  // calculate total pages
  const totalPages = Math.max(
    1,
    Math.ceil(filteredMantras.length / itemsPerPage),
  );

  // calculate starting index for pagination
  const startIndex = (currentPage - 1) * itemsPerPage;

  // slice data for current page
  const paginatedData = filteredMantras.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // delete function
  const handleDelete = async (id: string) => {

    // confirm before delete
    if (!window.confirm("Delete this mantra?")) return;

    try {
      // call delete API
      await deleteMantra(id);

      // refetch data after delete
      await queryClient.invalidateQueries({ queryKey: ["mantras"] });

    } catch {
      // error message
      alert("Delete failed ❌");
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
    // page container
    <div className="min-h-screen bg-orange-50 p-4 md:p-6">
      
      {/* header section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">

        {/* title */}
        <h1 className="text-2xl md:text-3xl font-bold text-orange-600">
          🪔 Devotional Mantras
        </h1>

        {/* search input */}
        <input
          type="text"
          placeholder="Search mantra..."
          value={search}

          // update search + reset page
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}

          className="p-2 border rounded w-full md:w-64 shadow-sm text-sm"
        />
      </div>

      {/* loading state */}
      {isLoading ? (
        <p className="mt-6 text-center">Loading...</p>
      ) : (
        <>
          
          {/* grid layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">

            {paginatedData.length > 0 ? (
              paginatedData.map((item: any) => (

                // card
                <div
                  key={item._id}
                  className="bg-white rounded-xl shadow-sm p-4 max-w-sm mx-auto hover:shadow-md transition flex flex-col"
                >
                 
                  {/* title */}
                  <h2 className="text-sm font-semibold text-orange-600 truncate">
                    {item.title}
                  </h2>

                  {/* description */}
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {item.description}
                  </p>

                  {/* image */}
                  {item.photos?.length > 0 && (
                    <div className="mt-2 w-full h-32 overflow-hidden rounded-lg">
                      <img
                        src={item.photos[0]}
                        alt="mantra"
                        loading="lazy" // performance optimization
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* audio player */}
                  {item.audio && (
                    <audio controls src={item.audio} className="mt-2 h-8" />
                  )}

                  {/* tags */}
                  {item.tags && (
                    <p className="text-[10px] text-gray-400 mt-1 truncate">
                      #{item.tags}
                    </p>
                  )}

                  {/* delete button */}
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
              // empty state
              <p className="text-center col-span-full text-gray-500">
                No mantras found 😐
              </p>
            )}
          </div>

          {/* pagination section */}
          <div className="mt-85 flex justify-center">
            <AppPagination
              currentPage={currentPage}     // current page
              totalPages={totalPages}       // total pages
              onPageChange={setCurrentPage} // change handler
            />
          </div>
        </>
      )}
    </div>
  );
}