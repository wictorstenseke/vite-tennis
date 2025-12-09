import { LoginDrawer } from '@/features/auth/components/LoginDrawer'
import './App.css'

function App() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center px-4 pt-8 pb-4 fixed inset-0 overflow-hidden bg-background">
      {/* Logo */}
      <div className="mb-8">
        <img 
          src="/htk-logo.svg" 
          alt="Högelids Tennisklubb" 
          className="w-32 h-32 md:w-40 md:h-40"
        />
      </div>

      {/* Login Drawer */}
      <div>
        <LoginDrawer />
      </div>
    </div>
  )
}

export default App
