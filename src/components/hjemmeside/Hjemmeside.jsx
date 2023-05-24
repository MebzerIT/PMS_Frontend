import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import RedigerProsjekt from '../rediger/RedigerProsjekt';
import { getProjects, updateProject, deleteProject } from '../../api/project';
import { getUser } from '../../api/user';

import withAuth from '../../hoc/withAuth';
import keycloak from '../keycloak/keycloak';

import "./Hjemmeside.css";


function Hjemmeside() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track user's authentication status

  useEffect(() => {
    async function fetchData() {

      if (keycloak.authenticated) {
        setIsLoggedIn(true); // Set isLoggedIn to true if the user is authenticated


        const userData = await getUser(keycloak.tokenParsed.sub);
        setUser(userData);

        if (userData) {
          const userProjects = await getProjects(userData.id);
          setProjects(userProjects);
        }
      }
    }

    fetchData();
  }, []);

  function getProgress(phase) {
    switch (phase) {
      case 'analyse':
        return 20;
      case 'design':
        return 40;
      case 'Implementering':
        return 60;
      case 'Testing':
        return 80;
      case 'Vedlikehold':
        return 99;
      default:
        return 0;
    }
  }

  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  }

  function daysRemaining(dueDate) {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }

  const localizer = momentLocalizer(moment);

  const events = projects.map((project) => {
    const startDate = new Date(project.startDate);
    const dueDate = new Date(project.dueDate);
    const phaseColor = getPhaseColor(project.phase);

    return {
      id: project.id,
      title: project.title,
      start: startDate,
      end: dueDate,
      tooltip: `
        <div>
          <h4>${project.title}</h4>
          <p>${project.description}</p>
          <p>Type: ${project.type}</p>
          <p>Phase: ${project.phase}</p>
          <p>Start Date: ${formatDate(project.startDate)}</p>
          <p>Due Date: ${formatDate(project.dueDate)}</p>
        </div>
      `,
      phase: project.phase,
      phaseColor: phaseColor,
    };
  });

  function tooltipAccessor(event) {
    return event.tooltip;
  }

  function eventStyleGetter(event) {
    return {
      style: {
        backgroundColor: event.phaseColor,
        borderRadius: '0px',
        opacity: 0.8,
        color: 'white',
        border: 'none',
        cursor: 'pointer',
      },
    };
  }

  function getPhaseColor(phase) {
    switch (phase) {
      case 'Analyse':
        return '#f44336';
      case 'Design':
        return '#940b99';
      case 'Implementering':
        return '#2196f3';
      case 'Testing':
        return '#4caf50';
      case 'Vedlikehold':
        return '#ff9800';
      default:
        return '#607d8b';
    }
  }

  function handleSaveProject(updatedProject) {
    const projectId = parseInt(updatedProject.id);

    updateProject(projectId, updatedProject)
      .then((response) => {
        console.log('Project updated successfully');
        setSelectedProject(null);
      })
      .catch((error) => {
        console.error('Error updating project:', error.message);
      });

    setSelectedProject(null);
  }

  function handleEditProject(project) {
    setSelectedProject(project);
  }

  function handleDeleteProject(projectId) {
    deleteProject(projectId)
      .then(() => {
        console.log('Project deleted successfully');
        const updatedProjects = projects.filter((project) => project.id !== projectId);
        setProjects(updatedProjects);
      })
      .catch((error) => {
        console.error('Error deleting project:', error.message);
      });
  }

  if (!isLoggedIn) {
    return (
      <div className="not-logged-in-image">
        <div>
          <h3>Samle alle oppgavene dine, gjøremålslister, lagkamerater og verktøy</h3>
          <p>Hold alt på samme sted – selv om teamet ditt ikke er det.</p>
        </div>
        <div className="image-container">
          <img src={process.env.PUBLIC_URL + '/images/gjoremal.png'} alt="Gjøremål" />
          <img src={process.env.PUBLIC_URL + '/images/calendar.png'} alt="Calendar" style={{ marginbottom: '500px' }} />
        </div>
      </div>
    );    
  }

  return (
    <div className="mittprosjekt-container">
      <div className="mittprosjekt-header">
        <h2>Mine prosjekter</h2>
      </div>
      <div className="mittprosjekt-calendar">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          tooltipAccessor={tooltipAccessor}
          eventPropGetter={eventStyleGetter}
        />
      </div>

      {selectedProject && (
        <RedigerProsjekt
          project={selectedProject}
          onSave={handleSaveProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}

export default Hjemmeside;
