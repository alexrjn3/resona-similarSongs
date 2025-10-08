import { Outlet } from "react-router-dom";

import Directory from "../../components/directory/directory.component";
import History from "../history/history.component";

import "./home.styles.scss";

const Home = ({ pastSearches, setPastSearches }) => {
  const lastFiveSearches = pastSearches.slice(-5);

  return (
    <div>
      <Directory setPastSearches={setPastSearches} />
      <History pastSearches={lastFiveSearches} />
    </div>
  );
};

export default Home;
