import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const VotePoll = () => {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
    fetch(`http://localhost:5001/api/polls/${id}`)
      .then(res => res.json())
      .then(data => setPoll(data))
      .catch(err => console.error(err));
    }, [id]);

    const handleInput = (idx, val) => setAnswers({ ...answers, [idx]: val });

    const handleCheckbox = (idx, option) => {
        const cur = answers[idx] || [];
        setAnswers({
            ...answers,
            [idx]: cur.includes(val) ? cur.filter(c => c !== val) : [...cur, val] });
    };

    const handleSubmit = (e) => {
    e.preventDefault();
    const formatted = Object.keys(answers).map(k => ({ questionIndex: Number(k), answer: answers[k] }));

    fetch(`http://localhost:5001/api/polls/${id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: formatted })
        })
        .then(res => {
            if (res.ok){ 
                setSubmitted(true);
            } else { 
            alert('Failed to submit vote');
            } 
        })
        .catch(err => console.error(err));
    };

    if (!poll) return <p>Loading...</p>;
    if (submitted) return <div style={{ textAlign: 'center', marginTop: '50px' }}><h1>Vote Recorded!</h1></div>;

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        <h1>{poll.title}</h1>
        <form onSubmit={handleSubmit}>
          {poll.questions.map((q, i) => (
            <div key={i} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #eee' }}>
              <h3>{q.text}</h3>
              {q.type === 'text' && <input onChange={e => handleInput(i, e.target.value)} required style={{ width: '100%' }} />}
              {q.type === 'ranked' && <input type="number" onChange={e => handleInput(i, e.target.value)} required />}
              {q.type === 'scale' && [1,2,3,4,5].map(n => <label key={n} style={{marginRight:'10px'}}><input type="radio" name={`q-${i}`} value={n} onChange={e => handleInput(i, e.target.value)} required />{n}</label>)}
              {q.type === 'multiple-choice' && q.options.map(opt => <div key={opt}><label><input type="radio" name={`q-${i}`} value={opt} onChange={e => handleInput(i, e.target.value)} required /> {opt}</label></div>)}
              {q.type === 'checkbox' && q.options.map(opt => <div key={opt}><label><input type="checkbox" onChange={() => handleCheckbox(i, opt)} /> {opt}</label></div>)}
            </div>
          ))}
          <button type="submit" style={{ padding: '10px 20px', background: 'blue', color: 'white', border: 'none' }}>Submit Vote</button>
        </form>
      </div>
    );
  };

export default VotePoll;