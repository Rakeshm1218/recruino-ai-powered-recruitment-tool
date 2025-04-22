import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

export const fetchCandidates = createAsyncThunk(
  "candidates/fetchCandidates",
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/candidates/${jobId}`);
      return response.data?.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const fetchAllCandidates = createAsyncThunk(
  'candidates/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/candidates');
      return response.data?.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const uploadResume = createAsyncThunk(
  "candidates/uploadResume",
  async (formData, { rejectWithValue }) => {
    // console.log("upload resume is called");

    try {
      const response = await api.post("/candidates/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // This is necessary for file uploads
        },
      });

      // console.log("API Response: ", response);
      return response.data.data; // Return response data, assuming it has a 'data' field
    } catch (err) {
      console.error("Upload failed:", err);
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);



export const deleteCandidate = createAsyncThunk(
  "candidates/deleteCandidate",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/candidates/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

const candidateSlice = createSlice({
  name: "candidates",
  initialState: {
    candidates: [],
    status: "idle",
    error: null,
    uploadStatus: "idle"
  },
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    resetStatus: (state) => {
      state.status = "idle";
      state.uploadStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Candidates
      .addCase(fetchCandidates.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCandidates.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.candidates = action.payload;
      })
      .addCase(fetchCandidates.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to fetch candidates";
      })
      
      // Fetch All Candidates
      .addCase(fetchAllCandidates.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAllCandidates.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.candidates = action.payload;
      })
      .addCase(fetchAllCandidates.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to fetch all candidates";
      })
      
      // Upload Resume
      .addCase(uploadResume.pending, (state) => {
        state.uploadStatus = "uploading";
        state.error = null;
      })
      .addCase(uploadResume.fulfilled, (state, action) => {
        state.uploadStatus = "succeeded";
        state.candidates.unshift(action.payload);
      })
      .addCase(uploadResume.rejected, (state, action) => {
        state.uploadStatus = "failed";
        state.error = action.payload?.message || "Failed to upload resume";
      })
      
      // Delete Candidate
      .addCase(deleteCandidate.fulfilled, (state, action) => {
        state.candidates = state.candidates.filter(c => c._id !== action.payload);
      });
  },
});

export const { clearErrors, resetStatus } = candidateSlice.actions;
export default candidateSlice.reducer;