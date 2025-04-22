import { Link, Outlet } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../store/slices/authSlice'
import { useState, useEffect, useRef } from 'react'
import { FaUserCircle, FaBars } from 'react-icons/fa'

export default function Layout() {
  const { token } = useSelector((state) => state.auth)
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Floating Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
        <nav className="max-w-7xl mx-auto bg-black bg-opacity-90 text-white rounded-xl shadow-lg">
          <div className="px-4 md:px-6">
            <div className="flex justify-between h-14">
              <div className="flex items-center">
                <Link to="/" className="text-xl font-bold text-white">
                  Recruino
                </Link>
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  to="/jobs"
                  className="px-3 py-2 text-sm font-medium text-gray-200 hover:text-white transition-colors"
                >
                  Jobs
                </Link>
                <Link
                  to="/candidates"
                  className="px-3 py-2 text-sm font-medium text-gray-200 hover:text-white transition-colors"
                >
                  Candidates
                </Link>
                
                {token ? (
                  <div className="relative" ref={profileDropdownRef}>
                    <button
                      onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                      className="flex items-center text-sm rounded-full focus:outline-none"
                    >
                      <FaUserCircle className="w-6 h-6 text-white" />
                    </button>
                    
                    {profileDropdownOpen && (
                      <div className="absolute top-8 -right-6 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                        <Link
                          to="/dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <button
                          onClick={() => {
                            dispatch(logout())
                            setProfileDropdownOpen(false)
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Login
                  </Link>
                )}
              </div>
              
              {/* Mobile menu button */}
              <div className="md:hidden flex items-center">
                <button 
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-md text-gray-200 hover:text-white focus:outline-none"
                >
                  <FaBars className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Mobile menu */}
          <div 
            ref={mobileMenuRef}
            className={`md:hidden ${mobileMenuOpen ? 'block ' : 'hidden'}`}
          >
            <div className="px-4 pt-2 pb-3 space-y-1 border-t mt-1 border-gray-700">
              <Link
                to="/jobs"
                className="block px-3 py-2 text-base font-medium text-gray-200 hover:text-white rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Jobs
              </Link>
              <Link
                to="/candidates"
                className="block px-3 py-2 text-base font-medium text-gray-200 hover:text-white rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Candidates
              </Link>
              {token ? (
                <>
                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 text-base font-medium text-gray-200 hover:text-white rounded-md transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      dispatch(logout())
                      setMobileMenuOpen(false)
                    }}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-gray-200 hover:text-white rounded-md transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="block px-3 py-2 text-base font-medium bg-gray-800 text-white hover:bg-gray-700 rounded-md transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </nav>
      </div>

      {/* Content area with padding to account for fixed navbar */}
      <main className="flex-grow p-4 md:p-8 mt-20">
        <Outlet />
      </main>

      <footer className="bg-black text-white py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-300 text-sm">
          © {new Date().getFullYear()} Recruino - All rights reserved
        </div>
      </footer>
    </div>
  )
}