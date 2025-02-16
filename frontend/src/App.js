import React, { useContext } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
  useNavigate,
} from "react-router-dom";
import General from "./views/General";
import Navbar from "./components/Navbar";
import Home from "./views/Home";
import Calendar from "./views/calendar/Calendar";
import Notes from "./views/notes/Notes";
import Search from "./views/Search";
import Profile from "./views/Profile";
import Timer from "./views/Timer/Timer";
import Login from "./views/auth/Login";
import Register from "./views/auth/Register";
import Notifications from "./components/Notifications";
import Profiles from "./components/Profiles";
import { AuthContext } from "./context/authcontext";
import Background from "./components/Background";

function App() {
  const { currentUser, logout } = useContext(AuthContext);
  const queryClient = new QueryClient();

  const Layout = () => {
    return (
      <QueryClientProvider client={queryClient}>
        <div className="relative top-0 left-0 w-screen h-screen flex overflow-hidden flex-col lg:flex-row">
          <div className="absolute w-screen h-[10%] bottom-0 lg:min-h-screen flex flex-col lg:flex-row l lg:w-[7%]">
            <Navbar />
          </div>

          <div className="absolute w-full top-0 h-[90%] bg-[#313338] overflow-hidden lg:w-[93%] lg:right-0 lg:h-screen">
            <div className="relative w-full h-full">
              <div className="absolute inset-0 z-1">
                <Background />
              </div>
              <div className="relative w-full h-full z-10">
                <Outlet />
              </div>
            </div>
          </div>
          <div>
            <style>
              {`
                .svg-glow {
                  transition: filter 0.3s ease, transform 0.3s ease; 
                }

                .svg-glow:hover {
                  filter: drop-shadow(0 0 8px white);
                  transform: rotate(-90deg);
                }
              `}
            </style>
            <div className="absolute flex  top-3 z-20 right-14 ">
              <Notifications />{" "}
            </div>
            <button
              className="rounded-full absolute flex z-20 top-3 right-3 "
              onClick={logout}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-7 stroke-white svg-glow"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </button>
          </div>
        </div>
      </QueryClientProvider>
    );
  };

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/" />;
    }

    return children;
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: currentUser ? <Navigate to="/home" /> : <General />,
    },
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        { path: "/home/:id", element: <Home /> },
        { path: "/calendar/:id", element: <Calendar /> },
        { path: "/notes/:id", element: <Notes /> },
        { path: "/search/:id", element: <Search /> },
        { path: "/profile/:id", element: <Profile /> },
        { path: "/timer/:id", element: <Timer /> },
        { path: "/profiles/:id", element: <Profiles /> },
      ],
    },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
