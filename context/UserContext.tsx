import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface Document {
  id: string;
  title: string;
  type: 'analysis' | 'affidavit' | 'template' | 'workflow';
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface UserContextType {
  user: User | null;
  documents: Document[];
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  saveDocument: (title: string, type: Document['type'], content: string) => void;
  deleteDocument: (id: string) => void;
  updateDocument: (id: string, title: string, content: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);

  // Load user data on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('sovereignUser');
    const savedDocuments = localStorage.getItem('sovereignDocuments');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    if (savedDocuments) {
      setDocuments(JSON.parse(savedDocuments));
    }
  }, []);

  // Save documents to localStorage whenever they change
  useEffect(() => {
    if (user) {
      localStorage.setItem('sovereignDocuments', JSON.stringify(documents));
    }
  }, [documents, user]);

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // Simulate registration process
      // In a real app, this would make an API call
      
      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem('sovereignUsers') || '[]');
      const userExists = existingUsers.some((u: any) => u.email === email);
      
      if (userExists) {
        return false;
      }

      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        createdAt: new Date().toISOString(),
      };

      // Store user credentials (in a real app, password would be hashed on backend)
      const userCredentials = { ...newUser, password };
      existingUsers.push(userCredentials);
      localStorage.setItem('sovereignUsers', JSON.stringify(existingUsers));

      // Set current user (without password)
      setUser(newUser);
      localStorage.setItem('sovereignUser', JSON.stringify(newUser));
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate login process
      // In a real app, this would make an API call
      
      const existingUsers = JSON.parse(localStorage.getItem('sovereignUsers') || '[]');
      const userCredentials = existingUsers.find((u: any) => u.email === email && u.password === password);
      
      if (!userCredentials) {
        return false;
      }

      // Set current user (without password)
      const { password: _, ...userWithoutPassword } = userCredentials;
      setUser(userWithoutPassword);
      localStorage.setItem('sovereignUser', JSON.stringify(userWithoutPassword));
      
      // Load user's documents
      const userDocuments = JSON.parse(localStorage.getItem(`documents_${userCredentials.id}`) || '[]');
      setDocuments(userDocuments);
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setDocuments([]);
    localStorage.removeItem('sovereignUser');
    localStorage.removeItem('sovereignDocuments');
  };

  const saveDocument = (title: string, type: Document['type'], content: string) => {
    if (!user) return;

    const newDocument: Document = {
      id: Date.now().toString(),
      title,
      type,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setDocuments(prev => [newDocument, ...prev]);
    
    // Also save to user-specific storage
    const userDocuments = [...documents, newDocument];
    localStorage.setItem(`documents_${user.id}`, JSON.stringify(userDocuments));
  };

  const deleteDocument = (id: string) => {
    if (!user) return;
    
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const updateDocument = (id: string, title: string, content: string) => {
    if (!user) return;
    
    setDocuments(prev => prev.map(doc => 
      doc.id === id 
        ? { ...doc, title, content, updatedAt: new Date().toISOString() }
        : doc
    ));
  };

  const value: UserContextType = {
    user,
    documents,
    login,
    register,
    logout,
    saveDocument,
    deleteDocument,
    updateDocument,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};