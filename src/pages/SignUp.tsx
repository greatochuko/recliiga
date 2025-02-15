import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, User, Users, AlertCircle } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from '@/contexts/AuthContext'

const popularCountryCodes = [
  { code: 'other', country: 'Other (input area code manually)', abbr: 'OTH', flag: '🌐' },
  { code: '+1', country: 'United States / Canada', abbr: 'US/CA', flag: '🇺🇸🇨🇦' },
  { code: '+44', country: 'United Kingdom', abbr: 'UK', flag: '🇬🇧' },
  { code: '+91', country: 'India', abbr: 'IN', flag: '🇮🇳' },
  { code: '+61', country: 'Australia', abbr: 'AU', flag: '🇦🇺' },
  { code: '+49', country: 'Germany', abbr: 'DE', flag: '🇩🇪' },
  { code: '+33', country: 'France', abbr: 'FR', flag: '🇫🇷' },
  { code: '+86', country: 'China', abbr: 'CN', flag: '🇨🇳' },
  { code: '+52', country: 'Mexico', abbr: 'MX', flag: '🇲🇽' },
  { code: '+81', country: 'Japan', abbr: 'JP', flag: '🇯🇵' },
  { code: '+7', country: 'Russia', abbr: 'RU', flag: '🇷🇺' },
  { code: '+55', country: 'Brazil', abbr: 'BR', flag: '🇧🇷' },
  { code: '+39', country: 'Italy', abbr: 'IT', flag: '🇮🇹' },
  { code: '+972', country: 'Israel', abbr: 'IL', flag: '🇮🇱' },
];

export default function SignUpPage() {
  const { signUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [role, setRole] = useState<'player' | 'organizer' | null>(null)
  const [countryCode, setCountryCode] = useState(popularCountryCodes[1])
  const [customCountryCode, setCustomCountryCode] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    if (!role) {
      setError('Please select a role')
      return false
    }
    if (!fullName.trim()) {
      setError('Please enter your full name')
      return false
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return false
    }
    if (!phone.trim()) {
      setError('Please enter your phone number')
      return false
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return false
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return false
    }
    return true
  }

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return re.test(String(email).toLowerCase())
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) return

    const finalPhone = countryCode.code === 'other' 
      ? `${customCountryCode}${phone}`
      : `${countryCode.code}${phone}`

    try {
      setIsLoading(true)
      await signUp(email, password, {
        full_name: fullName,
        role: role,
        phone: finalPhone,
      })
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCountryCodeChange = (value: any) => {
    const selectedCode = popularCountryCodes.find((code) => code.code === value)
    if (selectedCode) {
      setCountryCode(selectedCode)
    } else {
      setCountryCode(popularCountryCodes[0])
    }
  }

  const handleCustomCountryCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomCountryCode(e.target.value)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-[#FF7A00] mb-8">REC LiiGA</h1>
      
      <Card className="w-full max-w-md">
        <form onSubmit={handleSignUp}>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-center text-gray-800">Register your Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-800">Select Your Role</label>
              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant={role === 'organizer' ? 'default' : 'outline'}
                  className={`flex-1 flex flex-col items-center justify-center h-20 ${
                    role === 'organizer' ? 'bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white' : ''
                  }`}
                  onClick={() => setRole('organizer')}
                >
                  <Users className="h-6 w-6 mb-2" />
                  League Organizer
                </Button>
                <Button
                  type="button"
                  variant={role === 'player' ? 'default' : 'outline'}
                  className={`flex-1 flex flex-col items-center justify-center h-20 ${
                    role === 'player' ? 'bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white' : ''
                  }`}
                  onClick={() => setRole('player')}
                >
                  <User className="h-6 w-6 mb-2" />
                  Player
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm text-gray-800">Full Name</label>
              <Input 
                id="fullName" 
                type="text" 
                placeholder="John Doe" 
                className="w-full" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm text-gray-800">Email</label>
              <Input 
                id="email" 
                type="email" 
                placeholder="johndoe@gmail.com" 
                className="w-full" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm text-gray-800">Phone Number</label>
              <div className="flex items-center space-x-2">
                <Select onValueChange={handleCountryCodeChange}>
                  <SelectTrigger className="w-[120px] text-sm">
                    <SelectValue placeholder={`${countryCode.flag} ${countryCode.abbr}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {popularCountryCodes.map((code) => (
                      <SelectItem key={code.code} value={code.code}>
                        {code.flag} {code.country} ({code.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {countryCode.code === 'other' ? (
                  <Input
                    type="text"
                    placeholder="Enter Area Code"
                    className="w-[100px] text-sm"
                    value={customCountryCode}
                    onChange={handleCustomCountryCodeChange}
                  />
                ) : null}
                <Input 
                  id="phone" 
                  type="tel" 
                  placeholder="123-456-7890" 
                  className="w-full" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm text-gray-800">Password</label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="********" 
                  className="w-full pr-10" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm text-gray-800">Confirm Password</label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="********"
                  className="w-full pr-10"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
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
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Signing up...' : 'Sign Up'}
            </Button>
            <p className="text-sm text-[#707B81] text-center">
              Already have an account? <Link to="/sign-in" className="text-[#FF7A00] hover:underline">Sign in</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
