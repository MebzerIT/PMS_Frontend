import React, { useEffect, useState } from 'react';
import { getProjects } from '../../api/project';
import { getUser } from '../../api/user';
import keycloak from '../keycloak/keycloak';
import './Hjemmeside.css';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import moment from 'moment';

function Hjemmeside() {
  const [projects, setProjects] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track user's authentication status
  const [hoveredEvent, setHoveredEvent] = useState(null); // Track the hovered event
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 }); // Track mouse position

  useEffect(() => {
    async function fetchData() {
      if (keycloak.authenticated) {
        setIsLoggedIn(true);
        const userData = await getUser(keycloak.tokenParsed.sub);
        if (userData) {
          const userProjects = await getProjects(userData.id);
          setProjects(userProjects);
        }
      }
    }

    fetchData();
  }, []);

  const eventSources = projects.map((project) => ({
    id: project.id,
    title: project.title,
    start: project.startDate,
    end: project.dueDate,
    phase: project.phase, 
  }));

  const getPhaseColor = (phase) => {
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
  };

  if (!isLoggedIn) {
    return (
      <div className="not-logged-in-image">
        <div>
          <h3>Samle alle oppgavene dine, gjøremålslister, lagkamerater og verktøy</h3>
          <p>Hold alt på samme sted – selv om teamet ditt ikke er det.</p>
        </div>
        <div className="image-container">
          <img src={process.env.PUBLIC_URL + '/images/gjoremal.png'} alt="Gjøremål" />
          <img src={process.env.PUBLIC_URL + '/images/calendar.png'} alt="Calendar" style={{ marginBottom: '500px' }} />
        </div>
      </div>
    );
  }

  const eventContent = (eventInfo) => {
    const handleEventMouseEnter = (event) => {
      setHoveredEvent(event);
    };

    const handleEventMouseLeave = () => {
      setHoveredEvent(null);
    };

    return (
      <div
        style={{ backgroundColor: getPhaseColor(eventInfo.event.extendedProps.phase), cursor: 'pointer' }}
        onMouseEnter={() => handleEventMouseEnter(eventInfo.event)}
        onMouseLeave={handleEventMouseLeave}
      >
        <b>{eventInfo.timeText}</b>
        <p>{eventInfo.event.title}</p>
      </div>
    );
  };

  const handleMouseMove = (event) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  return (
    <div className="mittprosjekt-container" onMouseMove={handleMouseMove}>
      <div className="mittprosjekt-calendar">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={eventSources}
          eventContent={eventContent}
          datesRender={(info) => {
            const calendarApi = info.view.calendar;
            const events = calendarApi.getEvents();
            const eventDates = events.map((event) => {
              const start = moment(event.start).startOf('day');
              const end = moment(event.end).startOf('day');
              const dates = [];
              let current = start;
              while (current <= end) {
                dates.push(current.format('YYYY-MM-DD'));
                current = current.add(1, 'day');
              }
              return dates;
            });
            const flattenedDates = [].concat(...eventDates);
            calendarApi.addCustomDates((date) => flattenedDates.includes(moment(date).format('YYYY-MM-DD')), 'event');
          }}
        />
        {hoveredEvent && (
          <div
            className="event-details"
            style={{ position: 'absolute', top: mousePosition.y, left: mousePosition.x, pointerEvents: 'none' }}
          >
            <p>{hoveredEvent.title}</p>
            <p>Phase: {hoveredEvent.extendedProps.phase}</p>
            <p>Start Date: {moment(hoveredEvent.start).format('YYYY-MM-DD')}</p>
            <p>Due Date: {moment(hoveredEvent.end).format('YYYY-MM-DD')}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Hjemmeside;
