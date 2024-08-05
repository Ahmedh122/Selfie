import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./views/Home";
import Calendar from "./views/Calendar";
import Notes from "./views/Notes";
import Search from "./views/Search";
import Profile from "./views/Profile";
import Timer from "./views/Timer";
import Login from "./views/auth/Login";
import Register from "./views/auth/Register";

function App() {
  const queryClient = new QueryClient();

  const Layout = () => {
    return (
      <QueryClientProvider client={queryClient}>
        <div className="absolute top-0 left-0 w-screen h-screen flex overflow-hidden flex-col lg:flex-row">
          <div className="absolute w-screen h-[10%] bottom-0 lg:min-h-screen flex flex-col lg:flex-row l lg:w-[7%]">
            <Navbar />
          </div>
          <div className="absolute w-full top-0 h-[90%]  bg-[#313338] overflow-hidden lg:w-[93%] lg:right-0 lg:h-screen">
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
        { path: "/home", element: <Home /> },
        { path: "/calendar", element: <Calendar /> },
        { path: "/notes", element: <Notes /> },
        { path: "/search", element: <Search /> },
        { path: "/profile", element: <Profile /> },
        { path: "/timer", element: <Timer /> },
      ],
    },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
