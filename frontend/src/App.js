
import React, { useContext } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "found";
import { AuthContext } from "./context/authcontext";

function App() {


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
        {
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
    }
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

/*ciao*/

export default App;