// useListings.ts
import { useState, useEffect } from 'react';
import { Listing } from '../types'
import { dummyListings } from './dummyData';

const useListings = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate an API call with dummy data
    const fetchListings = async () => {
      // Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
      setListings(dummyListings);
      setLoading(false);
    };

    fetchListings();
  }, []);

  return { listings, loading };
};

export default useListings;
