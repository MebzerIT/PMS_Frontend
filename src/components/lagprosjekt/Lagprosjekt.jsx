import { useState, useEffect } from "react";
import withAuth from "../../hoc/withAuth";
import { addProject } from "../../api/project";
import "./Lagprosjekt.css";
import keycloak from "../keycloak/keycloak";
import axios from "axios";

const apiUrlProjects = "http://localhost:8080/api/v1/projects";
const apiUrlUsers = "http://localhost:8080/api/v1/users";

const Lagprosjekt = () => {
  const [project, setProject] = useState({
    title: "",
    type: "Jobb",
    description: "",
    startDate: "",
    dueDate: "",
    phase: "Analyse",
  });

  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    getUsers();
    axios.get(`${apiUrlUsers}/${keycloak.tokenParsed.sub}`)
    .then(response => {
      setSelectedUsers((prevUsers) => [ response.data])
    })
    .catch(error => {
      console.log(error)
    })
  }, []);

  const getUsers = async () => {
    try {
      const response = await fetch(apiUrlUsers);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const userIds = selectedUsers.map((user) => user.id);
      const response = await addProject({ ...project, users: userIds });
      console.log(response);
      alert("Project added successfully!");
    } catch (error) {
      console.error(error);
      alert("Error adding project. Please try again.");
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    console.log(name,value)
    setProject((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUserSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleUserSelect = (user) => {
    setSelectedUsers((prevUsers) => [...prevUsers, user]);
  };

  const handleUserRemove = (user) => {
    setSelectedUsers((prevUsers) =>
      prevUsers.filter((prevUser) => prevUser.id !== user.id)
    );
  };

  const filteredUsers = users.filter(
    (user) =>
      (user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
      !selectedUsers.some((selectedUser) => selectedUser.id === user.id)
  );

  return (
    <div className="input-card">
      <h2>Lag nytt prosjekt:</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Tittel</label>
        <input
          type="text"
          name="title"
          value={project.title}
          onChange={handleChange}
          className="form-control"
          required
        />

        <label htmlFor="type">Type:</label>
        <select
          id="type"
          name="type"
          value={project.type}
          onChange={handleChange}
          className="form-control"
        >
          <option value="Jobb">Jobb</option>
          <option value="Privat">Personlig</option>
        </select>

        <label htmlFor="description">Beskrivelse</label>
        <input
          type="text"
          name="description"
          value={project.description}
          onChange={handleChange}
          required
          className="form-control"
        />

        <label htmlFor="startDate">Startdato:</label>
        <input
          type="datetime-local"
          name="startDate"
          value={project.startDate}
          onChange={handleChange}
          className="form-control"
        />

        <label htmlFor="dueDate">Sluttdato:</label>
        <input
          type="datetime-local"
          name="dueDate"
          value={project.dueDate}
          onChange={handleChange}
          className="form-control"
        />

        <label htmlFor="phase">Fase:</label>
        <select
          id="phase"
          name="phase"
          value={project.phase}
          onChange={handleChange}
          className="form-control"
          required
        >
          <option value="Analyse">Analyse</option>
          <option value="Design">Design</option>
          <option value="Implementering">Implementering</option>
          <option value="Testing">Testing</option>
          <option value="Vedlikehold">Vedlikehold</option>
        </select>

        <label htmlFor="userSearch">Søk etter bruker:</label>
        <input
          type="text"
          name="userSearch"
          value={searchQuery}
          onChange={handleUserSearch}
          className="form-control"
        />

        <div className="user-list">
          {filteredUsers.map((user) => (
            <div key={user.id}>
              {user.firstName} {user.lastName} - {user.email}
              <button onClick={() => handleUserSelect(user)}>Add</button>
            </div>
          ))}
        </div>

        <div className="selected-users">
          <h3>Valgt brukere:</h3>
          {selectedUsers.map((user) => (
            <div key={user.id}>
              {user.firstName} {user.lastName} - {user.email}
              <button onClick={() => handleUserRemove(user)}>Remove</button>
            </div>
          ))}
        </div>

        <input
          type="submit"
          value="Lagre prosjekt"
          className="form-control"
        />
      </form>
    </div>
  );
};

export default withAuth(Lagprosjekt);
