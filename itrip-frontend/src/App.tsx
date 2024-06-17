import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Routes, Route, Navigate, Link, BrowserRouter, useLocation, useNavigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import api from '../src/api/api';
import InvalidPage from './pages/Invalid';
import { SettingsPage } from './pages/SettingsPage';
import { Register } from './pages/Register';
import { RequestTravel } from './pages/RequestTravel';
import { ViewRequests } from './pages/ViewRequest';
import MyTravels from './pages/MyTravels';

function App() {
    const [isTokenValid, setTokenValid] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const validateToken = async () => {
            try {
                const token = localStorage.getItem('token');

                if (!token) {
                    if (location.pathname == '/register') {
                        navigate('/register');
                        return
                    }
                    if(location.pathname == '/viewRequest') {
                        
                    }
                    setTokenValid(false);
                    navigate('/login');
                    return;
                }

                const idUser = (await api.post('/api/findUserIdByToken', { token })).data.user_id

                const response = await api.post('/api/getTokenLog', { idUser });
                if (response.status === 200) {
                    if (response.data.token === token && response.data.token !== null) {
                        setTokenValid(true)
                    }
                    else {
                        setTokenValid(true)
                        localStorage.setItem('token', response.data.token)
                    }
                } else {
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

            <Route path="/register" element={<Register />} />

            <Route path="/settings" element={<SettingsPage />} />

            <Route path="*" element={<InvalidPage />} />

            <Route path="/requestTravel" element={<RequestTravel />} />

            <Route path="/viewRequest" element={<ViewRequests />} />

            <Route path="/mytravels" element={<MyTravels />} />



        </Routes>
    );
}

export default App;