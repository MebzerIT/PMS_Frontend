import keycloak from "../components/keycloak/keycloak";

const apiUrl = "http://localhost:8080/api/v1/users"


const getUser = async (userId) => {
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
  
  export {addUsers,getUser, apiUrl}