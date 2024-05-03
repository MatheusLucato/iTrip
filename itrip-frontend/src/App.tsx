import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Routes, Route, Navigate, Link, BrowserRouter, useLocation, useNavigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import api from '../src/api/api';
import InvalidPage from './pages/Invalid';
import User from './pages/User';

function App() {
const [isTokenValid, setTokenValid] = useState(false);
const navigate = useNavigate();
const currentLocation = useLocation();

useEffect(() => {
    const validateToken = async () => {
     try {
        const token = localStorage.getItem('token');

        if (!token) {
         setTokenValid(false);
         navigate('/login');
         return;
        }

        const idUser = (await api.post('/api/findUserIdByToken', { token })).data.user_id
        
        const response = await api.post('/api/getTokenLog', { idUser });
        if(response.status === 200){
          if(response.data.token === token && response.data.token !== null){
            setTokenValid(true)
          }
          else{
            setTokenValid(true)
            localStorage.setItem('token', response.data.token)
          }
        }else{
          setTokenValid(false)
          navigate('/login')
        }

        
     } catch (error) {
        console.error('Error validating token', error);
        setTokenValid(false);
        navigate('/login');
     }
    };

    validateToken();
    
}, [navigate]);

  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      
      <Route path="/" element={<Home />} />

      <Route path="*" element={<InvalidPage />} />

      <Route path="/login" element={<Login />} />

      <Route path="/user" element={<User />} />
      
    </Routes>
  );
}

export default App;