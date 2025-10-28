// import { useState, useEffect, useRef } from "react";
// import { IoMdAdd } from "react-icons/io";
// import { FiMoreVertical, FiFilter } from "react-icons/fi";
// import AddVehicleForm from "./AddVehicleForm";
// import ViewVehicleModal from "./ViewVehicleModal";
// import DeleteVehicleModal from "./DeleteVehicleModal";
// import type { Vehicle, NewVehicle } from "../../types/vehicle";
// import { addVehicle, fetchVehicles } from "../../api/vehicleApi";
// import EditVehicleModal from "./EditVehicleModal";
// import axios from "axios";

// interface VehicleProps {
//   showAddModal: boolean;
//   setShowAddModal: (value: boolean) => void;
// }

// const Vehicles = ({ showAddModal, setShowAddModal }: VehicleProps) => {
//   const [search, setSearch] = useState("");
//   const [filterCategory, setFilterCategory] = useState("All");
//   const [filterStatus, setFilterStatus] = useState("All");
//   const [filterTransmission, setFilterTransmission] = useState("All");
//   const [vehicleList, setVehicleList] = useState<Vehicle[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [editVehicle, setEditVehicle] = useState(null);

//   const [openMenuId, setOpenMenuId] = useState<number | null>(null);
//   const [viewVehicle, setViewVehicle] = useState<Vehicle | null>(null);
//   const [deleteVehicleTarget, setDeleteVehicleTarget] =
//     useState<Vehicle | null>(null);
//   const [showFilter, setShowFilter] = useState(false);

//   const filterRef = useRef<HTMLDivElement | null>(null);

//   // Close filter dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
//         setShowFilter(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Fetch vehicles from backend
//   useEffect(() => {
//     const loadVehicles = async () => {
//       try {
//         const res = await fetch("http://localhost:4000/api/vehicles/");
//         if (!res.ok) throw new Error("Failed to fetch vehicles");
//         const data: Vehicle[] = await res.json();
//         setVehicleList(data);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadVehicles();
//   }, []);

//   // Updated filteredVehicles with better matching
//   const filteredVehicles = vehicleList.filter((v) => {
//     const matchesSearch =
//       (v.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
//       (v.brand?.toLowerCase() || "").includes(search.toLowerCase()) ||
//       (v.model?.toLowerCase() || "").includes(search.toLowerCase());

//     // ✅ Better category matching (handle both object and string)
//     const categoryName =
//       typeof v.category === "object" ? v.category?.name : v.category;
//     const matchesCategory =
//       filterCategory === "All" ||
//       (categoryName &&
//         categoryName.toLowerCase() === filterCategory.toLowerCase());

//     // ✅ Better transmission matching (handle case differences)
//     const transmissionValue = v.transmission;
//     const matchesTransmission =
//       filterTransmission === "All" ||
//       (transmissionValue &&
//         transmissionValue.toUpperCase() === filterTransmission.toUpperCase());

//     // ✅ Better status matching (handle case differences)
//     const matchesStatus =
//       filterStatus === "All" ||
//       (v.status && v.status.toUpperCase() === filterStatus.toUpperCase());

//     console.log("Vehicle:", v.name, {
//       category: categoryName,
//       transmission: transmissionValue,
//       status: v.status,
//       matchesCategory,
//       matchesTransmission,
//       matchesStatus,
//     });

//     return (
//       matchesSearch && matchesCategory && matchesTransmission && matchesStatus
//     );
//   });

//   const handleDelete = async (v_id: number) => {
//     try {
//       const res = await axios.delete(
//         `http://localhost:4000/api/vehicles/delete/${v_id}`,
//         { withCredentials: true }
//       );
//       console.log("Delete Response:", res.data);

//       if (res.status === 200) {
//         alert("Vehicle deleted successfully!");
//         setVehicleList((prev) => prev.filter((v) => v.v_id !== v_id));
//         setDeleteVehicleTarget(null);
//       } else {
//         alert(res.data?.message || "Failed to delete vehicle.");
//       }
//     } catch (err: any) {
//       console.error("Delete Error:", err.response?.data || err.message);
//       alert("Failed to delete vehicle. Check console for details.");
//     }
//   };

//   return (
//     <div>
//       {/* Header */}
//       <div className="flex flex-wrap gap-2  justify-between mb-10 items-center">
//         <div>
//           <h1 className="text-2xl font-bold">Vehicle Management</h1>
//           <p className="text-gray-500 text-sm">Manage your fleet of vehicles</p>
//         </div>
//         <button
//           onClick={() => setShowAddModal(true)}
//           className="flex justify-start w-fit items-center gap-2 px-4 py-2 rounded-lg text-white bg-red hover:bg-gradient-red"
//         >
//           <IoMdAdd size={20} /> Add Vehicle
//         </button>
//       </div>

//       {/* Add Vehicle Modal */}
//       {showAddModal && (
//         <AddVehicleForm
//           onClose={() => setShowAddModal(false)}
//           onSave={async (newVehicle: NewVehicle) => {
//             const saved: Vehicle = await addVehicle(newVehicle);
//             setVehicleList((prev) => [...prev, saved]);
//             setShowAddModal(false);
//           }}
//         />
//       )}

//       {/* Search + Filter */}
//       <div className="flex flex-wrap items-center justify-between bg-white p-5 rounded-2xl border border-gray-300 gap-4">
//         <input
//           type="text"
//           placeholder="Search vehicles by brand, model, or category..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="flex-1 min-w-[250px] px-4 py-2 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-red outline-none"
//         />

//         <div className="relative w-full sm:w-auto" ref={filterRef}>
//           <button
//             onClick={() => setShowFilter(!showFilter)}
//             className="flex items-center w-full gap-2 px-4 py-2 border text-center border-gray-300 rounded-lg bg-white hover:bg-gray-50"
//           >
//             <FiFilter size={18} /> Filters
//           </button>

//           {showFilter && (
//             <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-xl shadow-lg p-4 z-20">
//               <div className="flex justify-between items-center mb-3">
//                 <p className="font-semibold text-gray-700">Filters</p>
//                 <button
//                   className="text-sm text-red hover:underline"
//                   onClick={() => {
//                     setFilterCategory("All");
//                     setFilterStatus("All");
//                     setFilterTransmission("All");
//                     setShowFilter(false);
//                   }}
//                 >
//                   Clear
//                 </button>
//               </div>

//               {/* Status */}
//               <div className="mb-3">
//                 <label className="block text-sm text-gray-600 mb-1">
//                   Status
//                 </label>
//                 <select
//                   value={filterStatus}
//                   onChange={(e) => setFilterStatus(e.target.value)}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red outline-none"
//                 >
//                   <option value="All">All</option>
//                   <option value="AVAILABLE">Available</option>
//                   <option value="RENTED">Rented</option>
//                   <option value="MAINTENANCE">Maintenance</option>
//                 </select>
//               </div>

//               {/* Category */}
//               <div className="mb-3">
//                 <label className="block text-sm text-gray-600 mb-1">
//                   Category
//                 </label>
//                 <select
//                   value={filterCategory}
//                   onChange={(e) => setFilterCategory(e.target.value)}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red outline-none"
//                 >
//                   <option value="All">All</option>
//                   <option value="SUV">SUV</option>
//                   <option value="Car">Car</option>
//                   <option value="Truck">Truck</option>
//                   <option value="Rickshaw">Rickshaw</option>
//                   <option value="2-Wheeler">2-Wheeler</option>
//                 </select>
//               </div>

//               {/* Transmission */}
//               <div className="mb-3">
//                 <label className="block text-sm text-gray-600 mb-1">
//                   Transmission
//                 </label>
//                 <select
//                   value={filterTransmission}
//                   onChange={(e) => setFilterTransmission(e.target.value)}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red outline-none"
//                 >
//                   <option value="All">All</option>
//                   <option value="MANUAL">Manual</option>
//                   <option value="AUTOMATIC">Automatic</option>
//                 </select>
//               </div>

//               <p className="text-xs text-gray-500 mt-3">
//                 Showing {filteredVehicles.length} of {vehicleList.length}{" "}
//                 vehicles
//               </p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Vehicle Cards */}
//       {loading ? (
//         <p>Loading vehicles...</p>
//       ) : (
//         <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {filteredVehicles.length > 0 ? (
//             filteredVehicles.map((v) => {
//               // const images = [v.image, v.image1, v.image2].filter(Boolean);
//               return (
//                 <div
//                   key={v.v_id}
//                   className="relative rounded-lg bg-white overflow-hidden shadow hover:shadow-lg transition"
//                 >
//                   <img
//                     src={`http://localhost:4000/uploads/vehicles/${v.image}`} // ✅ Correct path
//                     alt={v.name}
//                     className="w-full h-40 object-cover"
//                     onError={(e) => {
//                       e.currentTarget.src = "/fallback-image.jpg"; // Fallback for broken images
//                     }}
//                   />
//                   <div className="p-5">
//                     <h3 className="text-lg font-bold">{v.name}</h3>
//                     <p className="text-sm text-gray-500">
//                       {v.brand} • {v.model} • {v.transmission}
//                     </p>
//                     <div className="flex items-center justify-between">
//                       <p className="text-red font-semibold mt-2">
//                         Rs. {v.dailyRate} / day
//                       </p>

//                       <p
//                         className={`text-sm font-semibold mt-1 inline-block px-2 py-1 rounded ${
//                           (v.status || "").toUpperCase() === "AVAILABLE"
//                             ? "bg-green-100 text-green-800"
//                             : (v.status || "").toUpperCase() === "RENTED"
//                             ? "bg-red-100 text-red-500"
//                             : "bg-orange-100 text-orange-800"
//                         }`}
//                       >
//                         {v.status}
//                       </p>
//                     </div>
//                   </div>

//                   {/* 3-dot Menu */}
//                   <div className="absolute top-3 right-3">
//                     <button
//                       className="menu-button p-2 rounded-full bg-gray-100"
//                       onClick={() =>
//                         setOpenMenuId(openMenuId === v.v_id ? null : v.v_id)
//                       }
//                     >
//                       <FiMoreVertical size={18} />
//                     </button>

//                     {openMenuId === v.v_id && (
//                       <div className="menu-dropdown absolute right-0 mt-2 w-36 bg-white overflow-hidden rounded-lg shadow-md z-10">
//                         <button
//                           className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
//                           onClick={() => {
//                             setViewVehicle(v);
//                             setOpenMenuId(null);
//                           }}
//                         >
//                           View
//                         </button>
//                         <button
//                           className="block w-full text-left px-4 py-2 text-sm  hover:bg-gray-100"
//                           onClick={() => {
//                             setEditVehicle(v); // ✅ store selected vehicle data in a state
//                             setOpenMenuId(null);
//                           }}
//                         >
//                           Edit
//                         </button>
//                         <button
//                           className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
//                           onClick={() => {
//                             setDeleteVehicleTarget(v);
//                             setOpenMenuId(null);
//                           }}
//                         >
//                           Delete
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               );
//             })
//           ) : (
//             <p className="text-gray-500 mt-6">No vehicles found.</p>
//           )}
//         </div>
//       )}

//       {/* Modals */}
//       {viewVehicle && (
//         <ViewVehicleModal
//           vehicle={viewVehicle} // This should be the complete vehicle object
//           onClose={() => setViewVehicle(null)}
//         />
//       )}

//       {deleteVehicleTarget && (
//         <DeleteVehicleModal
//           vehicleTitle={deleteVehicleTarget.name}
//           onClose={() => setDeleteVehicleTarget(null)}
//           onConfirm={() => handleDelete(deleteVehicleTarget.v_id)}
//         />
//       )}
//       {editVehicle && (
//         <EditVehicleModal
//           vehicle={editVehicle}
//           onClose={() => setEditVehicle(null)}
//           onUpdate={() => {
//             // ✅ Must be onUpdate, not onSave
//             setEditVehicle(null);
//             fetchVehicles(); // Refresh the vehicle list
//           }}
//         />
//       )}
//     </div>
//   );
// };

// export default Vehicles;

import { useState, useEffect, useRef } from "react";
import { IoMdAdd } from "react-icons/io";
import {
  FiMoreVertical,
  FiFilter,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import AddVehicleForm from "./AddVehicleForm";
import ViewVehicleModal from "./ViewVehicleModal";
import DeleteVehicleModal from "./DeleteVehicleModal";
import type { Vehicle, NewVehicle } from "../../types/vehicle";
import { addVehicle, fetchVehicles } from "../../api/vehicleApi";
import EditVehicleModal from "./EditVehicleModal";
import axios from "axios";

interface VehicleProps {
  showAddModal: boolean;
  setShowAddModal: (value: boolean) => void;
}

const Vehicles = ({ showAddModal, setShowAddModal }: VehicleProps) => {
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterTransmission, setFilterTransmission] = useState("All");
  const [vehicleList, setVehicleList] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [editVehicle, setEditVehicle] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [viewVehicle, setViewVehicle] = useState<Vehicle | null>(null);
  const [deleteVehicleTarget, setDeleteVehicleTarget] =
    useState<Vehicle | null>(null);
  const [showFilter, setShowFilter] = useState(false);

  const filterRef = useRef<HTMLDivElement | null>(null);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setShowFilter(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch vehicles from backend
  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/vehicles/");
        if (!res.ok) throw new Error("Failed to fetch vehicles");
        const data: Vehicle[] = await res.json();
        setVehicleList(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadVehicles();
  }, []);

  // Updated filteredVehicles with better matching
  const filteredVehicles = vehicleList.filter((v) => {
    const matchesSearch =
      (v.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (v.brand?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (v.model?.toLowerCase() || "").includes(search.toLowerCase());

    const categoryName =
      typeof v.category === "object" ? v.category?.name : v.category;
    const matchesCategory =
      filterCategory === "All" ||
      (categoryName &&
        categoryName.toLowerCase() === filterCategory.toLowerCase());

    const transmissionValue = v.transmission;
    const matchesTransmission =
      filterTransmission === "All" ||
      (transmissionValue &&
        transmissionValue.toUpperCase() === filterTransmission.toUpperCase());

    const matchesStatus =
      filterStatus === "All" ||
      (v.status && v.status.toUpperCase() === filterStatus.toUpperCase());

    return (
      matchesSearch && matchesCategory && matchesTransmission && matchesStatus
    );
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedVehicles = filteredVehicles.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterCategory, filterStatus, filterTransmission]);

  const reloadVehicles = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/vehicles/");
      if (!res.ok) throw new Error("Failed to fetch vehicles");
      const data: Vehicle[] = await res.json();
      setVehicleList(data);

      // Adjust pagination after reload
      const newFilteredCount = data.filter((v) => {
        const matchesSearch =
          (v.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
          (v.brand?.toLowerCase() || "").includes(search.toLowerCase()) ||
          (v.model?.toLowerCase() || "").includes(search.toLowerCase());

        const categoryName =
          typeof v.category === "object" ? v.category?.name : v.category;
        const matchesCategory =
          filterCategory === "All" ||
          (categoryName &&
            categoryName.toLowerCase() === filterCategory.toLowerCase());

        const transmissionValue = v.transmission;
        const matchesTransmission =
          filterTransmission === "All" ||
          (transmissionValue &&
            transmissionValue.toUpperCase() ===
              filterTransmission.toUpperCase());

        const matchesStatus =
          filterStatus === "All" ||
          (v.status && v.status.toUpperCase() === filterStatus.toUpperCase());

        return (
          matchesSearch &&
          matchesCategory &&
          matchesTransmission &&
          matchesStatus
        );
      }).length;

      const newTotalPages = Math.ceil(newFilteredCount / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (v_id: number) => {
    try {
      const res = await axios.delete(
        `http://localhost:4000/api/vehicles/delete/${v_id}`,
        { withCredentials: true }
      );

      if (res.status === 200) {
        alert("Vehicle deleted successfully!");
        setDeleteVehicleTarget(null);
        await reloadVehicles();
      } else {
        alert(res.data?.message || "Failed to delete vehicle.");
      }
    } catch (err: any) {
      console.error("Delete Error:", err.response?.data || err.message);
      alert("Failed to delete vehicle. Check console for details.");
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap gap-2 justify-between mb-10 items-center">
        <div>
          <h1 className="text-2xl font-bold">Vehicle Management</h1>
          <p className="text-gray-500 text-sm">Manage your fleet of vehicles</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex justify-start w-fit items-center gap-2 px-4 py-2 rounded-lg text-white bg-red hover:bg-gradient-red"
        >
          <IoMdAdd size={20} /> Add Vehicle
        </button>
      </div>

      {/* Add Vehicle Modal */}
      {showAddModal && (
        <AddVehicleForm
          onClose={() => setShowAddModal(false)}
          onSave={async (newVehicle: NewVehicle) => {
            const saved: Vehicle = await addVehicle(newVehicle);
            setShowAddModal(false);
            await reloadVehicles();
          }}
        />
      )}

      {/* Search + Filter */}
      <div className="flex flex-wrap items-center justify-between bg-white p-5 rounded-2xl border border-gray-300 gap-4">
        <input
          type="text"
          placeholder="Search vehicles by brand, model, or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[250px] px-4 py-2 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-red outline-none"
        />

        <div className="relative w-full sm:w-auto" ref={filterRef}>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center w-full gap-2 px-4 py-2 border text-center border-gray-300 rounded-lg bg-white hover:bg-gray-50"
          >
            <FiFilter size={18} /> Filters
          </button>

          {showFilter && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-xl shadow-lg p-4 z-20">
              <div className="flex justify-between items-center mb-3">
                <p className="font-semibold text-gray-700">Filters</p>
                <button
                  className="text-sm text-red hover:underline"
                  onClick={() => {
                    setFilterCategory("All");
                    setFilterStatus("All");
                    setFilterTransmission("All");
                    setShowFilter(false);
                  }}
                >
                  Clear
                </button>
              </div>

              {/* Status */}
              <div className="mb-3">
                <label className="block text-sm text-gray-600 mb-1">
                  Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red outline-none"
                >
                  <option value="All">All</option>
                  <option value="AVAILABLE">Available</option>
                  <option value="RENTED">Rented</option>
                  <option value="MAINTENANCE">Maintenance</option>
                </select>
              </div>

              {/* Category */}
              <div className="mb-3">
                <label className="block text-sm text-gray-600 mb-1">
                  Category
                </label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red outline-none"
                >
                  <option value="All">All</option>
                  <option value="SUV">SUV</option>
                  <option value="Car">Car</option>
                  <option value="Truck">Truck</option>
                  <option value="Rickshaw">Rickshaw</option>
                  <option value="2-Wheeler">2-Wheeler</option>
                </select>
              </div>

              {/* Transmission */}
              <div className="mb-3">
                <label className="block text-sm text-gray-600 mb-1">
                  Transmission
                </label>
                <select
                  value={filterTransmission}
                  onChange={(e) => setFilterTransmission(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red outline-none"
                >
                  <option value="All">All</option>
                  <option value="MANUAL">Manual</option>
                  <option value="AUTOMATIC">Automatic</option>
                </select>
              </div>

              <p className="text-xs text-gray-500 mt-3">
                Showing {filteredVehicles.length} of {vehicleList.length}{" "}
                vehicles
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Vehicle Cards */}
      {loading ? (
        <p>Loading vehicles...</p>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {paginatedVehicles.length > 0 ? (
              paginatedVehicles.map((v) => {
                return (
                  <div
                    key={v.v_id}
                    className="relative rounded-lg bg-white overflow-hidden shadow hover:shadow-lg transition"
                  >
                    <img
                      src={`http://localhost:4000/uploads/vehicles/${v.image}`}
                      alt={v.name}
                      className="w-full h-40 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/fallback-image.jpg";
                      }}
                    />
                    <div className="p-5">
                      <h3 className="text-lg font-bold">{v.name}</h3>
                      <p className="text-sm text-gray-500">
                        {v.brand} • {v.model} • {v.transmission}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-red font-semibold mt-2">
                          Rs. {v.dailyRate} / day
                        </p>

                        <p
                          className={`text-sm font-semibold mt-1 inline-block px-2 py-1 rounded ${
                            (v.status || "").toUpperCase() === "AVAILABLE"
                              ? "bg-green-100 text-green-800"
                              : (v.status || "").toUpperCase() === "RENTED"
                              ? "bg-red-100 text-red-500"
                              : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {v.status}
                        </p>
                      </div>
                    </div>

                    {/* 3-dot Menu */}
                    <div className="absolute top-3 right-3">
                      <button
                        className="menu-button p-2 rounded-full bg-gray-100"
                        onClick={() =>
                          setOpenMenuId(openMenuId === v.v_id ? null : v.v_id)
                        }
                      >
                        <FiMoreVertical size={18} />
                      </button>

                      {openMenuId === v.v_id && (
                        <div className="menu-dropdown absolute right-0 mt-2 w-36 bg-white overflow-hidden rounded-lg shadow-md z-10">
                          <button
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                            onClick={() => {
                              setViewVehicle(v);
                              setOpenMenuId(null);
                            }}
                          >
                            View
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                            onClick={() => {
                              setEditVehicle(v);
                              setOpenMenuId(null);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                            onClick={() => {
                              setDeleteVehicleTarget(v);
                              setOpenMenuId(null);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 mt-6">No vehicles found.</p>
            )}
          </div>

          {/* Pagination */}
          {filteredVehicles.length > 0 && (
            <div className="mt-8 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {startIndex + 1} to{" "}
                {Math.min(endIndex, filteredVehicles.length)} of{" "}
                {filteredVehicles.length} vehicles
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiChevronLeft size={20} />
                </button>

                {/* Page numbers */}
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => {
                      // Show first page, last page, current page, and pages around current
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`px-4 py-2 rounded-lg border ${
                              currentPage === page
                                ? "bg-red text-white border-red"
                                : "border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            {page}
                          </button>
                        );
                      } else if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return (
                          <span key={page} className="px-2">
                            ...
                          </span>
                        );
                      }
                      return null;
                    }
                  )}
                </div>

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      {viewVehicle && (
        <ViewVehicleModal
          vehicle={viewVehicle}
          onClose={() => setViewVehicle(null)}
        />
      )}

      {deleteVehicleTarget && (
        <DeleteVehicleModal
          vehicleTitle={deleteVehicleTarget.name}
          onClose={() => setDeleteVehicleTarget(null)}
          onConfirm={() => handleDelete(deleteVehicleTarget.v_id)}
        />
      )}
      {editVehicle && (
        <EditVehicleModal
          vehicle={editVehicle}
          onClose={() => setEditVehicle(null)}
          onUpdate={async () => {
            setEditVehicle(null);
            await reloadVehicles();
          }}
        />
      )}
    </div>
  );
};

export default Vehicles;
