import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '../hooks/useAuth'

interface LoginFormProps {
  onSuccess?: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  
  const { login, signUp, resetPassword, loading, error } = useAuth()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSuccessMessage('')
    
    try {
      if (showForgotPassword) {
        await resetPassword(email)
        setSuccessMessage('Återställningslänk skickad till din e-post!')
        setShowForgotPassword(false)
        setEmail('')
      } else if (isSignUp) {
        await signUp(email, password)
        onSuccess?.()
      } else {
        await login(email, password)
        onSuccess?.()
      }
    } catch (err) {
      // Error is handled by useAuth hook
      console.error('Form error:', err)
    }
  }

  const toggleMode = () => {
    setIsSignUp(!isSignUp)
    setShowForgotPassword(false)
    setSuccessMessage('')
  }

  const toggleForgotPassword = () => {
    setShowForgotPassword(!showForgotPassword)
    setIsSignUp(false)
    setSuccessMessage('')
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            E-post
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="din@epost.se"
          />
        </div>

        {/* Password Input - Hidden for forgot password */}
        {!showForgotPassword && (
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Lösenord
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="••••••••"
              minLength={6}
            />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
            {error}
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">
            {successMessage}
          </div>
        )}

        {/* Submit Button */}
        <Button 
          type="submit" 
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Laddar...' : showForgotPassword ? 'Skicka återställningslänk' : isSignUp ? 'Skapa konto' : 'Logga in'}
        </Button>
      </form>

      {/* Footer Links */}
      <div className="space-y-2 text-center text-sm">
        {!showForgotPassword && (
          <>
            <button
              type="button"
              onClick={toggleForgotPassword}
              className="text-muted-foreground hover:text-foreground underline"
            >
              Glömt lösenordet?
            </button>
            <div>
              <span className="text-muted-foreground">
                {isSignUp ? 'Har du redan ett konto?' : 'Inget konto än?'}
              </span>{' '}
              <button
                type="button"
                onClick={toggleMode}
                className="text-primary hover:underline font-medium"
              >
                {isSignUp ? 'Logga in' : 'Skapa konto'}
              </button>
            </div>
          </>
        )}
        
        {showForgotPassword && (
          <button
            type="button"
            onClick={toggleForgotPassword}
            className="text-muted-foreground hover:text-foreground underline"
          >
            Tillbaka till inloggning
          </button>
        )}
      </div>
    </div>
  )
}
