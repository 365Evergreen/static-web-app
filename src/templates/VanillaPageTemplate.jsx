import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";

const VanillaPageTemplate = ({ children }) => (
  <>
    <Header />
    <div style={{ display: "flex", minHeight: "70vh" }}>
      <Sidebar />
      <main className="main-content">{children}</main>
    </div>
    <Footer />
  </>
);

export default VanillaPageTemplate;
