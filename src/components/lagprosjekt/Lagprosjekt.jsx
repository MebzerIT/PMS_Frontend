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
    fase: "Analyse",
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
    <>
      <div className="prosjekt">
        <h2>Lag nytt prosjekt:</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Tittel</label>
          <br />
          <input
            type="text"
            name="title"
            value={project.title}
            onChange={handleChange}
            required
          />
          <br />

          <label htmlFor="type">Type:</label>
          <br />
          <select
            id="type"
            name="type"
            value={project.type}
            onChange={handleChange}
          >
            <option value="Jobb">Jobb</option>
            <option value="Privat">Personlig</option>
          </select>
          <br />

          <label htmlFor="description">Beskrivelse</label>
          <br />
          <input
            type="text"
            name="description"
            value={project.description}
            onChange={handleChange}
            required
          />
          <br />

          <label htmlFor="startDate">Startdato:</label>
          <br />
          <input
            type="date"
            name="startDate"
            value={project.startDate}
            onChange={handleChange}
          />
          <br />

          <label htmlFor="dueDate">Sluttdato:</label>
          <br />
          <input
            type="date"
            name="dueDate"
            value={project.dueDate}
            onChange={handleChange}
          />
          <br />

          <label htmlFor="phase">Fase:</label>
          <br />
          <select
            id="phase"
            name="phase"
            value={project.phase}
            onChange={handleChange}
          >
            <option value="Analyse">Analyse</option>
            <option value="Design">Design </option>
            <option value="Implementering">Implementering</option>
            <option value="Testing">Testing</option>
            <option value="Vedlikehold">Vedlikehold</option>
          </select>
          <br />

          <button type="submit">Lagre prosjekt</button>
        </form>
      </div>
    </>
  );
};

export default withAuth(Lagprosjekt);
