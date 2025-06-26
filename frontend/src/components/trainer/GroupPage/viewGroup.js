import React, { useEffect, useState } from 'react';
import { getGroups, getGroupDetails } from '../../../service/api'; // Import both functions
import '../../../styles/ViewGroup.css';
const ViewGroup = () => {
  const [groups, setGroups] = useState([]); // List of all groups
  const [selectedGroupId, setSelectedGroupId] = useState(null); // Selected group id
  const [groupDetails, setGroupDetails] = useState(null); // Details of selected group
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch all groups initially
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await getGroups();
        setGroups(res);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch groups');
      }
    };
    fetchGroups();
  }, []);

  // Fetch selected group details
  useEffect(() => {
    const fetchGroupDetails = async () => {
      if (!selectedGroupId) return;
      setLoading(true);
      try {
        const res = await getGroupDetails(selectedGroupId);
        setGroupDetails(res);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch group details.');
      } finally {
        setLoading(false);
      }
    };
    fetchGroupDetails();
  }, [selectedGroupId]);

  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '20px' }} className='view-group-container'>
      <h2>View Groups</h2>

      {/* List all groups first */}
      <div className='group-list'>
        <h3>Select a group to view trainees:</h3>
        {groups.length > 0 ? (
          <ul>
            {groups.map((group) => (
              <li key={group._id}>
                <button onClick={() => setSelectedGroupId(group._id)}>
                  {group.name}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No groups available.</p>
        )}
      </div>

      {/* Show selected group details */}
      {loading && <p>Loading group details...</p>}
      {groupDetails && (
        <div className='group-details'>
          <h3>Group: {groupDetails.name}</h3>
          <h4>Trainees:</h4>
          {groupDetails.trainees.length > 0 ? (
            <ul>
              {groupDetails.trainees.map((trainee) => (
                <li key={trainee._id}>
                  {trainee.name} ({trainee.email})
                </li>
              ))}
            </ul>
          ) : (
            <p>No trainees in this group yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewGroup;
