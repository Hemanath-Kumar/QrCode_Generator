import React, { useState } from 'react';
import { QR_CODE_TYPES } from '../config/qrTypes';
import { GenerateRequest } from '../types';
import { Send, AlertCircle } from 'lucide-react';

interface GenerationFormProps {
  selectedType: string;
  onGenerate: (data: GenerateRequest) => void;
  isGenerating: boolean;
}

const GenerationForm: React.FC<GenerationFormProps> = ({ 
  selectedType, 
  onGenerate, 
  isGenerating 
}) => {
  const [data, setData] = useState('');
  const [label, setLabel] = useState('');
  const [error, setError] = useState('');

  const selectedTypeData = QR_CODE_TYPES.find(type => type.id === selectedType);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!data.trim()) {
      setError('Please enter data to encode');
      return;
    }

    if (!selectedType) {
      setError('Please select a code type');
      return;
    }

    if (selectedTypeData?.maxLength && data.length > selectedTypeData.maxLength) {
      setError(`Data exceeds maximum length of ${selectedTypeData.maxLength} characters`);
      return;
    }

    onGenerate({
      data: data.trim(),
      label: label.trim(),
      code_type: selectedType
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="data" className="block text-sm font-medium text-gray-700 mb-2">
          Data to Encode *
        </label>
        <textarea
          id="data"
          value={data}
          onChange={(e) => setData(e.target.value)}
          placeholder={selectedTypeData?.example || 'Enter your data here...'}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
          disabled={isGenerating}
        />
        {selectedTypeData?.maxLength && (
          <div className="mt-1 text-sm text-gray-500">
            {data.length}/{selectedTypeData.maxLength} characters
          </div>
        )}
      </div>

      <div>
        <label htmlFor="label" className="block text-sm font-medium text-gray-700 mb-2">
          Label (Optional)
        </label>
        <input
          id="label"
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Enter a label for your code..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isGenerating}
        />
      </div>

      {error && (
        <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={isGenerating || !selectedType}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-colors"
      >
        <Send className="h-4 w-4" />
        <span>{isGenerating ? 'Generating...' : 'Generate Code'}</span>
      </button>
    </form>
  );
};

export default GenerationForm;