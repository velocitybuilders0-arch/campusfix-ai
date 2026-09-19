import { useEffect, useId, useState } from 'react';

function ImageUpload({ value, onChange, accept = 'image/*', maxSizeMB = 5, error, id }) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const [internalError, setInternalError] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (!value || !(value instanceof File)) {
      setPreviewUrl('');
      return undefined;
    }

    const nextUrl = URL.createObjectURL(value);
    setPreviewUrl(nextUrl);

    return () => URL.revokeObjectURL(nextUrl);
  }, [value]);

  const validateAndSet = (file) => {
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      setInternalError('Only image files are allowed.');
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      setInternalError(`File is too large (max ${maxSizeMB}MB).`);
      return;
    }

    setInternalError('');
    onChange(file);
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSet(file);
    }
    e.target.value = '';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndSet(file);
    }
  };

  return (
    <div className="image-upload">
      <label className="image-upload__dropzone" htmlFor={inputId}>
        <input
          id={inputId}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={handleInputChange}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        />
        {value ? (
          <div className="image-upload__preview">
            <img src={previewUrl} alt="Selected file preview" />
            <button
              type="button"
              className="image-upload__remove"
              onClick={(e) => {
                e.preventDefault();
                onChange(null);
              }}
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="image-upload__prompt">
            <p>Drag &amp; drop an image here, or click to select.</p>
            <p className="image-upload__hint">Max size: {maxSizeMB}MB</p>
          </div>
        )}
      </label>
      {internalError ? <p className="field__error" role="alert">{internalError}</p> : null}
      {error ? <p className="field__error" role="alert">{error}</p> : null}
    </div>
  );
}

export default ImageUpload;
