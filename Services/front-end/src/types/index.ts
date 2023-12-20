// Define the type for a listing, this should match the structure of your data
export type Listing = {
  id?: number;
  title?: string;
  description?: string;
  tags?: string[];
  imageUrl: string;
  // add other listing properties here
};