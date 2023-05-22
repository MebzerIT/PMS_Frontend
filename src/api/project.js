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

  export function deleteProject(projectId) {
    return fetch(`/api/projects/${projectId}`, {
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
