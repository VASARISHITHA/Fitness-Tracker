import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getPlans } from '../../service/api';
import '../../styles/AssignPlan.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const TrainerAssignPlan = () => {
  const [plans, setPlans] = useState([]);
  const [traineeId, setTraineeId] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState('');

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const plans = await getPlans();  // assuming this route lists all plans
        console.log(plans)
        setPlans(plans);
      } catch (error) {
        console.error('Error fetching plans:', error);
      }
    };

    fetchPlans();
  }, []);

  const handleAssign = async () => {
    if (!selectedPlanId || !traineeId) {
      toast.error('Please select a plan and enter trainee ID');
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/trainee-plans/assign/${selectedPlanId}`, {
        traineeId,
      });
      toast.success('Plan assigned successfully!');
      setTraineeId('');
      setSelectedPlanId('');
    } catch (error) {
      console.error('Error assigning plan:', error);
      toast.error('Failed to assign plan. Please try again.');
    }
  };

  return (
    <div className="assign-plan-container">
      <div className="assign-plan-card">
        <h2 className='assign-plan-title'>Assign Plan to Trainee</h2>
        <label className="block mb-2 font-semibold">Select Plan:</label>
        <select
          value={selectedPlanId}
          onChange={(e) => setSelectedPlanId(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="">-- Select a Plan --</option>
          {plans.map((plan) => (
            <option key={plan._id} value={plan._id}>
              {plan.planName} - {plan.exerciseType}
            </option>
          ))}
        </select><br/>
        <label className="block mb-2 font-semibold">Trainee ID:</label>
        <input
          type="text"
          placeholder="Enter Trainee ID"
          value={traineeId}
          onChange={(e) => setTraineeId(e.target.value)}
          className="border p-2 w-full"
        /><br/><br/>

      <button
        onClick={handleAssign}
        className="assign-button"
      >
        Assign Plan
      </button>
    </div>
    <ToastContainer position="top-right" autoClose={3000} />
  </div>
  );
};

export default TrainerAssignPlan;
