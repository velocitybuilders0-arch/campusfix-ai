// Issue persistence via Supabase. All queries use the admin client
// (service-role). Callers are responsible for authorization; this layer
// assumes the caller has already decided what the user is allowed to do.

const { getAdminClient } = require('./supabase');
const { notFound } = require('../utils/errors');

const ISSUE_COLUMNS =
  'id,user_id,title,description,image_url,category,priority,ai_summary,department,status,assigned_to,created_at,updated_at';

async function listIssues({ userId, role, filters = {} } = {}) {
  const admin = getAdminClient();
  let q = admin.from('issues').select(ISSUE_COLUMNS).order('created_at', { ascending: false });

  // Students may only see their own issues.
  if (role === 'STUDENT') {
    q = q.eq('user_id', userId);
  }

  if (filters.status) q = q.eq('status', filters.status);
  if (filters.priority) q = q.eq('priority', filters.priority);
  if (filters.category) q = q.eq('category', filters.category);
  if (filters.assigned_to) q = q.eq('assigned_to', filters.assigned_to);
  if (filters.user_id && role !== 'STUDENT') q = q.eq('user_id', filters.user_id);

  const { data, error } = await q;
  if (error) throw error;
  return data || [];
}

async function getIssueById(id, { userId, role } = {}) {
  const admin = getAdminClient();
  const { data, error } = await admin
    .from('issues')
    .select(ISSUE_COLUMNS)
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  if (!data) throw notFound('Issue not found');
  if (role === 'STUDENT' && data.user_id !== userId) {
    // Hide existence from students who don't own it.
    throw notFound('Issue not found');
  }
  return data;
}

async function createIssue(payload) {
  const admin = getAdminClient();
  const { data, error } = await admin
    .from('issues')
    .insert(payload)
    .select(ISSUE_COLUMNS)
    .single();
  if (error) throw error;
  return data;
}

async function updateIssue(id, patch) {
  const admin = getAdminClient();
  const { data, error } = await admin
    .from('issues')
    .update(patch)
    .eq('id', id)
    .select(ISSUE_COLUMNS)
    .maybeSingle();
  if (error) throw error;
  if (!data) throw notFound('Issue not found');
  return data;
}

async function deleteIssue(id) {
  const admin = getAdminClient();
  const { data, error } = await admin
    .from('issues')
    .delete()
    .eq('id', id)
    .select('id')
    .maybeSingle();
  if (error) throw error;
  if (!data) throw notFound('Issue not found');
  return true;
}

async function listUpdatesForIssue(issueId) {
  const admin = getAdminClient();
  const { data, error } = await admin
    .from('issue_updates')
    .select('id,issue_id,message,status,created_at')
    .eq('issue_id', issueId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data || [];
}

async function addIssueUpdate(issueId, { message, status }) {
  const admin = getAdminClient();
  const row = { issue_id: issueId, message };
  if (status) row.status = status;
  const { data, error } = await admin
    .from('issue_updates')
    .insert(row)
    .select('id,issue_id,message,status,created_at')
    .single();
  if (error) throw error;
  return data;
}

module.exports = {
  ISSUE_COLUMNS,
  listIssues,
  getIssueById,
  createIssue,
  updateIssue,
  deleteIssue,
  listUpdatesForIssue,
  addIssueUpdate
};
