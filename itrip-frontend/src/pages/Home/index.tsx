import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/SideBar';
import Topbar from '../../components/TopBar';
import { Main } from '../../components/Main';

export function Home() {
  const [username, setUsername] = useState('');
  const [isMotorista, setIsMotorista] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
    const motoristaStatus = localStorage.getItem('motorista') === '1';
    setIsMotorista(motoristaStatus);
  }, []);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div>
      <Main>
        <div className="h-screen flex flex-col items-center justify-center bg-white text-black">
          <h1 className="text-4xl font-bold mb-2">Bem-vindo ao iTrip, {username}!</h1>
          <p className="text-xl">A sua plataforma confiável para planejar suas viagens!</p>
          <div className="space-y-3">
            <button 
              onClick={() => handleNavigation('/requestTravel')}
              className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-300 transition duration-300">
              Agendar novas viagens
            </button>
            {isMotorista && (
              <button 
                onClick={() => handleNavigation('/viewRequest')}
                className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-300 transition duration-300">
                Visualizar solicitações de viagens
              </button>
            )}
            <button 
              onClick={() => handleNavigation('/settings')}
              className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-300 transition duration-300">
              Ajustes
            </button>
          </div>
        </div>
      </Main>
    </div>
  );
}

export default Home;
