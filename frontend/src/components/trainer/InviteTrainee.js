import React, { useState, useEffect } from 'react';
import { inviteTrainee, getGroups } from '../../service/api';  // ✅ import getGroups
import '../../styles/InviteTrainee.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const InviteTrainee = () => {
  const [email, setEmail] = useState('');
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true); // Set loading to true when starting to fetch groups
      try {
        const groupList = await getGroups();
        console.log('Fetched groups:', groupList);
        setGroups(groupList);
      } catch (error) {
        console.error('Error fetching groups:', error);
        toast.error('Failed to load groups.');
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchGroups();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const invitedBy = localStorage.getItem('trainerId'); // trainerId from localstorage
      if (!invitedBy) {
        toast.error('Trainer ID is missing!');
        return;
      }

      // Debugging log for data before submitting
      console.log('Sending invite with data:', { 
        email, 
        trainer: invitedBy, 
        group: selectedGroup 
      });

      await inviteTrainee({ 
        email, 
        trainer: invitedBy, 
        group: selectedGroup 
      });

      toast.success('Invite sent successfully!');
      setEmail('');
      setSelectedGroup('');
    } catch (error) {
      console.error('Error inviting trainee:', error);
      toast.error('Failed to send invite. Please try again later.');
    }
  };

  return (
    <div className="invite-container">
      <h2>Invite a Trainee</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Trainee Email"
          required
          className="border p-2 w-full"
        />

        {loading ? (
          <p>Loading groups...</p>
        ) : (
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            required
            className="border p-2 w-full"
          >
            <option value="">Select a group</option>
            {groups.length === 0 ? (
              <option disabled>No groups available</option>
            ) : (
              groups.map((group, index) => (
                <option key={group._id || index} value={group._id}>
                  {group.name}
                </option>
              ))
            )}
          </select>
        )}

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={loading || !selectedGroup}
        >
          Send Invite
        </button>
      </form>
      <ToastContainer position="top-right" autoClose={2500} />
    </div>
  );
};

export default InviteTrainee;
