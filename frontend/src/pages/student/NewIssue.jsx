import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/ui/Button';
import ErrorState from '../../components/ui/ErrorState';
import FormField from '../../components/ui/FormField';
import SuccessToast from '../../components/ui/SuccessToast';
import { analyzeIssue, createIssue } from '../../api/endpoints';
import { analyzeFixtureResponse } from '../../api/fixtures/analyze.fixture';

const initialState = {
  title: '',
  description: '',
  image: null,
};

const emptyErrors = {
  title: '',
  description: '',
  image: '',
};

function NewIssue() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState(emptyErrors);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisError, setAnalysisError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: '' }));
  };

  const handleImageChange = (event) => {
    const nextFile = event.target.files?.[0] || null;
    setFormData((previous) => ({ ...previous, image: nextFile }));
    setErrors((previous) => ({ ...previous, image: '' }));
  };

  const validate = () => {
    const nextErrors = { ...emptyErrors };
    const title = formData.title.trim();
    const description = formData.description.trim();

    if (!title) {
      nextErrors.title = 'Title is required.';
    } else if (title.length > 120) {
      nextErrors.title = 'Title must be 120 characters or fewer.';
    }

    if (!description) {
      nextErrors.description = 'Description is required.';
    } else if (description.length < 10) {
      nextErrors.description = 'Description must be at least 10 characters.';
    }

    setErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  };

  const handleAnalyze = async () => {
    setAnalysisError('');
    const isFixtureMode = import.meta.env.VITE_USE_FIXTURES === 'true';

    if (!formData.title.trim() || !formData.description.trim()) {
      setErrors({
        title: formData.title.trim() ? '' : 'Title is required.',
        description: formData.description.trim() ? '' : 'Description is required.',
        image: '',
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      if (isFixtureMode) {
        // TEMPORARY fixture branch — remove when backend /api/ai/analyze is live.
        setAnalysisResult(analyzeFixtureResponse.data);
        return;
      }

      const payload = formData.image
        ? (() => {
            const form = new FormData();
            form.append('title', formData.title.trim());
            form.append('description', formData.description.trim());
            form.append('image', formData.image);
            return form;
          })()
        : {
            title: formData.title.trim(),
            description: formData.description.trim(),
          };

      const response = await analyzeIssue(payload);
      setAnalysisResult(response.data || response);
    } catch (error) {
      setAnalysisError(error.message || 'Unable to analyze issue right now.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');

    if (!validate()) {
      return;
    }

    const isFixtureMode = import.meta.env.VITE_USE_FIXTURES === 'true';
    setIsSubmitting(true);

    try {
      if (isFixtureMode) {
        setSuccessMessage('Issue submitted successfully.');
        navigate('/student/issues');
        return;
      }

      const payload = formData.image
        ? (() => {
            const form = new FormData();
            form.append('title', formData.title.trim());
            form.append('description', formData.description.trim());
            form.append('image', formData.image);
            return form;
          })()
        : {
            title: formData.title.trim(),
            description: formData.description.trim(),
          };

      await createIssue(payload);
      setSuccessMessage('Issue submitted successfully.');
      navigate('/student/issues');
    } catch (error) {
      setSubmitError(error.message || 'Unable to submit the issue right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader title="Report a campus issue" subtitle="Describe the issue and let AI suggest a category and priority." />

      <form onSubmit={handleSubmit} noValidate aria-busy={isSubmitting}>
        <FormField label="Title" required htmlFor="issue-title" error={errors.title}>
          <input
            id="issue-title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            maxLength={120}
            placeholder="Broken light in lab"
            aria-invalid={Boolean(errors.title)}
          />
        </FormField>

        <FormField label="Description" required htmlFor="issue-description" error={errors.description}>
          <textarea
            id="issue-description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            minLength={10}
            placeholder="Describe the issue in detail"
            aria-invalid={Boolean(errors.description)}
          />
        </FormField>

        <FormField label="Image" htmlFor="issue-image" error={errors.image}>
          <input
            id="issue-image"
            name="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            aria-invalid={Boolean(errors.image)}
          />
        </FormField>

        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Button type="button" onClick={handleAnalyze} disabled={isAnalyzing}>
            {isAnalyzing ? 'Analyzing...' : 'Analyze with AI'}
          </Button>

          <Button type="submit" variant="secondary" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Issue'}
          </Button>
        </div>
      </form>

      {analysisError ? (
        <div style={{ marginTop: '1rem' }}>
          <ErrorState title="AI analysis failed" message={analysisError} />
        </div>
      ) : null}

      {analysisResult ? (
        <div className="card issue-card" style={{ marginTop: '1rem' }} role="status">
          <h3>AI suggestion</h3>
          <p>
            <strong>Category:</strong> {analysisResult.category}
          </p>
          <p>
            <strong>Priority:</strong> {analysisResult.priority}
          </p>
          <p>
            <strong>Department:</strong> {analysisResult.department}
          </p>
          <p>
            <strong>Summary:</strong> {analysisResult.summary}
          </p>
        </div>
      ) : null}

      {submitError ? (
        <div style={{ marginTop: '1rem' }}>
          <ErrorState title="Issue submission failed" message={submitError} />
        </div>
      ) : null}

      <SuccessToast message={successMessage} />
    </>
  );
}

export default NewIssue;
