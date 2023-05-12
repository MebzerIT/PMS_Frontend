import { useState, useEffect } from "react";
import { addtodos, getTodos } from "../../api/todos";
import withAuth from "../../hoc/withAuth";
import { Button, TextField, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import "./Gjøremålsliste.css";

const Gjøremålsliste = () => {
    const [todos, setTodos] = useState({
        title: "",
        category: "",
        date: "",
    });
    const [todoList, setTodoList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getTodos();
            setTodoList(data);
        };
        fetchData();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setTodos((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await addtodos(todos);
            console.log(response);
            alert("Todo list added successfully!");
            const newTodoList = await getTodos();
            setTodoList(newTodoList);
        } catch (error) {
            console.error(error);
            alert("Error adding Todolist. Please try again.");
        }
    };


    return (
        <div>
            <h2 className="list-title">Dine gjøremålsliste</h2>

            <form className="form-container" onSubmit={handleSubmit}>
                <TextField
                    label="Tittel"
                    variant="outlined"
                    margin="normal"
                    name="title"
                    value={todos.title}
                    onChange={handleChange}
                    required
                />

                <FormControl variant="outlined" margin="20px" required>
                    <InputLabel>Kategori</InputLabel>
                    <Select
                        label="Kategori"
                        name="category"
                        value={todos.category}
                        onChange={handleChange}
                    >
                        <MenuItem value="Jobb">Jobb</MenuItem>
                        <MenuItem value="Privat">Personlig</MenuItem>
                        <MenuItem value="Annet">Annet</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    label="Tidsfrist"
                    name="date"
                    type="datetime-local"
                    value={todos.date}
                    onChange={handleChange}
                />


                <Button variant="contained" color="primary" type="submit">
                    Lagre prosjekt
                </Button>
            </form>

            <div className="todo-container">
                {todoList.map((todo) => {
                    const dueDate = new Date(todo.date);
                    const now = new Date();
                    const diffMs = dueDate - now;
                    const diffDays = Math.floor(diffMs / 86400000);
                    const diffHrs = Math.floor((diffMs % 86400000) / 3600000);
                    const diffMins = Math.floor(((diffMs % 86400000) % 3600000) / 60000);
                    const countdown = `${diffDays}d ${diffHrs}h ${diffMins}m`;
                    return (
                        <div className={`todo ${todo.category.toLowerCase()}`} key={todo.id}>
                            <h3>{todo.title}</h3>
                            <p>Kategori: {todo.category}</p>
                            <p>Tidsfrist: {countdown} igjen</p>
                        </div>
                    );
                })}
            </div>

        </div>
    );

};

export default withAuth(Gjøremålsliste);
