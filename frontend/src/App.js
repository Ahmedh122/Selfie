import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "./context/authcontext";
import { useContext } from "react";
import Login from "./views/auth/Login";
import Register from "./views/auth/Register";
import Navbar from "./components/Navbar";
import Home from "./views/Home";
import Calendar from "./views/Calendar";
import Notes from "./views/Notes";
import Search from "./views/Search";
import Profile from "./views/Profile";
import Timer from "./views/Timer";


function App() {
 

  const queryClient = new QueryClient();

  const Layout = () => {
    return (
      <QueryClientProvider client={queryClient}>
        <div
          className="bg-[#313338]"
          style={{ display: "flex", position: "relative" }}
        >
            <Navbar />
          <div style={{ flex: "1", zIndex: 50 }}>
            <Outlet />
          </div>
        </div>
      </QueryClientProvider>
    );
  };



  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/calendar",
          element: <Calendar />,
        },
        {
          path: "/notes",
          element: <Notes />,
        },
        {
          path: "/search",
          element: <Search />,
        },
        {
          path: "/profile",
          element: <Profile />,
        },
        {
          path: "/timer",
          element: <Timer />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}



export default App;