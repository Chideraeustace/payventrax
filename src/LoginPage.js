import React, { useState } from 'react';
import { BiUser, BiLock } from 'react-icons/bi';
import { FaGoogle, FaFacebookF } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      alert(`Logged in as: ${email}`);
      setLoading(false);
      navigate('/dashboard'); // Redirect after login
    }, 1500);
  };

  const handleSignup = () => {
    navigate('/signup'); // Navigate to signup page
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-gradient-to-r from-[#040000] to-[#1b1a1a] overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#e59d02] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#8b00ff] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      {/* Login card */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 w-full max-w-md p-10 bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20"
      >
        <h2 className="text-3xl font-bold text-center text-[#e59d02] mb-6">Welcome Back</h2>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email input */}
          <div className="flex items-center border border-gray-400 rounded-xl px-4 py-2 bg-white/20 focus-within:border-[#e59d02] focus-within:ring-1 focus-within:ring-[#e59d02] transition-all">
            <BiUser className="text-white text-xl mr-3" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-transparent outline-none w-full text-white placeholder-gray-300"
            />
          </div>

          {/* Password input */}
          <div className="flex items-center border border-gray-400 rounded-xl px-4 py-2 bg-white/20 focus-within:border-[#e59d02] focus-within:ring-1 focus-within:ring-[#e59d02] transition-all">
            <BiLock className="text-white text-xl mr-3" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-transparent outline-none w-full text-white placeholder-gray-300"
            />
          </div>

          {/* Forgot password */}
          <div className="text-right">
            <a href="#!" className="text-sm text-[#e59d02] hover:underline transition-colors">
              Forgot password?
            </a>
          </div>

          {/* Login button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#e59d02] text-black font-semibold rounded-xl shadow-lg hover:scale-105 transform transition-all"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Signup button */}
        <button
          onClick={handleSignup}
          className="w-full mt-4 py-3 border border-[#e59d02] text-[#e59d02] font-semibold rounded-xl shadow-lg hover:bg-[#e59d02] hover:text-black transform transition-all"
        >
          Sign Up
        </button>

        {/* Divider */}
        <div className="flex items-center my-5 text-gray-300">
          <hr className="flex-grow border-gray-500" />
          <span className="mx-2 text-sm">or login with</span>
          <hr className="flex-grow border-gray-500" />
        </div>

        {/* Social login */}
        <div className="flex justify-center gap-5">
          <button className="flex items-center justify-center p-3 rounded-xl bg-red-500 hover:scale-105 transition-transform shadow-md">
            <FaGoogle className="text-white" />
          </button>
          <button className="flex items-center justify-center p-3 rounded-xl bg-blue-600 hover:scale-105 transition-transform shadow-md">
            <FaFacebookF className="text-white" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
