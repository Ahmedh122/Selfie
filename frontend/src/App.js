import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "./context/authcontext";
import { useContext } from "react";
import Login from "./views/login/Login";
import Register from "./views/login/Register";


function App() {
  <h1>hello world</h1>

  const queryClient = new QueryClient();

  const Layout = () => {
    return (  
      <QueryClientProvider client={queryClient}>

      </QueryClientProvider>
    );
  };



  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Layout />
      ),
      children: [
        /*{
          path: "/",
          element: <Home />,
        },
        {
          path: "/calendar/:id",
          element: <Calendar />,
        },
        {
          path: "/notes/:id",
          element: <Notes />,
        },*/
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    }
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}



export default App;