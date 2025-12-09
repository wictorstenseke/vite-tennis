import { LoginDrawer } from '@/features/auth/components/LoginDrawer'
import './App.css'

function App() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 fixed inset-0 overflow-hidden bg-background">
      {/* Logo */}
      <div className="mb-8">
        <img 
          src="/htk-logo.svg" 
          alt="Högelids Tennisklubb" 
          className="w-32 h-32 md:w-40 md:h-40"
        />
      </div>

      {/* Login Drawer */}
      <LoginDrawer />
    </div>
  )
}

export default App
