import React from 'react';
import { useGlobalContext } from '../GlobalContext';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const Header: React.FC = () => {
    const { logout } = useGlobalContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className='my-5'>
      <ul className='flex items-center justify-between'>
        <Link to="/characters">
          <img src={logo} className="h-[60px] w-auto" />
        </Link>
        <div className='flex gap-5'>
          <li>
            <Link to="/characters" className='text-3xl font-fontRegular text-[#08BAE3] drop-shadow-[0_1px_2px_rgb(192_223_64)] hover:drop-shadow-[0_1px_4px_rgb(192_223_64)]'>Characters</Link>
          </li>
          <li>
            <button onClick={handleLogout} className='text-3xl font-fontRegular text-[#08BAE3] drop-shadow-[0_1px_2px_rgb(192_223_64)] hover:drop-shadow-[0_1px_4px_rgb(192_223_64)]'>Logout</button>
          </li>
        </div>
      </ul>
    </nav>
  );
};

export default Header;
