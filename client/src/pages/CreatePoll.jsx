import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreatePoll = () => {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([{ text: '', type: 'multiple-choice', options: ['Option 1'] }]);
  const navigate = useNavigate();

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    fetch('http://localhost:5001/api/polls', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
      body: JSON.stringify({ title, questions })
    })
    .then(res => {
      if (res.ok) navigate('/dashboard');
      else alert('Failed to create poll');
    })
    .catch(err => console.error(err));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Create Poll</h1>
      <form onSubmit={handleSubmit}>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Poll Title" required style={{ width: '100%', padding: '10px', marginBottom: '20px', fontSize: '18px' }} />
        
        {questions.map((q, i) => (
          <div key={i} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '20px', background: '#f9f9f9' }}>
            <input value={q.text} onChange={e => updateQ(i, 'text', e.target.value)} placeholder="Question Text" required style={{ width: '100%', padding: '8px', marginBottom: '10px' }} />
            <select value={q.type} onChange={e => updateQ(i, 'type', e.target.value)} style={{ marginBottom: '10px' }}>
              <option value="multiple-choice">Multiple Choice</option>
              <option value="checkbox">Checkbox</option>
              <option value="text">Short Answer</option>
              <option value="scale">Scale (1-5)</option>
              <option value="ranked">Ranked (Number)</option>
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
        <button type="submit" style={{ marginLeft: '10px', background: 'blue', color: 'white', border: 'none', padding: '10px' }}>Publish Poll</button>
      </form>
    </div>
  );
};

export default CreatePoll;