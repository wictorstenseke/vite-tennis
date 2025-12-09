import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock Firebase config BEFORE importing authService
vi.mock('../firebase-config', () => ({
  auth: {
    currentUser: null,
    app: { name: '[DEFAULT]' },
  },
}))

// Import after mocking
const { login, signUp, logout, resetPassword } = await import('./authService')
const firebaseAuth = await import('firebase/auth')

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('login', () => {
    it('should successfully log in with valid credentials', async () => {
      const mockUser = { uid: '123', email: 'test@example.com' }
      vi.mocked(firebaseAuth.signInWithEmailAndPassword).mockResolvedValue({
        user: mockUser,
      } as any)

      const result = await login('test@example.com', 'password123')

      expect(firebaseAuth.signInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        'test@example.com',
        'password123'
      )
      expect(result).toEqual(mockUser)
    })

    it('should throw error with invalid credentials', async () => {
      const mockError = new Error('Invalid credentials')
      vi.mocked(firebaseAuth.signInWithEmailAndPassword).mockRejectedValue(mockError)

      await expect(login('test@example.com', 'wrongpassword')).rejects.toThrow()
      expect(firebaseAuth.signInWithEmailAndPassword).toHaveBeenCalled()
    })

    it('should handle network errors', async () => {
      const networkError = new Error('Network error')
      vi.mocked(firebaseAuth.signInWithEmailAndPassword).mockRejectedValue(networkError)

      await expect(login('test@example.com', 'password123')).rejects.toThrow('Network error')
    })
  })

  describe('signUp', () => {
    it('should successfully create a new user', async () => {
      const mockUser = { uid: '456', email: 'newuser@example.com' }
      vi.mocked(firebaseAuth.createUserWithEmailAndPassword).mockResolvedValue({
        user: mockUser,
      } as any)

      const result = await signUp('newuser@example.com', 'password123')

      expect(firebaseAuth.createUserWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        'newuser@example.com',
        'password123'
      )
      expect(result).toEqual(mockUser)
    })

    it('should throw error if email is already in use', async () => {
      const mockError = new Error('Email already in use')
      vi.mocked(firebaseAuth.createUserWithEmailAndPassword).mockRejectedValue(mockError)

      await expect(signUp('existing@example.com', 'password123')).rejects.toThrow()
    })

    it('should throw error if password is too weak', async () => {
      const mockError = new Error('Password is too weak')
      vi.mocked(firebaseAuth.createUserWithEmailAndPassword).mockRejectedValue(mockError)

      await expect(signUp('test@example.com', '123')).rejects.toThrow('Password is too weak')
    })
  })

  describe('logout', () => {
    it('should successfully log out user', async () => {
      vi.mocked(firebaseAuth.signOut).mockResolvedValue()

      await logout()

      expect(firebaseAuth.signOut).toHaveBeenCalledWith(expect.anything())
    })

    it('should handle logout errors', async () => {
      const mockError = new Error('Logout failed')
      vi.mocked(firebaseAuth.signOut).mockRejectedValue(mockError)

      await expect(logout()).rejects.toThrow('Logout failed')
    })
  })

  describe('resetPassword', () => {
    it('should send password reset email', async () => {
      vi.mocked(firebaseAuth.sendPasswordResetEmail).mockResolvedValue()

      await resetPassword('test@example.com')

      expect(firebaseAuth.sendPasswordResetEmail).toHaveBeenCalledWith(
        expect.anything(),
        'test@example.com'
      )
    })

    it('should throw error if email is invalid', async () => {
      const mockError = new Error('Invalid email')
      vi.mocked(firebaseAuth.sendPasswordResetEmail).mockRejectedValue(mockError)

      await expect(resetPassword('invalid-email')).rejects.toThrow('Invalid email')
    })

    it('should throw error if user not found', async () => {
      const mockError = new Error('User not found')
      vi.mocked(firebaseAuth.sendPasswordResetEmail).mockRejectedValue(mockError)

      await expect(resetPassword('nonexistent@example.com')).rejects.toThrow('User not found')
    })
  })
})
