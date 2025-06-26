import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { verifyInvite, acceptInvite } from '../../service/api';

const Register = () => {
  const { token } = useParams();

  const [invite, setInvite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    const fetchInvite = async () => {
      try {
        const inviteData = await verifyInvite(token);
        setInvite(inviteData);
      } catch (error) {
        setError('Invalid or expired token');
      } finally {
        setLoading(false);
      }
    };

    fetchInvite();
  }, [token]);

  const handleAccept = async () => {
    setAccepting(true);
    try {
      // Get logged-in user ID dynamically
      const userId = localStorage.getItem('userId'); // or get from context/store
      if (!userId) {
        setError('You must be logged in to accept the invitation.');
        setAccepting(false);
        return;
      }

      await acceptInvite(token, userId);
      alert('You have successfully joined the group!');
    } catch (error) {
      setError('Failed to join the group');
    } finally {
      setAccepting(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Join Group</h2>
      {invite && (
        <div>
          <p>You have been invited to join the group: <strong>{invite.group.name}</strong></p>
          <button 
            onClick={handleAccept} 
            disabled={accepting}
            style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
          >
            {accepting ? 'Joining...' : 'Accept Invitation'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Register;
