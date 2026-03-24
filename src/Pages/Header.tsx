import { NavLink, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthProvider";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Header() {

  // const { logout } = useAuth();

  // dropdown open state
  const [open, setOpen] = useState(false);
  const navigate = useNavigate()

  // logout confirm
  const handleLogoutConfirm = () => {
    toast((t) => (
      <div className="flex flex-col gap-3">

        <p className="text-sm font-medium">
          Are you sure you want to logout?
        </p>

        <div className="flex justify-end gap-3">

          {/* cancel */}
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 border rounded text-sm"
          >
            Cancel
          </button>

          {/* confirm */}
          <button
            onClick={() => {
              toast.dismiss(t.id);
               // call your auth logout
              toast.success("Logout successfully", {
                duration: 2000
              })

              setTimeout(() => {
                localStorage.clear()
                navigate('/login')
                window.location.reload();
              }, 1200)
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
    <header className="flex justify-between items-center px-6 py-6 shadow bg-white">
      
      {/* LOGO */}
      <h2 className="font-bold text-xl text-orange-500">
        DevoTion 🙏
      </h2>

      {/* NAV */}
      <nav className="flex gap-6 items-center">

        <NavLink
          to="/mantra"
          className={({ isActive }) =>
            isActive ? "text-orange-500 font-semibold" : "text-gray-600"
          }
        >
          Home
        </NavLink>

        <NavLink to="/create-mantra">Add Mantra</NavLink>

        <NavLink
          to="/stories"
          className={({ isActive }) =>
            isActive ? "text-orange-500 font-semibold" : "text-gray-600"
          }
        >
          Stories
        </NavLink>

        <NavLink to={'/create-Story'}>Add Story</NavLink>

        {/* PROFILE DROPDOWN */}
        <div className="relative">

          {/* profile button */}
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="text-gray-600 hover:text-orange-500"
          >
            Profile
          </button>

          {/* dropdown */}
          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg py-2">


              <NavLink
                to="/profile"
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
    </header>
  );
}