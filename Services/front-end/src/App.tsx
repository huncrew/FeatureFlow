import React from 'react';
import SignUp from './components/auth/SignUp';
import SignIn from './components/auth/SignIn';

const App: React.FC = () => {
  return (
    // This container will use Flexbox to center the children horizontally and apply some spacing
    <div className="flex justify-center items-center h-screen space-x-8">
      <SignUp />
      <SignIn />
    </div>
  );
};

export default App;

