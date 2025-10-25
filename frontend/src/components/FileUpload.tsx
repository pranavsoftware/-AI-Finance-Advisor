import { useState, type FC } from 'react';
import { useDropzone } from 'react-dropzone';
import { transactionAPI } from '../services/apiCalls';
import { UploadResponse } from '../types';

interface FileUploadProps {
  onUploadSuccess: (response: UploadResponse) => void;
  onError: (error: string) => void;
}

export const FileUpload: FC<FileUploadProps> = ({
  onUploadSuccess,
  onError,
}) => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      onError('Please upload a CSV or Excel file');
      return;
    }

    const file = acceptedFiles[0];

    // Validate file type
    const validTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
    if (
      !validTypes.includes(file.type) &&
      !file.name.endsWith('.csv') &&
      !file.name.endsWith('.xlsx') &&
      !file.name.endsWith('.xls')
    ) {
      onError('Only CSV and Excel files are supported');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5242880) {
      onError('File size exceeds 5MB limit');
      return;
    }

    try {
      setLoading(true);
      setProgress(30);

      const response = await transactionAPI.upload(file);
      setProgress(100);

      onUploadSuccess(response.data);

      setTimeout(() => {
        setProgress(0);
      }, 1000);
    } catch (error: any) {
      onError(
        error.response?.data?.error || 'Failed to upload file'
      );
    } finally {
      setLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
        '.xlsx',
      ],
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
        isDragActive
          ? 'border-purple-600 bg-purple-50 scale-105'
          : 'border-gray-300 hover:border-purple-500 hover:bg-gray-50'
      }`}
    >
      <input {...getInputProps()} />

      {loading ? (
        <div>
          <svg className="animate-spin h-12 w-12 text-purple-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <div className="mb-4 text-lg font-semibold text-gray-900">Uploading...</div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 text-sm text-gray-600 font-medium">{progress}%</div>
        </div>
      ) : (
        <div>
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <div className="text-lg font-semibold mb-2 text-gray-900">
            {isDragActive
              ? 'Drop your file here'
              : 'Drag & drop your CSV or Excel file'}
          </div>
          <div className="text-sm text-gray-600 mb-4">
            Supported formats: CSV, XLS, XLSX (Max 5MB)
          </div>
          <button
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all font-medium shadow-md hover:shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            Browse Files
          </button>
        </div>
      )}
    </div>
  );
};
