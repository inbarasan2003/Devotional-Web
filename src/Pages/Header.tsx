import { NavLink, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";

export default function Header() {

  const [open, setOpen] = useState(false); // profile dropdown
  const [menuOpen, setMenuOpen] = useState(false); // mobile menu
  const navigate = useNavigate();

  const dropdownRef = useRef<any>(null);

  // close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // logout confirm
  const handleLogoutConfirm = () => {
    toast((t) => (
      <div className="flex flex-col gap-3">

        <p className="text-sm font-medium">
          Are you sure you want to logout?
        </p>

        <div className="flex justify-end gap-3">

          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 border rounded text-sm"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              toast.dismiss(t.id);
              toast.success("Logout successfully");

              setTimeout(() => {
                localStorage.clear();
                navigate("/login");
                window.location.reload();
              }, 1200);
            }}
            className="px-3 py-1 bg-red-500 text-white rounded text-sm"
          >
            Yes, Logout
          </button>

        </div>
      </div>
    ));
  };

  return (
    <header className="bg-white shadow px-4 md:px-6 py-4 flex justify-between items-center">

      {/* LOGO */}
      <h2 className="font-bold text-xl text-orange-500">
        DevoTion 🙏
      </h2>

      {/* DESKTOP NAV */}
      <nav className="hidden md:flex gap-6 items-center">

        <NavLink to="/mantra">Home</NavLink>
        <NavLink to="/create-mantra">Add Mantra</NavLink>
        <NavLink to="/stories">Stories</NavLink>
        <NavLink to="/create-Story">Add Story</NavLink>

        {/* PROFILE */}
        <div ref={dropdownRef} className="relative">

          <button
            onClick={() => setOpen((prev) => !prev)}
            className="hover:text-orange-500"
          >
            Profile
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg py-2">

              <NavLink
                to="/profile"
                onClick={() => setOpen(false)}
                className="block px-4 py-2 text-sm hover:bg-gray-100"
              >
                My Profile
              </NavLink>

              <button
                onClick={handleLogoutConfirm}
                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
              >
                Logout
              </button>

            </div>
          )}
        </div>
      </nav>

      {/* MOBILE MENU ICON */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden text-2xl"
      >
        ☰
      </button>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center gap-4 py-4 md:hidden z-50">

          <NavLink to="/mantra" onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>

          <NavLink to="/create-mantra" onClick={() => setMenuOpen(false)}>
            Add Mantra
          </NavLink>

          <NavLink to="/stories" onClick={() => setMenuOpen(false)}>
            Stories
          </NavLink>

          <NavLink to="/create-Story" onClick={() => setMenuOpen(false)}>
            Add Story
          </NavLink>

          <NavLink to="/profile" onClick={() => setMenuOpen(false)}>
            My Profile
          </NavLink>

          <button
            onClick={() => {
              setMenuOpen(false);
              handleLogoutConfirm();
            }}
            className="text-red-500"
          >
            Logout
          </button>

        </div>
      )}
    </header>
  );
}