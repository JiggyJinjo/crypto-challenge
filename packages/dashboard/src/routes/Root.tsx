import { Navbar } from "../components";
import React from "react";
import { createBrowserRouter, Outlet } from "react-router-dom";
import { Users } from "./Users";
import { Transactions } from "./Transactions";
import { Error } from "./Error";

export const Root = () => {
  return (
    <>
      <Navbar />
      <div className="container mx-auto">
        <Outlet />
      </div>
    </>
  );
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error />,
    children: [
      {
        path: "users",
        element: <Users />,
      },

      {
        path: "transactions",
        element: <Transactions />,
      },
    ],
  },
]);
