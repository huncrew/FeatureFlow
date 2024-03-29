import { useState, useEffect } from 'react';

export const useProjectContext = (userId: string, selectedProject: any) => {

  interface Step {
    id: string;
    title: string;
    objective: string;
    exampleCode: string;
    generatedCode: string;
  }

  const [projectContext, setProjectContext] = useState('');
  const [techOverview, setTechOverview] = useState('');
  const [featureObjective, setFeatureObjective] = useState('');
  const [eventDetails, setEventDetails] = useState('');
  const [steps, setSteps] = useState<Step[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedProject) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/context/${userId}/${selectedProject}`, {
          method: 'GET', 
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': 'Bearer ' + yourAuthToken, // If you need authorization
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setProjectContext(data.projectContext || '');
        setTechOverview(data.techOverview || '');
        setFeatureObjective(data.featureObjective || '');
        setEventDetails(data.eventDetails || '');
        setSteps(data.steps || []);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId, selectedProject]);

  return {
    projectContext,
    setProjectContext,
    techOverview,
    setTechOverview,
    featureObjective,
    setFeatureObjective,
    eventDetails,
    setEventDetails,
    steps,
    setSteps,
    isLoading,
    error,
  };
};

export default useProjectContext;
