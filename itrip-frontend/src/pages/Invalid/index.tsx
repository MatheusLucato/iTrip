import React from 'react';

const InvalidPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">iTrip</h1>
        <h2 className="text-4xl font-bold text-gray-800 mb-4">404</h2>
        <p className="text-xl text-gray-600 mb-8">Página não encontrada</p>
        <a href="/home" className="text-blue-500 hover:text-blue-700">Voltar para a página inicial</a>
      </div>
    </div>
  );
};

export default InvalidPage;
