import React from "react";
import VanillaPageTemplate from "../templates/VanillaPageTemplate";
import SearchBar from "../components/Searchbar";

const Home = () => (
  <VanillaPageTemplate>
    <h2>Welcome to SWA Intranet Portal</h2>
    <p>Welcome to your company intranet portal. Use the navigation above or sidebar to explore different sections.</p>
    
    <SearchBar />
    
    <div className="quick-links">
      <h3>Quick Access</h3>
      <ul>
        <li><a href="/news">Latest Company News</a></li>
        <li><a href="/policies-and-procedures">Policies & Procedures</a></li>
        <li><a href="/meet-our-leaders">Meet Our Leaders</a></li>
        <li><a href="/my-home">My Personalized Home</a></li>
      </ul>
    </div>
  </VanillaPageTemplate>
);

export default Home;