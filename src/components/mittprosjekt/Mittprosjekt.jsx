import { useEffect, useState } from 'react';
import { getProjects } from '../../api/project';
import withAuth from '../../hoc/withAuth';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Mittprosjekt.css';

function Mittproject() {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        async function getData() {
            const data = await getProjects();
            setProjects(data);
        }

        getData();
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

    function eventStyleGetter(event, start, end, isSelected) {
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
            case 'analyse':
                return '#f44336';
            case 'design':
                return '#9c27b0';
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
                            <th>Prosjekt</th>
                            <th>Type</th>
                            <th>Fase</th>
                            <th>Startdato</th>
                            <th>Frist</th>
                            <th>Gjenværende dager</th>
                            <th>Fremgang</th> 
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map((project) => (
                            <tr key={project.id}>
                                <td>{project.title}</td>
                                <td>{project.type}</td>
                                <td>{project.phase}</td>
                                <td>{formatDate(project.startDate)}</td>
                                <td>{formatDate(project.dueDate)}</td>
                                <td>{daysRemaining(project.dueDate)}</td>
                                <td>
                                    <div className="progress-bar">
                                        <div
                                            className="progress-bar-fill"
                                            style={{
                                                backgroundColor: getPhaseColor(project.phase),
                                                width: `${getProgress(project.phase)}%`,
                                            }}
                                        ></div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        </div>
    );
}
export default withAuth(Mittproject);
