import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Tooltip as ReactTooltip } from 'react-tooltip';
import Loader from "./Loader";
import { logoutUser } from "../utils/logoutUser";
import { refreshToken } from "../utils/refreshToken";
import Header from "./Header";
import NavBar from "./NavBar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const selectProperty = (state: RootState) => state.auth.user;
  const user = useSelector(selectProperty);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSessionExpiry = async () => {
    const userChoice = window.confirm("Your session is about to expire. You will lose any unsaved changes. Do you want to refresh your session?");
    if (userChoice) {
      await refreshToken();
    } else {
      await logoutUser();
    }
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const interval = setInterval(() => {
      handleSessionExpiry();
    }, 14 * 60 * 1000); // Check every 14 minutes

    return () => { 
      document.body.style.overflow = 'auto';
      clearInterval(interval);
    }
  }, []);


  return (
    <div className="flex flex-col h-screen">
      <Header children={children} username={user?.username as string} />
      <div className="flex flex-1">
        <NavBar wrapperClassName="" setIsSidebarOpen={setIsSidebarOpen} isSidebarOpen={isSidebarOpen} />
        {/* Main Content */}
        <div id="mainloader" className="fixed inset-0 hidden flex justify-center items-center">
          <Loader />
        </div>
        <main className="flex-1 p-4">{children}</main>
      </div>
      <ReactTooltip id="tooltip" place="right"/>
    </div>
  );
};

export default Layout;