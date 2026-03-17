import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header className="flex justify-between items-center px-6 py-6 shadow bg-white">
      
      <h2 className="font-bold text-xl text-orange-500">
        DevoTion 🙏
      </h2>

      <nav className="flex gap-4">
        <NavLink
          to="/mantra"
          className={({ isActive }) =>
            isActive ? "text-orange-500 font-semibold" : "text-gray-600"
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/stories"
          className={({ isActive }) =>
            isActive ? "text-orange-500 font-semibold" : "text-gray-600"
          }
        >
          Stories
        </NavLink>

        <NavLink
        to='/profile'
        className={({isActive})=>
            isActive ? 'text-orange-500 font-semibold' :'text-gray-600'
        }
        >
            Profile
        </NavLink>
      </nav>
    </header>
  );
}