import { useEffect, useState } from "react";
import JobForm from "../components/jobs/JobForm";
import JobList from "../components/jobs/JobList";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobs } from "../store/slices/jobSlice";

const Jobs = () => {
  const [showForm, setShowForm] = useState(false);
  const dispatch = useDispatch();
  const { jobs, status, error } = useSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Job Postings</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {showForm ? "Cancel" : "Create New Job"}
        </button>
      </div>

      {showForm && <JobForm onSuccess={() => setShowForm(false)} />}

      <JobList />
    </div>
  );
};

export default Jobs;
