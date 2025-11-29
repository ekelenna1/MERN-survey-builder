import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const endpoint = isRegistering ? 'register' : 'login';
    
    fetch(`http://localhost:5001/api/auth/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
    .then(res => res.json().then(data => ({ ok: res.ok, data })))
    .then(({ ok, data }) => {
      if (ok) {
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      } else {
        alert(data.msg);
      }
    })
    .catch(err => {
      console.error(err);
      alert('Server connection failed. Is the backend running?');
    });
  };

  return (
    <div style={{ maxWidth: '300px', margin: '50px auto', textAlign: 'center' }}>
      <h2>{isRegistering ? 'Register' : 'Login'}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input name="username" placeholder="Username" onChange={handleChange} required style={{ padding: '8px' }} />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required style={{ padding: '8px' }} />
        <button type="submit" style={{ padding: '10px', cursor: 'pointer' }}>
          {isRegistering ? 'Sign Up' : 'Sign In'}
        </button>
      </form>
      <p onClick={() => setIsRegistering(!isRegistering)} style={{ cursor: 'pointer', color: 'blue' }}>
        {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
      </p>
    </div>
  );
};

export default Login;