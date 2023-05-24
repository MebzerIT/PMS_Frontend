import keycloak from "../keycloak/keycloak";
import { NavLink, useNavigate } from "react-router-dom";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddProjectIcon from '@mui/icons-material/Add';
import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';
import SearchIcon from '@mui/icons-material/Search';
import ForumIcon from '@mui/icons-material/Forum';
import ListIcon from '@mui/icons-material/List';
import LogoutIcon from '@mui/icons-material/Logout';
import { ListItemIcon } from '@mui/material';
import { addUsers, getUser } from "../../api/user";

import "./NavBar.css";

const NavBar = () => {
  const navigate = useNavigate();

  if (keycloak.authenticated) {
    console.log(keycloak.tokenParsed.sub)
    getUser(keycloak.tokenParsed.sub)
      .then(result => {
        console.log(result)
        if (!result) {
          console.log("POST")
          addUsers();
          window.location.reload();
        } else {
          // do nothing
          console.log("User exists, NO POST")
        }
      })
      .catch(error => {
        console.error(error);
      });
  }
  return (
    <nav className="navbar">
      <div className="navbar__item">
      </div>
      <NavLink className="tekst" to="/">
        <img
          src="/images/projectlogo.png"
          alt="logo"
          style={{ width: '50px', height: '40px' }}
        />
      </NavLink>
      {keycloak.authenticated && (
        <div className="navbar__item">
          <NavLink className="tekst" to="/Gjøremålsliste">
            <ListItemIcon>
              <ListIcon />
              Gjøremålsliste
            </ListItemIcon>
          </NavLink>
        </div>
      )}

      {keycloak.authenticated && (
        <div className="navbar__item">
          <NavLink className="tekst" to="/MittProsjekt">
            <ListItemIcon>
              <AutoAwesomeMotionIcon />
              Mitt Prosjekt
            </ListItemIcon>
          </NavLink>
        </div>
      )}

      {keycloak.authenticated && (
        <div className="navbar__item">
          <NavLink className="tekst" to="/Chat">
            <ListItemIcon>
              <ForumIcon />
              Chat
            </ListItemIcon>
          </NavLink>
        </div>
      )}

      {keycloak.authenticated && (
        <div className="navbar__item">
          <NavLink className="tekst" to="/Lagprosjekt">
            <ListItemIcon>
              <AddProjectIcon />
              Lag prosjekt
            </ListItemIcon>
          </NavLink>
        </div>
      )}

      {keycloak.authenticated && (
        <div className="navbar__item">
          <NavLink className="tekst" to="/Profil">
            <ListItemIcon>
              <AccountCircleIcon />
              Profil
            </ListItemIcon>
          </NavLink>
        </div>
      )}

      {keycloak.authenticated && (
        <button
          className="navbar__item logout-button"
          onClick={() => {
            keycloak.logout();
            navigate("/");
          }}
        >
          <ListItemIcon>
            <LogoutIcon />
            Logg ut
          </ListItemIcon>
        </button>

      )}
      <div className="registrer">
        {!keycloak.authenticated && (
          <>
            <button
              onClick={() => keycloak.login()}
            >
              Logg inn
            </button>

            <button
              onClick={() => keycloak.register()}
            >
              Ny bruker
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;