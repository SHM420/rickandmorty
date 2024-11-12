import React from 'react';
import { useGlobalContext } from '../GlobalContext';
import { Link, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
    const { logout } = useGlobalContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link to="/characters">Characters</Link>
          </li>
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
