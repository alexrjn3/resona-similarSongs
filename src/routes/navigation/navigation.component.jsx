import { Fragment, useContext } from "react";
import { Outlet, Link } from "react-router-dom";

//import { UserContext } from '../../contexts/user.context'; history context

//import { ReactComponent as CrwnLogo } from '../../assets/crown.svg'; logo-ul meu

import "./navigation.styles.scss";
import logo from "./../../resource/Logo.JPG";

const Navigation = () => {
  //const { currentUser, setCurrentUser } = useContext(UserContext); history context

  return (
    <Fragment>
      <div className="navigation">
        <Link className="logo-container" to="/">
          <img src={logo} alt="App Logo" className="logo" />
        </Link>
        <div className="nav-links-container">
          <Link className="nav-link" to="/history">
            HISTORY
          </Link>
        </div>
      </div>
      <Outlet />
    </Fragment>
  );
};

export default Navigation;
