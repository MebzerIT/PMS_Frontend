import keycloak from "../components/keycloak/keycloak";

const apiUrl = "http://localhost:8080/api/v1/users"

export const getUser = async () => {
  try {
    await keycloak.updateToken(5);
    const userId = keycloak.tokenParsed.sub;
    return userId;
  } catch (error) {
    throw new Error("Error retrieving user ID.");
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
          firstName: keycloak.tokenParsed.given_name,
          lastName: keycloak.tokenParsed.family_name,
          email: keycloak.tokenParsed.email
        }),
      });
      return response;
    } catch (error) {
      console.log(error)
      throw new Error(`Error adding project: ${error.message}`);
    }
  };
  
  export {addUsers, apiUrl}