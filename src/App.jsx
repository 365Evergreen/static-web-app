import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import News from "./pages/news";
import OurCompany from "./pages/OurCompany";
import PoliciesAndProcedures from "./pages/PoliciesAndProcedures";
import MyHome from "./pages/MyHome";
import MeetOurLeaders from "./pages/MeetOurLeaders";
import SearchResults from "./pages/SearchResults";

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/news" element={<News />} />
      <Route path="/our-company" element={<OurCompany />} />
      <Route path="/policies-and-procedures" element={<PoliciesAndProcedures />} />
      <Route path="/my-home" element={<MyHome />} />
      <Route path="/meet-our-leaders" element={<MeetOurLeaders />} />
      <Route path="/search-results" element={<SearchResults />} />
    </Routes>
  </Router>
);

export default App;