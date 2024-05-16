// ListingCard.tsx
import React from 'react';
import { Listing } from '../../types';

type ListingCardProps = {
  listing: Listing; // This indicates the component expects a single prop named 'listing'
};

const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  return (
    <div className="inline-block">
      <img
        className="w-24 h-24 rounded shadow-lg object-cover object-center"
        src={listing.imageUrl}
        alt={listing.title}
      />
    </div>
  );
};

export default ListingCard;
