import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/Activity.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const UpdateActivity = () => {
  const [formData, setFormData] = useState({
    activityType: '',
    duration: '',
    date: '',
    city: '',
    country: '',
  });

  const traineeId = localStorage.getItem('userId'); // retrieved after login

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!traineeId) {
      toast.error('Trainee ID missing. Please login.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/activity/update', {
        ...formData,
        traineeId,
      });
      toast.success(response.data.message || 'Activity updated successfully');
    } catch (error) {
      console.error('Error submitting activity:', error);
      toast.error('Failed to update activity');
    }
  };

  return (
    <div className='update-activity-container'>
      <h2 className="text-2xl font-bold mb-4">Update Activity</h2>
      <form onSubmit={handleSubmit}  className="update-activity-form">
        <div>
          <label className="block font-medium">Activity Type</label>
          <input
            type="text"
            name="activityType"
            value={formData.activityType}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Duration (minutes)</label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Country</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Submit Activity
        </button>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default UpdateActivity;
