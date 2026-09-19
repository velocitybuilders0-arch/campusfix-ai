import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { listIssues } from '../../api/endpoints';
import IssueCard from '../../components/issues/IssueCard';
import PageHeader from '../../components/layout/PageHeader';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import FilterBar from '../../components/ui/FilterBar';
import SearchInput from '../../components/ui/SearchInput';
import Spinner from '../../components/ui/Spinner';
import { CATEGORY_OPTIONS } from '../../constants/categories';
import { PRIORITY_LABELS, PRIORITY_OPTIONS } from '../../constants/priorities';
import { STATUS_LABELS, STATUS_OPTIONS } from '../../constants/statuses';

function AdminDashboard() {
  const [issues, setIssues] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [category, setCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadIssues = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await listIssues();
      setIssues(response.data || response || []);
    } catch (loadError) {
      setError(loadError.message || 'Unable to load issues.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadIssues(); }, [loadIssues]);

  const filteredIssues = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();
    return issues.filter((issue) => {
      if (status && issue.status !== status) return false;
      if (priority && issue.priority !== priority) return false;
      if (category && issue.category !== category) return false;
      return !searchTerm || `${issue.title} ${issue.description}`.toLowerCase().includes(searchTerm);
    });
  }, [issues, search, status, priority, category]);

  const clearFilters = () => {
    setSearch('');
    setStatus('');
    setPriority('');
    setCategory('');
  };

  return (
    <>
      <PageHeader title="Admin dashboard" subtitle="Review, assign, and resolve campus issues." />
      <div className="issues-toolbar">
        <SearchInput value={search} onChange={setSearch} placeholder="Search issues" label="Search all issues" />
        <FilterBar
          filters={[
            { key: 'status', label: 'Status', value: status },
            { key: 'priority', label: 'Priority', value: priority },
            { key: 'category', label: 'Category', value: category },
          ]}
          options={{
            status: STATUS_OPTIONS.map((value) => ({ value, label: STATUS_LABELS[value] })),
            priority: PRIORITY_OPTIONS.map((value) => ({ value, label: PRIORITY_LABELS[value] })),
            category: CATEGORY_OPTIONS.map((value) => ({ value, label: value })),
          }}
          onChange={(key, value) => ({ status: setStatus, priority: setPriority, category: setCategory }[key](value))}
          onClear={clearFilters}
        />
      </div>
      {isLoading ? <Spinner label="Loading issues…" /> : null}
      {error ? <ErrorState title="Could not load admin issues" message={error} onRetry={loadIssues} /> : null}
      {!isLoading && !error && issues.length === 0 ? <EmptyState title="No issues found" description="There are no issues available for your account." /> : null}
      {!isLoading && !error && issues.length > 0 && filteredIssues.length === 0 ? <EmptyState title="No issues match your filters" description="Clear the filters or try another search." /> : null}
      {!isLoading && !error && filteredIssues.length > 0 ? (
        <div className="issues-grid">
          {filteredIssues.map((issue) => <IssueCard key={issue.id} issue={issue} basePath="/admin" />)}
        </div>
      ) : null}
    </>
  );
}

export default AdminDashboard;
