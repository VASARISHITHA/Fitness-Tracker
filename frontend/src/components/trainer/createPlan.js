import React, { useState } from 'react';
import '../../styles/createPlan.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const CreatePlan = () => {
  const [formData, setFormData] = useState({
    planName: '',
    exerciseType: '',
    duration: '',
    workoutType: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/plans', formData);
      console.log('Plan created successfully', response.data);
       // Show success toast notification
       toast.success('Plan created successfully!');
    } catch (error) {
      console.error('Error creating plan:', error);
      toast.error('Error creating plan. Please try again.');
    }
  };

  return (
    <div className='plan'>
    <div className="form-container">
      <h2>Create Training Plan</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="planName">Plan Name</label>
          <input 
            type="text" 
            name="planName" 
            placeholder="Enter plan name" 
            value={formData.planName} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="input-group">
          <label htmlFor="exerciseType">Exercise Type</label>
          <input 
            type="text" 
            name="exerciseType" 
            placeholder="Enter exercise type" 
            value={formData.exerciseType} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="input-group">
          <label htmlFor="duration">Duration (minutes)</label>
          <input 
            type="number" 
            name="duration" 
            placeholder="Enter duration" 
            value={formData.duration} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="input-group">
          <label htmlFor="workoutType">Workout Type</label>
          <input 
            type="text" 
            name="workoutType" 
            placeholder="Enter workout type" 
            value={formData.workoutType} 
            onChange={handleChange} 
            required 
          />
        </div>
        <button type="submit" className="submit-btn">Create Plan</button>
      </form>
    </div>
    <ToastContainer position="top-right" autoClose={2000} />
  </div>
  );
};

export default CreatePlan;

