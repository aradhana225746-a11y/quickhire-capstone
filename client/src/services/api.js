const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('quickhire_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

const handleResponse = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errorMsg = data.message || `Request failed with status ${res.status}`;
    const error = new Error(errorMsg);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
};

// API Client
export const api = {
  // Auth
  login: async (credentials) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return handleResponse(res);
  },

  register: async (userData) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return handleResponse(res);
  },

  getMe: async () => {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Jobs
  getJobs: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${BASE_URL}/jobs${query ? `?${query}` : ''}`);
    return handleResponse(res);
  },

  getJobById: async (id) => {
    const res = await fetch(`${BASE_URL}/jobs/${id}`);
    return handleResponse(res);
  },

  createJob: async (jobData) => {
    const res = await fetch(`${BASE_URL}/jobs`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(jobData)
    });
    return handleResponse(res);
  },

  updateJob: async (id, jobData) => {
    const res = await fetch(`${BASE_URL}/jobs/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(jobData)
    });
    return handleResponse(res);
  },

  deleteJob: async (id) => {
    const res = await fetch(`${BASE_URL}/jobs/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  getMyPostedJobs: async () => {
    const res = await fetch(`${BASE_URL}/jobs/my-jobs`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Applications
  applyForJob: async (jobId, applicationData) => {
    const res = await fetch(`${BASE_URL}/applications/${jobId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(applicationData)
    });
    return handleResponse(res);
  },

  getMyApplications: async () => {
    const res = await fetch(`${BASE_URL}/applications/my-applications`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  getJobApplications: async (jobId) => {
    const res = await fetch(`${BASE_URL}/applications/job/${jobId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  updateApplicationStatus: async (applicationId, status, recruiterNotes = '') => {
    const res = await fetch(`${BASE_URL}/applications/${applicationId}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, recruiterNotes })
    });
    return handleResponse(res);
  },

  getRecruiterStats: async () => {
    const res = await fetch(`${BASE_URL}/applications/recruiter-stats`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  }
};
