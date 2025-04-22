import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchJobs, deleteJob, updateJob } from '../../store/slices/jobSlice' // Make sure to import updateJob
import { FaEdit } from 'react-icons/fa'
import { MdDelete } from "react-icons/md";

export default function JobList() {
  const dispatch = useDispatch()
  const { jobs, status, error } = useSelector((state) => state.jobs)
  const [editingJob, setEditingJob] = useState(null)
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    skills: ''
  })

  useEffect(() => {
    dispatch(fetchJobs())
  }, [dispatch])

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      dispatch(deleteJob(id))
    }
  }

  const handleEditClick = (job) => {
    setEditingJob(job._id)
    setEditFormData({
      title: job.title,
      description: job.description,
      skills: job.skills.join(', ')
    })
  }

  const handleEditFormChange = (e) => {
    const { name, value } = e.target
    setEditFormData({
      ...editFormData,
      [name]: value
    })
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const updatedJob = {
      ...editFormData,
      skills: editFormData.skills.split(',').map(skill => skill.trim())
    };
  
    try {
      const resultAction = await dispatch(
        updateJob({ id: editingJob, jobData: updatedJob })
      );
      
      if (updateJob.fulfilled.match(resultAction)) {
        setEditingJob(null); // Only close the form if update was successful
      } else {
        console.error('Update failed:', resultAction.error);
      }
    } catch (err) {
      console.error('Error updating job:', err);
    }
  };

  const handleCancelEdit = () => {
    setEditingJob(null)
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
            <li key={job._id} className="p-4">
              {editingJob === job._id ? (
                <form onSubmit={handleEditSubmit}>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={editFormData.title}
                      onChange={handleEditFormChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={editFormData.description}
                      onChange={handleEditFormChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Skills (comma separated)
                    </label>
                    <input
                      type="text"
                      name="skills"
                      value={editFormData.skills}
                      onChange={handleEditFormChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex justify-between relative">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                    <p className="text-sm text-gray-500">{job.description}</p>
                    <div className="mt-2">
                      <span className="text-xs font-medium text-gray-500">Skills: </span>
                      <div className=' flex flex-wrap w-3/4 gap-2 mt-2'>
                      {job.skills?.map((skill, i) => (
                        <span key={i} className="inline-block bg-gray-100 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-1">
                          {skill}
                        </span>
                      ))}
                      </div>
                    </div>
                  </div>
                  {/* small screen edit and delete function  */}
                  <div className="md:hidden space-x-2 absolute bottom-0 right-0">
                    
                    <button
                      onClick={() => handleEditClick(job)}
                      className="text-blue-600 hover:text-blue-800 text-lg font-medium "
                    >
                      <FaEdit/>
                    </button>
                    <button
                      onClick={() => handleDelete(job._id)}
                      className="text-red-600 hover:text-red-800 text-lg font-medium "
                    >
                      <MdDelete/>
                    </button>
                  </div>
                  {/* large screen edit and delete function  */}
                  <div className="md:flex space-x-2 hidden">

                    <button
                      onClick={() => handleEditClick(job)}
                      className="text-blue-600  text-sm font-medium  shadow my-auto px-6 py-2 rounded-md hover:bg-blue-600 hover:text-white"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(job._id)}
                      className="text-red-600  text-sm font-medium shadow my-auto px-6 py-2 rounded-md hover:bg-red-600 hover:text-white"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}