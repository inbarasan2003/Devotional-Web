// Import UI pagination components
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

// Props type (data coming from parent)
type Props = {
  currentPage: number; // current active page
  totalPages: number;  // total number of pages
  onPageChange: (page: number) => void; // function to change page
};

export default function AppPagination({
  currentPage,
  totalPages,
  onPageChange,
}: Props) {

  // Function to generate page numbers with "..."
  const generatePages = () => {
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {

      // Always show first page, last page, and nearby pages
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(i);
      }

      // Show "..." when skipping pages
      else if (i === currentPage - 2 || i === currentPage + 2) {
        pages.push("...");
      }
    }

    return pages;
  };

  return (

    // Center align pagination
    <div className="flex justify-center items-center">

      <Pagination>
        {/* Main container with glass UI */}
        <PaginationContent className="flex items-center gap-2 bg-white/10 backdrop-blur-lg border border-white/10 px-3 py-2 rounded-full shadow-lg">

          {/* 🔥 PREVIOUS BUTTON */}
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault(); // prevent page reload

                // Go to previous page if not first page
                if (currentPage > 1) onPageChange(currentPage - 1);
              }}
              className="text-gray-300 hover:text-white hover:bg-orange-500/20 rounded-full px-2 py-1 transition"
            />
          </PaginationItem>

          {/* 🔥 PAGE NUMBERS */}
          {generatePages().map((page, index) =>

            // If page is "..." show ellipsis
            page === "..." ? (
              <PaginationItem key={index}>
                <PaginationEllipsis className="text-gray-400" />
              </PaginationItem>
            ) : (

              // Normal page number
              <PaginationItem key={index}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === page} // highlight active page
                  onClick={(e) => {
                    e.preventDefault();

                    // Change page
                    onPageChange(Number(page));
                  }}

                  // Dynamic styling
                  className={`
                    px-3 py-1 text-sm rounded-full transition
                    ${
                      currentPage === page
                        // Active page style
                        ? "bg-linear-to-r from-orange-500 to-yellow-400 text-white shadow-md"
                        // Normal page style
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                    }
                  `}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            )
          )}

          {/* 🔥 NEXT BUTTON */}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();

                // Go to next page if not last page
                if (currentPage < totalPages) onPageChange(currentPage + 1);
              }}
              className="text-gray-300 hover:text-white hover:bg-orange-500/20 rounded-full px-2 py-1 transition"
            />
          </PaginationItem>

        </PaginationContent>
      </Pagination>

    </div>
  );
}