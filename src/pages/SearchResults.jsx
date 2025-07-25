import React from "react";
import { useLocation } from "react-router-dom";
import VanillaPageTemplate from "../templates/VanillaPageTemplate";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchResults = () => {
  const query = useQuery().get("q");
  return (
    <VanillaPageTemplate>
      <h2>Search Results</h2>
      <p>Showing results for: <strong>{query}</strong></p>
      <ul>
        <li>Result 1 (placeholder)</li>
        <li>Result 2 (placeholder)</li>
      </ul>
    </VanillaPageTemplate>
  );
};

export default SearchResults;