import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { TravelRequest } from '../../model/TravelRequest';

export function MyTravels() {
    const [travels, setTravels] = useState<TravelRequest[]>([]);
    const navigate = useNavigate();
    const [userId, setUserId] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const findUserId = async () => {
                const userIdAux = (await api.post('/api/findUserIdByToken', { token })).data.user_id;
                setUserId(userIdAux);
            };
            findUserId();
        }
    }, []);

    useEffect(() => {
        const fetchTravels = async () => {
            if (userId) {
                const response = await api.get<TravelRequest[]>('/api/getTravelById', { params: { userId } });
                const pendingTravels = response.data.filter(travel => !travel.accepted);
                setTravels(pendingTravels);
            }
        };
        fetchTravels();
    }, [userId]);

    const handleDelete = async (id: number) => {
        try {
            await api.post('/api/deleteTravel', { id });
            alert('Travel request deleted!');
            setTravels(travels => travels.filter(travel => travel.id !== id));
        } catch (error) {
            console.error('Error deleting travel request:', error);
            alert('Failed to delete travel request');
        }
    };

    return (
        <div className='container mx-auto p-4'>
            <h2 className="text-2xl font-bold text-center mb-4">Minhas viagens pendentes</h2>
            <button onClick={() => navigate('/')} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4">Voltar para Home</button>
            {travels.length > 0 ? (
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Data partida</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Hora partida</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {travels.map(travel => (
                            <tr key={travel.id}>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{new Date(travel.departuredate).toLocaleDateString()}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{travel.departuretime}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <button onClick={() => handleDelete(travel.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Deletar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-center text-gray-500">Sem viagens pendentes.</p>
            )}
        </div>
    );
}

export default MyTravels;
