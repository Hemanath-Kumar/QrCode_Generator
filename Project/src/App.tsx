import React, { useState } from 'react';
import { QrCode, Database, Layers } from 'lucide-react';
import QRTypeSelector from './components/QRTypeSelector';
import GenerationForm from './components/GenerationForm';
import GenerationLogs from './components/GenerationLogs';
import GeneratedResult from './components/GeneratedResult';
import { useQRGeneration } from './hooks/useQRGeneration';

function App() {
  const [selectedType, setSelectedType] = useState('');
  const [activeTab, setActiveTab] = useState<'generate' | 'logs'>('generate');
  
  const {
    logs,
    isGenerating,
    error,
    latestGeneration,
    generateCode,
    clearLogs,
    downloadCSV
  } = useQRGeneration();

  const handleGenerate = async (request: any) => {
    try {
      await generateCode(request);
    } catch (err) {
      // Error is handled in the hook
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center space-x-3 mb-4">
            <QrCode className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Universal QR & Barcode Generator
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Generate QR codes and barcodes with multiple format support. 
            Track your generations with detailed logging and CSV export functionality.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm border border-gray-200">
            <button
              onClick={() => setActiveTab('generate')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'generate'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Layers className="h-4 w-4" />
              <span>Generate</span>
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'logs'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Database className="h-4 w-4" />
              <span>History ({logs.length})</span>
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {activeTab === 'generate' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Type Selection */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-4">Select Code Type</h2>
                <QRTypeSelector
                  selectedType={selectedType}
                  onTypeSelect={setSelectedType}
                />
              </div>
            </div>

            {/* Generation Form */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-4">Generate Code</h2>
                <GenerationForm
                  selectedType={selectedType}
                  onGenerate={handleGenerate}
                  isGenerating={isGenerating}
                />
              </div>

              {/* Latest Generation Result */}
              {latestGeneration && (
                <GeneratedResult log={latestGeneration} />
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <GenerationLogs
              logs={logs}
              onClearLogs={clearLogs}
              onDownloadCSV={downloadCSV}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;