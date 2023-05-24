import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import withAuth from '../../hoc/withAuth';
import './RedigerProsjekt.css';

function RedigerProsjekt({ project, onSaveProject, onCancel }) {
  const [editedProject, setEditedProject] = useState(project);

  const handleFieldChange = (field, value) => {
    setEditedProject(prevProject => ({
      ...prevProject,
      [field]: value
    }));
  };

  const handleSaveProject = () => {
    if (!editedProject.phase) {
      console.error('Error updating project: Phase is required');
      return;
    }

    onSaveProject(editedProject);
  };

  return (
    <Dialog open={true} onClose={onCancel}>
      <DialogTitle>Rediger Prosjekt</DialogTitle>
      <DialogContent>
        <label htmlFor="editTitle">Tittel</label>
        <input
          type="text"
          id="editTitle"
          value={editedProject.title}
          onChange={(e) => handleFieldChange('title', e.target.value)}
          className="form-control"
          required
        />

        {/* Remaining input fields */}
        <label htmlFor="editType">Type:</label>
        <select
          id="editType"
          value={editedProject.type}
          onChange={(e) => handleFieldChange('type', e.target.value)}
          className="form-control"
        >
          <option value="Jobb">Jobb</option>
          <option value="Privat">Personlig</option>
        </select>

        <label htmlFor="editDescription">Beskrivelse</label>
        <input
          type="text"
          id="editDescription"
          value={editedProject.description}
          onChange={(e) => handleFieldChange('description', e.target.value)}
          className="form-control"
          required
        />

        <label htmlFor="editStartDate">Startdato:</label>
        <input
          type="datetime-local"
          id="editStartDate"
          value={editedProject.startDate}
          onChange={(e) => handleFieldChange('startDate', e.target.value)}
          className="date-control"
        />

        <label htmlFor="editDueDate">Sluttdato:</label>
        <input
          type="datetime-local"
          id="editDueDate"
          value={editedProject.dueDate}
          onChange={(e) => handleFieldChange('dueDate', e.target.value)}
          className="date-control"
        />

        <label htmlFor="editPhase">Fase:</label>
        <select
          id="editPhase"
          value={editedProject.phase}
          onChange={(e) => handleFieldChange('phase', e.target.value)}
          className="date-control"
        >
          <option value="Analyse">Analyse</option>
          <option value="Design">Design</option>
          <option value="Implementering">Implementering</option>
          <option value="Testing">Testing</option>
          <option value="Vedlikehold">Vedlikehold</option>
        </select>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Avbryt</Button>
        <Button onClick={handleSaveProject} color="primary">
          Oppdater
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default withAuth(RedigerProsjekt);

