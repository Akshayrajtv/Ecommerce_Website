import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { HiShoppingBag } from "react-icons/hi";
import toast from "react-hot-toast";
import SearchInput from "../Form/SearchInput";
import { useCart } from "../../context/cart";
import { Badge } from "antd";

const Header = () => {
    const [auth, setAuth] = useAuth();
    const [cart, setCart] = useCart();
    const [isNavOpen, setIsNavOpen] = useState(false); // Add state to control navbar visibility

    const handleLogout = () => {
        setAuth({
            ...auth,
            user: null,
            token: "",
        });
        localStorage.removeItem("auth");
        toast.success("Logout Successfully!");
    };

    const handleToggleNav = () => {
        setIsNavOpen(!isNavOpen); // Toggle navbar visibility
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <button
                className="navbar-toggler"
                type="button"
                onClick={handleToggleNav} // Update the onClick event to toggle navbar visibility
            >
                <span className="navbar-toggler-icon"></span>
            </button>
            <div
                className={`collapse navbar-collapse ${
                    isNavOpen ? "show" : "" // Add 'show' class conditionally based on isNavOpen state
                }`}
            >
                <Link to="/" className="navbar-brand p-2">
                    <HiShoppingBag /> Ecommerce App
                </Link>
                <ul className="navbar-nav ms-auto mt-2 mt-lg-0">
                    <SearchInput />
                    <li className="nav-item">
                        <NavLink to="/" className="nav-link">
                            Home
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/category" className="nav-link">
                            Category
                        </NavLink>
                    </li>
                    {!auth.user ? (
                        <>
                            <li className="nav-item">
                                <NavLink
                                    to="/register"
                                    className="nav-link"
                                    activeClassName="active"
                                >
                                    Register
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    to="/login"
                                    className="nav-link"
                                    activeClassName="active"
                                >
                                    Login
                                </NavLink>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="nav-item dropdown">
                                <NavLink
                                    className="nav-link dropdown-toggle"
                                    href="#"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    style={{ border: "none" }}
                                >
                                    {auth?.user?.name}
                                </NavLink>
                                <ul className="dropdown-menu">
                                    <li>
                                        <NavLink
                                            to={`/dashboard/${
                                                auth?.user?.role === 1
                                                    ? "admin"
                                                    : "user"
                                            }`}
                                            className="dropdown-item"
                                        >
                                            Dashboard
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            onClick={handleLogout}
                                            to="/login"
                                            className="dropdown-item"
                                        >
                                            Logout
                                        </NavLink>
                                    </li>
                                </ul>
                            </li>
                        </>
                    )}
                    <li className="nav-item">
                        <Badge count={cart?.length} showZero>
                            <NavLink to="/cart" className="nav-link">
                                Cart
                            </NavLink>
                        </Badge>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Header;
