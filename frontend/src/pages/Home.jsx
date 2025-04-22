import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Navigation Bar */}
      

      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-16 pb-24">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* Left side content */}
          <div className="lg:w-1/2 mb-12 lg:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Swift <span className="bg-blue-500 text-white px-2 rounded-md ">Recruitment</span> for current pace of work
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              An all-encompassing remote hiring solution to help modern businesses grow with Virtual Assistants.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/jobs" className="bg-blue-600 text-white px-8 py-3 rounded-lg text-center hover:bg-blue-700 transition-colors">
                Manage Jobs
              </Link>
              <Link to="/candidates" className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg text-center hover:bg-blue-50 transition-colors">
                View Candidates
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">AI-Powered Recruitment Tool</h2>
          <p className="text-xl text-center text-gray-700 mb-12 max-w-3xl mx-auto">
            Streamline your hiring process with intelligent candidate matching
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-blue-50 rounded-xl p-6 text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Matching</h3>
              <p className="text-gray-600">Find perfect candidates with AI-powered matching technology</p>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-6 text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Time Saving</h3>
              <p className="text-gray-600">Reduce hiring time by up to 75% with automated workflows</p>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-6 text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Hiring</h3>
              <p className="text-gray-600">Make better hiring decisions with comprehensive analytics</p>
            </div>
          </div>
        </div>
      </div>
      
      
      
      
    </div>
  );
}