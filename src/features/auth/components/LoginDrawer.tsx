import { useState } from 'react'
import { Drawer, DrawerContent, DrawerTrigger, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { LoginForm } from './LoginForm'

interface LoginDrawerProps {
  children?: React.ReactNode
}

export function LoginDrawer({ children }: LoginDrawerProps) {
  const [open, setOpen] = useState(false)

  const handleLoginSuccess = () => {
    setOpen(false)
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
        </DrawerHeader>
        <div className="p-6 pt-0">
          <LoginForm onSuccess={handleLoginSuccess} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
