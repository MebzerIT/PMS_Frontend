import keycloak from "../keycloak/keycloak";
import {NavLink, useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();

  return (
    <>
      <div>
        <NavLink to="/">Hjem</NavLink>
      </div>
     {keycloak.authenticated && (
      <div>
        <NavLink to="/Gjøremålsliste">Gjøremålsliste</NavLink>
      </div>
        )}

        {keycloak.authenticated && (
      <div>
        <NavLink to="/Profil">Profil</NavLink>
      </div>
        )}

      {keycloak.authenticated && (
        <button
          onClick={() => {
            keycloak.logout();
            navigate("/");
          }}
        >
          Logg ut
        </button>
      )}
    </>
  );
};

export default NavBar;



