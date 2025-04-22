import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { register } from '../../store/slices/authSlice'
import { Link, useNavigate } from 'react-router-dom'

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })
  const dispatch = useDispatch()
  const { status, error } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!")
      return
    }
    const result = await dispatch(register({
      email: formData.email,
      password: formData.password
    }))
    if (result.payload?.token) {
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-blue-600 lg:bg-gray-100 lg:flex-row">
      {/* Logo for Mobile */}
      <div className="lg:hidden flex justify-center items-center pt-8 pb-4">
        <div className="flex items-center">
          <svg className="w-8 h-8 mr-2 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4L4 8L12 12L20 8L12 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 16L12 20L20 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 12L12 16L20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-xl font-bold text-white">Recuino</span>
        </div>
      </div>
      
      {/* Left Side - Blue Section (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 flex-col justify-center items-center p-12 text-white">
        <div className="max-w-md">
          <div className="flex items-center mb-8">
            <svg className="w-8 h-8 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4L4 8L12 12L20 8L12 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 16L12 20L20 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 12L12 16L20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-xl font-bold">Recruino</span>
          </div>
          
          <h1 className="text-4xl font-bold mb-6">Let's setup your recruitment portal</h1>
          <p className="mb-8 text-blue-100">AI-powered recruitment solution to streamline your hiring process. Find the perfect candidate faster and more efficiently.</p>
          
          
          
         
        </div>
      </div>
      
      {/* Right Side - White on Desktop, Blue on Mobile */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h2 className="text-xl md:text-3xl font-bold text-gray-800 mb-2">Create an account</h2>
            <p className="text-gray-600 text-sm">Let's get started with your recruitment journey</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                required
                placeholder="name@company.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                required
                placeholder="Create a strong password"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                required
                placeholder="Confirm your password"
              />
            </div>
            
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition-colors font-medium flex items-center justify-center"
            >
              {status === 'loading' ? 'Creating account...' : 'Create account'}
              {status !== 'loading' && (
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              )}
            </button>
            
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm flex items-start">
                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}
          </form>
          
          <p className="mt-6 text-center text-gray-600 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}