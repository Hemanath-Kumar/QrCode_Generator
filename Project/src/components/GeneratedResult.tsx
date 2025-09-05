import React from 'react';
import { GenerationLog } from '../types';
import { Download, Calendar, Clock, MapPin, FileText, Tag } from 'lucide-react';

interface GeneratedResultProps {
  log: GenerationLog;
}

const GeneratedResult: React.FC<GeneratedResultProps> = ({ log }) => {
  const handleDownload = async () => {
    try {
      const response = await fetch(log.qr_code_url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = log.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-gray-900">
          Generated Successfully!
        </h3>
        <button
          onClick={handleDownload}
          className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Download className="h-4 w-4" />
          <span>Download</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex justify-center">
          <img
            src={log.qr_code_url}
            alt={`${log.code_type} code`}
            className="max-w-full max-h-64 object-contain border border-gray-200 rounded"
          />
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center space-x-2">
              <Tag className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Type:</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                {log.code_type.replace('_', ' ')}
              </span>
            </div>

            <div className="flex items-start space-x-2">
              <FileText className="h-4 w-4 text-gray-500 mt-0.5" />
              <div>
                <span className="text-sm font-medium text-gray-700">Data:</span>
                <p className="text-sm text-gray-600 mt-1 break-all">{log.data}</p>
              </div>
            </div>

            {log.label && (
              <div className="flex items-start space-x-2">
                <Tag className="h-4 w-4 text-gray-500 mt-0.5" />
                <div>
                  <span className="text-sm font-medium text-gray-700">Label:</span>
                  <p className="text-sm text-gray-600 mt-1">{log.label}</p>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Date:</span>
              <span className="text-sm text-gray-600">{log.date}</span>
            </div>

            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Time:</span>
              <span className="text-sm text-gray-600">{log.time}</span>
            </div>

            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filename:</span>
              <span className="text-sm text-gray-600 truncate" title={log.filename}>
                {log.filename}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratedResult;