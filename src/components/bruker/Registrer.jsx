import keycloak from '../keycloak/keycloak';

const Register = () => (
    <div>
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
                  </>)}</div>)  

export default Register;



