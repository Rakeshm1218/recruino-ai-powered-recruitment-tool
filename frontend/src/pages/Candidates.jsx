import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CandidateList from '../components/candidates/CandidateList';
import ResumeUpload from '../components/candidates/ResumeUpload';
import { fetchJobs } from '../store/slices/jobSlice';

const Candidates = () => {
  const [showUpload, setShowUpload] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState("");
  const dispatch = useDispatch();
  
  const { jobs, status: jobsStatus } = useSelector((state) => state.jobs);

  useEffect(() => {
    // Fetch jobs if not already loaded
    if (jobs.length === 0) {
      dispatch(fetchJobs());
    }
  }, [dispatch, jobs.length]);

  if (jobsStatus === 'loading') {
    return <div className="text-center py-8">Loading jobs...</div>;
  }

  if (jobsStatus === 'failed') {
    return <div className="text-center py-8 text-red-500">Failed to load jobs</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Candidates</h2>
        
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="border rounded-md p-2 flex-grow md:w-64"
            disabled={jobs.length === 0}
          >
            <option value="">{jobs.length === 0 ? 'No jobs available' : 'Select a job'}</option>
            {jobs.map((job) => (
              <option key={job._id} value={job._id}>
                {job.title}
              </option>
            ))}
          </select>
          
          <button
            onClick={() => setShowUpload(true)}
            disabled={!selectedJobId || jobs.length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            Upload Resume
          </button>
        </div>
      </div>

      {showUpload && (
        <ResumeUpload 
          jobId={selectedJobId} 
          onSuccess={() => {
            setShowUpload(false);
          }} 
          onCancel={() => setShowUpload(false)}
        />
      )}

      {selectedJobId ? (
        <CandidateList jobId={selectedJobId} />
      ) : (
        <div className="text-center py-8 text-gray-500">
          {jobs.length === 0 ? 'No jobs available to show candidates' : 'Please select a job to view candidates'}
        </div>
      )}
    </div>
  );
};

export default Candidates;