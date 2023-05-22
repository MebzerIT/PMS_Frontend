import { useState } from "react";
import withAuth from "../../hoc/withAuth";
import { addProject } from "../../api/project";
import "./Lagprosjekt.css";
import keycloak from "../keycloak/keycloak";

const Lagprosjekt = () => {
  const [project, setProject] = useState({
    title: "",
    type: "Jobb",
    description: "",
    startDate: "",
    dueDate: "",
    phase: "Analyse",
  });


  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const userId = keycloak.tokenParsed.sub; // Extract the user ID from the Keycloak token
      const response = await addProject({ ...project, users: [userId] });
      console.log(response);
      alert("Project added successfully!");
    } catch (error) {
      console.error(error);
      alert("Error adding project. Please try again.");
    }
  };


  const handleChange = (event) => {
    const { name, value } = event.target;
    setProject((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

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
          required // Add the required attribute
        >
          <option value="Analyse">Analyse</option>
          <option value="Design">Design</option>
          <option value="Implementering">Implementering</option>
          <option value="Testing">Testing</option>
          <option value="Vedlikehold">Vedlikehold</option>
        </select>


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
