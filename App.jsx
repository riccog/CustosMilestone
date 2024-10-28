import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

const useAuth = () => {
  const login = async () => {
    const tenantID = 10000000; // Your tenant ID
    const clientId = 'custos-u8fth4tahwfil3ue3vpm-10000000'; // Your client ID
    const redirectUri = 'http://localhost:5173/callback'; // Your redirect URI
    const state = 'active'; // Define the state parameter
  
    // Generate a code verifier and challenge
    const codeVerifier = Array.from(window.crypto.getRandomValues(new Uint8Array(32)))
      .map(b => String.fromCharCode(b % 94 + 33)).join('');
    
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    localStorage.setItem('code_verifier', codeVerifier); // Store code verifier in local storage
  
    // Construct the authorization URL with backticks
    const authUrl = `https://api.playground.usecustos.org/api/v1/identity-management/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=openid+profile+email&state=${encodeURIComponent(state)}&code_challenge=${encodeURIComponent(codeChallenge)}&code_challenge_method=S256`;
  
    // Redirect the user to the authorization endpoint
    window.location.href = authUrl;
  };
  

  const generateCodeChallenge = async (codeVerifier) => {
    const buffer = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', buffer);
    const base64String = btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    return base64String;
  };
  return { login };
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

const WelcomeScreen = () => {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const name = urlParams.get('name');
  const role = urlParams.get('role');

  return (
    <div>
      <h1>Welcome, {name}</h1>
      <p>Role: {role}</p>
      <h2>Your Tasks:</h2>
      <ul>
        {/* Example Task List */}
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
        <Route path="/welcome" element={<WelcomeScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
