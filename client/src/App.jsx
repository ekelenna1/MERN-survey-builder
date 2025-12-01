import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import CreatePoll from './pages/CreatePoll.jsx';

function App() {
  return (
    <Router>
      <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-poll" element={<CreatePoll />} />
        </Routes>
    </Router>
  );
}

export default App
