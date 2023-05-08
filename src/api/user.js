import keycloak from "../components/keycloak/keycloak";

const apiUrl = "http://localhost:8080/api/v1/users"

export const getUser = async (userId) => {
    try {
      const response = await fetch(`${apiUrl}/${userId}`);
      if(response.status === 404){
        throw new Error();
      }
      const user = await response.json();
      return user;
    } catch (error) {
     
      return false;
    }
  };
  
  const addUsers = async () => {
    
    try {
      console.log("REGISTER")
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
        
          id: keycloak.tokenParsed.sub,
          f_name: keycloak.tokenParsed.given_name,
          l_name: keycloak.tokenParsed.family_name,
          
        }),
      });
      return response;
    } catch (error) {
      console.log(error)
      throw new Error(`Error adding project: ${error.message}`);
    }
  };
  
  export {addUsers, apiUrl}