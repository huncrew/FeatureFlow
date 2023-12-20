// NavigationControls.tsx
import React from 'react';

type NavigationControlsProps = {
  onNavigate: (direction: 'prev' | 'next') => void; // Define the type for the onNavigate prop
};

const NavigationControls: React.FC<NavigationControlsProps> = ({ onNavigate }) => {
  return (
    <div className="navigation-controls">
      {/* ... */}
    </div>
  );
};

export default NavigationControls;
