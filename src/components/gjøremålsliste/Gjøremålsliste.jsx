import React, { useState, useEffect } from "react";
import { addtodos, getTodos, updatetodos, deletetodos, getToDoById } from "../../api/todos";
import withAuth from "../../hoc/withAuth";
import { Button, TextField, Select, MenuItem, FormControl, InputLabel, Slider } from "@mui/material";
import "./Gjøremålsliste.css";
import keycloak from "../keycloak/keycloak";

const Gjøremålsliste = () => {
  const [todos, setTodos] = useState({
    title: "",
    category: "",
    priorityLvl: "",
    date: "",
    user: keycloak.tokenParsed.sub
  });
  const [todoList, setTodoList] = useState([]);
  const [sortedTodoList, setSortedTodoList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getToDoById(keycloak.tokenParsed.sub);
      console.log("DATA: ", data);
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
    console.log(value);
  };

  const handleEdit = (todo) => {
    setTodos(todo);
  };

  const handleDelete = async (id) => {
    try {
      await deletetodos(id);
      const newTodoList = await getToDoById(keycloak.tokenParsed.sub);
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
        console.log(todos);
        await addtodos(todos);
        alert("Todo list added successfully!");
      }
      setTodos({
        title: "",
        category: "",
        priorityLvl: 1,
        date: "",
        user: keycloak.tokenParsed.sub,
      });
      const newTodoList = await getToDoById(keycloak.tokenParsed.sub);
      setTodoList(newTodoList);
      sortTodoList(newTodoList);
    } catch (error) {
      console.error(error);
      alert("Error adding/updating Todolist. Please try again.");
    }
  };

  return (
    <div className="gjoremalsliste-container">
      <div className="input-container">
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

          <FormControl variant="outlined" margin="normal" required>
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
            <p>prioriteringsnivå</p>
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
              {todos.priorityLvl === 0
                ? "Lav"
                : todos.priorityLvl === 1
                ? "Middels"
                : "Høy"}
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
      </div>

      <div className="todo-container">
        {sortedTodoList.length === 0 ? (
          <div className="empty-message">Du har ingen gjøremål</div>
        ) : (
          sortedTodoList.map((todo) => {
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
                <div className="button-container">
                  <Button variant="outlined" color="primary" onClick={() => handleEdit(todo)}>
                    Rediger
                  </Button>
                  <Button variant="outlined" color="secondary" onClick={() => handleDelete(todo.id)}>
                    Slett
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default withAuth(Gjøremålsliste);
