import React, { useRef, useState, useCallback } from 'react';
import { useGlobalContext } from '../GlobalContext';
import { useNavigate } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchCharacters = async ({ pageParam = 'https://rickandmortyapi.com/api/character' }) => {
  const response = await axios.get(pageParam);
  return response.data;
};

const Characters: React.FC = () => {
  const { userData } = useGlobalContext();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  if (!userData) {
    navigate('/login');
  }

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['characters'],
    queryFn: fetchCharacters,
    initialPageParam: 'https://rickandmortyapi.com/api/character',
    getNextPageParam: (lastPage) => lastPage.info.next || undefined,
  });

  const observerRef = useRef<IntersectionObserver | null>(null);

  const loadMoreRef = useCallback(
    (node: HTMLDivElement) => {
      if (isFetchingNextPage) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage]
  );

  if (status === 'pending') return <div>Loading...</div>;
  if (status === 'error') return <div>Error loading characters</div>;

  const filteredCharacters = data?.pages.flatMap((page) =>
    page.results.filter((character: any) =>
      character.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleCharacterClick = (id: number) => {
    navigate(`/character/${id}`);
  };

  return (
    <div>
      <h3>Characters List</h3>
      
      <div>
        <input
          type="text"
          placeholder="Search characters..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div>
        {filteredCharacters?.map((character: any) => (
          <div
            key={character.id}
            onClick={() => handleCharacterClick(character.id)}
            style={{ cursor: 'pointer' }}
          >
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
      
      <div ref={loadMoreRef} style={{ height: '20px', margin: '10px' }}>
        {isFetchingNextPage ? 'Loading more characters...' : ''}
      </div>
    </div>
  );
};

export default Characters;
