// Gallery.tsx
import React from 'react';
import { Listing } from '../../types';

type GalleryProps = {
  listing: Listing; // Make sure 'listing' is defined here
};

const Gallery: React.FC<GalleryProps> = ({ listing }) => {

  return (
    <div className="gallery">
      {/* ... */}
    </div>
  );
};

export default Gallery;
