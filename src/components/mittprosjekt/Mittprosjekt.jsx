import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Button } from '@mui/material';
import RedigerProsjekt from '../rediger/RedigerProsjekt';
import Medlemmer from '../medlemmer/Medlemmer';
import { getProjects, updateProject, deleteProject } from '../../api/project';
import { getUser } from '../../api/user';
import withAuth from '../../hoc/withAuth';
import './Mittprosjekt.css';
import keycloak from '../keycloak/keycloak';

function Mittproject() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [user, setUser] = useState(null);
  const [projectMembers, setProjectMembers] = useState([]);
  const [viewMembers, setViewMembers] = useState(false); // New state variable

  useEffect(() => {
    async function fetchData() {
      const userData = await getUser(keycloak.tokenParsed.sub);
      setUser(userData);

      if (userData) {
        const userProjects = await getProjects(userData.id);
        setProjects(userProjects);
      }
    }

    fetchData();
  }, [selectedProject]);

  function getProgress(phase) {
    switch (phase) {
      case 'Analyse':
        return 20;
      case 'Design':
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
      className: 'progress-bar',
    };
  }

  function getPhaseColor(phase) {
    switch (phase) {
      case 'Analyse':
        return '#f44336';
      case 'Design':
        return '#e466e8';
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
    setViewMembers(false); // Reset viewMembers state
  }

  async function handleViewMembers(project) {
    setSelectedProject(project);

    const response = await fetch('http://localhost:8080/api/v1/users');
    const users = await response.json();

    const members = users.filter((user) => user.projects.includes(project.id));
    setProjectMembers(members);
    setViewMembers(true); // Update viewMembers state
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
      <div className="mittprosjekt-table">
        <table>
          <thead>
            <tr>
              <th>Prosjektnavn</th>
              <th>Beskrivelse</th>
              <th>Type</th>
              <th>Startdato</th>
              <th>Frist</th>
              <th>Fremgang</th>
              <th>Dager igjen</th>
              <th>Rediger</th>
              <th>Slett</th>
              <th>Medlemmer</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td>{project.title}</td>
                <td>{project.description}</td>
                <td>{project.type}</td>
                <td>{formatDate(project.startDate)}</td>
                <td>{formatDate(project.dueDate)}</td>

                <td>
                  <div className="progress">
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{
                        width: `${getProgress(project.phase)}%`,
                        backgroundColor: getPhaseColor(project.phase),
                      }}
                      aria-valuenow={getProgress(project.phase)}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      {getProgress(project.phase)}%
                    </div>
                  </div>
                </td>
                <td>{daysRemaining(project.dueDate)}</td>
                <td>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => handleEditProject(project)}
                  >
                    Rediger
                  </Button>
                </td>
                <td>
                  <Button
                    variant="outlined"
                    color="secondary"
                    size="small"
                    onClick={() => handleDeleteProject(project.id)}
                  >
                    Slett
                  </Button>
                </td>
                <td>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => handleViewMembers(project)}
                  >
                    Se Medlemmer
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedProject && !viewMembers && (
        <RedigerProsjekt
          project={selectedProject}
          onSaveProject={handleSaveProject}
          onCancel={() => setSelectedProject(null)}
        />
      )}
      {selectedProject && viewMembers && (
        <Medlemmer
        projectMembers={projectMembers} 
        selectedProject={selectedProject}
        onCancel={() => {
          setSelectedProject(null);
          setViewMembers(false);
        }}
      />
      
      )}
    </div>
  );
}

export default withAuth(Mittproject);
