import React, { useState, useEffect } from "react";
import { addtodos, getTodos, updatetodos, deletetodos } from "../../api/todos";
import withAuth from "../../hoc/withAuth";
import { Button, TextField, Select, MenuItem, FormControl, InputLabel, Slider } from "@mui/material";
import "./Gjøremålsliste.css";

const Gjøremålsliste = () => {
    const [todos, setTodos] = useState({
        id: "",
        title: "",
        category: "",
        priorityLvl: 1,
        date: "",
    });
    const [todoList, setTodoList] = useState([]);
    const [sortedTodoList, setSortedTodoList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getTodos();
            setTodoList(data);
            sortTodoList(data);
        };
        fetchData();
    }, []);

    const sortTodoList = (data) => {
        const sortedData = [...data].sort((a, b) => b.priorityLvl - a.priorityLvl);
        setSortedTodoList(sortedData);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setTodos((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handlePriorityChange = (event, value) => {
        setTodos((prevState) => ({
            ...prevState,
            priorityLvl: value,
        }));
    };

    const handleEdit = (todo) => {
        setTodos(todo);
    };

    const handleDelete = async (id) => {
        try {
            await deletetodos(id);
            const newTodoList = await getTodos();
            setTodoList(newTodoList);
            sortTodoList(newTodoList);
        } catch (error) {
            console.error(error);
            alert("Error deleting Todolist. Please try again.");
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (todos.id) {
                await updatetodos(todos.id, todos);
                alert("Todo list updated successfully!");
            } else {
                await addtodos(todos);
                alert("Todo list added successfully!");
            }
            setTodos({
                id: "",
                title: "",
                category: "",
                priorityLvl: 1,
                date: "",
            });
            const newTodoList = await getTodos();
            setTodoList(newTodoList);
            sortTodoList(newTodoList);
        } catch (error) {
            console.error(error);
            alert("Error adding/updating Todolist. Please try again.");
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

                <div className="priority-container">
                    <Slider
                        name="priorityLvl"
                        value={todos.priorityLvl}
                        onChange={handlePriorityChange}
                        min={0}
                        max={2}
                        step={1}
                        marks={[
                            { value: 0, label: "Lav" },
                            { value: 1, label: "Middels" },
                            { value: 2, label: "Høy" },
                        ]}
                    />
                    <div className={`priority-label priority-${todos.priorityLvl}`}>
                        {todos.priorityLvl === 0 ? "Lav" : todos.priorityLvl === 1 ? "Middels" : "Høy"}
                    </div>
                </div>

                <TextField
                    label="Tidsfrist"
                    name="date"
                    type="datetime-local"
                    value={todos.date}
                    onChange={handleChange}
                />
                <Button variant="contained" color="primary" type="submit">
                    {todos.id ? "Oppdater gjøremål" : "Lagre gjøremål"}
                </Button>
            </form>
            <div className="todo-container">
                {sortedTodoList.map((todo) => {
                    const dueDate = new Date(todo.date);
                    const now = new Date();
                    const diffMs = dueDate - now;
                    const diffDays = Math.floor(diffMs / 86400000);
                    const diffHrs = Math.floor((diffMs % 86400000) / 3600000);
                    const diffMins = Math.floor(((diffMs % 86400000) % 3600000) / 60000);
                    const countdown = `${diffDays}d ${diffHrs}h ${diffMins}m`;
                    return (
                        <div className={`todo ${todo.category.toLowerCase()}`} key={todo.id}>
                            <h3>
                                {todo.title} {todo.priorityLvl === 2 ? "!" : ""}
                            </h3>
                            <p>Kategori: {todo.category}</p>
                            <p>Tidsfrist: {countdown} igjen</p>
                            <div>
                                <Button variant="outlined" color="primary" onClick={() => handleEdit(todo)}>
                                    Rediger
                                </Button>
                                <Button variant="outlined" color="secondary" onClick={() => handleDelete(todo.id)}>
                                    Slett
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default withAuth(Gjøremålsliste);
