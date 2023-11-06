import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './components/auth/SignUp';
import SignIn from './components/auth/SignIn';
import VerifyAccount from './components/auth/Verify'; // Import your verification component
import PrivateRoute from './routes/ProtectedRoutes'; // Import your PrivateRoute component
import Home from './components/home/Home'; // Import your Home component that you want to protect
import { AuthProvider } from './context/AuthContext';

const App: React.FC = () => {
  return (
  <AuthProvider>
    <Router>
      <div className="flex justify-center items-center h-screen space-x-8">
        <Routes>
          {/* Public Routes */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/verify" element={<VerifyAccount />} />

          {/* Private Routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          {/* You can add more private routes inside PrivateRoute as needed */}
        </Routes>
      </div>
    </Router>
  </AuthProvider>
  );
};

export default App;
