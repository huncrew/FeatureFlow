import React, { useState } from 'react';
import { Disclosure } from '@headlessui/react';
import AceEditor from 'react-ace';

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";

import { useProjectContext } from '../../hooks/projectContext';

const projects = ['Tokenise', 'FeatureFlowBackend', 'FeatureFlowFrontend']; // Replace with real project names

const MVPDashboard = () => {  

  interface Step {
    id: string;
    title: string;
    objective: string;
    exampleCode: string;
    generatedCode: string;
  }

  const [selectedProject, setSelectedProject] = useState(projects[0]);

    const {
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
  } = useProjectContext('user-123', selectedProject); // Pass the user ID and selected project

  const refreshToken = () => {
    const newToken = crypto.randomUUID(); // Generate a new token. Replace with your token generation logic if necessary.
    localStorage.setItem('token', newToken); // Store the new token in local storage.
    console.log('Token refreshed:', newToken);
  };

  const handleAddStep = () => {
    const newStep: Step = {
      id: crypto.randomUUID(),
      title: '',
      objective: '',
      exampleCode: '',
      generatedCode: '',
    };
    setSteps([...steps, newStep]);
  };

  const handleUploadExample = (stepId: string, fileContent: string) => {
    // handle file content, assuming it's already read and passed as a string
    setSteps(
      steps.map(step =>
        step.id === stepId ? { ...step, exampleCode: fileContent } : step
      )
    );
  };

  // This function updates the fields for title and objective of a step
const updateStepField = (stepId: string, field: keyof Step, value: string) => {
  setSteps(steps.map(step => {
    if (step.id === stepId) {
      return { ...step, [field]: value };
    }
    return step;
  }));
};

// This function handles the file upload for the example code of a step
const handleExampleCodeFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, stepId: string) => {
  if (event.target.files) {
    const file = event.target.files[0];
    if (file) {
      const fileContent = await readFileAsString(file);
      setSteps(steps.map(step => {
        if (step.id === stepId) {
          return { ...step, exampleCode: fileContent };
        }
        return step;
      }));
    }
  }
};

// Helper function to read file as a string
const readFileAsString = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

  const generateCodeForStep = (step: any) => {
    // Placeholder function to be replaced with code generation logic
  };

  const handleProjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProject(event.target.value);
  };

  // Dummy function for handling codebase upload
  const handleCodebaseUpload = () => {
    // Logic to handle file upload will go here
  };

  // Utility function to make POST request
  const postData = async (url = '', data = {}) => {
    const response = await fetch(url, {
      method: 'POST', 
      mode: 'cors', 
      cache: 'no-cache', 
      credentials: 'same-origin', 
      headers: {
        'Content-Type': 'application/json'
        // 'Authorization': 'Bearer ' + yourAuthToken, // If you need authorization
      },
      redirect: 'follow', 
      referrerPolicy: 'no-referrer', 
      body: JSON.stringify(data)
    });
    return response.json(); // parses JSON response into native JavaScript objects
  };

  const sendContextToBackend = async () => {
    const contextObject = {
      user: 'user-123', // Replace with the actual user ID
      projectTitle: selectedProject,
      projectContext: projectContext,
      techContext: techOverview,
      featureContext: featureObjective,
      steps: steps.map(({ id, title, objective, exampleCode }) => ({
        title,
        objective,
        exampleCode,
      })), // we exclude 'generatedCode' and 'id' as they might not be needed in the context object
    }

    try {
      const result = await postData(`${process.env.REACT_APP_API_URL}/context`, contextObject);
      console.log('Context sent to backend', result);
    } catch (error) {
      console.error('Failed to send context to backend', error);
    }
  };

  return (
    <div className="bg-gray-900 text-white p-4">
      <h1 className="text-3xl mb-8 text-green-400 text-center">FeatureFlow v2 Dashboard</h1>
      <select
        onChange={handleProjectChange}
        value={selectedProject}
        className="bg-gray-800 text-white border border-green-500 rounded p-2 mb-4"
        >
        {projects.map((project) => (
          <option key={project} value={project}>
            {project}
          </option>
        ))}
      </select>
      <button
        onClick={sendContextToBackend}
        className="mt-3 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Save Context
      </button>
      <div className="flex flex-wrap -mx-2 mb-4">
        <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
          <h2 className="text-xl mb-2 text-green-400">Project Context</h2>
          <textarea
            value={projectContext}
            onChange={(e) => setProjectContext(e.target.value)}
            className="w-full p-3 bg-gray-800 border border-green-500 rounded"
            rows={4}
          />
        </div>

        <div className="w-full md:w-1/2 px-2">
          <h2 className="text-xl mb-2 text-green-400">Tech Overview</h2>
          <textarea
            value={techOverview}
            onChange={(e) => setTechOverview(e.target.value)}
            className="w-full p-3 bg-gray-800 border border-green-500 rounded"
            rows={4}
          />
          <button 
            onClick={refreshToken} 
            className="mt-3 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            New Feature
          </button>
          
          <button 
            onClick={handleCodebaseUpload} 
            className="mt-3 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Upload Codebase
          </button>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-xl mb-2 text-green-400">Feature Objective (e.g., JIRA Ticket)</h2>
        <input
          type="text"
          value={featureObjective}
          onChange={(e) => setFeatureObjective(e.target.value)}
          className="w-full p-3 bg-gray-800 border border-green-500 rounded"
        />
      </div>
      <div className="md:col-span-1">
        <h3 className="text-xl text-green-400 mb-2">Event</h3>
        <textarea
          className="w-full p-3 bg-gray-800 border border-green-500 rounded"
          rows={6}
          placeholder="Enter the event details here"
          // assuming you have a state variable to hold event details
          value={eventDetails}
          onChange={(e) => setEventDetails(e.target.value)}
        />
      </div>
      <div>
    {steps.map((step, index) => (
      <Disclosure key={step.id} as="div" className="mb-4">
        {({ open }) => (
          <>
            <Disclosure.Button className="flex justify-between items-center text-sm font-medium text-left bg-purple-200 rounded-lg hover:bg-purple-300 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75 p-4 mb-2">
              <span>{`Step ${index + 1}: ${step.title || 'New Step'}`}</span>
              <span>{open ? '−' : '+'}</span>
            </Disclosure.Button>
            {open && (
              <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500 bg-gray-700 rounded">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Step Title"
                      value={step.title}
                      onChange={e => updateStepField(step.id, 'title', e.target.value)}
                      className="w-full p-2 mb-2 bg-gray-800 border border-green-500 rounded"
                    />
                    <textarea
                      placeholder="Objective"
                      value={step.objective}
                      onChange={e => updateStepField(step.id, 'objective', e.target.value)}
                      className="w-full p-2 mb-2 bg-gray-800 border border-green-500 rounded"
                      rows={4}
                    />
                    <input
                      type="file"
                      onChange={e => handleExampleCodeFileUpload(e, step.id)}
                      className="w-full p-2 bg-gray-800 border border-green-500 rounded cursor-pointer"
                    />
                    <button
                      onClick={() => generateCodeForStep(step.id)}
                      className="mt-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
                    >
                      Generate Code
                    </button>
                  </div>
                  <div className="space-y-2">
                    <AceEditor
                      placeholder="Type your code here..."
                      mode="javascript"
                      theme="monokai"
                      name={`exampleCodeEditor_${index}`}
                      fontSize={14}
                      showPrintMargin={true}
                      showGutter={true}
                      highlightActiveLine={true}
                      value={step.exampleCode}
                      onChange={newCode => updateStepField(step.id, 'exampleCode', newCode)}
                      setOptions={{
                        useWorker: false,
                        enableBasicAutocompletion: false,
                        enableLiveAutocompletion: false,
                        enableSnippets: false,
                        showLineNumbers: true,
                        tabSize: 2,
                      }}
                      style={{ width: '100%', height: '200px' }}
                    />
                    <AceEditor
                      placeholder="Generated code will appear here..."
                      mode="javascript"
                      theme="monokai"
                      name={`generatedCodeEditor_${index}`}
                      readOnly={true}
                      value={step.generatedCode}
                      fontSize={14}
                      showPrintMargin={true}
                      showGutter={true}
                      highlightActiveLine={true}
                      setOptions={{
                        useWorker: false,
                      }}
                      style={{ width: '100%', height: '200px' }}
                    />
                  </div>
                </div>
              </Disclosure.Panel>
            )}
          </>
        )}
      </Disclosure>
    ))}
    <button onClick={handleAddStep} className="button-retro mt-4">
      + Add Step
    </button>
  </div>
      {/* ... */}
    </div>
  );
};

export default MVPDashboard;
