import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs } from '../../store/slices/jobSlice';
import { fetchAllCandidates } from '../../store/slices/candidateSlice';

export default function Dashboard() {
  const dispatch = useDispatch();
  
  const { 
    jobs, 
    status: jobsStatus, 
    error: jobsError 
  } = useSelector((state) => state.jobs);
  
  const { 
    candidates, 
    status: candidatesStatus, 
    error: candidatesError 
  } = useSelector((state) => state.candidates);
  console.log(jobs,candidates)
  // Load data when component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        // Always fetch jobs if not loading
        dispatch(fetchJobs());
        // Always fetch candidates if not loading
        dispatch(fetchAllCandidates());
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    };
    loadData();
  }, [dispatch]); // Remove length dependencies

  // Calculate dashboard metrics
  const totalJobs = jobs?.length || 0;
  const totalCandidates = candidates?.length || 0;
  const avgMatchScore = candidates?.reduce((sum, c) => sum + (c.matchScore || 0), 0) / (totalCandidates || 1) || 0;
  const candidatesPerJob = jobs?.map(job => ({
    jobId: job._id,
    jobTitle: job.title,
    count: candidates?.filter(c => c.job === job._id).length || 0
  })) || [];
  
  const topCandidates = [...candidates]
  ?.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
  ?.slice(0, 5) || [];


  // Loading state
  if (jobsStatus === 'loading' || candidatesStatus === 'loading') {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Recruiter Dashboard</h1>
        <div className="text-center py-12">Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Recruiter Dashboard</h1>
      
      {/* Only show error if we have no data */}
      {(jobsError || candidatesError) && totalJobs === 0 && totalCandidates === 0 && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-red-400 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-red-700">
              {jobsError || candidatesError}
            </span>
          </div>
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Total Jobs</h3>
          <p className="text-3xl font-bold mt-2">{totalJobs}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Total Candidates</h3>
          <p className="text-3xl font-bold mt-2">{totalCandidates}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Avg Match Score</h3>
          <p className="text-3xl font-bold mt-2">{avgMatchScore.toFixed(1)}%</p>
        </div>
      </div>

      {/* Candidates per Job */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Candidates per Job</h3>
        {totalJobs === 0 ? (
          <p className="text-gray-500">No jobs available</p>
        ) : (
          <ul className="space-y-2">
            {candidatesPerJob.map((item) => (
              <li key={item.jobId} className="flex justify-between">
                <span>{item.jobTitle}</span>
                <span className="font-medium">{item.count} candidates</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Top Candidates */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Top Candidates</h3>
        {totalCandidates === 0 ? (
          <p className="text-gray-500">No candidates available</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Match Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skills</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topCandidates.map((candidate) => (
                  <tr key={candidate._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{candidate.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {jobs.find(j => j._id === candidate.job)?.title || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        candidate.matchScore > 75 ? 'bg-green-100 text-green-800' :
                        candidate.matchScore > 50 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {candidate.matchScore}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {candidate.skills?.slice(0, 3).map(skill => (
                        <span key={skill} className="inline-block bg-gray-100 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-1">
                          {skill}
                        </span>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}