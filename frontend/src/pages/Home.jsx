import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto text-center py-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        AI-Powered Recruitment Tool
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Streamline your hiring process with intelligent candidate matching
      </p>
      <div className="flex flex-col md:flex-row justify-center gap-4">
        <Link
          to="/jobs"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Manage Jobs
        </Link>
        <Link
          to="/candidates"
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          View Candidates
        </Link>
      </div>
    </div>
  )
}