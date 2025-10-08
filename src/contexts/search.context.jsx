import { createContext, useState, useEffect } from "react";

export const SearchContext = createContext({
  pastSearches: [],
  setPastSearches: () => {},
});

export const SearchProvider = ({ children }) => {
  const [pastSearches, setPastSearches] = useState(() => {
    const saved = localStorage.getItem("pastSearches");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("pastSearches", JSON.stringify(pastSearches));
  }, [pastSearches]);

  const value = { pastSearches, setPastSearches };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};
