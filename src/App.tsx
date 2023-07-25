import React from "react"
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import FormPage from "./Pages/Form";
import AdminPage from "./Pages/AdminPage";

const router = createBrowserRouter([
    {
      path: "/",
      element: <FormPage />,
    },
    {
      path: "/admin",
      element: <AdminPage />
    }
  ]);
  

export default function App(): JSX.Element{
    return (
        <React.StrictMode>
          <RouterProvider router={router} />
        </React.StrictMode>
    )
}