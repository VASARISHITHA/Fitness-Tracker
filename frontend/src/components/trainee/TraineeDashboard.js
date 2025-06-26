import React,{useState}  from "react";
import MyPlans from "./TraineePlan";
import UpdateActivity from './Activity';
import ProgressCharts from "./Progress";
import { useNavigate } from 'react-router-dom';
import dashboardImage2 from '../../assests/dashboardImage2'
const TraineeDashboard = () => {
  const navigate = useNavigate();
  const [activeComponent, setActiveComponent] = useState('');
  const handleButtonClick = (componentName) => {
    if (componentName === 'Logout') {
      navigate('/');
    } else {
      setActiveComponent(componentName);
    }
  };
  return (
    <div>
      <div className="navbar">
        <h2>Trainee Dashboard</h2>
        <button onClick={() => handleButtonClick('TraineePlan')}>My Plan</button>
        <button onClick={() => handleButtonClick('Activity')}>Activity</button>
        <button onClick={() => handleButtonClick('progress')}>View Progress</button>
        <button onClick={() => handleButtonClick('Logout')}>Logout</button>
      </div>
    {activeComponent === '' && (
            <div className="dashboard-image-container" style={{background:"linear-gradient(120deg,rgb(245, 245, 243),rgb(254, 203, 0))"}}>
              <div style={{position: 'absolute',left: '5%',top: '40%',width: '35%',fontSize: '2.8rem',fontWeight: 'bold',color: 'purple'}}>
                  “Push yourself, because no one else is going to do it for you.” </div>
              <img src={dashboardImage2} alt="Trainee Dashboard" style={{width:'56%',height:'90vh',marginLeft:'44%'}} />
            </div>
          )}
      <div className="content">
      {activeComponent === 'TraineePlan' && <MyPlans/>}
      {activeComponent === 'Activity' && <UpdateActivity />}
      {activeComponent === 'progress' && <ProgressCharts/>}
      </div>
    </div>
  );
};
export default TraineeDashboard;