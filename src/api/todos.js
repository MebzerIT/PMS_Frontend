import axios from 'axios';
const apiUrl = "http://localhost:8080/api/v1/todos"
const userApiUrl = "http://localhost:8080/api/v1/users"

async function getTodos() {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
}

const getToDoById = async (id) => {
    const response = await fetch(`${userApiUrl}/${id}/getToDoList`);
    const data = await response.json();
    return data;
}


const addtodos = async (todos) => {
    try {
        const response = await axios.post("http://localhost:8080/api/v1/todos",JSON.stringify(todos) ,{

            headers: {
                "Content-Type": "application/json",
              },
            
        });
        if (response.status === 404){
            console.log("failed")
        }
        return response;
    } catch (error) {
        console.log("ERROR")
        throw new Error(`Error adding ToDo list: ${error.message}`);
    }
};

const updatetodos = async (id, updatedtodos) => {
    try {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedtodos),
        });
        return response;
    } catch (error) {
        throw new Error(`Error updating project: ${error.message}`);
    }
};

const deletetodos = async (id) => {
    try {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: "DELETE",
        });
        return response;
    } catch (error) {
        throw new Error(`Error deleting ToDo list: ${error.message}`);
    }
};

export { addtodos, getTodos, updatetodos, deletetodos, getToDoById,apiUrl };