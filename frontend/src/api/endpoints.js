import { request } from './client';

export const API_ENDPOINTS = Object.freeze({
  health: '/api/health',
  analyze: '/api/ai/analyze',
  issues: '/api/issues',
  issueDetail: (id) => `/api/issues/${id}`,
  issueUpdates: (id) => `/api/issues/${id}/updates`,
});

export async function analyzeIssue(payload) {
  return request(API_ENDPOINTS.analyze, {
    method: 'POST',
    body: payload,
  });
}

export async function createIssue(payload) {
  return request(API_ENDPOINTS.issues, {
    method: 'POST',
    body: payload,
  });
}

export async function listIssues(params = {}) {
  const query = new URLSearchParams(params).toString();
  const path = query ? `${API_ENDPOINTS.issues}?${query}` : API_ENDPOINTS.issues;
  return request(path, { method: 'GET' });
}

export async function getIssue(id) {
  return request(API_ENDPOINTS.issueDetail(id), { method: 'GET' });
}

export async function updateIssue(id, payload) {
  return request(API_ENDPOINTS.issueDetail(id), {
    method: 'PATCH',
    body: payload,
  });
}

export async function addIssueUpdate(id, payload) {
  return request(API_ENDPOINTS.issueUpdates(id), {
    method: 'POST',
    body: payload,
  });
}

export async function deleteIssue(id) {
  return request(API_ENDPOINTS.issueDetail(id), { method: 'DELETE' });
}

export default API_ENDPOINTS;
