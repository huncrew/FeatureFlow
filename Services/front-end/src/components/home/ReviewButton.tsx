// ReviewButton.tsx
import React from 'react';

type ReviewButtonProps = {
  onClick: () => void;
};

// ReviewButton.tsx
const ReviewButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    >
      Review Suggestions
    </button>
  );
};

export default ReviewButton;
