
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '@/features/auth/context/AuthContext'
import { AuthLayout } from '../components/AuthLayout'
import { routes } from '@/utils/routes'

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return re.test(String(email).toLowerCase())
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    try {
      setIsLoading(true)
      await resetPassword(email)
      setResetSent(true)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout title="Reset Password">
      <Card className="w-full">
        {resetSent ? (
          <CardContent className="pt-6">
            <Alert className="border-0 bg-transparent p-0">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-[#FF7A00] mr-2 mt-0.5" />
                <AlertDescription className="text-[#707B81]">
                  We've sent an email to <span className="font-semibold text-gray-800">{email}</span> with instructions to reset your password. Please check your inbox and follow the link provided.
                </AlertDescription>
              </div>
            </Alert>
            <p className="mt-6 text-sm text-[#707B81] text-center">
              Didn't receive the email? Check your spam folder or <button onClick={() => setResetSent(false)} className="text-[#FF7A00] hover:underline font-semibold">try again</button>.
            </p>
          </CardContent>
        ) : (
          <form onSubmit={handleResetPassword}>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm text-gray-800">Email</label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="johndoe@gmail.com" 
                  className="w-full" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
                {error && (
                  <Alert variant="destructive" className="border-0 bg-transparent p-0">
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                      <AlertDescription className="text-red-600">{error}</AlertDescription>
                    </div>
                  </Alert>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Reset Password'}
              </Button>
              <p className="text-sm text-[#707B81] text-center">
                Remember your password? <Link to={routes.auth.signIn} className="text-[#FF7A00] hover:underline">Sign in</Link>
              </p>
            </CardFooter>
          </form>
        )}
      </Card>
    </AuthLayout>
  );
}
