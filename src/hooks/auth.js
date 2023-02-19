import { createContext, useState, useEffect } from 'react';
import { auth } from '../firebase/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);



  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

  }, []);

  const logout = async () => {
    try {
      signOut(auth);
      setUser(null);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        logout,
        loading,
        error,
        setError,
        setLoading,
        isCompleted,
        setIsCompleted,
        isEditing,
        setIsEditing,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

