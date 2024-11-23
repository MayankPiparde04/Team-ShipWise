import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Dashboard from "./pages/DashBoard";
import Login from "./auth/Login";
import SignUp from "./auth/Signup";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ActivateAccount from "./pages/ActivateAccount";

const Layout = ({ withFooter = true }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <div className="flex-1">
      <Outlet />
    </div>
    {withFooter && <Footer />}
  </div>
);

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: "about", element: <About /> },
      ],
    },
    {
      path: "/dashboard/:id",
      element: <Dashboard />,
    },
    {
      path: "/auth",
      element: <Layout withFooter={false} />,
      children: [
        { path: "login", element: <Login /> },
        { path: "activate/:token", element: <ActivateAccount /> }, // Added ActivateAccount route
        { path: "signup", element: <SignUp /> },
      ],
    },
    { path: "*", element: <NotFound /> }, // Catch-all route for 404
  ]);

  return <RouterProvider router={router} />;
}

export default App;

