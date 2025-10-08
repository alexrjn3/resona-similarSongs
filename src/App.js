import logo from "./logo.svg";
import "./App.scss";
import { Routes, Route } from "react-router-dom";
import { useContext } from "react";

import Navigation from "./routes/navigation/navigation.component";
import Home from "./routes/home/home.component";
import { SearchContext } from "./contexts/search.context";

import History from "./routes/history/history.component";

const App = () => {
  const { pastSearches, setPastSearches } = useContext(SearchContext);

  return (
    <Routes>
      <Route path="/" element={<Navigation />}>
        <Route
          index
          element={
            <Home
              pastSearches={pastSearches}
              setPastSearches={setPastSearches}
            />
          }
        />
        <Route
          path="history"
          element={<History pastSearches={pastSearches} />}
        />
      </Route>
    </Routes>
  );
};

export default App;
