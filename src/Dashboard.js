import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from './Firebase';
import { signOut } from 'firebase/auth';
import { FaStore, FaUsers, FaMoneyBillWave } from 'react-icons/fa';
import { BiUserCircle, BiMenu, BiX } from 'react-icons/bi';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const displayName = user?.displayName || 'User';
  const [activeTab, setActiveTab] = useState('seller');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.matchMedia('(min-width: 640px)').matches);

  // Track screen size for sidebar visibility
  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 640px)');
    const handleChange = () => setIsLargeScreen(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err.message);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const sections = [
    {
      id: 'seller',
      title: 'Become a Seller',
      icon: <FaStore className="text-2xl text-yellow-400" />,
      content: (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 shadow-xl border border-gray-700/50">
          <h3 className="text-2xl font-bold text-yellow-400 mb-4">Become a Seller</h3>
          <p className="text-gray-200 text-base mb-6 leading-relaxed">
            Launch your online store and start selling today. Create stunning product listings, manage your inventory effortlessly, and connect with a global audience of buyers.
          </p>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(234, 179, 8, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            className="py-2.5 px-6 bg-yellow-400 text-gray-900 font-semibold rounded-full shadow-lg transition-all duration-300"
            onClick={() => navigate('/become-seller')}
          >
            Start Selling Now
          </motion.button>
        </div>
      ),
    },
    {
      id: 'affiliate',
      title: 'Become an Affiliate',
      icon: <FaUsers className="text-2xl text-yellow-400" />,
      content: (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 shadow-xl border border-gray-700/50">
          <h3 className="text-2xl font-bold text-yellow-400 mb-4">Become an Affiliate</h3>
          <p className="text-gray-200 text-base mb-6 leading-relaxed">
            Join our affiliate program and earn generous commissions by promoting products you love. Share your unique links and monitor your earnings in real-time.
          </p>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(234, 179, 8, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            className="py-2.5 px-6 bg-yellow-400 text-gray-900 font-semibold rounded-full shadow-lg transition-all duration-300"
            onClick={() => navigate('/become-affiliate')}
          >
            Join Affiliate Program
          </motion.button>
        </div>
      ),
    },
    {
      id: 'profile',
      title: 'Profile',
      icon: <BiUserCircle className="text-2xl text-yellow-400" />,
      content: (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 shadow-xl border border-gray-700/50">
          <h3 className="text-2xl font-bold text-yellow-400 mb-4">Profile</h3>
          <p className="text-gray-200 text-base mb-6 leading-relaxed">
            Personalize your account by managing your details, updating contact information, and tailoring your settings to suit your preferences.
          </p>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(234, 179, 8, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            className="py-2.5 px-6 bg-yellow-400 text-gray-900 font-semibold rounded-full shadow-lg transition-all duration-300"
            onClick={() => navigate('/profile')}
          >
            Edit Profile
          </motion.button>
        </div>
      ),
    },
    {
      id: 'payments',
      title: 'Payment/Payout',
      icon: <FaMoneyBillWave className="text-2xl text-yellow-400" />,
      content: (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 shadow-xl border border-gray-700/50">
          <h3 className="text-2xl font-bold text-yellow-400 mb-4">Payment/Payout</h3>
          <p className="text-gray-200 text-base mb-6 leading-relaxed">
            Monitor your earnings, configure secure payment methods, and schedule payouts seamlessly. Track affiliate commissions and seller profits with ease.
          </p>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(234, 179, 8, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            className="py-2.5 px-6 bg-yellow-400 text-gray-900 font-semibold rounded-full shadow-lg transition-all duration-300"
            onClick={() => navigate('/payments')}
          >
            Manage Payments
          </motion.button>
        </div>
      ),
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const sidebarVariants = {
    hidden: { x: '-100%', opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  const contentVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-black overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-yellow-500/20 rounded-full mix-blend-overlay blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500/20 rounded-full mix-blend-overlay blur-3xl opacity-30 animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex justify-between items-center p-4 sm:p-6 bg-gray-800/80 backdrop-blur-xl rounded-b-2xl shadow-2xl border-b border-gray-700/50">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <BiUserCircle className="text-3xl text-yellow-400" />
          </motion.div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
            Welcome, {displayName}!
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(234, 179, 8, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            className="py-2 px-5 bg-yellow-400 text-gray-900 font-semibold rounded-full shadow-lg transition-all duration-300"
          >
            Logout
          </motion.button>
          <button className="sm:hidden text-yellow-400 text-3xl focus:outline-none" onClick={toggleMenu}>
            {isMenuOpen ? <BiX /> : <BiMenu />}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col sm:flex-row flex-1 max-w-7xl mx-auto mt-6 gap-6"
      >
        {/* Sidebar */}
        <motion.div
          variants={sidebarVariants}
          initial="visible"
          animate={isLargeScreen || isMenuOpen ? 'visible' : 'hidden'}
          className={`fixed inset-y-0 left-0 w-64 bg-gray-800/80 backdrop-blur-xl p-6 rounded-r-2xl shadow-2xl sm:static sm:flex sm:flex-col sm:w-1/4 sm:min-w-[220px] transition-transform duration-300 sm:transition-none border-r border-gray-700/50 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'}`}
        >
          <div className="flex flex-col gap-2">
            {sections.map((section) => (
              <motion.button
                key={section.id}
                onClick={() => {
                  setActiveTab(section.id);
                  setIsMenuOpen(false);
                }}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(234, 179, 8, 0.2)' }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-3 p-3 rounded-xl text-gray-200 font-semibold transition-all duration-300 ${
                  activeTab === section.id ? 'bg-yellow-400 text-gray-900 shadow-md' : 'hover:bg-gray-700/50'
                }`}
              >
                {section.icon}
                <span className="text-base">{section.title}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Content Area */}
        <motion.div
          className="flex-1 p-6 bg-gray-800/30 rounded-2xl sm:ml-6 shadow-xl border border-gray-700/50"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, x: -20, transition: { duration: 0.3 } }}
            >
              {sections.find((section) => section.id === activeTab)?.content}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;