import React, { useState, useCallback } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import api from '../../api/api';

const containerStyle = {
  width: '100%',
  height: '500px'
};

interface LatLng {
    lat: number;
    lng: number;
  }

export function RequestTravel() {
    const [origin, setOrigin] = useState<LatLng | null>(null);
    const [destination, setDestination] = useState<LatLng | null>(null);
  const [departureDate, setDepartureDate] = useState<Date | null>(new Date());
  const [departureTime, setDepartureTime] = useState('');

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyA9MjROBJTSX0CPsWOaTtYjvbFXORbLRGU"
  });
  

  const onMapClick = useCallback((event: any) => {
    if (!event.latLng) return;
    const position = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    };
    if (!origin) {
      setOrigin(position);
    } else if (!destination) {
      setDestination(position);
    }
  }, [origin, destination]);

  const handleSubmit = async () => {
    if (!origin || !destination) {
      alert('Please select both origin and destination on the map');
      return;
    }

    const token = localStorage.getItem('token')

    const idUser = (await api.post('/api/findUserIdByToken', { token })).data.user_id
  
    const travelRequest = {
      originLat: origin.lat,
      originLng: origin.lng,
      destinationLat: destination.lat,
      destinationLng: destination.lng,
      departureDate,
      departureTime,
      userIdRequest: idUser,
      accepted: false, 
      userIdDriver: null 
    };
  
    try {

      const response = await api.post("/api/newTravel", travelRequest);
  
      if (response.status == 200) {
        alert('Travel request saved!');
      } else {
        throw new Error('Failed to save the travel request');
      }
    } catch (error:any) {
      alert(error.message);
    }
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div className="flex flex-col items-center justify-center my-4">
      <div className="w-full max-w-6xl">
        <h1 className="text-3xl font-semibold text-center my-4 text-black-700">Selecione sua origem e destino</h1>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={{ lat: -25.444329, lng: -49.273159 }}
          zoom={10}
          onClick={onMapClick}
        >
          {origin && <Marker position={origin} label="Origem" />}
          {destination && <Marker position={destination} label="Destino" />}
        </GoogleMap>
        <div className="flex flex-col items-center justify-center space-y-4 mt-4">
          <div className="flex space-x-3 items-center">
            <DatePicker
              selected={departureDate}
              onChange={(date) => setDepartureDate(date)}
              className="input border border-gray-300 p-2 rounded text-lg"
            />
            <input
              type="time"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              className="input border border-gray-300 p-2 rounded text-lg"
            />
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => window.history.back()}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:border-green-700 focus:ring-green-200 transition duration-300"
            >
              Voltar para Home
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-purple-800 hover:bg-purple-900 font-bold text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
            >
              Refazer
            </button>
            <button
              onClick={handleSubmit}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );

}

export default RequestTravel;
