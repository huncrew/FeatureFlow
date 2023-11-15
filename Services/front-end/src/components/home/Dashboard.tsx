// Dashboard.tsx
import React from 'react';
import ListingCard from './ListingCard';
import ReviewButton from './ReviewButton';
import useListings from '../../hooks/useListings';
import ListingDetailModal from './ListingDetailModal';
import { useState } from 'react';
import { Listing } from '../../types';
// Import other necessary types and components



const Dashboard: React.FC = () => {
const { listings, loading } = useListings();
const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

const handleReviewButtonClick = () => {
  // Set the selectedListing to the first listing in the array
  setSelectedListing(listings[0]);
  setIsModalOpen(true); // Open the modal
};

const handleCloseModal = () => {
  setIsModalOpen(false); // Close the modal
};

const connectToEtsy = () => {
  // Logic to connect to Etsy
};


  // Optionally, handle the loading state
  if (loading) {
    return <div>Loading...</div>;
  }

return (
  <div>
    <div className="pt-8 text-2xl md:text-3xl text-center px-4">
      Welcome to ShopAI
    </div>
    <div className="flex justify-center mt-4 px-4">
    <button
      onClick={connectToEtsy}
      className="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded cursor-pointer focus:outline-none focus:shadow-outline w-full sm:w-auto"
      type="button"
    >
      Connect to Etsy
    </button>
  </div> 
  <div className="min-h-screen bg-white p-6">
  <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Listings Needing Attention</h2>
  
  {/* The container for the listings */}
  <div className="flex justify-center gap-4 mb-8">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  
  {/* Centered button below the listings */}
  <div className="flex justify-center">
    <ReviewButton onClick={handleReviewButtonClick} />
  </div>
</div>
{/* Conditionally render the ListingDetailModal based on isModalOpen state */}
  {isModalOpen && selectedListing && (
    <ListingDetailModal
      listing={selectedListing}
      onClose={handleCloseModal}
    />
  )}
    {/* ...more components related to the dashboard functionality... */}
  </div>
);
};

export default Dashboard;
