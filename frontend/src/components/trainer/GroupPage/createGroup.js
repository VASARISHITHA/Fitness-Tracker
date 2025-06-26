import React, { useState } from 'react';
import { createGroup } from '../../../service/api'; // Ensure createGroup API is implemented // Add styles as per your requirement
import '../../../styles/createGroup.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const CreateGroup = () => {
  const [groupName, setGroupName] = useState('');
  // const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!groupName) {
      toast.error('Group Name is required');
      return;
    }
    const trainerId = localStorage.getItem('trainerId');
    if (!trainerId) {
      toast.error('Trainer ID not found in localStorage');
      return;
    }
    const groupData = {
      name: groupName,
      trainer: trainerId, 
      trainees:[],// Get trainer ID from localStorage or context
    };
  console.log(groupData)
    try {
      const response = await createGroup(groupData);
      toast.success('Group Created Successfully!');
      console.log(response)
      setGroupName('');
    } catch (error) {
      console.error('Error creating group:', error);
      toast.error('Failed to create group');
    }
  };

  return (
    <div className="create-group-container">
      <h2>Create New Group</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          required
          className="border p-2 w-full"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Group
        </button>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default CreateGroup;
