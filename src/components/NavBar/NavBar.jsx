import keycloak from "../keycloak/keycloak";
import { NavLink, useNavigate } from "react-router-dom";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddProjectIcon from '@mui/icons-material/Add';
import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';
import ListIcon from '@mui/icons-material/List';
import { ListItemIcon } from '@mui/material';


import "./NavBar.css"; 

const NavBar = () => {
  const navigate = useNavigate();

  
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
            <ListIcon/>
            </ListItemIcon>
            Gjøremålsliste
          </NavLink>
        </div>
      )}

      {keycloak.authenticated && (
        <div className="navbar__item">
          <NavLink className="tekst" to="/MittProsjekt">
            <ListItemIcon>
                <AutoAwesomeMotionIcon/>
            </ListItemIcon>
            Mitt Prosjekt
          </NavLink>
        </div>
      )}

      {keycloak.authenticated && (
        <div className="navbar__item">
          <NavLink className="tekst" to="/Lagprosjekt">
            <ListItemIcon>
              <AddProjectIcon />
            </ListItemIcon>
            Lag prosjekt
          </NavLink>
        </div>
      )}

      {keycloak.authenticated && (
        <div className="navbar__item">
          <NavLink className="tekst" to="/Profil">
            <ListItemIcon>
              <AccountCircleIcon/>
            </ListItemIcon>
            Profil
          </NavLink>
        </div>
      )}

      {keycloak.authenticated && (
        <button
          className="navbar__item"
          onClick={() => {
            keycloak.logout();
            navigate("/");
          }}
        >
          Logg ut
        </button>
      )}
      <div className="registrer">
        {!keycloak.authenticated && (
          <>
            <button
              onClick={() => keycloak.login()}
            >
              LOGG INN
            </button>

            <button
              onClick={() => keycloak.register()}
            >
              NY BRUKER
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
