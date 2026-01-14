// Login.jsx
import React, { useState } from 'react';
import { useAuth } from './../../context/AuthContext';

const Login = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(password);
    if (!success) setError('Invalid password. Try another one!');
  };

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-[#383838]">
    <form onSubmit={handleSubmit} className="p-4 max-w-sm flex flex-col justify-center items-center mt-10">
      <img className="mb-7 w-30 h-30" src={import.meta.env.VITE_LOGIN_LOGO_URL} alt="MDS Medical Logo" />
      <input
        type="password"
        placeholder="Enter password"
        className="border border-[#A0A0A0] px-3 py-2 w-full rounded rounded-3xl bg-[#FFF] text-center"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <div className="text-red-400 mt-2">{error}</div>}
      <button type="submit" className="mt-4 text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 font-medium rounded-3xl text-sm px-5 py-2.5 text-center mb-2 w-full">Log In</button>

    </form>
    </div>
  );
};

export default Login;
