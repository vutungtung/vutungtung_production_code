import React, { useState } from "react";
import { AdminNavbar } from "../component/AdminDashboard/AdminNavbar";
import { Sidebar } from "../component/AdminDashboard/Sidebar";
import Overview from "../component/AdminDashboard/Overview";

import Setting from "../component/AdminDashboard/Setting";
import Users from "../component/AdminDashboard/Users";
import Vehicles from "../component/AdminDashboard/Vehicles";
import BookingComponent from "../component/AdminDashboard/Booking";


const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState("Overview");
  const [showAddModal, setShowAddModal] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const pages: Record<string, React.JSX.Element> = {
    Overview: <Overview />,
    Vehicles: (
      <Vehicles showAddModal={showAddModal} setShowAddModal={setShowAddModal} />
    ),
    Bookings: <BookingComponent />,
    Users: <Users />,
    Settings: <Setting />,
  };

  return (
    <div className="flex h-screen bg-light-gray">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onSelectPage={setActivePage}
        onClose={() => setIsSidebarOpen(false)}
        activePage={activePage}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <AdminNavbar
          onMenuClick={toggleSidebar}
          onSelectPage={setActivePage}
          onAddVehicleClick={() => {
            setActivePage("Vehicles");
            setShowAddModal(true);
          }}
        />
        <div className="flex-1 p-6 overflow-y-auto">{pages[activePage]}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
