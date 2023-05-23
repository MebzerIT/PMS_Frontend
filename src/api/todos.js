const apiUrl = "http://localhost:8080/api/v1/todos"

async function getTodos() {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
}


const addtodos = async (todos) => {
    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(todos),
            
        });
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

export { addtodos, getTodos, updatetodos, deletetodos, apiUrl };

