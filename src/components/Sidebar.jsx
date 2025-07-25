import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => (
  <aside className="sidebar">
    <h2>Quick Links</h2>
    <ul>
      <li><Link to="/policies-and-procedures">Policies</Link></li>
      <li><Link to="/resources">Resources</Link></li>
      <li><Link to="/search">Search</Link></li>
    </ul>
  </aside>
);

export default Sidebar;
