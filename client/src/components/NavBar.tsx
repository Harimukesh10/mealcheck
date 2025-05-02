import React from 'react'
import { Link, useLocation } from 'react-router-dom';
import { RootState } from '../redux/store';
import { useSelector } from 'react-redux';
import { MdFoodBank } from "react-icons/md";
import {  FaHeart } from "react-icons/fa";

interface Nav {
  wrapperClassName: string;
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const NavBar: React.FC<Nav> = ({ isSidebarOpen, setIsSidebarOpen, wrapperClassName = "" }) => {
  const selectProperty = (state: RootState) => state.auth.user;
  const user = useSelector(selectProperty);
  const location = useLocation();
  const { pathname } = location;
  type Role = "admin" | "member";
  const links: Record<Role, { to: string; label: React.ReactNode; tooltip: string }[]> =
    {
      member: [
       
        { to: "/meallist", label: <MdFoodBank />, tooltip: "Meal List" },
        { to: "/myfavourites", label: <FaHeart className="text-red-500" />, tooltip: "Favourite Meal" }

      ],
      admin: [
        { to: "/meallist", label: <MdFoodBank />, tooltip: "Meal List" },
       
      ],
    };
  return (
    <div className={wrapperClassName}>
      <aside
        className={`fixed md:h-full md:relative px-3 bg-gradient-to-t from-orange-400 to-orange-700 text-white transform ${
          isSidebarOpen ? "translate-x-0 z-2" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <nav className="flex flex-col flex-shrink-0 h-full px-2 py-4 items-center justify-center flex-1 space-y-1">
          {links[user?.role as Role]?.map(
            (link: { to: string; label: React.ReactNode; tooltip: string }) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className={`hover:border-black hover:text-orange-500 p-2 mb-2 border-4 border-orange-700 rounded inline-block text-xl font-bold tracking-wider bg-white  uppercase text-orange-500 ${
                  pathname === link.to ? "bg-white" : "bg-orange-500"
                }`}
                data-tooltip-id="tooltip" // Link to the tooltip
                data-tooltip-content={link.tooltip} // Add tooltip text
              >
                {link.label}
              </Link>
            )
          )}
        </nav>
      </aside>
    </div>
  )
}

export default NavBar;