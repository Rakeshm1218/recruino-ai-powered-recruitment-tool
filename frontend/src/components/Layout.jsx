import { Link, Outlet } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../store/slices/authSlice'
import { useState, useEffect, useRef } from 'react'

export default function Layout() {
  const { token, user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const mobileMenuRef = useRef(null)
  const profileDropdownRef = useRef(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false)
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-blue-600">
                Recruino
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/jobs"
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                Jobs
              </Link>
              <Link
                to="/candidates"
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                Candidates
              </Link>
              
              {token ? (
                <div className="relative" ref={profileDropdownRef}>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center text-sm rounded-full focus:outline-none"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                      {user?.email?.charAt(0).toUpperCase()}
                    </div>
                  </button>
                  
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          dispatch(logout())
                          setProfileDropdownOpen(false)
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  Login
                </Link>
              )}
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="mobile-menu-button p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        <div 
          ref={mobileMenuRef}
          className={`md:hidden bg-gray-100 ${mobileMenuOpen ? 'block' : 'hidden'}`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/jobs"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Jobs
            </Link>
            <Link
              to="/candidates"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Candidates
            </Link>
            {token ? (
              <>
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    dispatch(logout())
                    setMobileMenuOpen(false)
                  }}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-grow p-4 md:p-8 bg-gray-50">
        <Outlet />
      </main>

      <footer className="bg-white shadow-inner py-4">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Recruino - All rights reserved
        </div>
      </footer>
    </div>
  )
}