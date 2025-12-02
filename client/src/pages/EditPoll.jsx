import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditPoll = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Existing Data
  useEffect(() => {
    const fetchPoll = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5001/api/polls/${id}`, {
      });
      const data = await res.json();
      setTitle(data.title);
      setQuestions(data.questions);

      if (data.expiresAt) {
        const date = new Date(data.expiresAt);
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        setExpiresAt(date.toISOString().slice(0, 16));
      }

      setLoading(false);
    };
    fetchPoll();
  }, [id]);

  // 2. Reuse Update Logic (Same as CreatePoll)
  const updateQ = (idx, key, val) => {
    const newQ = [...questions];
    newQ[idx][key] = val;
    setQuestions(newQ);
  };

  const handleOption = (qIdx, oIdx, val) => {
    const newQ = [...questions];
    newQ[qIdx].options[oIdx] = val;
    setQuestions(newQ);
  };

  const addOption = (qIdx) => {
    const newQ = [...questions];
    newQ[qIdx].options.push(`Option ${newQ[qIdx].options.length + 1}`);
    setQuestions(newQ);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:5001/api/polls/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
      body: JSON.stringify({ title, questions, expiresAt })
    });

    if (res.ok) navigate('/dashboard');
    else alert("Failed to update");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Edit Poll</h1>
      <form onSubmit={handleSubmit}>
        <input value={title} onChange={e => setTitle(e.target.value)} required style={{ width: '100%', padding: '10px', marginBottom: '20px', fontSize: '18px' }} />
        <div style={{ marginBottom: '20px', padding: '10px', background: '#fff3cd', borderRadius: '5px' }}>
            <label><strong>Edit Expiration: </strong></label>
            <input 
                type="datetime-local" 
                value={expiresAt} 
                onChange={e => setExpiresAt(e.target.value)} 
            />
        </div>

        {questions.map((q, i) => (
          <div key={i} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '20px', background: '#f9f9f9' }}>
            <input value={q.text} onChange={e => updateQ(i, 'text', e.target.value)} required style={{ width: '100%', marginBottom: '10px' }} />
            <select value={q.type} onChange={e => updateQ(i, 'type', e.target.value)} style={{ marginBottom: '10px' }}>
              <option value="multiple-choice">Multiple Choice</option>
              <option value="checkbox">Checkbox</option>
              <option value="text">Short Answer</option>
              <option value="scale">Scale (1-5)</option>
              <option value="ranked">Ranked</option>
            </select>
            
            {(q.type === 'multiple-choice' || q.type === 'checkbox') && (
              <div style={{ marginLeft: '20px' }}>
                {q.options.map((opt, oIdx) => (
                  <div key={oIdx} style={{ marginBottom: '5px' }}>
                    <input value={opt} onChange={e => handleOption(i, oIdx, e.target.value)} required />
                  </div>
                ))}
                <button type="button" onClick={() => addOption(i)}>+ Add Option</button>
              </div>
            )}
             <button type="button" onClick={() => { const newQ = [...questions]; newQ.splice(i, 1); setQuestions(newQ); }} style={{ color: 'red', marginTop: '10px' }}>Remove Question</button>
          </div>
        ))}
         <button type="button" onClick={() => setQuestions([...questions, { text: '', type: 'text', options: [] }])}>+ Add Question</button>
        <button type="submit" style={{ marginLeft: '10px', background: 'orange', color: 'white', border: 'none', padding: '10px' }}>Save Changes</button>
      </form>
    </div>
  );
};

export default EditPoll;