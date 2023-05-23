const apiUrl = "http://localhost:8080/api/v1/project"
const userApiUrl = "http://localhost:8080/api/v1/users"

const getProjects = async (id) => {
    const response = await fetch(`${userApiUrl}/${id}/getAllProjects`);
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

  const updateProject = async (id, updatedProject) => {
    try {
      const response = await fetch(`${apiUrl}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProject),
      });
      return response;
    } catch (error) {
      throw new Error(`Error updating project: ${error.message}`);
    }
  };

  export const deleteProject = async (projectId) => {
    return fetch(`${apiUrl}/${projectId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to delete project');
        }
      })
      .catch((error) => {
        console.error('Error deleting project:', error);
      });
  }
  
  
  export {addProject, getProjects, updateProject,  apiUrl};
