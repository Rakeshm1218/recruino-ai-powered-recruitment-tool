import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createJob } from '../../store/slices/jobSlice'

const JobForm = ({ onSuccess }) => {
  const dispatch = useDispatch()
  const { status, error } = useSelector((state) => state.jobs)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skills: '',
    status: 'open'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const skillsArray = formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill)
    
    dispatch(createJob({
      title: formData.title,
      description: formData.description,
      skills: skillsArray,
      status: formData.status
    })).unwrap()
      .then(() => {
        setFormData({
          title: '',
          description: '',
          skills: '',
          status: 'open'
        })
        if (onSuccess) onSuccess()
      })
      .catch((err) => {
        console.error('Error creating job:', err)
      })
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Job</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Job Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
            maxLength={100}
          />
          <p className="mt-1 text-sm text-gray-500">
            {formData.title.length}/100 characters
          </p>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Job Description *
          </label>
          <textarea
            id="description"
            name="description"
            rows={5}
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
            maxLength={1000}
          />
          <p className="mt-1 text-sm text-gray-500">
            {formData.description.length}/1000 characters
          </p>
        </div>

        <div>
          <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
            Required Skills (comma separated) *
          </label>
          <input
            type="text"
            id="skills"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="e.g. JavaScript, React, Node.js"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            Separate multiple skills with commas
          </p>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Job Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => onSuccess && onSuccess()}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={status === 'loading'}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
          >
            {status === 'loading' ? 'Creating...' : 'Create Job'}
          </button>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error creating job
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}

export default JobForm