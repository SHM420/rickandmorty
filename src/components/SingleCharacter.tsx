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
    <div>
      <h3>{character?.name}</h3>
      <img src={character?.image} alt={character?.name} />
      <p>Status: {character?.status}</p>
      <p>Gender: {character?.gender}</p>
      <p>Species: {character?.species}</p>
      <p
        key={`location-${character?.id}`}
        onClick={() => navigate(`/location/${locationId}`)}
        style={{ cursor: 'pointer' }}
      >
        Location: {character?.location?.name}
      </p>
      <p>Origin: {character?.origin?.name}</p>

      <h4>Episodes:</h4>
      {episodesLoading ? (
        <div>Loading episodes...</div>
      ) : (
        <ul>
          {episodes?.map((episode: any) => (
            <li
              key={`episode-${episode?.id}`}
              onClick={() => navigate(`/episode/${episode.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <strong>{episode.name}</strong> - {episode.air_date} - {episode.episode}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SingleCharacter;
