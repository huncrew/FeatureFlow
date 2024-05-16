// ListingDetailModal.tsx
import React from 'react';
import { Listing } from '../../types'; // Adjust the import path as needed
// import EditSaveControls from './EditSaveControls';
// import NavigationControls from './NavigationControls';
import Gallery from './Gallery';

type ListingDetailModalProps = {
  listing: Listing;
  onClose: () => void; // Function to close the modal
  // onSave: () => void; // Function to save the listing after editing
  // onNavigate: (direction: 'prev' | 'next') => void; // Function to navigate listings
};

const ListingDetailModal: React.FC<ListingDetailModalProps> = ({
  listing,
  onClose,
}) => {
  // Placeholder for the suggested data (replicating the current data for now)
  const suggestedListing = { ...listing }; // In the future, this will be your AI suggested data

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-7xl w-full">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-bold">Listing Details</h2>
          <button onClick={onClose} className="text-sm">
            Close
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          {/* Current listing details */}
          <div className="w-full lg:w-1/2 p-4 space-y-4">
            <img
              className="w-20 h-20 object-cover rounded"
              src={listing.imageUrl}
              alt={listing.title}
            />
            <div className="border p-2 rounded">
              <p className="font-semibold">Title:</p>
              <p>{listing.title}</p>
            </div>
            <div className="border p-2 rounded">
              <p className="font-semibold">Description:</p>
              <p>{listing.description}</p>
            </div>
            <div className="border p-2 rounded">
              <p className="font-semibold">Tags:</p>
              <div className="flex flex-wrap gap-2">
                {listing.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-200 rounded px-2 py-1 text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* AI suggested improvements (Using the same layout for now) */}
          <div className="w-full lg:w-1/2 p-4 space-y-4">
            <img
              className="w-20 h-20 object-cover rounded"
              src={suggestedListing.imageUrl}
              alt={suggestedListing.title}
            />
            <div className="border p-2 rounded">
              <p className="font-semibold">Title:</p>
              <p>{suggestedListing.title}</p>
            </div>
            <div className="border p-2 rounded">
              <p className="font-semibold">Description:</p>
              <p>{suggestedListing.description}</p>
            </div>
            <div className="border p-2 rounded">
              <p className="font-semibold">Tags:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedListing.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-200 rounded px-2 py-1 text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Uncomment or implement your NavigationControls and EditSaveControls when ready */}
        {/* <NavigationControls onNavigate={onNavigate} /> */}
        {/* <EditSaveControls listing={listing} onSave={onSave} /> */}

        <Gallery listing={listing} />
      </div>
    </div>
  );
};

export default ListingDetailModal;
