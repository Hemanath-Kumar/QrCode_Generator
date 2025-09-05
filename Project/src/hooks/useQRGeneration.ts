import { useState, useEffect } from 'react';
import { qrCodeApi } from '../services/api';
import { GenerationLog, GenerateRequest } from '../types';

export const useQRGeneration = () => {
  const [logs, setLogs] = useState<GenerationLog[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [latestGeneration, setLatestGeneration] = useState<GenerationLog | null>(null);

  const fetchLogs = async () => {
    try {
      const data = await qrCodeApi.getLogs();
      setLogs(data);
    } catch (err) {
      setError('Failed to fetch logs');
      console.error('Error fetching logs:', err);
    }
  };

  const generateCode = async (request: GenerateRequest) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const response = await qrCodeApi.generateCode(request);
      setLatestGeneration(response.log);
      await fetchLogs(); // Refresh logs after generation
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to generate code';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const clearLogs = async () => {
    try {
      await qrCodeApi.clearLogs();
      setLogs([]);
      setLatestGeneration(null);
    } catch (err) {
      setError('Failed to clear logs');
      console.error('Error clearing logs:', err);
    }
  };

  const downloadCSV = async () => {
    try {
      const blob = await qrCodeApi.downloadCSV();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'qr_generation_log.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to download CSV');
      console.error('Error downloading CSV:', err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return {
    logs,
    isGenerating,
    error,
    latestGeneration,
    generateCode,
    clearLogs,
    downloadCSV,
    fetchLogs
  };
};