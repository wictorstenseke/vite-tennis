import { useState } from 'react'
import { Drawer, DrawerContent, DrawerTrigger, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { LoginForm } from './LoginForm'
import { useAuth } from '../hooks/useAuth'
import { toast } from 'sonner'

interface LoginDrawerProps {
  children?: React.ReactNode
}

export function LoginDrawer({ children }: LoginDrawerProps) {
  const [open, setOpen] = useState(false)
  const { user } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)

  const getDescription = () => {
    if (showForgotPassword) {
      return 'Fyll i din e-post för att återställa lösenordet.'
    } else if (isSignUp) {
      return 'Skapa ett nytt konto för att boka bana och delta i stegen.'
    } else {
      return 'Logga in med din e-post och lösenord för att boka bana och se stegen.'
    }
  }

  const handleLoginSuccess = () => {
    setOpen(false)
    
    // Show toast notification when user logs in
    if (user) {
      const userName = user.displayName || user.email?.split('@')[0] || 'Användare'
      const now = new Date()
      const formattedDate = now.toLocaleDateString('sv-SE', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
      const formattedTime = now.toLocaleTimeString('sv-SE', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
      
      toast(`${userName} är inloggad`, {
        description: `${formattedDate} ${formattedTime}`,
        action: {
          label: 'Okej',
          onClick: () => {}
        },
        duration: 5000
      })
    }
  }

  // Pass state setters to LoginForm for sync
  const handleToggleMode = (signUp: boolean) => setIsSignUp(signUp)
  const handleToggleForgot = (forgot: boolean) => setShowForgotPassword(forgot)

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {children || (
          <Button>
            Logga in
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent className="max-w-full md:max-w-md mx-auto">
        <DrawerHeader>
          <DrawerTitle className="text-center">Välkommen</DrawerTitle>
          <DrawerDescription className="text-center">
            {getDescription()}
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-6 pt-0">
          <LoginForm onSuccess={handleLoginSuccess} onToggleMode={handleToggleMode} onToggleForgot={handleToggleForgot} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
