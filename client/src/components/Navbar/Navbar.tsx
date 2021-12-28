import "./Navbar.css";
import logo from "../../assets/logo_coba_band.svg";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";


/*
Responsive navbar for site controls
*/
const Navbar: React.FC = () => {
  const [clicked, setClicked] = useState(false);
  const { currentUser } = useAuth();

  const NavLinkContent = [
    {
      link: "/tasks",
      text: "My Tasks",
    },
    {
      link: "/sensors",
      text: "My Sensors",
    },
    {
      link: "/reports",
      text: "Reports",
    },
    {
      link: "/contact",
      text: "Contact",
    },
    {
      link: "/profile",
      text: currentUser ? <b>{currentUser.email.split("@")[0]}</b> : ""
    },
  ];

  const handleClick = () => {
    setClicked(!clicked);
  };

  return (
    <nav className="NavbarItems">
      <Link to="/" style={{ textDecoration: "none" }}>
        <div className="navbar-logo">
          <img src={logo} alt="coba_logo" />
          <h2 className="title">DQ Radar</h2>
        </div>{" "}
      </Link>
      <div className="menu-icon" onClick={handleClick}>
        {clicked ? (
          <FaTimes style={{ color: "#00414B" }} />
        ) : (
          <FaBars style={{ color: "#00414B" }} />
        )}
      </div>
      <ul className={clicked ? "nav-menu active" : "nav-menu"}>
        {NavLinkContent.map((content) => {
          return (
            <li>
              <NavLink
                className="nav-link"
                exact
                activeClassName="active"
                to={content.link}
              >
                {content.text}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Navbar;
