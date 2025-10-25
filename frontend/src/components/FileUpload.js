import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { transactionAPI } from '../services/apiCalls';
export const FileUpload = ({ onUploadSuccess, onError, }) => {
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const onDrop = async (acceptedFiles) => {
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
        if (!validTypes.includes(file.type) &&
            !file.name.endsWith('.csv') &&
            !file.name.endsWith('.xlsx') &&
            !file.name.endsWith('.xls')) {
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
        }
        catch (error) {
            onError(error.response?.data?.error || 'Failed to upload file');
        }
        finally {
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
    return (_jsxs("div", { ...getRootProps(), className: `border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive
            ? 'border-primary-600 bg-primary-50'
            : 'border-gray-300 hover:border-primary-600'}`, children: [_jsx("input", { ...getInputProps() }), loading ? (_jsxs("div", { children: [_jsx("div", { className: "mb-4 text-lg font-semibold", children: "Uploading..." }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: _jsx("div", { className: "bg-primary-600 h-2 rounded-full transition-all", style: { width: `${progress}%` } }) }), _jsxs("div", { className: "mt-2 text-sm text-gray-600", children: [progress, "%"] })] })) : (_jsxs("div", { children: [_jsx("div", { className: "text-3xl mb-2", children: "\uD83D\uDCC1" }), _jsx("div", { className: "text-lg font-semibold mb-1", children: isDragActive
                            ? 'Drop your file here'
                            : 'Drag & drop your CSV or Excel file' }), _jsx("div", { className: "text-sm text-gray-600", children: "Supported formats: CSV, XLS, XLSX (Max 5MB)" }), _jsx("button", { className: "mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors", onClick: (e) => e.stopPropagation(), children: "Browse Files" })] }))] }));
};
