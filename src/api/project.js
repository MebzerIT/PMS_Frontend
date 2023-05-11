const apiUrl = "http://localhost:8080/api/v1/projects"

async function getProjects() {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
  }
  

const addProject = async (project) => {
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(project),
      });
      return response;
    } catch (error) {
      throw new Error(`Error adding project: ${error.message}`);
    }
  };

  export {addProject, getProjects, apiUrl}