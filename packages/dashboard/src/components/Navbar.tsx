import React, { useContext } from "react";
import { Navbar as NavbarReact } from "flowbite-react";
import { Link } from "react-router-dom";
import { ConfigContext } from "../context/ContextConfig";

export const Navbar = () => {
  const { title } = useContext(ConfigContext);

  return (
    <NavbarReact>
      <NavbarReact.Brand as="span">
        <Link to={"/"} className="flex">
          <img
            alt={`${title} Logo`}
            className="mr-3 h-6 sm:h-9"
            src="/logo.png"
          />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            {title}
          </span>
        </Link>
      </NavbarReact.Brand>
      <div className="md:hidden flex md:order-1">
        <NavbarReact.Toggle />
      </div>
      <NavbarReact.Collapse className="justify-end">
        <NavbarReact.Link as="span">
          <Link to={"users"}>Users</Link>
        </NavbarReact.Link>
        <NavbarReact.Link as="span">
          <Link to={"transactions"}>Transactions</Link>
        </NavbarReact.Link>
      </NavbarReact.Collapse>
    </NavbarReact>
  );
};
