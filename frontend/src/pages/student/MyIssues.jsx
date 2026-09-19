import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { listIssues } from '../../api/endpoints';
import { issuesFixture } from '../../api/fixtures/issues.fixture';
import IssueCard from '../../components/issues/IssueCard';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import FilterBar from '../../components/ui/FilterBar';
import SearchInput from '../../components/ui/SearchInput';
import Spinner from '../../components/ui/Spinner';
import SuccessToast from '../../components/ui/SuccessToast';
import { STATUS_OPTIONS, STATUS_LABELS } from '../../constants/statuses';
import { PRIORITY_OPTIONS, PRIORITY_LABELS } from '../../constants/priorities';
import { CATEGORY_OPTIONS } from '../../constants/categories';
import { ASYNC, useAsyncState } from '../../hooks/useAsyncState';

const USE_FIXTURES = import.meta.env.VITE_USE_FIXTURES === 'true';

function MyIssues() {
  const location = useLocation();
  const [flash, setFlash] = useState(location.state?.flash || '');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const fetchIssues = useCallback(async () => {
    if (USE_FIXTURES) {
      await new Promise((resolve) => setTimeout(resolve, 150));
      return issuesFixture;
    }
    return listIssues();
  }, []);

  const { data: response, loading, error, state, run } = useAsyncState(fetchIssues, null);

  useEffect(() => {
    run().catch(() => {});
  }, [run]);

  const allIssues = Array.isArray(response)
    ? response
    : Array.isArray(response?.data)
      ? response.data
      : [];

  const filteredIssues = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return allIssues.filter((issue) => {
      if (statusFilter && issue.status !== statusFilter) return false;
      if (priorityFilter && issue.priority !== priorityFilter) return false;
      if (categoryFilter && issue.category !== categoryFilter) return false;

      if (searchTerm) {
        const haystack = `${issue.title || ''} ${issue.description || ''}`.toLowerCase();
        if (!haystack.includes(searchTerm)) return false;
      }

      return true;
    });
  }, [allIssues, search, statusFilter, priorityFilter, categoryFilter]);

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('');
    setPriorityFilter('');
    setCategoryFilter('');
  };

  const filters = [
    {
      key: 'status',
      label: 'Status',
      allLabel: 'All statuses',
      value: statusFilter,
    },
    {
      key: 'priority',
      label: 'Priority',
      allLabel: 'All priorities',
      value: priorityFilter,
    },
    {
      key: 'category',
      label: 'Category',
      allLabel: 'All categories',
      value: categoryFilter,
    },
  ];

  const filterOptions = {
    status: STATUS_OPTIONS.map((s) => ({ value: s, label: STATUS_LABELS[s] })),
    priority: PRIORITY_OPTIONS.map((p) => ({ value: p, label: PRIORITY_LABELS[p] })),
    category: CATEGORY_OPTIONS.map((c) => ({ value: c, label: c })),
  };

  const handleFilterChange = (key, value) => {
    if (key === 'status') setStatusFilter(value);
    if (key === 'priority') setPriorityFilter(value);
    if (key === 'category') setCategoryFilter(value);
  };

  return (
    <>
      <PageHeader
        title="My Issues"
        subtitle="Track the issues you have reported."
      />

      <div className="issues-toolbar">
        <div className="issues-toolbar__search">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by title or description…"
            label="Search issues"
          />
        </div>
        <FilterBar
          filters={filters}
          options={filterOptions}
          onChange={handleFilterChange}
          onClear={clearFilters}
        />
      </div>

      {loading ? <Spinner label="Loading issues…" /> : null}

      {!loading && state === ASYNC.ERROR ? (
        <ErrorState
          title="Could not load issues"
          message={error?.message || 'Something went wrong loading your issues.'}
          onRetry={() => { run().catch(() => {}); }}
        />
      ) : null}

      {!loading && state === ASYNC.SUCCESS && allIssues.length === 0 ? (
        <EmptyState
          title="No issues yet"
          description="You have not reported any issues. Start by filing one."
          action={
            <Link to="/student/new">
              <Button type="button">Report an issue</Button>
            </Link>
          }
        />
      ) : null}

      {!loading && state === ASYNC.SUCCESS && allIssues.length > 0 && filteredIssues.length === 0 ? (
        <EmptyState
          title="No issues match your filters"
          description="Try clearing the filters or searching for something else."
          action={
            <Button type="button" onClick={clearFilters}>Clear filters</Button>
          }
        />
      ) : null}

      {!loading && state === ASYNC.SUCCESS && filteredIssues.length > 0 ? (
        <div className="issues-grid">
          {filteredIssues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      ) : null}

      <SuccessToast message={flash} onDismiss={() => setFlash('')} />
    </>
  );
}

export default MyIssues;
