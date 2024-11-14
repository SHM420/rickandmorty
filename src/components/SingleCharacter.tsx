import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchCharacterById = async (id: string) => {
  const response = await axios.get(`https://rickandmortyapi.com/api/character/${id}`);
  return response.data;
};

const fetchEpisodeByIds = async (ids: string) => {
  const response = await axios.get(`https://rickandmortyapi.com/api/episode/${ids}`);
  return Array.isArray(response.data) ? response.data : [response.data];
};

const SingleCharacter: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      navigate('/');
    }
  }, [id, navigate]);

  const { data: character, error: characterError, isLoading: characterLoading } = useQuery({
    queryKey: ['character', id],
    queryFn: () => fetchCharacterById(id as string),
    enabled: !!id,
  });

  const episodesIds = character?.episode.map((url: string) => url.split('/').pop()).join(',');
  const locationId = character?.location?.url.split('/').pop();

  // Fetch episodes data
  const { data: episodes, error: episodesError, isLoading: episodesLoading } = useQuery({
    queryKey: ['episodes', character?.episode],
    queryFn: () => fetchEpisodeByIds(episodesIds || ''),
    enabled: !!character?.episode,
  });

  if (characterLoading) return <div>Loading character...</div>;
  if (characterError) return <div>Error loading character</div>;
  if (episodesError) return <div>Error loading episodes</div>;

  return (
    <div className='h-screen flex items-start justify-center gap-10 mt-10'>
      <div className='flex items-center backdrop-blur-sm bg-green-400 bg-opacity-10 rounded-[20px]'>
        <img src={character?.image} alt={character?.name} className='w-[50%] rounded-[20px]' />
        <div className='text-lg p-5'>
          <h3 className='text-5xl font-fontRegular text-[#08BAE3] drop-shadow-[0_1px_2px_rgb(192_223_64)]'>{character?.name}</h3>
          <p>Status: {character?.status}</p>
          <p>Gender: {character?.gender}</p>
          <p>Species: {character?.species}</p>
          <p
            key={`location-${character?.id}`}
            onClick={() => navigate(`/location/${locationId}`)}
            className='cursor-pointer text-[#08BAE3] hover:drop-shadow-[0_1px_2px_rgb(192_223_64)]'
          >
            Location: {character?.location?.name}
          </p>
          <p>Origin: {character?.origin?.name}</p>
        </div>
      </div>

      <div className='max-h-[85%] backdrop-blur-sm bg-green-400 bg-opacity-10 rounded-[20px] p-5 overflow-y-auto'>
        <h4 className='text-4xl text-[#08BAE3] font-fontRegular drop-shadow-[0_1px_2px_rgb(192_223_64)]'>Episodes:</h4>
        {episodesLoading ? (
          <div>Loading episodes...</div>
        ) : (
          <ul>
            {episodes?.map((episode: any) => (
              <li
                key={`episode-${episode?.id}`}
                onClick={() => navigate(`/episode/${episode.id}`)}
                className='cursor-pointer hover:text-[#08BAE3]'
              >
                <strong className='text-lg'>{episode.name}</strong> - {episode.air_date} - {episode.episode}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SingleCharacter;
