import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/SideBar';
import Topbar from '../../components/TopBar';
import { Main } from '../../components/Main';

export function Home() {
  const [username, setUsername] = useState('');
  
    useEffect(() => {
      const storedUsername = localStorage.getItem('username');
      if (storedUsername) {
        setUsername(storedUsername);
      }
    }, [])

  return (
    <div>
      <Main>
        <div className="h-screen flex flex-col items-center justify-center bg-white text-black">
          <h1 className="text-4xl font-bold mb-2">Bem-vindo ao iTrip, {username}!</h1>
          <p className="text-xl">A sua plataforma confiável para planejar suas viagens!</p>
          <div className="space-y-3">
          <button className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-300 transition duration-300">
            Agendar nova viagem
          </button>
          <button className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-300 transition duration-300">
            Viagens programadas
          </button>
          <button className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-300 transition duration-300">
            Viagens concluídas
          </button>
        </div>
        </div>
      </Main>
    </div>
  );
}