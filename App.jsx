import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './App.css';

const useAuth = () => {
  const login = async () => {
    const tenantID = 10000000;
    const clientId = 'custos-u8fth4tahwfil3ue3vpm-10000000';
    const redirectUri = 'http://localhost:5173/callback';
    const state = 'active';

    const codeVerifier = Array.from(window.crypto.getRandomValues(new Uint8Array(32)))
      .map(b => String.fromCharCode(b % 94 + 33)).join('');

    const codeChallenge = await generateCodeChallenge(codeVerifier);
    localStorage.setItem('code_verifier', codeVerifier);

    const authUrl = `https://api.playground.usecustos.org/api/v1/identity-management/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=openid+profile+email&state=${encodeURIComponent(state)}&code_challenge=${encodeURIComponent(codeChallenge)}&code_challenge_method=S256`;
    window.location.href = authUrl;
  };

//code verifier - fix this
//libraries that 
  const generateCodeChallenge = async (codeVerifier) => {
    const buffer = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', buffer);
    const base64String = btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    return base64String;
  };

  const exchangeCodeForToken = async (code) => {
    const codeVerifier = localStorage.getItem('code_verifier');
    const tokenUrl = `https://api.playground.usecustos.org/api/v1/identity-management/token`;
    const clientId = 'custos-u8fth4tahwfil3ue3vpm-10000000';
  
    const data = new URLSearchParams();
    data.append('grant_type', 'authorization_code');
    data.append('code', code);
    data.append('redirect_uri', 'http://localhost:5173/callback');
    data.append('client_id', clientId);
    data.append('code_verifier', codeVerifier);
  
    try {
      const response = await axios.post(tokenUrl, data);
      const accessToken = response.data.access_token;
  
      // Fetch user details
      const userResponse = await axios.get('https://api.playground.usecustos.org/api/v1/identity-management/user', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      
      const { name, email } = userResponse.data;
  
      // Pass name and email to the welcome screen
      window.location.href = `/welcome?name=${name}&email=${email}`;
    } catch (error) {
      console.error('Error exchanging code for token or fetching user details:', error);
    }
  };  

  return { login, exchangeCodeForToken };
};

const LoginScreen = () => {
  const { login } = useAuth();

  return (
    <div>
      <h1>Manage Tasks More Efficiently</h1>
      <div className="card">
        <button onClick={login}>Log on via Custos</button>
      </div>
    </div>
  );
};

const CallbackScreen = () => {
  const { exchangeCodeForToken } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get('code');
    if (code) {
      exchangeCodeForToken(code).then(() => {
        navigate('/welcome'); // Redirect after token exchange
      });
    }
  }, [location, exchangeCodeForToken, navigate]);

  return <p>Loading...</p>;
};

const WelcomeScreen = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const name = urlParams.get('name');
  const email = urlParams.get('email');

  return (
    <div>
      <h1>Welcome {name}</h1>
      <p>Email: {email}</p>
      <h2>Your Tasks:</h2>
      <ul>
        <li>Task 1</li>
        <li>Task 2</li>
        <li>Task 3</li>
      </ul>
      <button onClick={() => alert('Add task functionality here')}>Add Task</button>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/callback" element={<CallbackScreen />} />
        <Route path="/welcome" element={<WelcomeScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
