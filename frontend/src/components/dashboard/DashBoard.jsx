import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs } from '../../store/slices/jobSlice';
import { fetchAllCandidates } from '../../store/slices/candidateSlice';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const dispatch = useDispatch();
  const [selectedJobId, setSelectedJobId] = useState(null);
  
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

  useEffect(() => {
    const loadData = async () => {
      try {
        dispatch(fetchJobs());
        dispatch(fetchAllCandidates());
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    };
    loadData();
  }, [dispatch]);

  // Calculate dashboard metrics only if jobs exist
  const hasJobs = jobs?.length > 0;
  const totalJobs = hasJobs ? jobs.length : 0;
  const totalCandidates = candidates?.length || 0;
  const avgMatchScore = hasJobs 
    ? candidates?.reduce((sum, c) => sum + (c.matchScore || 0), 0) / (totalCandidates || 1) || 0
    : 0;

  const candidatesPerJob = hasJobs 
    ? jobs.map(job => ({
        jobId: job._id,
        jobTitle: job.title,
        count: candidates?.filter(c => c.job === job._id).length || 0
      }))
    : [];

  const filteredCandidates = selectedJobId
    ? candidates?.filter(c => c.job === selectedJobId)
    : candidates;

  const topCandidates = [...(filteredCandidates || [])]
    ?.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
    ?.slice(0, 5) || [];

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
      
      {/* Error display */}
      {(jobsError || candidatesError) && (
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

      {/* Empty state when no jobs */}
      {!hasJobs && !jobsError && (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No jobs posted yet</h3>
          <p className="mt-1 text-gray-500">Get started by creating your first job posting.</p>
          <div className="mt-6">
            <Link
              to="/jobs"
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create Job
            </Link>
          </div>
        </div>
      )}

      {/* Only show metrics if jobs exist */}
      {hasJobs && (
        <>
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
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Candidates per Job</h3>
              {selectedJobId && (
                <button 
                  onClick={() => setSelectedJobId(null)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Show all candidates
                </button>
              )}
            </div>
            <ul className="space-y-2">
              {candidatesPerJob.map((item) => (
                <li 
                  key={item.jobId} 
                  className="flex justify-between cursor-pointer hover:bg-gray-50 p-2 rounded"
                  onClick={() => setSelectedJobId(item.jobId)}
                >
                  <span className={selectedJobId === item.jobId ? "font-semibold text-blue-600" : ""}>
                    {item.jobTitle}
                  </span>
                  <span className={`font-medium ${selectedJobId === item.jobId ? "text-blue-600" : ""}`}>
                    {item.count} candidates
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Top Candidates */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {selectedJobId 
                ? `Top Candidates for ${jobs.find(j => j._id === selectedJobId)?.title || 'Selected Job'}`
                : 'Top Candidates Overall'}
            </h3>
            {totalCandidates === 0 ? (
              <p className="text-gray-500">No candidates available</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      {!selectedJobId && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job</th>
                      )}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Match Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skills</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {topCandidates.map((candidate) => (
                      <tr key={candidate._id}>
                        <td className="px-6 py-4 whitespace-nowrap">{candidate.name}</td>
                        {!selectedJobId && (
                          <td className="px-6 py-4 whitespace-nowrap">
                            {jobs.find(j => j._id === candidate.job)?.title || 'Unknown'}
                          </td>
                        )}
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
        </>
      )}
    </div>
  );
}