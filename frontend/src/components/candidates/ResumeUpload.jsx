import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { uploadResume } from '../../store/slices/candidateSlice';

const ResumeUpload = ({ jobId, onSuccess, onCancel }) => {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null); // State to store error messages

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setError(null); // Reset any previous errors

    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('jobId', jobId);
      if (name) formData.append('name', name);
      if (email) formData.append('email', email);

      // Dispatch the uploadResume action and wait for completion
      await dispatch(uploadResume(formData)).unwrap();

      // On success, call the onSuccess callback and reset the form
      onSuccess();
      setFile(null);
      setName('');
      setEmail('');
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Upload failed, please try again.'); // Display a user-friendly error message
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h3 className="text-lg font-medium mb-4">Upload Resume</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* File Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Resume (PDF/DOCX) *
          </label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
            accept=".pdf,.docx"
            required
          />
        </div>

        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name (optional)
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Email Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email (optional)
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Error Message */}
        {error && <div className="text-red-500 text-sm">{error}</div>}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isUploading}
            className="px-4 py-2 border border-gray-300 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isUploading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResumeUpload;
