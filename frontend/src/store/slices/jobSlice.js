import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

const handleApiError = (error, rejectWithValue) => {
  if (!error.response) {
    return rejectWithValue({
      message: "Network error - server not responding",
    });
  }
  return rejectWithValue(
    error.response.data || { message: "An unknown error occurred" }
  );
};

// Helper to normalize API response
const normalizeResponse = (response) => {
  if (Array.isArray(response)) return response;
  if (response?.data && Array.isArray(response.data)) return response.data;
  if (response?.data && typeof response.data === "object")
    return [response.data];
  return [];
};

export const fetchJobs = createAsyncThunk(
  "jobs/fetchJobs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/jobs");
      return normalizeResponse(response.data);
    } catch (err) {
      return handleApiError(err, rejectWithValue);
    }
  }
);

export const createJob = createAsyncThunk(
  "jobs/createJob",
  async (jobData, { rejectWithValue }) => {
    try {
      const response = await api.post("/jobs", jobData);
      return response.data?.data || response.data;
    } catch (err) {
      return handleApiError(err, rejectWithValue);
    }
  }
);

export const updateJob = createAsyncThunk(
  "jobs/updateJob",
  async ({ id, jobData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/jobs/${id}`, jobData);
      return response.data;
    } catch (err) {
      return handleApiError(err, rejectWithValue);
    }
  }
);

export const deleteJob = createAsyncThunk(
  "jobs/deleteJob",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/jobs/${id}`);
      return id;
    } catch (err) {
      return handleApiError(err, rejectWithValue);
    }
  }
);

// Slice with more comprehensive state management
const jobSlice = createSlice({
  name: "jobs",
  initialState: {
    jobs: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    lastFetch: null,
    operationStatus: "idle", // For create/update/delete operations
  },
  reducers: {
    clearJobError: (state) => {
      state.error = null;
    },
    resetOperationStatus: (state) => {
      state.operationStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Jobs
      .addCase(fetchJobs.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.jobs = action.payload;
        state.lastFetch = new Date().toISOString();
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to fetch jobs";
      })

      // Create Job
      .addCase(createJob.pending, (state) => {
        state.operationStatus = "loading";
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.operationStatus = "succeeded";
        state.jobs.push(action.payload);
      })
      .addCase(createJob.rejected, (state, action) => {
        state.operationStatus = "failed";
        state.error = action.payload?.message || "Failed to create job";
      })

      // Update Job
      .addCase(updateJob.pending, (state) => {
        state.operationStatus = "loading";
      })
      // In your updateJob.fulfilled case
      .addCase(updateJob.fulfilled, (state, action) => {
        // console.log("Update payload:", action.payload); // Verify what you're receiving
        state.operationStatus = "succeeded";
        const updatedJob = action.payload.data;
        // console.log("Before update:", state.jobs);
        state.jobs = state.jobs.map((job) =>
          job._id === updatedJob._id ? updatedJob : job
        );
        // console.log("After update:", state.jobs);
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.operationStatus = "failed";
        state.error = action.payload?.message || "Failed to update job";
      })

      // Delete Job
      .addCase(deleteJob.pending, (state) => {
        state.operationStatus = "loading";
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.operationStatus = "succeeded";
        state.jobs = state.jobs.filter((job) => job._id !== action.payload);
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.operationStatus = "failed";
        state.error = action.payload?.message || "Failed to delete job";
      });
  },
});

export const { clearJobError, resetOperationStatus } = jobSlice.actions;
export default jobSlice.reducer;
