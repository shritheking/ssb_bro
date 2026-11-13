import React, { createContext, useContext, useState, useEffect } from 'react';
import { defaultStudentProfile, StudentProfile } from '../data/mockStudentData';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Concept Administrator' | 'Chief Mentor';
}

interface AuthContextType {
  // Student auth
  isStudentLoggedIn: boolean;
  studentUser: StudentProfile | null;
  studentLogin: (email?: string) => boolean;
  studentLogout: () => void;
  updateStudentProfile: (updates: Partial<StudentProfile>) => void;

  // Admin auth
  isAdminLoggedIn: boolean;
  adminUser: AdminUser | null;
  adminLogin: (email?: string, password?: string) => boolean;
  adminLogout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Student state
  const [isStudentLoggedIn, setIsStudentLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('ssb_student_logged_in') === 'true';
  });

  const [studentUser, setStudentUser] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('ssb_student_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultStudentProfile;
      }
    }
    return defaultStudentProfile;
  });

  // Admin state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('ssb_admin_logged_in') === 'true';
  });

  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('ssb_admin_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // Student methods
  const studentLogin = (email?: string) => {
    setIsStudentLoggedIn(true);
    localStorage.setItem('ssb_student_logged_in', 'true');
    if (email && email !== studentUser.email) {
      const updated = { ...studentUser, email };
      setStudentUser(updated);
      localStorage.setItem('ssb_student_profile', JSON.stringify(updated));
    }
    return true;
  };

  const studentLogout = () => {
    setIsStudentLoggedIn(false);
    localStorage.removeItem('ssb_student_logged_in');
  };

  const updateStudentProfile = (updates: Partial<StudentProfile>) => {
    setStudentUser((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem('ssb_student_profile', JSON.stringify(next));
      return next;
    });
  };

  // Admin methods
  const adminLogin = (email?: string, _password?: string) => {
    const user: AdminUser = {
      id: 'admin-vamshi-01',
      name: 'Lt. Vamshi E.',
      email: email || 'mentor@ssbbro.concept',
      role: 'Chief Mentor',
    };
    setIsAdminLoggedIn(true);
    setAdminUser(user);
    localStorage.setItem('ssb_admin_logged_in', 'true');
    localStorage.setItem('ssb_admin_user', JSON.stringify(user));
    return true;
  };

  const adminLogout = () => {
    setIsAdminLoggedIn(false);
    setAdminUser(null);
    localStorage.removeItem('ssb_admin_logged_in');
    localStorage.removeItem('ssb_admin_user');
  };

  return (
    <AuthContext.Provider
      value={{
        isStudentLoggedIn,
        studentUser,
        studentLogin,
        studentLogout,
        updateStudentProfile,
        isAdminLoggedIn,
        adminUser,
        adminLogin,
        adminLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
