import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./global.css";
import App from "./App";
import ErrorPage from "./Pages/ErrorPage/ErrorPage";
import Store from "./Pages/Store/Store";
import About from "./Pages/About/About";
import Details from "./Pages/Details/Details";
import StoreDetails from "./Pages/StoreDetails/StoreDetails";
import Profile from "./components/Profile/Profile";
import StoreAll from "./Pages/StoreAll/StoreAll";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Store />,
      },
      {
        path: "/Todos",
        element: <StoreAll />,
      },
      {
        path: "/Sobre",
        element: <About />,
      },
      {
        path: "/Detalhes/:id",
        element: <Details />,
      },
      {
        path: "/Produtos/:category",
        element: <StoreDetails />,
      },
      {
        path: "/Perfil/:name",
        element: <Profile />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
