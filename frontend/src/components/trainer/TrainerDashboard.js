import React, { useState } from 'react';
import CreatePlan from '../trainer/createPlan';
import InviteTrainee from '../trainer/InviteTrainee';
import '../../styles/trainerDashboard.css'
import GroupPage from './groups';
import TrainerAssignPlan from './TrainerAssignPlan';
import TrainerProgress from './ProgressDashboard';
import dashboardImage from '../../assests/trainerdashboard.png'
import {useNavigate } from 'react-router-dom';    
const TrainerDashboard = () => {
  const [activeComponent, setActiveComponent] = useState('');
  const navigate = useNavigate();
  const handleButtonClick = (componentName) => {
    if (componentName === 'Logout') {
      navigate('/');
    } else {
      setActiveComponent(componentName);
    }
  }

  return (
    <div>
      <div className="navbar">
        <h2>Trainer Dashboard</h2>
        <button onClick={() => handleButtonClick('CreatePlan')}>Create Plan</button>
        <button onClick={()=>handleButtonClick('AssignPlan')}>AssignPlan</button>
        <button onClick={() => handleButtonClick('InviteTrainee')}>Invite Trainee</button>
        <button onClick={() => handleButtonClick('Group')}>Groups</button>
        <button onClick={() => handleButtonClick('TrainerProgress')}>View progress</button>
        <button onClick={() => handleButtonClick('Logout')}>Logout</button>
      </div>
      {activeComponent === '' && (
        <div className="dashboard-image-container">
          <img src={dashboardImage} alt="Trainer Dashboard" style={{width:'100%',height:'90vh'}} />
        </div>
      )}
      <div className="content">
        {activeComponent === 'CreatePlan' && <CreatePlan />}
        {activeComponent === 'InviteTrainee' && <InviteTrainee />}
        {activeComponent === 'Group' && <GroupPage/>}
        {activeComponent==='AssignPlan'&&<TrainerAssignPlan/>}
        {activeComponent==='TrainerProgress'&&<TrainerProgress/>}
      </div>
    </div>
  );
};

export default TrainerDashboard;


