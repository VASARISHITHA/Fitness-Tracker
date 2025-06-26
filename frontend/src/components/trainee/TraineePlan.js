import React, { useEffect, useState } from 'react';
import { getAssignedPlan } from '../../service/api';
import '../../styles/Myplan.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const MyPlans = () => {
  const [plans, setPlans] = useState([]);
  const traineeId=localStorage.getItem('userId');
  useEffect(() => {
    if (!traineeId) {
      console.error('Trainee ID is undefined or invalid');
      toast.error('Trainee ID is missing. Please log in.');
      return;  // Prevent API call if traineeId is missing
    }
    const fetchAssignedPlans = async () => {
      try {
        const data = await getAssignedPlan(traineeId);
        setPlans(data);
        toast.success('Plans fetched successfully!');
      } catch (error) {
        console.error('Error fetching assigned plans:', error);
        toast.error('Failed to fetch assigned plans.');
      }
    };

    fetchAssignedPlans();
  }, [traineeId]);

  return (
    <div className="my-plans-container">
      <h2 className="my-plans-title">My Assigned Plans</h2>
      {plans.length === 0 ? (
        <p style={{textAlign:'center'}}>No plans assigned yet.</p>
      ) : (
        <ul className="plans-grid">
          {plans.map((plan) => (
            <li key={plan._id} className="plan-card">
              <h3 className="text-xl font-semibold">{plan.planName}</h3>
              <p>Exercise Type: {plan.exerciseType}</p>
              <p>Workout Type: {plan.workoutType}</p>
              <p>Duration: {plan.duration} mins</p>
            </li>
          ))}
        </ul>
      )}
    <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default MyPlans;
