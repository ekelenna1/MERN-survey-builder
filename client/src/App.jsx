import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import CreatePoll from './pages/CreatePoll.jsx';
import VotePoll from './pages/VotePoll.jsx';
import EditPoll from './pages/EditPoll.jsx';

function App() {
  return (
    <Router>
      <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-poll" element={<CreatePoll />} />
          <Route path="/poll/:id" element={<VotePoll />} />
          <Route path="/edit/:id" element={<EditPoll />} />
        </Routes>
    </Router>
  );
}

export default App
