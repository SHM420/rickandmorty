import React from 'react';
import { useGlobalContext } from '../GlobalContext';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchCharacters = async () => {
  const response = await axios.get('https://rickandmortyapi.com/api/character');
  console.log('Characters Data =>', response.data)
  return response.data;
};

const Characters: React.FC = () => {
  const { userData } = useGlobalContext();
  const navigate = useNavigate();

  if (!userData) {
    navigate('/login');
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ['characters'],
    queryFn: fetchCharacters,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading characters</div>;

  return (
    <div>
      <h3>Characters List</h3>
      <div>
        {data.results.map((character: any) => (
          <div key={character.id}>
            <h4>{character.name}</h4>
            <img src={character.image} alt={character.name} />
            <p>Status: {character.status}</p>
            <p>Gender: {character.gender}</p>
            <p>Species: {character.species}</p>
            <p>
              Location Name:
              <a href={character.location?.name}> {character.location?.name}</a>
            </p>
            <p>
              Origin Name:
              <a href={character.origin?.url}> {character.origin?.name}</a>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Characters;
