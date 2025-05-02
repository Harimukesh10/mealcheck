import React, { ReactNode, useState } from "react";
import { FaUser } from "react-icons/fa6";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import { logoutUser } from "../utils/logoutUser";
import NavBar from "./NavBar";
import { GiHotMeal } from "react-icons/gi";

const Header: React.FC<{ username: string; children: ReactNode }> = ({
  username,
}) => {
  const selectProperty = (state: RootState) => state.auth.user;
  const user = useSelector(selectProperty);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <header className="bg-gradient-to-r from-orange-400 to-orange-700 text-white p-6">
        <div className="flex justify-between items-center">
          {user && (
            <div className="flex items-center md:hidden justify-between space-x-4">
              <button
                type="button"
                className="bg-gray-600 px-3 py-1 rounded"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                ☰
              </button>
            </div>
          )}
          <div className="flex">
            <div className="text-lg font-bold">
              <a href={username ? "" : "/"} className="text-white">
                Recipe Explorer
              </a>

            </div>
            <div className="text-xl px-2 pb-1"> <GiHotMeal /></div>
          </div>

          <div className="flex space-x-2 items-center">
            <div className="flex space-x-2 items-center">
              <FaUser />
              <span>{username}</span>
            </div>
            {user && (
              <button
                type="button"
                onClick={logoutUser}
                className="bg-white hover:border-black border-2 border-white text-start rounded w-auto font-semibold text-orange-500 px-4 py-2 ml-auto"
              >
                Logout
              </button>
            )}
          </div>

        </div>
      </header>
      <NavBar wrapperClassName="visible md:hidden" setIsSidebarOpen={setIsSidebarOpen} isSidebarOpen={isSidebarOpen} />
    </>
  );
};

export default Header;