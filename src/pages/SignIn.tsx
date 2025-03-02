
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function SignInPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await signIn(email, password)
      navigate('/')
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogoClick = () => {
    // Reset form and errors
    setEmail('')
    setPassword('')
    setError('')
    // Force a complete page refresh to reset all state
    window.location.href = window.location.pathname
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <h1 
        className="text-4xl font-bold text-[#FF7A00] mb-8 cursor-pointer hover:text-[#FF9A30] transition-colors" 
        onClick={handleLogoClick}
      >
        REC LiiGA
      </h1>
      
      <Card className="w-full max-w-md">
        <form onSubmit={handleSignIn}>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-center text-gray-800">Sign in now</CardTitle>
            <p className="text-center text-[#707B81] text-sm">Please sign in to continue</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm text-gray-700">Email</label>
              <Input 
                id="email" 
                type="email" 
                placeholder="johndoe@gmail.com" 
                className="w-full" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm text-gray-700">Password</label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="********" 
                  className="w-full pr-10" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
            </div>
            {error && (
              <Alert variant="destructive" className="border-0 bg-transparent p-0">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                  <AlertDescription className="text-red-600">{error}</AlertDescription>
                </div>
              </Alert>
            )}
            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-[#707B81] hover:underline">Forget Password?</Link>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
            <p className="text-sm text-[#707B81] text-center">
              Don't have an account? <Link to="/sign-up" className="text-[#FF7A00] hover:underline">Sign up</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
