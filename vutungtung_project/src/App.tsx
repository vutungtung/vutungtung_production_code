import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { useLocation } from "react-router-dom";
import ScrollToTop from "./component/ScrollToTop";
import Footer from "./component/footer";
import Nav from "./component/nav";
import Home from "./pages/home";
import About from "./pages/about";
import Vehicle from "./pages/vehicle";
import VehicleDetails from "./pages/vehicleDetails";
import PrivateRoute from "./context/PrivateRoute";
import ConfirmBooking from "./pages/ConfirmBooking";
import BookingSuccessful from "./pages/BookingSuccessful";
import { Contact } from "./pages/contact";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Overview from "./component/AdminDashboard/Overview";
import Failure from "./pages/Failure";
import PublicRoute from "./context/PublicRoute";
import { Login } from "./auth/login";
import { Signup } from "./auth/signup";
import { ForgotPassword } from "./auth/ForgotPassword";
import { VerifyOTP } from "./auth/VerifyOTP";
import { ResetPassword } from "./auth/ResetPassword";
import { ResetPasswordOTP } from "./auth/ResetPasswordOTP";
import { VerifySuccess } from "./auth/VerifySuccess";
import { VerifyFailed } from "./auth/VerifyFailed";

import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailure from "./pages/PaymentFailure";

// ✅ Global Layout Component
const Layout = () => {
  const location = useLocation();

  // Routes where we hide Navbar & Footer
  const hideLayoutOn = [
    "/login",
    "/signup",
    "/forgot-password",
    "/verify-otp",
    "/reset-password",
    "/reset-password-otp",
    "/verify-success",
    "/verify-failed",
    "/admin-dashboard",
    "/overview",
    "/payment-success",
    "/payment-failure",
  ];

  const hideLayout = hideLayoutOn.includes(location.pathname);

  return (
    <>
      {!hideLayout && <Nav />}
      <ScrollToTop />
      <Outlet />
      {!hideLayout && <Footer />}
    </>
  );
};

// ✅ Router setup
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // Global layout applies to ALL routes
    children: [
      { path: "/", element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/vehicles", element: <Vehicle /> },
      { path: "/vehicles/:id", element: <VehicleDetails /> },

      {
        path: "/payment",
        element: (
          <PrivateRoute role="user">
            <Payment />
          </PrivateRoute>
        ),
      },
      {
        path: "/confirm-booking/:id",
        element: (
          <PrivateRoute role="user">
            <ConfirmBooking />
          </PrivateRoute>
        ),
      },
      {
        path: "/booking-successful",
        element: (
          <PrivateRoute role="user">
            <BookingSuccessful />
          </PrivateRoute>
        ),
      },
      { path: "/contact", element: <Contact /> },

      // ✅ User Routes
      {
        path: "/user-dashboard",
        element: (
          <PrivateRoute role="user">
            <UserDashboard />
          </PrivateRoute>
        ),
      },

      // ✅ Admin Routes
      {
        path: "/admin-dashboard",
        element: (
          <PrivateRoute role="admin">
            <AdminDashboard />
          </PrivateRoute>
        ),
      },
      {
        path: "/overview",
        element: (
          <PrivateRoute role="admin">
            <Overview />
          </PrivateRoute>
        ),
      },

      // ✅ Failure
      { path: "/failure", element: <Failure /> },

      // ✅ Payment Success/Failure (no layout)
      { path: "/payment-success", element: <PaymentSuccess /> },
      { path: "/payment-failure", element: <PaymentFailure /> },

      // ✅ Auth routes (Navbar/Footer hidden automatically)
      {
        path: "/login",
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ),
      },
      {
        path: "/signup",
        element: (
          <PublicRoute>
            <Signup />
          </PublicRoute>
        ),
      },
      {
        path: "/forgot-password",
        element: (
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        ),
      },
      {
        path: "/verify-otp",
        element: (
          <PublicRoute>
            <VerifyOTP />
          </PublicRoute>
        ),
      },
      {
        path: "/reset-password",
        element: (
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        ),
      },
      {
        path: "/reset-password-otp",
        element: (
          <PublicRoute>
            <ResetPasswordOTP />
          </PublicRoute>
        ),
      },
      {
        path: "/verify-success",
        element: (
          <PublicRoute>
            <VerifySuccess />
          </PublicRoute>
        ),
      },
      {
        path: "/verify-failed",
        element: (
          <PublicRoute>
            <VerifyFailed />
          </PublicRoute>
        ),
      },
    ],
  },
]);

// ✅ App Component
const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
