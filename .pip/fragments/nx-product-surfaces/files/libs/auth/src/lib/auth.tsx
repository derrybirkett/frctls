import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, AuthContextType } from './types';

/**
 * Auth Boundary - Provider-Swappable Authentication
 * 
 * This is a placeholder implementation. Replace with your auth provider:
 * - Supabase: https://supabase.com/docs/guides/auth
 * - Clerk: https://clerk.com/docs
 * - WorkOS: https://workos.com/docs/sso
 * 
 * SECURITY NOTES:
 * - Implement proper CSRF protection
 * - Use secure, httpOnly cookies for sessions
 * - Rate limit login/signup endpoints
 * - Add MFA support for production
 * - Never store passwords in frontend code
 */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    // TODO: Check for existing session on mount
    // Example for Supabase:
    // supabase.auth.getSession().then(({ data: { session } }) => {
    //   setState({
    //     user: session?.user ?? null,
    //     isLoading: false,
    //     isAuthenticated: !!session,
    //   });
    // });

    // Placeholder: simulate session check
    setTimeout(() => {
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }, 100);
  }, []);

  const login = async (email: string, password: string) => {
    // TODO: Implement login with your auth provider
    // Example for Supabase:
    // const { data, error } = await supabase.auth.signInWithPassword({
    //   email,
    //   password,
    // });
    // if (error) throw error;
    // setState({ user: data.user, isLoading: false, isAuthenticated: true });
    
    console.warn('Login not implemented. Replace with real auth provider.');
    throw new Error('Authentication not configured');
  };

  const signup = async (email: string, password: string, name?: string) => {
    // TODO: Implement signup with your auth provider
    // Example for Supabase:
    // const { data, error } = await supabase.auth.signUp({
    //   email,
    //   password,
    //   options: {
    //     data: { name },
    //   },
    // });
    // if (error) throw error;
    // setState({ user: data.user, isLoading: false, isAuthenticated: true });
    
    console.warn('Signup not implemented. Replace with real auth provider.');
    throw new Error('Authentication not configured');
  };

  const logout = async () => {
    // TODO: Implement logout with your auth provider
    // Example for Supabase:
    // await supabase.auth.signOut();
    // setState({ user: null, isLoading: false, isAuthenticated: false });
    
    console.warn('Logout not implemented. Replace with real auth provider.');
    throw new Error('Authentication not configured');
  };

  const value: AuthContextType = {
    ...state,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({ children, redirectTo = '/login' }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // TODO: Redirect to login page
    // Example: window.location.href = redirectTo;
    console.warn('User not authenticated. Implement redirect logic.');
    return <div>Not authenticated. Redirecting...</div>;
  }

  return <>{children}</>;
}
