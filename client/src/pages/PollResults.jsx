import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PollResults = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5001/api/polls/${id}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then(data => {
        setPoll(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const downloadCSV = () => {
    if (!poll || poll.votes.length === 0) {
      alert('No votes to download');
      return;
    }

    const headers = ['Submission Date', ...poll.questions.map(q => `"${q.text}"`)];
    const rows = poll.votes.map(vote => {
        let dateStr = "N/A";
        if (vote.submittedAt) {
            const d = new Date(vote.submittedAt);
            if (!isNaN(d)) {
                dateStr = `"${d.toLocaleString()}"`;
            }
        }
        const answers = poll.questions.map((q, index) => {
            const ansObj = vote.answers.find(a => a.questionIndex === index);
            let answerText = ansObj ? ansObj.response : "";
    
            if (Array.isArray(answerText)) {
              answerText = answerText.join(" | ");
            }

            const safeText = String(answerText).replace(/"/g, '""');
            return `"${safeText}"`;
        });

        return [dateStr, ...answers].join(',');
    });

    const csvContent = [headers.join(","), ...rows].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `poll_results_${id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <p>Loading...</p>;
  if (!poll) return <p>Poll not found</p>;

  // Aggregation Logic
  const results = {};

  poll.votes.forEach(vote => {
    vote.answers.forEach(answer => {
      const qIndex = answer.questionIndex;
      const response = answer.response;
      
      if (!results[qIndex]) results[qIndex] = {};
      
      if (Array.isArray(response)) {
        response.forEach(r => {
          results[qIndex][r] = (results[qIndex][r] || 0) + 1;
        });
      } else {
        results[qIndex][response] = (results[qIndex][response] || 0) + 1;
      }
    });
  });

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button onClick={() => navigate('/dashboard')}>&larr; Back to Dashboard</button>
            <button onClick={downloadCSV} style={{ background: '#28a745', color: 'white', padding: '10px 15px', border: 'none', cursor: 'pointer' }}>
                📥 Export to CSV
            </button>
        </div>
      <h1>Results: {poll.title}</h1>
      <p>Total Respondents: {poll.votes.length}</p>

      {poll.questions.map((q, i) => (
        <div key={i} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px', borderRadius: '8px' }}>
          <h3>{q.text}</h3>
          
          {Object.keys(results[i] || {}).length === 0 ? (
            <p style={{ fontStyle: 'italic' }}>No votes yet.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {Object.entries(results[i]).map(([answer, count]) => (
                <li key={answer} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', padding: '5px', background: '#f0f0f0' }}>
                  <span>{answer}</span>
                  <strong>{count} votes</strong>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default PollResults;