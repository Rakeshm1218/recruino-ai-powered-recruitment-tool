import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchJobs, deleteJob } from '../../store/slices/jobSlice'

export default function JobList() {
  const dispatch = useDispatch()
  const { jobs, status, error } = useSelector((state) => state.jobs)

  useEffect(() => {
    dispatch(fetchJobs())
  }, [dispatch])
   console.log(jobs)
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      dispatch(deleteJob(id))
    }
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {status === 'loading' ? (
        <div className="p-4 text-center">Loading jobs...</div>
      ) : error ? (
        <div className="p-4 text-red-500">{error}</div>
      ) : jobs.length === 0 ? (
        <div className="p-4 text-center text-gray-500">No jobs found</div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {jobs.map((job) => (
            <li key={job._id} className="p-4 hover:bg-gray-50">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                  <p className="text-sm text-gray-500">{job.description}</p>
                  <div className="mt-2">
                    <span className="text-xs font-medium text-gray-500">Skills: </span>
                    {job.skills?.map((skill,i) => (
                      <span key={i} className="inline-block bg-gray-100 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-1">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDelete(job._id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}