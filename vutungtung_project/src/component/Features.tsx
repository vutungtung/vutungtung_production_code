// import { NavLink } from "react-router-dom";
// import VehicleCard from "./VehicleCard";
// import { useVehicles } from "../hooks/useVehicles";

// const Features = () => {
//   const { vehicles, loading, error } = useVehicles();

//   if (loading) return <p className="text-center">Loading vehicles...</p>;
//   if (error) return <p className="text-center text-red-500">{error}</p>;

//   // Take first 3 featured vehicles
//   const featuredCard = vehicles.slice(0, 3);

//   return (
//     <div className="max-w-7xl w-full flex flex-col h-fit px-5 py-20 justify-around mx-auto">
//       <div>
//         <h1 className="text-4xl md:text-5xl text-center mb-5 font-black">
//           FEATURED <br />
//           <span className="text-red">COLLECTION</span>
//         </h1>
//         <p className="text-lg mb-20 text-gray-500 text-center ">
//           Handcrafted selection of the world's most extraordinary vehicles. Each
//           one tells a story <br /> of performance, luxury, and innovation.
//         </p>

//         {/* feature cards */}
//         <div className="grid md:grid-cols-2  lg:grid-cols-3 gap-5">
//           {featuredCard.map((vehicle) => (
//             <VehicleCard key={vehicle.id} {...vehicle} />
//           ))}
//         </div>
//       </div>

//       <NavLink
//         to={"/vehicles"}
//         className="border-2 text-xl w-fit mx-auto font-bold text-red mt-10 py-3 px-8 rounded-lg"
//       >
//         Discover All Vehicles
//       </NavLink>
//     </div>
//   );
// };

// export default Features;


import { NavLink } from "react-router-dom";
import VehicleCard from "./VehicleCard";
import { useVehicles } from "../hooks/useVehicles";

const Features = () => {
  const { vehicles, loading, error } = useVehicles();

  if (loading) return <p className="text-center">Loading vehicles...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  // Take first 3 AVAILABLE vehicles
  const featuredCard = vehicles
    .filter((v) => (v.status || "").toUpperCase() === "AVAILABLE")
    .slice(0, 3);

  return (
    <div className="max-w-7xl w-full flex flex-col h-fit px-5 py-20 justify-around mx-auto">
      <div>
        <h1 className="text-4xl md:text-5xl text-center mb-5 font-black">
          FEATURED <br />
          <span className="text-red">COLLECTION</span>
        </h1>
        <p className="text-lg mb-20 text-gray-500 text-center">
          Handcrafted selection of the world's most extraordinary vehicles. Each
          one tells a story <br /> of performance, luxury, and innovation.
        </p>

        {/* feature cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredCard.map((vehicle) => (
            <VehicleCard key={vehicle.id} {...vehicle} />
          ))}
        </div>
      </div>

      <NavLink
        to={"/vehicles"}
        className="border-2 text-xl w-fit mx-auto font-bold text-red mt-10 py-3 px-8 rounded-lg"
      >
        Discover All Vehicles
      </NavLink>
    </div>
  );
};

export default Features;
