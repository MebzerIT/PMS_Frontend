import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogActions, Button } from '@mui/material';

function Medlemmer({ projectMembers, selectedProject, onCancel }) {
    const [membersData, setMembersData] = useState([]);

    useEffect(() => {
        const fetchMembersData = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/v1/users');
                const users = await response.json();
                const members = users.filter((user) => user.projects.includes(selectedProject.id));
                setMembersData(members);
            } catch (error) {
                console.error('Error fetching project members:', error);
            }
        };

        fetchMembersData();
    }, [projectMembers, selectedProject]);


    return (
        <Dialog open={true} onClose={onCancel}>
            <DialogContent>
                <h3>Se Medlemmer</h3>
                {membersData.length > 0 ? (
                    <ul>
                        {membersData.map((member) => (
                            <li key={member.id}>{`${member.firstName} ${member.lastName} ${member.email}`}</li>
                        ))}
                    </ul>
                ) : (
                    <p>Ingen medlemmer.</p>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>Avbryt</Button>
            </DialogActions>
        </Dialog>
    );
}

export default Medlemmer;
