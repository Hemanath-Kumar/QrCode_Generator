import React from 'react';
import { QRCodeType } from '../types';
import { QR_CODE_TYPES } from '../config/qrTypes';
import { Info, CheckCircle } from 'lucide-react';

interface QRTypeSelectorProps {
  selectedType: string;
  onTypeSelect: (type: string) => void;
}

const QRTypeSelector: React.FC<QRTypeSelectorProps> = ({ selectedType, onTypeSelect }) => {
  const selectedTypeData = QR_CODE_TYPES.find(type => type.id === selectedType);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {QR_CODE_TYPES.map((type) => (
          <div
            key={type.id}
            className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedType === type.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
            onClick={() => onTypeSelect(type.id)}
          >
            {selectedType === type.id && (
              <CheckCircle className="absolute top-2 right-2 h-5 w-5 text-blue-500" />
            )}
            <h3 className="font-semibold text-lg mb-2">{type.name}</h3>
            <p className="text-sm text-gray-600 mb-3">{type.description}</p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Info className="h-4 w-4 text-gray-400" />
                <span className="text-xs text-gray-500">Supports: {type.supports}</span>
              </div>
              {type.maxLength && (
                <div className="text-xs text-gray-500">
                  Max length: {type.maxLength} characters
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedTypeData && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">
            Selected: {selectedTypeData.name}
          </h4>
          <p className="text-blue-800 mb-2">{selectedTypeData.description}</p>
          <div className="space-y-1 text-sm">
            <p><strong>Supports:</strong> {selectedTypeData.supports}</p>
            {selectedTypeData.maxLength && (
              <p><strong>Max Length:</strong> {selectedTypeData.maxLength} characters</p>
            )}
            <p><strong>Example:</strong> {selectedTypeData.example}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRTypeSelector;