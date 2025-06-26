import React, { useState } from 'react';
import CreateGroup from '../trainer/GroupPage/createGroup';  // Your Create Group Component
import ViewGroup from '../trainer/GroupPage/viewGroup';    // Your View Group Component
import '../../styles/GroupPage.css'
const GroupPage = () => {
  const [activePage, setActivePage] = useState(''); // To track which page is active

  // Handle button click to switch between pages
  const handlePageChange = (page) => {
    setActivePage(page);
  };

  return (
    <div style={{ padding: '20px' }} className='container'>
      <h2>Group Dashboard</h2>

      {/* Buttons to toggle between creating or viewing group */}
      <div className="button-container">
        <button onClick={() => handlePageChange('create')}>Create Group</button>
        <button onClick={() => handlePageChange('view')}>View Groups</button>
      </div>

      {/* Conditional rendering of components based on selected page */}
      <div className="content">
        {activePage === 'create' && <CreateGroup />}
        {activePage === 'view' && <ViewGroup />}
      </div>
    </div>
  );
};

export default GroupPage;
