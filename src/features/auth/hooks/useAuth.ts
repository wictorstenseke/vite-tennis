import { useState, useEffect } from 'react'
import type { User } from 'firebase/auth'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase-config'
import { login as loginService, logout as logoutService, signUp as signUpService, resetPassword as resetPasswordService } from '../services/authService'

export interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthState({
        user,
        loading: false,
        error: null
      })
    })

    return unsubscribe
  }, [])

  const login = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))
    try {
      const user = await loginService(email, password)
      setAuthState({ user, loading: false, error: null })
      return user
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed'
      setAuthState(prev => ({ ...prev, loading: false, error: errorMessage }))
      throw error
    }
  }

  const signUp = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))
    try {
      const user = await signUpService(email, password)
      setAuthState({ user, loading: false, error: null })
      return user
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign up failed'
      setAuthState(prev => ({ ...prev, loading: false, error: errorMessage }))
      throw error
    }
  }

  const logout = async () => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))
    try {
      await logoutService()
      setAuthState({ user: null, loading: false, error: null })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Logout failed'
      setAuthState(prev => ({ ...prev, loading: false, error: errorMessage }))
      throw error
    }
  }

  const resetPassword = async (email: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))
    try {
      await resetPasswordService(email)
      setAuthState(prev => ({ ...prev, loading: false }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password reset failed'
      setAuthState(prev => ({ ...prev, loading: false, error: errorMessage }))
      throw error
    }
  }

  return {
    ...authState,
    login,
    signUp,
    logout,
    resetPassword
  }
}
