import { NavLink, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [open, setOpen] = useState(false); // profile dropdown
  const [menuOpen, setMenuOpen] = useState(false); // mobile menu
  const navigate = useNavigate();

  const dropdownRef = useRef<any>(null);

  // close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
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
      <div className="flex flex-col gap-4 bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-5 shadow-2xl w-72">
        {/* MESSAGE */}
        <p className="text-sm font-medium text-white text-center">
          Are you sure you want to logout?
        </p>

        {/* BUTTONS */}
        <div className="flex justify-center gap-3 mt-1">
          {/* CANCEL */}
          <button
            onClick={() => toast.dismiss(t.id)}
            className="flex-1 px-3 py-1.5 border border-white/20 rounded-full text-xs text-gray-300 hover:bg-white/10 hover:text-white transition"
          >
            Cancel
          </button>

          {/* LOGOUT */}
          <button
            onClick={() => {
              toast.dismiss(t.id);
              localStorage.removeItem("authToken");
              localStorage.removeItem("user");
              localStorage.removeItem("userId");
              toast.success("Logout Successfully", {
                style: {
                  background: "rgba(15,23,42,0.85)",
                  color: "#fff",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(34,197,94,0.3)", // green border
                  borderRadius: "14px",
                  boxShadow: "0 0 20px rgba(34,197,94,0.3)", // glow
                },
              });      
              setTimeout(() => {
                localStorage.clear();
                navigate("/login");
                window.location.reload();
              }, 200);
            }}
            className="flex-1 px-3 py-1.5 bg-linear-to-r from-orange-500 to-yellow-500 text-white rounded-full text-xs shadow-lg hover:scale-105 transition"
          >
            Yes, Logout
          </button>
        </div>
      </div>
    ));
  };
  return (
    <header className="bg-white/10 backdrop-blur-lg border-b border-white/10 shadow-lg px-4 md:px-6 py-4 flex justify-between items-center fixed top-0 left-0 w-full z-50 text-white">
      {/* 🔥 LOGO */}
      <h2
        onClick={() => navigate("/home")}
        className="font-bold text-xl text-orange-400 tracking-wide cursor-pointer hover:scale-105 transition"
      >
        DevoTion ✨
      </h2>

      {/* 🔥 DESKTOP NAV */}
      <nav className="hidden md:flex gap-6 items-center">
        {[
          { name: "Home", path: "/home" },
          { name: "Mantra", path: "/mantra" },
          { name: "Add Mantra", path: "/create-mantra" },
          { name: "Stories", path: "/stories" },
          { name: "Add Story", path: "/create-Story" },
        ].map((link, i) => (
          <NavLink
            key={i}
            to={link.path}
            className={({ isActive }) =>
              isActive
                ? "text-orange-400 font-semibold"
                : "text-gray-300 hover:text-orange-300 transition"
            }
          >
            {link.name}
          </NavLink>
        ))}

        {/* 🔥 PROFILE */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="hover:text-orange-400 transition"
          >
            Profile
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-3 w-44 bg-white/10 backdrop-blur-lg border border-white/10 rounded-xl shadow-lg py-2"
              >
                <NavLink
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10"
                >
                  My Profile
                </NavLink>

                <button
                  onClick={handleLogoutConfirm}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/10"
                >
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* 🔥 MOBILE MENU BUTTON */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden text-2xl hover:scale-110 transition"
      >
        ☰
      </button>

      {/* 🔥 MOBILE MENU */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 left-0 w-full bg-black/80 backdrop-blur-lg flex flex-col items-center gap-4 py-6 md:hidden z-50"
          >
            {[
              { name: "Home", path: "/home" },
              { name: "Mantra", path: "/mantra" },
              { name: "Add Mantra", path: "/create-mantra" },
              { name: "Stories", path: "/stories" },
              { name: "Add Story", path: "/create-Story" },
              { name: "My Profile", path: "/profile" },
            ].map((link, i) => (
              <NavLink
                key={i}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className="text-gray-300 hover:text-orange-400 transition"
              >
                {link.name}
              </NavLink>
            ))}

            <button
              onClick={() => {
                setMenuOpen(false);
                handleLogoutConfirm();
              }}
              className="text-red-400"
            >
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
