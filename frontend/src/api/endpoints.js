import { request } from './client';

function normalizeUpdate(update = {}) {
  return {
    ...update,
    issueId: update.issueId ?? update.issue_id,
    createdAt: update.createdAt ?? update.created_at,
  };
}

export function normalizeIssue(issue = {}) {
  return {
    ...issue,
    userId: issue.userId ?? issue.user_id,
    imageUrl: issue.imageUrl ?? issue.image_url,
    aiSummary: issue.aiSummary ?? issue.ai_summary,
    assignedTo: issue.assignedTo ?? issue.assigned_to,
    createdAt: issue.createdAt ?? issue.created_at,
    updatedAt: issue.updatedAt ?? issue.updated_at,
    updates: Array.isArray(issue.updates) ? issue.updates.map(normalizeUpdate) : issue.updates,
  };
}

function normalizeResponse(response) {
  if (Array.isArray(response?.data)) {
    return { ...response, data: response.data.map(normalizeIssue) };
  }

  if (response?.data && typeof response.data === 'object') {
    return { ...response, data: normalizeIssue(response.data) };
  }

  return response;
}

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
  const response = await request(API_ENDPOINTS.issues, {
    method: 'POST',
    body: payload,
  });
  return normalizeResponse(response);
}

export async function listIssues(params = {}) {
  const query = new URLSearchParams(params).toString();
  const path = query ? `${API_ENDPOINTS.issues}?${query}` : API_ENDPOINTS.issues;
  return normalizeResponse(await request(path, { method: 'GET' }));
}

export async function getIssue(id) {
  return normalizeResponse(await request(API_ENDPOINTS.issueDetail(id), { method: 'GET' }));
}

export async function updateIssue(id, payload) {
  const response = await request(API_ENDPOINTS.issueDetail(id), {
    method: 'PATCH',
    body: payload,
  });
  return normalizeResponse(response);
}

export async function addIssueUpdate(id, payload) {
  const response = await request(API_ENDPOINTS.issueUpdates(id), {
    method: 'POST',
    body: payload,
  });
  return normalizeResponse(response);
}

export async function deleteIssue(id) {
  return request(API_ENDPOINTS.issueDetail(id), { method: 'DELETE' });
}

export default API_ENDPOINTS;
