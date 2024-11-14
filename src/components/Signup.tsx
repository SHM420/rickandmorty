import React, { useState } from 'react';
import { useGlobalContext } from '../GlobalContext';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const SignUp: React.FC = () => {
  const { signup } = useGlobalContext();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup(email, password);
      navigate('/characters');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className='h-screen flex flex-col items-center justify-center gap-5'>
      <div className='flex flex-col items-center'>
        <img src={logo} className='w-[30vw]' />
        <h3 className='text-6xl font-fontRegular text-[#08BAE3] drop-shadow-[0_1px_2px_rgb(192_223_64)]'>SignUp</h3>
      </div>
      <div className='flex items-center justify-center flex-col gap-5 w-[30vw] h-[30vh] rounded-[10px] bg-sky-300 bg-opacity-10 backdrop-blur-sm'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-5 w-[60%]'>
          <input
            className='bg-transparent border-b-2 outline-none'
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            className='bg-transparent border-b-2 outline-none'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button type="submit" className='bg-green-900 bg-opacity-80 border-2 border-[#40B6CB] p-1 rounded-[20px] hover:bg-opacity-100 hover:drop-shadow-[0_0_3px_rgb(192_223_64)]'>Sign Up</button>
        </form>
        {error && <div>Error: {error}</div>}
        <p>
          Already have an account? <a href="/login" className='text-[#08BAE3] hover:drop-shadow-[0_1px_2px_rgb(192_223_64)]'>Login here</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
