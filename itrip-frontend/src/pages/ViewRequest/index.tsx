import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { TravelRequest } from '../../model/TravelRequest';

export function ViewRequests() {
    const [travels, setTravels] = useState<TravelRequest[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTravels();
    }, []);

    async function fetchTravels() {
        try {
            const response = await api.get<TravelRequest[]>('/api/getAllTravels');
            const filteredTravels = response.data.filter(travel => !travel.accepted);
            setTravels(filteredTravels);
        } catch (error) {
            console.error('Error fetching travel requests:', error);
            alert('Error fetching travel requests');
        }
    }

    const handleAcceptTravel = async (id: number) => {
        try {
            const token = localStorage.getItem('token')

            const idUser = (await api.post('/api/findUserIdByToken', { token })).data.user_id

            await api.post(`/api/travelAccept`, { id, idUser });
            alert('Travel request accepted!');
            fetchTravels();
        } catch (error) {
            console.error('Error accepting travel request:', error);
            alert('Failed to accept travel request');
        }
    };

    return (
        <div className='container mx-auto p-4'>
            <h2 className="text-2xl font-bold text-center mb-4">Viagens pendentes</h2>
            <button onClick={() => navigate('/')} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4">Voltar para Home</button>
            {travels.length > 0 ? (
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Data partida</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Hora partida</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">De (Lat, Lng)</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Para (Lat, Lng)</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {travels.map(travel => (
                            <tr key={travel.id}>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{new Date(travel.departuredate).toLocaleDateString()}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{travel.departuretime}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{`${travel.originlat}, ${travel.originlng}`}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{`${travel.destinationlat}, ${travel.destinationlng}`}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <button onClick={() => handleAcceptTravel(travel.id)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Aceitar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-center text-gray-500">Sem viagens pendentes</p>
            )}
        </div>
    );
}

export default ViewRequests;
