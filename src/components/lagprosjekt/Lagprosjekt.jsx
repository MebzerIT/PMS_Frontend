import { useState } from "react";
import withAuth from "../../hoc/withAuth";
import { addProject } from "../../api/project";
import "./Lagprosjekt.css";

  const Lagprosjekt = () => {
    const [project, setProject] = useState({
      title: "",
      type: "Jobb",
      description: "",
      startDate: "",
      dueDate: "",
      phase: "",
    });
  
    const handleChange = (event) => {
      const { name, value } = event.target;
      setProject((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    };
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      try {
        const response = await addProject(project);
        console.log(response);
        alert("Project added successfully!");
      } catch (error) {
        console.error(error);
        alert("Error adding project. Please try again.");
      }
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
            type="Beskrivelse"
            name="description"
            value={project.description}
            onChange={handleChange}
            required
            className="date-control"
          />
  
          <label htmlFor="startDate">Startdato:</label>
          <input
            type="datetime-local"
            name="startDate"
            value={project.startDate}
            onChange={handleChange}
            className="date-control"
          />
  
          <label htmlFor="dueDate">Sluttdato:</label>
          <input
            type="datetime-local"
            name="dueDate"
            value={project.dueDate}
            onChange={handleChange}
            className="date-control"
          />
  
          <label htmlFor="phase">Fase:</label>
          <select
            id="phase"
            name="phase"
            value={project.phase}
            onChange={handleChange}
            className="date-control"
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
