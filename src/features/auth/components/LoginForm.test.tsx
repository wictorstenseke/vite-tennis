import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from './LoginForm'
import * as useAuthModule from '../hooks/useAuth'

// Mock the useAuth hook
vi.mock('../hooks/useAuth')

describe('LoginForm', () => {
  const mockLogin = vi.fn()
  const mockSignUp = vi.fn()
  const mockResetPassword = vi.fn()
  const mockOnSuccess = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      user: null,
      loading: false,
      error: null,
      login: mockLogin,
      signUp: mockSignUp,
      logout: vi.fn(),
      resetPassword: mockResetPassword,
    })
  })

  describe('Login Mode', () => {
    it('should render login form with email and password fields', () => {
      render(<LoginForm />)

      expect(screen.getByLabelText(/e-post/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/lösenord/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /logga in/i })).toBeInTheDocument()
    })

    it('should call login function when form is submitted', async () => {
      const user = userEvent.setup()
      mockLogin.mockResolvedValue({ uid: '123' })
      
      render(<LoginForm onSuccess={mockOnSuccess} />)

      await user.type(screen.getByLabelText(/e-post/i), 'test@example.com')
      await user.type(screen.getByLabelText(/lösenord/i), 'password123')
      await user.click(screen.getByRole('button', { name: /logga in/i }))

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123')
        expect(mockOnSuccess).toHaveBeenCalled()
      })
    })

    it('should display error message when login fails', async () => {
      const user = userEvent.setup()
      vi.mocked(useAuthModule.useAuth).mockReturnValue({
        user: null,
        loading: false,
        error: 'Invalid credentials',
        login: mockLogin,
        signUp: mockSignUp,
        logout: vi.fn(),
        resetPassword: mockResetPassword,
      })

      render(<LoginForm />)

      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
    })

    it('should disable submit button when loading', async () => {
      vi.mocked(useAuthModule.useAuth).mockReturnValue({
        user: null,
        loading: true,
        error: null,
        login: mockLogin,
        signUp: mockSignUp,
        logout: vi.fn(),
        resetPassword: mockResetPassword,
      })

      render(<LoginForm />)

      expect(screen.getByRole('button', { name: /laddar/i })).toBeDisabled()
    })

    it('should show "Glömt lösenordet?" link', () => {
      render(<LoginForm />)

      expect(screen.getByText(/glömt lösenordet/i)).toBeInTheDocument()
    })

    it('should switch to sign up mode when clicking "Skapa konto"', async () => {
      const user = userEvent.setup()
      render(<LoginForm />)

      await user.click(screen.getByText(/skapa konto/i))

      expect(screen.getByRole('button', { name: /skapa konto/i })).toBeInTheDocument()
    })
  })

  describe('Sign Up Mode', () => {
    it('should call signUp function when creating account', async () => {
      const user = userEvent.setup()
      mockSignUp.mockResolvedValue({ uid: '456' })

      render(<LoginForm onSuccess={mockOnSuccess} />)

      // Switch to sign up mode
      await user.click(screen.getByText(/skapa konto/i))

      await user.type(screen.getByLabelText(/e-post/i), 'newuser@example.com')
      await user.type(screen.getByLabelText(/lösenord/i), 'password123')
      await user.click(screen.getByRole('button', { name: /skapa konto/i }))

      await waitFor(() => {
        expect(mockSignUp).toHaveBeenCalledWith('newuser@example.com', 'password123')
        expect(mockOnSuccess).toHaveBeenCalled()
      })
    })

    it('should validate password length (minimum 6 characters)', () => {
      render(<LoginForm />)

      const passwordInput = screen.getByLabelText(/lösenord/i)
      expect(passwordInput).toHaveAttribute('minLength', '6')
    })

    it('should show "Logga in" link in sign up mode', async () => {
      const user = userEvent.setup()
      render(<LoginForm />)

      await user.click(screen.getByText(/skapa konto/i))

      expect(screen.getByText(/logga in/i)).toBeInTheDocument()
    })
  })

  describe('Forgot Password Mode', () => {
    it('should show forgot password form when clicking link', async () => {
      const user = userEvent.setup()
      render(<LoginForm />)

      await user.click(screen.getByText(/glömt lösenordet/i))

      expect(screen.getByRole('button', { name: /skicka återställningslänk/i })).toBeInTheDocument()
      expect(screen.queryByLabelText(/lösenord/i)).not.toBeInTheDocument()
    })

    it('should call resetPassword function when submitting email', async () => {
      const user = userEvent.setup()
      mockResetPassword.mockResolvedValue(undefined)

      render(<LoginForm />)

      await user.click(screen.getByText(/glömt lösenordet/i))
      await user.type(screen.getByLabelText(/e-post/i), 'test@example.com')
      await user.click(screen.getByRole('button', { name: /skicka återställningslänk/i }))

      await waitFor(() => {
        expect(mockResetPassword).toHaveBeenCalledWith('test@example.com')
      })
    })

    it('should show success message after sending reset email', async () => {
      const user = userEvent.setup()
      mockResetPassword.mockResolvedValue(undefined)

      render(<LoginForm />)

      await user.click(screen.getByText(/glömt lösenordet/i))
      await user.type(screen.getByLabelText(/e-post/i), 'test@example.com')
      await user.click(screen.getByRole('button', { name: /skicka återställningslänk/i }))

      await waitFor(() => {
        expect(screen.getByText(/återställningslänk skickad/i)).toBeInTheDocument()
      })
    })

    it('should return to login mode from forgot password', async () => {
      const user = userEvent.setup()
      render(<LoginForm />)

      await user.click(screen.getByText(/glömt lösenordet/i))
      await user.click(screen.getByText(/tillbaka till inloggning/i))

      expect(screen.getByRole('button', { name: /logga in/i })).toBeInTheDocument()
    })
  })

  describe('Form Validation', () => {
    it('should require email field', () => {
      render(<LoginForm />)

      const emailInput = screen.getByLabelText(/e-post/i)
      expect(emailInput).toBeRequired()
      expect(emailInput).toHaveAttribute('type', 'email')
    })

    it('should require password field in login mode', () => {
      render(<LoginForm />)

      const passwordInput = screen.getByLabelText(/lösenord/i)
      expect(passwordInput).toBeRequired()
      expect(passwordInput).toHaveAttribute('type', 'password')
    })

    it('should have proper placeholder text', () => {
      render(<LoginForm />)

      expect(screen.getByPlaceholderText(/din@epost.se/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper form labels', () => {
      render(<LoginForm />)

      expect(screen.getByLabelText(/e-post/i)).toHaveAccessibleName()
      expect(screen.getByLabelText(/lösenord/i)).toHaveAccessibleName()
    })

    it('should have submit button with accessible text', () => {
      render(<LoginForm />)

      const submitButton = screen.getByRole('button', { name: /logga in/i })
      expect(submitButton).toBeInTheDocument()
    })
  })
})
