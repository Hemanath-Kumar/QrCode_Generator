import axios from 'axios';
import { GenerateRequest, GenerateResponse, GenerationLog } from '../types';

const API_BASE_URL = window.location.protocol === 'https:' 
  ? 'https://localhost:8000/api' 
  : 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const qrCodeApi = {
  generateCode: async (data: GenerateRequest): Promise<GenerateResponse> => {
    const response = await api.post('/generate/', data);
    return response.data;
  },

  getLogs: async (): Promise<GenerationLog[]> => {
    const response = await api.get('/logs/');
    return response.data;
  },

  clearLogs: async (): Promise<void> => {
    await api.delete('/logs/clear/');
  },

  downloadCSV: async (): Promise<Blob> => {
    const response = await api.get('/logs/csv/', {
      responseType: 'blob'
    });
    return response.data;
  }
};