import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const fetchLocationById = async (id: string) => {
  const response = await axios.get(`https://rickandmortyapi.com/api/location/${id}`);
  return response.data;
};

const fetchcharactersByIds = async (ids: string) => {
  const response = await axios.get(`https://rickandmortyapi.com/api/character/${ids}`);
  return response.data;
};

const SingleLocation: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  

  if (!id) {
    navigate('/');
  }

  const { data: location, error: locationError, isLoading: locationLoading } = useQuery({
    queryKey: ['locations', id],
    queryFn: () => fetchLocationById(id as string),
    enabled: !!id,
  });

  const charactersIds = location?.residents.map((url: string) => url.split('/').pop()).join(',');

  const { data: characters, error: charactersError, isLoading: charactersLoading } = useQuery({
    queryKey: ['character', location?.residents],
    queryFn: () => fetchcharactersByIds(charactersIds || ''),
      enabled: !!location?.residents, 
  });

  if (locationLoading) return <div>Loading location...</div>;
  if (locationError) return <div>Error!</div>;

  if (charactersLoading) return <div>Loading characters...</div>;
  if (charactersError) return <div>Error!</div>;

  const handleCharacterClick = (id: number) => {
    navigate(`/character/${id}`);
  };

  return (
    <div>
      <h3>{location?.name}</h3>
      <p>Status: {location?.type}</p>
      <p>Gender: {location?.dimension}</p>

      <h4>characters:</h4>
      <ul>
        {characters?.map((character: any) => (
          <li key={character.id}
          onClick={() => handleCharacterClick(character.id)}
          style={{ cursor: 'pointer' }}>
            <h3>{character?.name}</h3>
            <img src={character?.image} alt={character?.name} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SingleLocation;
