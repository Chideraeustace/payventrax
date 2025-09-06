import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCreditCard, FaMobileAlt, FaMoneyCheckAlt, FaArrowLeft, FaEdit, FaTrash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth, db } from '../Firebase';
import { doc, setDoc, collection, query, where, getDocs, getDoc, deleteDoc } from 'firebase/firestore';

// LoadingSpinner component
const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <motion.div
        className="w-16 h-16 border-4 border-t-yellow-400 border-gray-700 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        aria-label="Loading"
      />
    </div>
  );
};

// Confirmation Modal component
const ConfirmationModal = ({ isOpen, onConfirm, onCancel, message }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700/50 max-w-sm w-full"
          >
            <p className="text-gray-200 mb-4">{message}</p>
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onConfirm}
                className="flex-1 py-2 px-4 bg-red-600 text-white rounded-xl"
              >
                Confirm
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onCancel}
                className="flex-1 py-2 px-4 bg-gray-600 text-white rounded-xl"
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const PaymentSetup = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [userData, setUserData] = useState({
    firstName: 'User',
    lastName: '',
    email: user?.email || '',
  });
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
  const [paymentMethod, setPaymentMethod] = useState(''); // 'mobile' or 'bank'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isLoadingPayments, setIsLoadingPayments] = useState(true);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [editingPaymentId, setEditingPaymentId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePaymentId, setDeletePaymentId] = useState(null);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!user) {
          throw new Error('No authenticated user found');
        }
        const userDoc = await getDoc(doc(db, 'payventraxusers', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          toast.warn('User data not found, using default values.', { theme: 'dark' });
        }
      } catch (err) {
        console.error('Error fetching user data:', err.message);
        toast.error(`Failed to load user data: ${err.message}. Using default values.`, { theme: 'dark' });
      } finally {
        setIsLoadingUser(false);
      }
    };
    if (user) {
      fetchUserData();
    } else {
      toast.error('No authenticated user. Please log in.', { theme: 'dark' });
      setIsLoadingUser(false);
    }
  }, [user]);

  // Fetch saved payment methods
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        if (!user) {
          throw new Error('No authenticated user found');
        }
        const q = query(collection(db, 'paymentMethods'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const payments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPaymentMethods(payments);
      } catch (err) {
        console.error('Error fetching payment methods:', err.message);
        toast.error(`Failed to load payment methods: ${err.message}.`, { theme: 'dark' });
      } finally {
        setIsLoadingPayments(false);
      }
    };
    if (user) {
      fetchPayments();
    } else {
      toast.error('No authenticated user. Please log in.', { theme: 'dark' });
      setIsLoadingPayments(false);
    }
  }, [user]);

  const onSubmit = async (data) => {
    if (!user) {
      toast.error('No authenticated user. Please log in.', { theme: 'dark' });
      return;
    }
    if (!editingPaymentId && paymentMethods.length > 0) {
      toast.error('You can only add one payment method.', { theme: 'dark' });
      return;
    }
    setIsSubmitting(true);
    try {
      const paymentDocId = editingPaymentId || Date.now().toString();
      await setDoc(doc(db, 'paymentMethods', paymentDocId), {
        userId: user.uid,
        paymentMethod,
        ...data,
        createdAt: editingPaymentId ? paymentMethods.find(p => p.id === editingPaymentId).createdAt : new Date(),
      });
      reset();
      setPaymentMethod('');
      setEditingPaymentId(null);
      toast.success(editingPaymentId ? 'Payment method updated successfully!' : 'Payment method added successfully!', { theme: 'dark' });
      // Refresh payment methods list
      const q = query(collection(db, 'paymentMethods'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      setPaymentMethods(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error('Error saving payment method:', err.message);
      toast.error(`Failed to save payment method: ${err.message}.`, { theme: 'dark' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (method) => {
    setPaymentMethod(method.paymentMethod);
    setEditingPaymentId(method.id);
    if (method.paymentMethod === 'mobile') {
      setValue('mobileProvider', method.mobileProvider);
      setValue('mobileNumber', method.mobileNumber);
      setValue('mobileAccountHolder', method.mobileAccountHolder);
    } else {
      setValue('bankName', method.bankName);
      setValue('accountHolder', method.accountHolder);
      setValue('accountNumber', method.accountNumber);
      setValue('routingNumber', method.routingNumber);
    }
  };

  const handleDelete = async () => {
    if (!user) {
      toast.error('No authenticated user. Please log in.', { theme: 'dark' });
      return;
    }
    setIsSubmitting(true);
    try {
      // Verify document exists before deletion
      const paymentDoc = await getDoc(doc(db, 'paymentMethods', deletePaymentId));
      if (!paymentDoc.exists()) {
        throw new Error('Payment method not found');
      }
      await deleteDoc(doc(db, 'paymentMethods', deletePaymentId));
      setPaymentMethods(paymentMethods.filter(method => method.id !== deletePaymentId));
      toast.success('Payment method deleted successfully!', { theme: 'dark' });
    } catch (err) {
      console.error('Error deleting payment method:', err.message);
      toast.error(`Failed to delete payment method: ${err.message}.`, { theme: 'dark' });
    } finally {
      setShowDeleteModal(false);
      setDeletePaymentId(null);
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  if (isSubmitting || isLoadingPayments || isLoadingUser) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-black overflow-hidden px-4 sm:px-6 lg:px-8">
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-yellow-500/20 rounded-full mix-blend-overlay blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500/20 rounded-full mix-blend-overlay blur-3xl opacity-30 animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex justify-between items-center p-4 sm:p-6 bg-gray-800/80 backdrop-blur-xl rounded-b-2xl shadow-2xl border-b border-gray-700/50">
        <div className="flex items-center gap-3">
          <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
            <FaMoneyCheckAlt className="text-3xl text-yellow-400" />
          </motion.div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
              Payment Setup, {userData.firstName} {userData.lastName}!
            </h2>
            <p className="text-gray-400 text-sm">{userData.email}</p>
          </div>
        </div>
        <motion.button
          onClick={() => navigate('/dashboard')}
          whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(234, 179, 8, 0.5)' }}
          whileTap={{ scale: 0.95 }}
          className="p-2 bg-yellow-400 text-gray-900 rounded-full shadow-lg transition-all duration-300"
          aria-label="Back to Dashboard"
        >
          <FaArrowLeft className="text-xl" />
        </motion.button>
      </div>

      {/* Main Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col max-w-3xl mx-auto mt-6"
      >
        {/* Saved Payment Methods */}
        <motion.div
          variants={contentVariants}
          className="p-6 rounded-2xl bg-gray-800/30 shadow-xl border border-gray-700/50 mb-6"
        >
          <h3 className="text-2xl font-bold text-yellow-400 mb-4">Saved Payment Methods</h3>
          {paymentMethods.length === 0 ? (
            <p className="text-gray-200">No payment methods saved yet.</p>
          ) : (
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <motion.div
                  key={method.id}
                  className="p-4 rounded-xl bg-gray-700/50 border border-gray-600/50 flex justify-between items-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-3">
                    {method.paymentMethod === 'mobile' ? (
                      <FaMobileAlt className="text-yellow-400" />
                    ) : (
                      <FaCreditCard className="text-yellow-400" />
                    )}
                    <div>
                      <p className="text-gray-200 font-semibold">
                        {method.paymentMethod === 'mobile'
                          ? `${method.mobileProvider.toUpperCase()} - ${method.mobileNumber} (${method.mobileAccountHolder})`
                          : `${method.bankName} - ${method.accountNumber.slice(-4)}`}
                      </p>
                      <p className="text-gray-400 text-sm">
                        Added on {new Date(method.createdAt.seconds * 1000).toLocaleString('en-GB', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          timeZone: 'UTC',
                          timeZoneName: 'short',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEdit(method)}
                      className="p-2 bg-yellow-400 text-gray-900 rounded-full"
                      aria-label="Edit Payment Method"
                    >
                      <FaEdit />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setDeletePaymentId(method.id);
                        setShowDeleteModal(true);
                      }}
                      className="p-2 bg-red-600 text-white rounded-full"
                      aria-label="Delete Payment Method"
                    >
                      <FaTrash />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Add/Edit Payment Method */}
        {paymentMethods.length === 0 || editingPaymentId ? (
          <motion.div
            variants={contentVariants}
            className="p-6 rounded-2xl bg-gray-800/30 shadow-xl border border-gray-700/50"
          >
            <h3 className="text-2xl font-bold text-yellow-400 mb-6">
              {editingPaymentId ? 'Edit Payment Method' : 'Add Payment Method'}
            </h3>
            {paymentMethods.length > 0 && !editingPaymentId ? (
              <p className="text-gray-200">You can only have one payment method. Edit or delete the existing one to add a new one.</p>
            ) : (
              <>
                <div className="mb-6">
                  <label className="block text-gray-200 font-semibold mb-2">Select Payment Method</label>
                  <div className="flex gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex-1 py-3 px-4 rounded-xl text-gray-200 font-semibold transition-all duration-300 ${
                        paymentMethod === 'mobile' ? 'bg-yellow-400 text-gray-900' : 'bg-gray-700/50'
                      }`}
                      onClick={() => {
                        setPaymentMethod('mobile');
                        if (!editingPaymentId) reset();
                      }}
                      disabled={isSubmitting || !user}
                    >
                      <FaMobileAlt className="inline mr-2" /> Mobile Money
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex-1 py-3 px-4 rounded-xl text-gray-200 font-semibold transition-all duration-300 ${
                        paymentMethod === 'bank' ? 'bg-yellow-400 text-gray-900' : 'bg-gray-700/50'
                      }`}
                      onClick={() => {
                        setPaymentMethod('bank');
                        if (!editingPaymentId) reset();
                      }}
                      disabled={isSubmitting || !user}
                    >
                      <FaCreditCard className="inline mr-2" /> Bank Account
                    </motion.button>
                  </div>
                  {errors.paymentMethod && (
                    <p className="text-red-400 text-sm mt-2">{errors.paymentMethod.message}</p>
                  )}
                </div>

                <AnimatePresence mode="wait">
                  {paymentMethod === 'mobile' && (
                    <motion.div
                      key="mobile"
                      variants={contentVariants}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-gray-200 font-semibold mb-2">Mobile Provider</label>
                        <select
                          {...register('mobileProvider', { required: 'Please select a mobile provider' })}
                          className="w-full p-3 bg-gray-700/50 text-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        >
                          <option value="">Select Provider</option>
                          <option value="mtn">MTN</option>
                          <option value="airtel">Airtel</option>
                          <option value="vodafone">Vodafone</option>
                        </select>
                        {errors.mobileProvider && (
                          <p className="text-red-400 text-sm mt-2">{errors.mobileProvider.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-gray-200 font-semibold mb-2">Name on Mobile Money Account</label>
                        <input
                          type="text"
                          {...register('mobileAccountHolder', {
                            required: 'Please enter the name on the mobile money account',
                            pattern: {
                              value: /^[A-Za-z\s]+$/,
                              message: 'Please enter a valid name (letters and spaces only)',
                            },
                          })}
                          placeholder="e.g., Amoako Benedicta"
                          className="w-full p-3 bg-gray-700/50 text-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                        {errors.mobileAccountHolder && (
                          <p className="text-red-400 text-sm mt-2">{errors.mobileAccountHolder.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-gray-200 font-semibold mb-2">Mobile Number</label>
                        <input
                          type="text"
                          {...register('mobileNumber', {
                            required: 'Please enter a mobile number',
                            pattern: {
                              value: /^0\d{9}$/,
                              message: 'Please enter a valid 10-digit mobile number starting with 0',
                            },
                          })}
                          placeholder="0551000005"
                          className="w-full p-3 bg-gray-700/50 text-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                        {errors.mobileNumber && (
                          <p className="text-red-400 text-sm mt-2">{errors.mobileNumber.message}</p>
                        )}
                      </div>
                    </motion.div>
                  )}
                  {paymentMethod === 'bank' && (
                    <motion.div
                      key="bank"
                      variants={contentVariants}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-gray-200 font-semibold mb-2">Bank Name</label>
                        <input
                          type="text"
                          {...register('bankName', { required: 'Please enter the bank name' })}
                          placeholder="e.g., GCB Bank"
                          className="w-full p-3 bg-gray-700/50 text-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                        {errors.bankName && (
                          <p className="text-red-400 text-sm mt-2">{errors.bankName.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-gray-200 font-semibold mb-2">Account Holder</label>
                        <input
                          type="text"
                          {...register('accountHolder', { required: 'Please enter the account holder name' })}
                          placeholder="Full Name"
                          className="w-full p-3 bg-gray-700/50 text-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                        {errors.accountHolder && (
                          <p className="text-red-400 text-sm mt-2">{errors.accountHolder.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-gray-200 font-semibold mb-2">Account Number</label>
                        <input
                          type="text"
                          {...register('accountNumber', {
                            required: 'Please enter an account number',
                            pattern: {
                              value: /^\d{8,20}$/,
                              message: 'Please enter a valid account number (8-20 digits)',
                            },
                          })}
                          placeholder="Account Number"
                          className="w-full p-3 bg-gray-700/50 text-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                        {errors.accountNumber && (
                          <p className="text-red-400 text-sm mt-2">{errors.accountNumber.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-gray-200 font-semibold mb-2">Routing Number</label>
                        <input
                          type="text"
                          {...register('routingNumber', {
                            required: 'Please enter a routing number',
                            pattern: {
                              value: /^\d{9}$/,
                              message: 'Please enter a valid 9-digit routing number',
                            },
                          })}
                          placeholder="9-digit Routing Number"
                          className="w-full p-3 bg-gray-700/50 text-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                        {errors.routingNumber && (
                          <p className="text-red-400 text-sm mt-2">{errors.routingNumber.message}</p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {paymentMethod && (
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(234, 179, 8, 0.5)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSubmitting || !user}
                    className={`mt-6 py-2.5 px-6 bg-yellow-400 text-gray-900 font-semibold rounded-full shadow-lg transition-all duration-300 ${
                      isSubmitting || !user ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? 'Saving...' : editingPaymentId ? 'Update Payment Method' : 'Save Payment Method'}
                  </motion.button>
                )}
              </>
            )}
          </motion.div>
        ) : (
          <motion.div
            variants={contentVariants}
            className="p-6 rounded-2xl bg-gray-800/30 shadow-xl border border-gray-700/50"
          >
            <p className="text-gray-200">You can only have one payment method. Please edit or delete the existing one to add a new one.</p>
          </motion.div>
        )}
      </motion.div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        message="Are you sure you want to delete this payment method?"
      />
    </div>
  );
};

export default PaymentSetup;