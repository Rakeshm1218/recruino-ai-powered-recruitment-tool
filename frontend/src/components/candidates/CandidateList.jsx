import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCandidate, fetchCandidates } from '../../store/slices/candidateSlice';

const CandidateList = ({ jobId }) => {
  const dispatch = useDispatch();
  const { candidates, status, error } = useSelector((state) => state.candidates);

  useEffect(() => {
    if (jobId) {
      dispatch(fetchCandidates(jobId));
    }
  }, [dispatch, jobId]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      dispatch(deleteCandidate(id));
    }
  };

  if (status === 'loading') {
    return <div className="text-center py-4">Loading candidates...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  if (candidates.length === 0) {
    return <div className="text-center py-4">No candidates found</div>;
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <ul className="divide-y divide-gray-200">
        {candidates.map((candidate) => (
          <li key={candidate._id} className="p-4 hover:bg-gray-50">
            <div className="flex justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{candidate.name}</h3>
                <p className="text-sm text-gray-500">{candidate.email}</p>
                <div className="mt-2">
                  <span className="text-xs font-medium text-gray-500">Match Score: </span>
                  <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                    candidate.matchScore > 75 ? 'bg-green-100 text-green-800' :
                    candidate.matchScore > 50 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {candidate.matchScore}%
                  </span>
                </div>
                <div className="mt-1">
                  <span className="text-xs font-medium text-gray-500">Skills: </span>
                  {candidate.skills.map((skill) => (
                    <span key={skill} className="inline-block bg-gray-100 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-1">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleDelete(candidate._id)}
                  className="text-red-600 text-sm font-medium shadow my-auto px-6 py-2 rounded-md hover:bg-red-600 hover:text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CandidateList;