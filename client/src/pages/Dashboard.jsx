import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [polls, setPolls] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    fetch('http://localhost:5001/api/polls/mine', {
      headers: { 'x-auth-token': token }
    })
    .then(res => {
      if (res.ok) return res.json();
      navigate('/'); 
      return [];
    })
    .then(setPolls)
    .catch(err => console.error(err));
  }, [navigate]);

  const handleDelete = (id) => {
    if (!confirm("Are you sure? This cannot be undone.")) return;
    
    const token = localStorage.getItem('token');
    
    fetch(`http://localhost:5001/api/polls/${id}`, {
      method: 'DELETE',
      headers: { 'x-auth-token': token }
    })
    .then(res => {
      if (res.ok) {
        setPolls(prev => prev.filter(p => p._id !== id));
      } else {
        alert("Failed to delete");
      }
    })
    .catch(err => console.error(err));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>My Polls</h1>
        <button onClick={() => { localStorage.removeItem('token'); navigate('/'); }}>Logout</button>
      </header>
      <button onClick={() => navigate('/create')} style={{ padding: '10px 20px', margin: '20px 0', background: 'green', color: 'white', border: 'none' }}>+ Create New Poll</button>
      
      {polls.map(poll => (
        <div key={poll._id} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '10px', borderRadius: '5px' }}>
          <h3 style={{ margin: '0 0 10px 0' }}>{poll.title}</h3>
          <p>Votes: {poll.votes.length}</p>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => navigate(`/results/${poll._id}`)} style={{ background: '#007bff', color: 'white', padding: '5px 10px', border: 'none' }}>
              📊 View Results
            </button>
            
            <button onClick={() => navigate(`/edit/${poll._id}`)} style={{ background: 'orange', color: 'white', padding: '5px 10px', border: 'none' }}>
              ✏️ Edit
            </button>

            <button onClick={() => handleDelete(poll._id)} style={{ background: 'red', color: 'white', padding: '5px 10px', border: 'none' }}>
              🗑 Delete
            </button>

            <button onClick={() => {
              navigator.clipboard.writeText(`http://localhost:5173/poll/${poll._id}`);
              alert('Link copied!');
            }}>🔗 Share</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;