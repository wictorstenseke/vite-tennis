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
            Logga in med ditt konto för att boka bana och se stegen
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-6 pt-0">
          <LoginForm onSuccess={handleLoginSuccess} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
