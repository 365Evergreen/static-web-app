import React from "react";
import { Link } from "react-router-dom";

const Header = () => (
  <header>
    <h1>SWA Intranet Portal</h1>
    <nav>
      <Link to="/">Home</Link> |{" "}
      <Link to="/news">News</Link> |{" "}
      <Link to="/our-company">Our Company</Link> |{" "}
      <Link to="/policies-and-procedures">Policies & Procedures</Link> |{" "}
      <Link to="/my-home">My Home</Link> |{" "}
      <Link to="/meet-our-leaders">Meet Our Leaders</Link>
    </nav>
  </header>
);

export default Header;
