import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type AuthState = {
  token: string | null;
  isAuthenticated: boolean;
  user?: any; // Define a user type here as appropriate
  loading: boolean, // Set loading to true initially
};

// Initialize with undefined, which will be set in the component
const AuthContext = createContext<{
  authState: AuthState;
  signIn: (token: string) => void;
  signOut: () => void;
} | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    token: null,
    loading: true, // Set loading to true initially
  });

    // When the provider is first mounted, it checks if a token exists in local storage
    useEffect(() => {
      const token = localStorage.getItem('authToken');
      if (token) {
        setAuthState({
          isAuthenticated: true,
          token: token,
          loading: false,
        });
      }
    }, []);

    const signIn = (token: string) => {
      localStorage.setItem('authToken', token);
      setAuthState((prevState) => ({
        ...prevState,
        isAuthenticated: true,
        token: token,
      }));
    };
    

  const signOut = () => {
    localStorage.removeItem('authToken');
    setAuthState({
      isAuthenticated: false,
      token: null,
      loading: false, // Set loading to true initially
    });
  };

  // Only render children once the loading is complete
  return (
    <AuthContext.Provider value={{ authState, signIn, signOut }}>
      {!authState.loading ? children : <div>Loading...</div>} 
    </AuthContext.Provider>
  );
};
