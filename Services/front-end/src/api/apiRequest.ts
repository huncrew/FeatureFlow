import axios from 'axios';

// Send the project context to the backend
export const sendContextToBackend = async (projectContext: any) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/project-context`,
      projectContext,
    );
    return response.data;
  } catch (error) {
    // Handle errors here
    console.error('Error sending context to backend:', error);
  }
};

// ... other API functions
