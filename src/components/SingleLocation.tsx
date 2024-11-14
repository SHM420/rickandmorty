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
        <div className='text-xl'>
            <h3 className='text-5xl font-fontRegular text-[#08BAE3] drop-shadow-[0_1px_2px_rgb(192_223_64)]'>{location?.name}</h3>
            <p>Status: {location?.type}</p>
            <p>Gender: {location?.dimension}</p>
        </div>

      <h4 className='mt-5 mb-2 text-xl'>Characters:</h4>
      <div className='overflow-y-auto h-[70vh]'>
        <ul className='grid grid-cols-3 gap-5'>
            {characters?.map((character: any) => (
            <li key={character.id}
            onClick={() => handleCharacterClick(character.id)}
            className='cursor-pointer flex items-center gap-5 backdrop-blur-sm'>
                <img src={character?.image} alt={character?.name}  className='rounded-l-[20px]' />
                <h3 className='text-5xl font-fontRegular text-[#08BAE3] drop-shadow-[0_1px_2px_rgb(192_223_64)]'>{character?.name}</h3>
            </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default SingleLocation;
