import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const fetchEpisodeById = async (id: string) => {
  const response = await axios.get(`https://rickandmortyapi.com/api/episode/${id}`);
  return response.data;
};

const fetchCharactersByIds = async (ids: string) => {
  const response = await axios.get(`https://rickandmortyapi.com/api/character/${ids}`);
  return response.data;
};

const SingleEpisode: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  

  if (!id) {
    navigate('/');
  }

  const { data: episode, error: episodeError, isLoading: episodeLoading } = useQuery({
    queryKey: ['episodes', id],
    queryFn: () => fetchEpisodeById(id as string),
    enabled: !!id,
  });

  const charactersIds = episode?.characters.map((url: string) => url.split('/').pop()).join(',');

  const { data: characters, error: charactersError, isLoading: charactersLoading } = useQuery({
    queryKey: ['character', episode?.characters],
    queryFn: () => fetchCharactersByIds(charactersIds || ''),
      enabled: !!episode?.characters, 
  });

  if (episodeLoading) return <div>Loading Episode...</div>;
  if (episodeError) return <div>Error!</div>;

  if (charactersLoading) return <div>Loading Characters...</div>;
  if (charactersError) return <div>Error!</div>;

  const handleCharacterClick = (id: number) => {
    navigate(`/character/${id}`);
  };

  return (
    <div>
      <div className='text-xl'>
        <h3 className='text-5xl font-fontRegular text-[#08BAE3] drop-shadow-[0_1px_2px_rgb(192_223_64)]'>{episode?.name}</h3>
        <p>Status: {episode?.air_date}</p>
        <p>Gender: {episode?.episode}</p>
      </div>

      <h4 className='mt-5 mb-2 text-xl'>Characters:</h4>
      <div className='overflow-y-auto h-[70vh]'>
        <ul className='grid grid-cols-3 gap-5'>
          {characters?.map((character: any) => (
            <li 
              key={character.id}
              onClick={() => handleCharacterClick(character.id)}
              className='cursor-pointer flex items-center gap-5 backdrop-blur-sm'>
              <img src={character?.image} alt={character?.name} className='rounded-l-[20px]' />
              <h3 className='text-5xl font-fontRegular text-[#08BAE3] drop-shadow-[0_1px_2px_rgb(192_223_64)]'>{character?.name}</h3>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SingleEpisode;
