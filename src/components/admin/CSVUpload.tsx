import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../Button';

interface CSVUploadProps {
  onUpload?: (file: File) => void;
  className?: string;
}

export function CSVUpload({ onUpload, className = '' }: CSVUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [fileName, setFileName] = useState('');

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
      setFileName(file.name);
      setUploadStatus('uploading');
      
      // Simulate upload
      setTimeout(() => {
        setUploadStatus('success');
        onUpload?.(file);
      }, 1500);
    } else {
      setUploadStatus('error');
      setFileName('Invalid file type');
    }
  };

  return (
    <div className={className}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all
          ${isDragging 
            ? 'border-[var(--color-primary-500)] bg-[var(--color-primary-50)]' 
            : 'border-[var(--color-neutral-300)] bg-white hover:border-[var(--color-primary-400)]'
          }
          ${uploadStatus === 'success' ? 'border-[var(--color-success-500)] bg-[var(--color-success-50)]' : ''}
          ${uploadStatus === 'error' ? 'border-[var(--color-error-500)] bg-[var(--color-error-50)]' : ''}
        `}
        role="region"
        aria-label="CSV file upload area"
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          aria-label="Choose CSV file"
        />

        <div className="pointer-events-none">
          {uploadStatus === 'idle' && (
            <>
              <Upload className="w-12 h-12 mx-auto mb-4 text-[var(--color-primary-600)]" aria-hidden="true" />
              <h3 className="font-semibold mb-2">Upload Internship CSV</h3>
              <p className="text-[var(--color-neutral-600)] mb-4">
                Drag and drop your CSV file here, or click to browse
              </p>
              <p className="text-sm text-[var(--color-neutral-500)]">
                Supported format: .csv (max 10MB)
              </p>
            </>
          )}

          {uploadStatus === 'uploading' && (
            <>
              <div className="w-12 h-12 mx-auto mb-4 border-4 border-[var(--color-primary-200)] border-t-[var(--color-primary-600)] rounded-full animate-spin" />
              <h3 className="font-semibold mb-2">Uploading...</h3>
              <p className="text-[var(--color-neutral-600)]">{fileName}</p>
            </>
          )}

          {uploadStatus === 'success' && (
            <>
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-[var(--color-success-600)]" aria-hidden="true" />
              <h3 className="font-semibold mb-2">Upload Successful!</h3>
              <p className="text-[var(--color-neutral-600)]">{fileName}</p>
            </>
          )}

          {uploadStatus === 'error' && (
            <>
              <XCircle className="w-12 h-12 mx-auto mb-4 text-[var(--color-error-600)]" aria-hidden="true" />
              <h3 className="font-semibold mb-2">Upload Failed</h3>
              <p className="text-[var(--color-error-700)]">Please upload a valid CSV file</p>
            </>
          )}
        </div>
      </div>

      {uploadStatus === 'success' && (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            setUploadStatus('idle');
            setFileName('');
          }}
          className="mt-4"
          leftIcon={<FileText className="w-4 h-4" />}
        >
          Upload Another File
        </Button>
      )}
    </div>
  );
}
