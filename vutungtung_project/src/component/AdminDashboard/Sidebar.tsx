import { FaCar } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import { LuLayoutDashboard } from "react-icons/lu";
import { MdKeyboardArrowRight, MdOutlineCalendarToday } from "react-icons/md";
import { TbUsers } from "react-icons/tb";

interface SidebarProps {
  isOpen: boolean;
  onSelectPage: (page: string) => void;
  onClose: () => void;
  activePage: string;
}

export const Sidebar = ({
  isOpen,
  onSelectPage,
  onClose,
  activePage,
}: SidebarProps) => {
  const handleSelect = (page: string) => {
    onSelectPage(page);

    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const getClass = (page: string) =>
    `p-3 rounded-md flex items-center gap-2 cursor-pointer transition ${
      activePage === page
        ? "bg-red-100 border-l-[5px] border-red-500 text-red-500 font-medium"
        : "hover:bg-red-500 hover:text-white"
    }`;

  return (
    <div
      className={`fixed lg:static top-0 left-0 h-screen w-64 bg-white shadow flex flex-col transform transition-transform duration-300 z-40
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
    >
      {/* Logo */}
      <div className="flex justify-start h-[4.8rem] items-center border-b border-gray-200">
        <div className="px-6 py-3 text-xl font-black text-red">
          VUTING<span className="text-black">TUNG</span>
          <p className="text-xs font-normal text-gray-500">Admin Portal</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-4 p-2">
        <ul className="space-y-2">
          <li
            onClick={() => handleSelect("Overview")}
            className={getClass("Overview")}
          >
            <LuLayoutDashboard /> Overview
            {activePage === "Overview" && (
              <MdKeyboardArrowRight className="text-xl ml-auto" />
            )}
          </li>
          <li
            onClick={() => handleSelect("Vehicles")}
            className={getClass("Vehicles")}
          >
            <FaCar /> Vehicles
            {activePage === "Vehicles" && (
              <MdKeyboardArrowRight className="text-xl ml-auto" />
            )}
          </li>
          <li
            onClick={() => handleSelect("Bookings")}
            className={getClass("Bookings")}
          >
            <MdOutlineCalendarToday />
            Bookings
            {activePage === "Bookings" && (
              <MdKeyboardArrowRight className="text-xl ml-auto" />
            )}
          </li>
          <li
            onClick={() => handleSelect("Users")}
            className={getClass("Users")}
          >
            <TbUsers /> Users
            {activePage === "Users" && (
              <MdKeyboardArrowRight className="text-xl ml-auto" />
            )}
          </li>
          <li
            onClick={() => handleSelect("Settings")}
            className={getClass("Settings")}
          >
            <FiSettings /> Settings
            {activePage === "Settings" && (
              <MdKeyboardArrowRight className="text-xl ml-auto" />
            )}
          </li>
        </ul>
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-gray-200 flex justify-center items-center gap-2">
        <div className="h-12 w-12 bg-red-500 flex text-white rounded-full justify-center items-center">
          AD
        </div>
        <div>
          <p className="text-sm font-medium">Admin User</p>
          <p className="text-xs text-gray-500">admin@vutungtung.com</p>
        </div>
      </div>
    </div>
  );
};
