import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Verify: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(
    location.state?.email || 'test@example.com',
  );
  const [confirmationCode, setConfirmationCode] = useState('');
  // Start with a default test email, you can change this manually for testing

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log(location.state?.email);
    e.preventDefault();

    try {
      const body = JSON.stringify({
        email: email,
        confirmationCode,
      });
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/verify-email`,
        body,
        config,
      );
      console.log(response.data);
      // Handle navigation after successful verification
      navigate('/signin'); // Redirect to a success page or sign-in page
    } catch (error) {
      console.error('Verification error:', error);
      // Handle error case
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={onSubmit} className="p-10 bg-white rounded-lg shadow-xl">
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email:
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="confirmationCode"
          >
            Confirmation Code:
          </label>
          <input
            id="confirmationCode"
            type="text"
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Verify
          </button>
        </div>
      </form>
    </div>
  );
};

export default Verify;
