import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => (
  <aside className="sidebar">
    <h2>Quick Links</h2>
    <ul>
      <li><Link to="/policies-and-procedures">Policies</Link></li>
      <li><Link to="/our-company">Our Company</Link></li>
      <li><Link to="/search-results">Search</Link></li>
      <li><Link to="/meet-our-leaders">Leaders</Link></li>
    </ul>
  </aside>
);

export default Sidebar;
