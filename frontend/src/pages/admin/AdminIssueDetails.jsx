import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { addIssueUpdate, getIssue, updateIssue } from '../../api/endpoints';
import IssueDetailLayout from '../../components/issues/IssueDetailLayout';
import Button from '../../components/ui/Button';
import ErrorState from '../../components/ui/ErrorState';
import FormField from '../../components/ui/FormField';
import Spinner from '../../components/ui/Spinner';
import { STATUS_LABELS, STATUS_OPTIONS } from '../../constants/statuses';

function AdminIssueDetails() {
  const { issueId } = useParams();
  const [issue, setIssue] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [message, setMessage] = useState('');
  const [updateStatus, setUpdateStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveMessage, setSaveMessage] = useState('');

  const loadIssue = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await getIssue(issueId);
      const nextIssue = response.data || response;
      setIssue(nextIssue);
      setStatus(nextIssue.status || '');
      setAssignedTo(nextIssue.assignedTo || '');
    } catch (loadError) {
      setError(loadError.message || 'Unable to load this issue.');
    } finally {
      setIsLoading(false);
    }
  }, [issueId]);

  useEffect(() => {
    loadIssue();
  }, [loadIssue]);

  const handleSaveIssue = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setSaveError('');
    setSaveMessage('');

    try {
      const patch = { status };
      if (assignedTo.trim()) patch.assigned_to = assignedTo.trim();
      else patch.assigned_to = null;
      const response = await updateIssue(issueId, patch);
      setIssue(response.data || response);
      setSaveMessage('Issue updated successfully.');
    } catch (saveIssueError) {
      setSaveError(saveIssueError.message || 'Unable to update this issue.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddUpdate = async (event) => {
    event.preventDefault();
    if (!message.trim()) return;

    setIsSaving(true);
    setSaveError('');
    setSaveMessage('');

    try {
      await addIssueUpdate(issueId, {
        message: message.trim(),
        ...(updateStatus ? { status: updateStatus } : {}),
      });
      setMessage('');
      setUpdateStatus('');
      await loadIssue();
      setSaveMessage('Update added successfully.');
    } catch (updateError) {
      setSaveError(updateError.message || 'Unable to add this update.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <Spinner label="Loading issue…" />;
  if (error) return <ErrorState title="Could not load issue" message={error} onRetry={loadIssue} />;
  if (!issue) return <ErrorState title="Issue not found" message="This issue is no longer available." />;

  return (
    <>
      <p style={{ marginBottom: '1rem' }}><Link to="/admin">← Back to admin issues</Link></p>
      <IssueDetailLayout issue={issue} />

      <section className="card issue-card" style={{ marginTop: '1.25rem' }}>
        <h2>Manage issue</h2>
        <form onSubmit={handleSaveIssue} className="layout-grid">
          <FormField label="Status" htmlFor="admin-status">
            <select id="admin-status" className="field__select" value={status} onChange={(event) => setStatus(event.target.value)}>
              {STATUS_OPTIONS.map((option) => <option key={option} value={option}>{STATUS_LABELS[option]}</option>)}
            </select>
          </FormField>
          <FormField label="Assigned user ID" htmlFor="admin-assigned-to">
            <input id="admin-assigned-to" className="field__input" value={assignedTo} onChange={(event) => setAssignedTo(event.target.value)} placeholder="Supabase user UUID" />
          </FormField>
          <div><Button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save issue'}</Button></div>
        </form>

        <form onSubmit={handleAddUpdate} style={{ marginTop: '1.5rem' }}>
          <FormField label="Activity update" required htmlFor="admin-update-message">
            <textarea id="admin-update-message" className="field__textarea" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Describe the work or next step" required />
          </FormField>
          <FormField label="Optional status transition" htmlFor="admin-update-status">
            <select id="admin-update-status" className="field__select" value={updateStatus} onChange={(event) => setUpdateStatus(event.target.value)}>
              <option value="">Keep current status</option>
              {STATUS_OPTIONS.map((option) => <option key={option} value={option}>{STATUS_LABELS[option]}</option>)}
            </select>
          </FormField>
          <Button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Add update'}</Button>
        </form>
        {saveError ? <p className="field__error" role="alert">{saveError}</p> : null}
        {saveMessage ? <p role="status">{saveMessage}</p> : null}
      </section>
    </>
  );
}

export default AdminIssueDetails;
