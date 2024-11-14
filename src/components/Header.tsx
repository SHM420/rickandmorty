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
    <div>
      <nav>
        <ul className='container mx-auto flex items-center justify-between'>
          <li>
            <Link to="/characters">Characters</Link>
          </li>
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Header;
